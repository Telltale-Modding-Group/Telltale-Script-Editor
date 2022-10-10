import {BuildsActions} from './slices/BuildsSlice';
import {SidebarActions} from './slices/SidebarSlice';
import {MainProcess} from './MainProcessUtils';
import {FileTreeAsyncActions} from './slices/FileTreeSlice';
import {showNotification} from '@mantine/notifications';
import {useAppDispatch, useAppSelector} from './slices/store';
import {StorageActions} from './slices/StorageSlice';
import {EditorActions, EditorAsyncActions} from "./slices/EditorSlice";
import {EditorFile} from "../shared/types";
import * as parser from 'luaparse';
import {LuaSyntaxError} from "./types";

export const useBuildProject = () => {
	const dispatch = useAppDispatch();
	const projectRoot = useAppSelector(state => state.filetree.root);
	const projectPath = useAppSelector(state => state.filetree.root?.path);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const saveFilesOnBuild = useAppSelector(state => state.storage.saveFilesOnBuild);

	const buildProject = async () => {
		if (!projectPath || !project) return;

		if (saveFilesOnBuild) await dispatch(EditorAsyncActions.saveAllFiles());

		if (!await checkLuaFiles()) return;

		dispatch(BuildsActions.clearLogs());
		dispatch(SidebarActions.setActiveTab('logs'));
		const buildZipPath = await MainProcess.buildProject({ projectPath, project });
		dispatch(FileTreeAsyncActions.refreshRootDirectory());

		if (!buildZipPath) {
			showNotification({
				title: 'Build Failed',
				message: 'An error occurred during build compilation. Check the logs for more details.',
				color: 'red'
			});
		} else {
			showNotification({
				title: 'Build Successful',
				message: 'The project was built successfully!',
				color: 'green'
			});
		}

		return buildZipPath;
	};

	const buildProjectAndRun = async () => {
		if (!projectPath || !project) return;

		if (saveFilesOnBuild) await dispatch(EditorAsyncActions.saveAllFiles());

		if (!await checkLuaFiles()) return;

		dispatch(BuildsActions.clearLogs());
		dispatch(SidebarActions.setActiveTab('logs'));

		let gamePath = gameExePath;

		if (!gamePath) {
			gamePath = await MainProcess.getGamePath();

			if (!gamePath) return;

			dispatch(StorageActions.setGamePath(gamePath));
		}

		try {
			await MainProcess.runProject({ projectPath, project, gamePath });
		} catch {
			showNotification({
				title: 'Unexpected Error',
				message: 'An error occurred while either building the project, or while trying to open the game. Try just building to rule out a build error, and check if the game is already open in the background. Check the logs for more details.',
				color: 'red',
				autoClose: 10 * 1000
			});
		}

		dispatch(FileTreeAsyncActions.refreshRootDirectory());
	};

	const checkLuaFiles = async () => {
		if (!projectRoot || !projectRoot.directory) return false;

		const luaFiles: EditorFile[] = [];
		const cb = (e: EditorFile) => {
			if (e.name.endsWith(".lua")) luaFiles.push(e);
			if (e.directory && e.name !== "Builds" && e.children.length > 0) e.children.forEach(cb);
		}

		projectRoot.children.forEach(cb);

		let errorEncountered = false;

		for (const file of luaFiles) {
			try {
				parser.parse(await MainProcess.getFileContents(file.path));
			} catch (e) {
				const syntaxError = e as LuaSyntaxError;

				errorEncountered = true;

				showNotification({
					title: 'LUA Syntax Error',
					message: `In ${file.name}, Line ${syntaxError.line}, Column ${syntaxError.column}.`,
					color: 'red',
					autoClose: 10 * 1000
				});

				dispatch(EditorActions.setSyntaxErrorLineNumber(syntaxError.line));
				
				await dispatch(EditorAsyncActions.openFile(file));
				return;
			}
		}

		return !errorEncountered;
	}

	return {
		buildProject,
		buildProjectAndRun
	};
};