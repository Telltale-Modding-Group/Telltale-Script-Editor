import {AppDispatch, resetAllSlices} from './slices/store';
import {MainProcess} from './MainProcessUtils';
import {FileTreeActions} from './slices/FileTreeSlice';
import {ProjectActions} from './slices/ProjectSlice';
import {getDefaultProject, Project} from '../shared/types';
import {showNotification} from '@mantine/notifications';

export const handleOpenProject = async (dispatch: AppDispatch) => {
	const project = await MainProcess.openProject();

	if (!project) return;

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

	resetAllSlices(dispatch);

	MainProcess.updateAppState({ projectOpen: true });

	dispatch(FileTreeActions.setRootDirectory(project.root));

	// TODO: Handle tseproj with invalid schema
	const defaultProject = getDefaultProject();

	const { formatVersion: defaultVersion, mod: defaultMod, tool: defaultTool } = defaultProject;

	const tseprojWithDefaults: Project = {
		formatVersion: tseproj.formatVersion ?? defaultVersion,
		tool: { ...defaultTool, ...(tseproj.tool ?? {}) },
		mod: { ...defaultMod, ...(tseproj.mod ?? {}) }
	};

	dispatch(ProjectActions.setProject(tseprojWithDefaults));
};