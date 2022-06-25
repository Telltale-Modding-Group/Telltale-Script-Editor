import { AppState, createModInfo, Project, ModInfo } from '../../shared/types';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import {
	createResourceDescription,
	generateResourceDescriptionContents,
	generateResourceDescriptionName,
	generateTtarchName,
	ResourceDescription
} from './ResdescUtils';
import crypto from 'crypto';

const generateHash = (string: string) => {
	const hash = crypto.createHash('md5');
	hash.update(string);

	return hash.digest('hex');
}

const generateHashForFile = async (path: string) => {
	const fileContents = await fs.readFile(path, 'utf8');

	return generateHash(fileContents);
}

type Hash = string;
type Cache = { tseproj?: Hash } & Record<string, Record<string, Hash>>;
export type Logger = (message: string) => void;

const writeResourceDescription = async (project: Project, resdesc: ResourceDescription, cachePath: string, log: Logger) => {
	const resdescOutputPath = path.join(cachePath, generateResourceDescriptionName(project, resdesc));

	await fs.mkdir(path.dirname(resdescOutputPath), {recursive: true});

	await fs.writeFile(resdescOutputPath, generateResourceDescriptionContents(project, resdesc));
	const process = exec(`resources\\ttarchext.exe -V 7 -e 0 -o 67 "${resdescOutputPath}" "${cachePath}"`, (e, out, err) => {
		log(out);
		log(err);
	});

	await new Promise(resolve => process.addListener('close', resolve));
};

const compileLua = async (filePath: string, projectPath: string, cachePath: string, log: Logger) => {
	const compiledLuaPath = filePath.replace(projectPath, cachePath);
	await fs.mkdir(path.dirname(compiledLuaPath), {recursive: true});

	let error;
	const process = exec(`resources\\luac.exe -o "${compiledLuaPath}" "${filePath}"`, async (e, out, err) => {
		if (err) {
			log(err);

			error = err;
		}
	});
	await new Promise(resolve => process.addListener('close', resolve));

	if (error) throw new Error(error);
};

export const buildProject = async (log: Logger, state: AppState, { projectPath, project }: { projectPath: string, project: Project }): Promise<ModInfo | void> => {
	const buildsPath = path.join(projectPath, 'Builds');
	const cachePath = path.join(buildsPath, 'cache');

	let previousCache: Cache;

	try {
		const cacheFile = await fs.readFile(path.join(cachePath, 'cache.json'), 'utf8');
		log('============== Loading cache from previous builds...');
		previousCache = JSON.parse(cacheFile);
	} catch {
		previousCache = {};
	}

	const newCache: Cache = {};

	const tasks: Promise<unknown>[] = [];

	const generateTtarchArchives = new Set<string>();
	const projectDir = await fs.opendir(projectPath);
	let generateResourceDescriptions = false;
	for await (const projectFile of projectDir) {
		const projectFilePath = path.join(projectPath, projectFile.name);
		const archiveName = projectFile.name;

		if (projectFile.name.endsWith('.tseproj')) {
			const hash = await generateHashForFile(projectFilePath);
			newCache.tseproj = hash;

			generateResourceDescriptions = hash !== previousCache.tseproj;
			continue;
		}

		if (!projectFile.isDirectory() || archiveName === 'Builds') continue;

		const currentArchiveCache: Cache[string] = {};

		const archiveDir = await fs.opendir(projectFilePath);
		for await (const archiveFile of archiveDir) {
			if (archiveFile.isDirectory()) continue;
			const archiveFileName = archiveFile.name;
			const archiveFilePath = path.join(projectFilePath, archiveFileName);

			const hash = await generateHashForFile(archiveFilePath);
			currentArchiveCache[archiveFileName] = hash;

			if (hash === previousCache[archiveName]?.[archiveFileName]) continue;

			generateTtarchArchives.add(archiveName);

			if (archiveFileName.endsWith('.lua')) {
				tasks.push(compileLua(archiveFilePath, projectPath, cachePath, log));
			} else {
				tasks.push(fs.cp(archiveFilePath, path.join(cachePath, archiveName, archiveFileName), {recursive: true}));
			}
		}

		newCache[archiveName] = currentArchiveCache;

		if (!previousCache[archiveName] || generateResourceDescriptions) {
			if (generateResourceDescriptions) {
				log('============== Project settings updated since previous build, generating resource description...');
			} else {
				log('============== New archive found, generating resource description...');
			}

			const resdesc = createResourceDescription(project, archiveName);
			const resdescName = generateResourceDescriptionName(project, resdesc);

			log(`============== Generating ${resdescName}...`);

			tasks.push(writeResourceDescription(project, resdesc, cachePath, log));
			continue;
		}

		Object.keys(previousCache[archiveName]).forEach(file => {
			// If the previous cache has a file that the current archive doesn't have, it must have been deleted.
			// Clear the previous cache for that file.
			if (!currentArchiveCache[file]) {
				log(`============== Clearing cached file ${file} as it is no longer needed...`);
				generateTtarchArchives.add(archiveName);
				tasks.push(fs.rm(path.join(cachePath, archiveName, file), { recursive: true }).catch());
			}
		})
	}

	Object.keys(previousCache).forEach(archive => {
		// If the previous cache has an archive that the current project doesn't have, it must have been deleted.
		// Clear the previous cache for that archive.
		if (!newCache[archive]) {
			log(`============== Clearing cached archive ${archive} as it is no longer needed...`);
			const ttarch = generateTtarchName(project, archive);
			const resdesc = createResourceDescription(project, ttarch);
			const resdescFilename = generateResourceDescriptionName(project, resdesc);

			tasks.push(fs.rm(path.join(cachePath, archive), { recursive: true }));
			tasks.push(fs.rm(path.join(cachePath, ttarch)));
			tasks.push(fs.rm(path.join(cachePath, resdescFilename)));
		}
	});

	try {
		await Promise.all(tasks);
	} catch (e) {
		log(`============== There was an error building the project!`);
		log(`${e}`);

		return;
	}

	const ttarchTasks: Promise<unknown>[] = [];
	generateTtarchArchives.forEach(archive => {
		const archivePath = path.join(cachePath, archive);

		const ttarchName = generateTtarchName(project, archive);

		const ttarchFilePath = path.join(cachePath, ttarchName);

		log(`============== Generating ${ttarchFilePath} from ${archivePath}...`);

		const process = exec(`resources\\ttarchext.exe -b -o 67 "${ttarchFilePath}" "${archivePath}"`, (error, stdout, stderr) => {
			log(stdout);
			log(stderr);
		});

		ttarchTasks.push(new Promise(resolve => process.addListener('close', resolve)));
	});

	await Promise.all(ttarchTasks);

	log('============== Updating cache...');
	await fs.writeFile(path.join(cachePath, 'cache.json'), JSON.stringify(newCache));

	const filesInCache = await fs.readdir(path.join(cachePath));

	return createModInfo(project, filesInCache.filter(file => file.endsWith('.lua') || file.endsWith('.ttarch2')));
}