import {BuildsActions} from './slices/BuildsSlice';
import {SidebarActions} from './slices/SidebarSlice';
import {MainProcess} from './MainProcessUtils';
import {FileTreeAsyncActions} from './slices/FileTreeSlice';
import {showNotification} from '@mantine/notifications';
import {useAppDispatch, useAppSelector} from './slices/store';
import {StorageActions} from './slices/StorageSlice';
import {EditorAsyncActions} from "./slices/EditorSlice";

export const useBuildProject = () => {
	const dispatch = useAppDispatch();
	const projectPath = useAppSelector(state => state.filetree.root?.path);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const saveFilesOnBuild = useAppSelector(state => state.storage.saveFilesOnBuild);

	const buildProject = async () => {
		if (!projectPath || !project) return;

		if (saveFilesOnBuild) await dispatch(EditorAsyncActions.saveAllFiles());

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

	return {
		buildProject,
		buildProjectAndRun
	};
};