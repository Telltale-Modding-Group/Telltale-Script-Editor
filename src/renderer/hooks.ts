import {BuildsActions} from './slices/BuildsSlice';
import {SidebarActions} from './slices/SidebarSlice';
import {MainProcess} from './MainProcessUtils';
import {FileTreeAsyncActions} from './slices/FileTreeSlice';
import {showNotification} from '@mantine/notifications';
import {useAppDispatch, useAppSelector} from './slices/store';
import {StorageActions} from './slices/StorageSlice';

export const useBuildProject = () => {
	const dispatch = useAppDispatch();
	const projectPath = useAppSelector(state => state.filetree.root?.path);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.storage.gamePath);

	const buildProject = async () => {
		if (!projectPath || !project) return;

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
		let gamePath = gameExePath;

		if (!gamePath) {
			gamePath = await MainProcess.getGamePath();

			if (!gamePath) return;

			dispatch(StorageActions.setGamePath(gamePath));
		}

		const buildZipPath = await buildProject();

		if (!buildZipPath) return;

		await MainProcess.runProject({ buildZipPath, gamePath });
	};

	return {
		buildProject,
		buildProjectAndRun
	};
};