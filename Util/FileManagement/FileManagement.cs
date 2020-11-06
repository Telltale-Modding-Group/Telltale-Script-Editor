using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Telltale_Script_Editor.Util.GUI;
using Telltale_Script_Editor.Util.JSON;

namespace Telltale_Script_Editor.Util.FileManagement
{
    public class FileManagement
    {
        private TreeView fileTreeView;
        private ProgressBar progressBar;
        public string WorkingDirectory;
        public FileSystemWatcher fsWatcher;
        public EditorProject CurrentProject;

        /// <summary>
        /// File management class
        /// </summary>
        /// <param name="w">The ProgressBar on which to report progress</param>
        /// <param name="x">The main TreeView to display file structure</param>
        /// <param name="y">The working directory for the project</param>
        /// <param name="z">An instance of the Editor Window</param>
        public FileManagement(ProgressBar w, TreeView x, string y, EditorWindow z)
        {
            this.progressBar = w;
            this.fileTreeView = x;
            this.WorkingDirectory = y; 
            MonitorDirectory(WorkingDirectory, z);
        }

        /// <summary>
        /// Repopulates the file-reltaed GUIs.
        /// </summary>
        public void PopulateFileGUI()
        {
            fileTreeView.Nodes.Clear();
            FileSystemTreeView.LoadDirectory(WorkingDirectory, fileTreeView, progressBar);
        }

        /// <summary>
        /// Import an existing TTARCH2 Archive
        /// </summary>
        /// <param name="x">The location of the archive to import</param>
        public void ImportTTARCH(string x)
        {
            var exeLoc = System.Reflection.Assembly.GetEntryAssembly().Location;
            Console.WriteLine("Exe is located at " + exeLoc);
        }


        /// <summary>
        /// Rename a node in the file tree view
        /// </summary>
        /// <param name="x">The old path of the file</param>
        /// <param name="y">The new path of the file</param>
        /// <remarks>
        /// TODO: This needs a more efficient rewrite - just a hacky solution for now since I'm about to pull my hair out.
        ///       Can someone work on this?
        /// </remarks>
        private void RenameFileNode(string x, string y)
        {
            var node = GetNodeByDirectory(x);
            if (node != null)
                {
                    node.Tag = y;
                    node.Text = Path.GetFileName(y);
                }
        }

        /// <summary>
        /// Delete a node in the file tree view
        /// </summary>
        /// <param name="x">The path of the deleted file</param>
        private void DeleteFileNode(string x)
        {
            var node = GetNodeByDirectory(x);
            if(node != null)
            {
                node.Remove();
            }
        }

        /// <summary>
        /// Load a project file
        /// </summary>
        /// <param name="x">The location of the project file</param>
        public void LoadProject(string x)
        {
            CurrentProject = JsonConvert.DeserializeObject<EditorProject>(File.ReadAllText(x));
            Console.WriteLine($"Loaded \"{CurrentProject.mod.name}\" by {CurrentProject.mod.author}");
        }

        /// <summary>
        /// Monitors a directory for changes
        /// </summary>
        /// <param name="x">The directory to watch</param>
        /// <param name="y">An instance of the window where changes are to be reflected</param>
        public void MonitorDirectory(string x, EditorWindow y)
        {
            fsWatcher = new FileSystemWatcher();
            fsWatcher.Path = x;
            fsWatcher.Created += fsWatcher_Created;
            fsWatcher.Deleted += fsWatcher_Deleted;
            fsWatcher.Renamed += fsWatcher_Renamed;
            fsWatcher.SynchronizingObject = y;
            fsWatcher.IncludeSubdirectories = true;
            fsWatcher.EnableRaisingEvents = true;
        }

        private void fsWatcher_Created(object sender, FileSystemEventArgs e)
        {
            PopulateFileGUI();
        }

        private void fsWatcher_Deleted(object sender, FileSystemEventArgs e)
        {
            DeleteFileNode(e.FullPath);
        }

        private void fsWatcher_Renamed(object sender, RenamedEventArgs e)
        {
            Console.WriteLine($"File at {e.OldFullPath} renamed! New path: {e.FullPath}");
            RenameFileNode(e.OldFullPath, e.FullPath);
        }

        private TreeNode GetNodeByDirectory(string x )
        {
            var allNodes = fileTreeView.Nodes
            .Cast<TreeNode>()
            .SelectMany(GetNodeBranch);

            foreach (var treeNode in allNodes)
            {
                if (treeNode.Tag != null && treeNode.Tag.ToString() == x)
                    return treeNode;
            }
            return null;
        }

        private IEnumerable<TreeNode> GetNodeBranch(TreeNode node)
        {
            yield return node;

            foreach (TreeNode child in node.Nodes)
                foreach (var childChild in GetNodeBranch(child))
                    yield return childChild;
        }

        /// <summary>
        /// Save the currently active file
        /// </summary>
        /// <param name="x">Where to save the file</param>
        /// <remarks>If 'x' is not passed, the original file will be overwritten.</remarks>
        public void SaveFile(string x = null)
        {
            if(x == null)
            {
                //Save normally
            }
            else
            {
                //Save as
            }
        }

        /// <summary>
        /// Builds the project
        /// </summary>
        /// <param name="runGameAfterBuild">If true, the mod will be installed & the game run after the build is completed</param>
        public void BuildProject(bool runGameAfterBuild = false)
        {
            fsWatcher.EnableRaisingEvents = false;
            fileTreeView.Enabled = false;
            if (runGameAfterBuild)
            {
                MessageBox.Show("This feature is currently not supported.", "Not Implemented");
                return;
            }

            var buildDirectory = $"{WorkingDirectory}\\Builds";
            var tempDirectory = $"{buildDirectory}\\Temp";

            var buildZip = $"{buildDirectory}\\build-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}.zip";

            if (!Directory.Exists(buildDirectory))
                Directory.CreateDirectory(buildDirectory);

            if (!Directory.Exists(tempDirectory))
                Directory.CreateDirectory(tempDirectory);
            else
                ClearDirectory(tempDirectory);

            List<string> ttarchNames = new List<string>();
            List<string> luaNames = new List<string>();

            foreach (string dirPath in Directory.GetDirectories(WorkingDirectory, "*", SearchOption.TopDirectoryOnly))
            {
                if (dirPath != buildDirectory && dirPath != tempDirectory) 
                 Directory.CreateDirectory(dirPath.Replace(WorkingDirectory, tempDirectory));
            }

            foreach (string luaFile in Directory.GetFiles(WorkingDirectory, "*.lua", SearchOption.AllDirectories))
            {
                CompileLuaScript(luaFile, luaFile.Replace(WorkingDirectory, tempDirectory));
            }

            foreach (string newPath in Directory.GetFiles(WorkingDirectory, "*.*", SearchOption.AllDirectories).Where(name => !name.EndsWith(".lua") && !name.EndsWith(".tseproj")))
            {
                if(Path.GetDirectoryName(newPath) != tempDirectory && Path.GetDirectoryName(newPath) != buildDirectory)
                    File.Copy(newPath, newPath.Replace(WorkingDirectory, tempDirectory), true);
            }

            foreach (string archiveDirPath in Directory.GetDirectories(WorkingDirectory, "*", SearchOption.TopDirectoryOnly))
            {
                if (archiveDirPath != buildDirectory && archiveDirPath != tempDirectory)
                {
                    //build ttarch
                    
                    string ttarchName = new DirectoryInfo(archiveDirPath).Name;
                    string temp = ttarchName.Substring(7, ttarchName.Length - 7);
                    string logicalName = temp.Substring(0, temp.LastIndexOf("_"));

                    ttarchNames.Add(ttarchName + $"_{Regex.Replace(CurrentProject.mod.name, @"[^A-Za-z0-9]+", "")}.ttarch2");
                    ttarchNames.Add("_resdesc_50_" + logicalName + "_" + Regex.Replace(CurrentProject.mod.name, @"[^A-Za-z0-9]+", "") + ".lua");

                    BuildTtarchArchive(
                        tempDirectory + "\\" + new DirectoryInfo(archiveDirPath).Name,
                        logicalName
                        );        
                }
            }

            //create JSON manifest

            ModInfo manifest = new ModInfo
            {
                ModDisplayName = CurrentProject.mod.name,
                ModVersion = CurrentProject.mod.version,
                ModAuthor = CurrentProject.mod.author,
                ModCompatibility = "The_Walking_Dead_Definitive_Edition",
                ModFiles = ttarchNames
            };

            File.WriteAllText($"{tempDirectory}\\modinfo_{Regex.Replace(CurrentProject.mod.name, @"[^A-Za-z0-9]+", "")}.json", JsonConvert.SerializeObject(manifest, Formatting.Indented));


            if (File.Exists(buildZip))
                File.Delete(buildZip);
            
            ZipFile.CreateFromDirectory(tempDirectory, buildZip);

            Directory.Delete(tempDirectory, true);
            fsWatcher.EnableRaisingEvents = true;
            this.PopulateFileGUI();
            fileTreeView.Enabled = true;
        }

        private void BuildTtarchArchive(string x, string y)
        {
            string exeLocation = System.Reflection.Assembly.GetEntryAssembly().Location;
            var ttarch = $"{Path.GetDirectoryName(exeLocation)}\\ttarchext.exe";

            string modFileName = Regex.Replace(CurrentProject.mod.name, @"[^A-Za-z0-9]+", "");

            string ttarchDirectory = x + "_" + modFileName + ".ttarch2";
            string ttarchName = Path.GetFileName(ttarchDirectory); 
            string setName = y + modFileName;

            string luaTemp = Directory.GetParent(x).FullName + "\\lua\\";

            if (!Directory.Exists(luaTemp))
                Directory.CreateDirectory(luaTemp);

            string luaDirectory = Directory.GetParent(x).FullName + "\\lua\\" + "_resdesc_50_" + y + "_" + modFileName + ".lua";

            string luaFinal = Directory.GetParent(x).FullName;
            string[] luaFile =
            {
                "--This file was automatically generated by the Telltale Script Editor, available at https://github.com/Telltale-Modding-Group/Telltale-Script-Editor",
                "local set = {}",
               $"set.name = \"{setName}\"",
               $"set.setName = \"{setName}\"",
                "set.descriptionFilenameOverride = \"\"",
               $"set.logicalName = \"<{y}>\"",
                "set.logicalDestination = \"<>\"",
                "set.priority = 900",
                "set.localDir = _currentDirectory",
                "set.enableMode = \"bootable\"",
                "set.version = \"trunk\"",
                "set.descriptionPriority = 0",
               $"set.gameDataName = \"{setName} Game Data\"",
                "set.gameDataPriority = 900",
                "set.gameDataEnableMode = \"constant\"",
                "set.localDirIncludeBase = true",
                "set.localDirRecurse = false",
                "set.localDirIncludeOnly = nil",
                "set.localDirExclude =",
                "{",
                "    \"Packaging/\",",
                "    \"_dev/\"",
                "}",
                "set.gameDataArchives =",
                "{",
               $"    _currentDirectory .. \"{ttarchName}\"",
                "}",
                "RegisterSetDescription(set)"
            };

            File.WriteAllLines(luaDirectory, luaFile);

            if (!File.Exists(ttarch))
            {
                MessageBox.Show("ttarchext.exe wasn't found!", "You can't do that!");
                return;
            }

            if(!Directory.Exists(x))
            {
                MessageBox.Show("How did this even happen? Literally you should never ever see this message box. Something went catastrophically wrong.");
                return;
            }

            Process process = new Process
            {
                StartInfo =
                     {
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        FileName = ttarch,
                        Arguments = $"-b 67 \"{ttarchDirectory}\" \"{x}\""
                    }
                //Arguments = $"67 \"{x}\" \"{unpackDir}\"" TTDS
                //Arguments = $"-k 96CA999F8DDA9A87D7CDD9986295AAB8D59596E5A4B99BD0C9559F8590CDCD9FC8B39993C6C49DA0A5A4CFCDA39DBBDDACA78B94D4A66F 0 \"{x}\" \"{unpackDir}\"" SEASON 4
                //Arguments = $"-k 86DE8EA688D594B1E59DA59479DAB4C9CD938EE5B0A6669FAC96D0C79DD5C2A2D276627FA8D89ADED9DDD9DAAA63829F8CD887A5D4DBA0 0 \"{x}\" \"{unpackDir}\"" GOTG
            };

            process.Start();
            while (!process.StandardOutput.EndOfStream)
            {
                string line = process.StandardOutput.ReadLine();
                Console.WriteLine(line);
                Application.DoEvents();
            }
            process.WaitForExit();
            if (process.HasExited)
            {
                Process luaComp = new Process
                {
                    StartInfo =
                     {
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        FileName = ttarch,
                        Arguments = $"-V 7 -e 0 67 \"{luaDirectory}\" \"{luaFinal}\""
                    }
                    //Arguments = $"67 \"{x}\" \"{unpackDir}\"" TTDS
                    //Arguments = $"-k 96CA999F8DDA9A87D7CDD9986295AAB8D59596E5A4B99BD0C9559F8590CDCD9FC8B39993C6C49DA0A5A4CFCDA39DBBDDACA78B94D4A66F 0 \"{x}\" \"{unpackDir}\"" SEASON 4
                    //Arguments = $"-k 86DE8EA688D594B1E59DA59479DAB4C9CD938EE5B0A6669FAC96D0C79DD5C2A2D276627FA8D89ADED9DDD9DAAA63829F8CD887A5D4DBA0 0 \"{x}\" \"{unpackDir}\"" GOTG
                };

                luaComp.Start();
                while(!luaComp.StandardOutput.EndOfStream)
                {
                    string line = luaComp.StandardOutput.ReadLine();
                    Console.WriteLine(line);
                    Application.DoEvents();
                }
                luaComp.WaitForExit();
                if(luaComp.HasExited)
                {
                    Console.WriteLine($"Compiled archive {y}!");
                    Console.WriteLine($"Exit code {process.ExitCode}");
                    Console.WriteLine($"Compiled lua for archive {y}!");
                    Console.WriteLine($"Exit code {luaComp.ExitCode}");
                    Directory.Delete(x, true);
                    Directory.Delete(Directory.GetParent(x).FullName + "\\lua\\", true);
                }
            }
        }

        private void ClearDirectory(string x)
        {
            DirectoryInfo di = new DirectoryInfo(x);

            foreach (FileInfo file in di.GetFiles())
            {
                file.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                dir.Delete(true);
            }

        }

        /// <summary>
        /// Import & Unpack a TTARCH2 Archive
        /// </summary>
        /// <param name="x">The location of the archive to import</param>
        public void ImportTelltaleArchive(string x, bool additionalConsoleOutput)
        {
            string exeLocation = System.Reflection.Assembly.GetEntryAssembly().Location;
            var ttarch = $"{Path.GetDirectoryName(exeLocation)}\\ttarchext.exe";

            if (!File.Exists(ttarch))
            {
                MessageBox.Show("ttarchext.exe wasn't found!", "You can't do that!");
                return;
            }

            string unpackDir = $"{WorkingDirectory}\\{Path.GetFileNameWithoutExtension(x)}";

            if (!Directory.Exists(unpackDir))
                Directory.CreateDirectory(unpackDir);
            else
            {
                MessageBox.Show("An archive with that name already exists within the project.", "You can't do that!");
                return;
            }

            Process process = new Process
            {
                StartInfo =
                     {
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        FileName = ttarch,
                        Arguments = $"-f \"*.lua\" 67 \"{x}\" \"{unpackDir}\""
                    }
                //Arguments = $"67 \"{x}\" \"{unpackDir}\"" TTDS
                //Arguments = $"-k 96CA999F8DDA9A87D7CDD9986295AAB8D59596E5A4B99BD0C9559F8590CDCD9FC8B39993C6C49DA0A5A4CFCDA39DBBDDACA78B94D4A66F 0 \"{x}\" \"{unpackDir}\"" SEASON 4
                //Arguments = $"-k 86DE8EA688D594B1E59DA59479DAB4C9CD938EE5B0A6669FAC96D0C79DD5C2A2D276627FA8D89ADED9DDD9DAAA63829F8CD887A5D4DBA0 0 \"{x}\" \"{unpackDir}\"" GOTG
            };
            this.fsWatcher.EnableRaisingEvents = false;
            this.fileTreeView.Enabled = false;
            process.Start();
            while (!process.StandardOutput.EndOfStream)
            {
                string line = process.StandardOutput.ReadLine();
                if (additionalConsoleOutput) Console.WriteLine(line);
                Application.DoEvents();
            }
            process.WaitForExit();
            if (process.HasExited)
            {
                List<string> files = new List<string>();

                foreach (var ogFile in
                Directory.EnumerateFiles(unpackDir, "*.lua"))
                {
                    files.Add(ogFile);
                }

                foreach (var file in files)
                {
                    var newFileName = WorkingDirectory + "\\" + Path.GetFileNameWithoutExtension(x) + "\\" + Path.GetFileNameWithoutExtension(file) + "_temp.lua";
                    File.Move(file, newFileName);
                    if (additionalConsoleOutput) Console.WriteLine("Moved file " + file);
                    Application.DoEvents();
                }

                foreach (var file in files)
                {
                    var newFileName = WorkingDirectory + "\\" + Path.GetFileNameWithoutExtension(x) + "\\" + Path.GetFileNameWithoutExtension(file) + "_temp.lua";
                    DecompileLuaScript(newFileName, file, additionalConsoleOutput);
                    Application.DoEvents();
                }

                this.fsWatcher.EnableRaisingEvents = true;
                this.PopulateFileGUI();
                fileTreeView.Enabled = true;
            }
        }

        /// <summary>
        /// Decompile a Lua Script
        /// </summary>
        /// <param name="x">The location of the compiled script</param>
        /// <param name="y">The location of the decompiled script</param>
        private void DecompileLuaScript(string x, string y, bool additionalConsoleOutput)
        {
            var luaDecompTemp = $"{Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location)}\\luadec.exe";

            var folderNames = luaDecompTemp.Split('\\');

            folderNames = folderNames.Select(fn => (fn.Contains(' ')) ? String.Format("\"{0}\"", fn) : fn)
                                     .ToArray();

            var luaDecompFile = String.Join("\\", folderNames);

            Process luaDecomp = new Process
            {
                StartInfo =
                {
                    FileName = "cmd.exe",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    Arguments = $"/C {luaDecompFile} \"{x}\" > \"{y}\""
                }
            };

            luaDecomp.Start();
            while (!luaDecomp.StandardOutput.EndOfStream)
            {
                string line = luaDecomp.StandardOutput.ReadLine();
                if (additionalConsoleOutput) Console.WriteLine(line);
                Application.DoEvents();
            }
            if (luaDecomp.HasExited)
            {
                File.Delete(x);
                if (additionalConsoleOutput) Console.WriteLine($"Decompiled {y}! Exit code {luaDecomp.ExitCode}");
                Application.DoEvents();
            }
        }

        private void CompileLuaScript(string x, string y)
        {
            var luaCompileTemp = $"{Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location)}\\luac.exe";

            var folderNames = luaCompileTemp.Split('\\');

            folderNames = folderNames.Select(fn => (fn.Contains(' ')) ? String.Format("\"{0}\"", fn) : fn)
                                     .ToArray();

            var luaCompileFile = String.Join("\\", folderNames);

            Process luaCompile = new Process
            {
                StartInfo =
                {
                    FileName = "cmd.exe",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    Arguments = $"/C {luaCompileFile} -o \"{y}\" \"{x}\""
                }
            };

            luaCompile.Start();
            while (!luaCompile.StandardOutput.EndOfStream)
            {
                string line = luaCompile.StandardOutput.ReadLine();
                Console.WriteLine(line);
                Application.DoEvents();
            }
            if (luaCompile.HasExited)
            {
                Console.WriteLine($"Compiled {y}! Exit code {luaCompile.ExitCode}");
                Application.DoEvents();
            }
        }
    }
}
