import {AppDispatch, resetAllSlices} from './slices/store';
import {MainProcess} from './MainProcessUtils';
import {FileTreeActions} from './slices/FileTreeSlice';
import {ProjectActions} from './slices/ProjectSlice';
import {EditorFile, getDefaultProject, Project} from '../shared/types';
import {showNotification} from '@mantine/notifications';
import {OverlayActions} from './slices/OverlaySlice';
import {isSupported} from './FileUtils';
import {StorageActions} from './slices/StorageSlice';

export const openProject = (dispatch: AppDispatch, root: EditorFile, project: Project) => {
	if (!root.directory) return;

	resetAllSlices(dispatch);

	dispatch(FileTreeActions.setRootDirectory(root));
	dispatch(ProjectActions.setProject(project));

	const tseprojPath = root.children.find(child => child.path.endsWith('.tseproj'))!.path;
	dispatch(StorageActions.addRecentProject({ project, tseprojPath }));
};

export const handleOpenProject = async (dispatch: AppDispatch) => {
	dispatch(OverlayActions.show());

	const project = await MainProcess.openProject();

	if (project && project.root.directory) {
		const tseprojJSON = project.tseproj;
		let tseproj: Project;

		try {
			tseproj = JSON.parse(tseprojJSON);
		} catch {
			return showNotification({
				title: 'Invalid Project',
				message: 'The found .tseproj is corrupted and cannot be parsed as JSON.',
				color: 'red'
			});
		}

		// TODO: Handle tseproj with invalid schema
		const defaultProject = getDefaultProject();

		const { formatVersion: defaultVersion, mod: defaultMod, tool: defaultTool } = defaultProject;

		const tseprojWithDefaults: Project = {
			formatVersion: tseproj.formatVersion ?? defaultVersion,
			tool: { ...defaultTool, ...(tseproj.tool ?? {}) },
			mod: { ...defaultMod, ...(tseproj.mod ?? {}) }
		};

		openProject(dispatch, project.root, tseprojWithDefaults);
	}

	dispatch(OverlayActions.hide());
};

export const iterateFiles = (root: EditorFile): EditorFile[] => {
	if (root.directory) {
		return root.children
			.map(child => iterateFiles(child))
			.reduce((acc, descendantGroup) => [...acc, ...descendantGroup], []);
	}

	return isSupported(root) ? [root] : [];
};