import {AppDispatch, resetAllSlices} from './slices/store';
import {MainProcess} from './MainProcessUtils';
import {FileTreeActions} from './slices/FileTreeSlice';
import {ProjectActions} from './slices/ProjectSlice';

export const handleOpenProject = async (dispatch: AppDispatch) => {
	console.log('opening project...');
	const project = await MainProcess.openProject();

	console.log('open project response', project);
	if (!project) return;

	resetAllSlices(dispatch);

	dispatch(FileTreeActions.setRootDirectory(project.root));

	// TODO: Handle invalid .tseproj files
	dispatch(ProjectActions.setProject(JSON.parse(project.tseproj)));
};