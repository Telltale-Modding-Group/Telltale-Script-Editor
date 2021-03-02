using Microsoft.Win32;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using Telltale_Script_Editor.Util;
using Telltale_Script_Editor.Util.FileManagement;
using Telltale_Script_Editor.Util.GUI;
using Telltale_Script_Editor.Util.JSON;

namespace Telltale_Script_Editor
{
    public partial class EditorWindow : Form
    {
        private string WorkingDirectory;
        private string activeFile;

        public FileManagement fileManager;

        public EditorWindow()
        {
            InitializeComponent();

            //add a context menu to the file tree for convience
            ContextMenu contextMenu = new ContextMenu();

            //create a menu item for opening said item in explorer
            MenuItem projectFileTree_menuItem1 = new MenuItem("Open In Explorer", projectFileTree_menuItem1_ContextMenuClick);

            //create a menu item for delete said selected item in the tree
            MenuItem projectFileTree_menuItem2 = new MenuItem("Delete", projectFileTree_menuItem2_ContextMenuClick);

            //create a menu item for renaming said selected item in the tree
            MenuItem projectFileTree_menuItem3 = new MenuItem("Rename", projectFileTree_menuItem3_ContextMenuClick);

            //add the menus
            contextMenu.MenuItems.Add(projectFileTree_menuItem3);
            contextMenu.MenuItems.Add(projectFileTree_menuItem2);
            contextMenu.MenuItems.Add(projectFileTree_menuItem1);

            //add the context menu
            projectFileTree.ContextMenu = contextMenu;
        }

        //rename
        private void projectFileTree_menuItem3_ContextMenuClick(object sender, EventArgs e)
        {
            string filePath = projectFileTree.SelectedNode.Tag.ToString();

            string fileName ;
            string fileExtension;//returns with the period
            string fileDirectory;
            string rename;

            if (File.Exists(filePath))
            {
                fileName = Path.GetFileName(projectFileTree.SelectedNode.Tag.ToString());
                fileExtension = Path.GetExtension(filePath);//returns with the period
                fileDirectory = Path.GetDirectoryName(filePath);

                rename = Prompt.ShowDialog(fileName, "Rename File");

                if (string.IsNullOrEmpty(rename))
                    return;

                string newFilePath = fileDirectory + "/" + rename + fileExtension;

                //rename the file
                File.Move(filePath, newFilePath);
            }
            else
            {
                fileDirectory = Path.GetDirectoryName(filePath);
                fileName = filePath.Remove(0, fileDirectory.Length + 1);

                rename = Prompt.ShowDialog(fileName, "Rename Folder");

                if (string.IsNullOrEmpty(rename))
                    return;

                string newFolderPath = fileDirectory + "/" + rename;

                //rename the folder
                Directory.Move(filePath, newFolderPath);
            }
        }

        //delete
        private void projectFileTree_menuItem2_ContextMenuClick(object sender, EventArgs e)
        {
            string selectedPath = projectFileTree.SelectedNode.Tag.ToString();
            string fileName;
            string message;

            if (File.Exists(selectedPath))
            {
                fileName = Path.GetFileName(selectedPath);
                message = string.Format("Are you sure you want to delete '{0}'?", fileName);

                //get our message box
                DialogResult messageBox = MessageBox.Show(message, "Delete File", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

                if (messageBox == DialogResult.Yes)
                {
                    //delete file
                    File.Delete(selectedPath);
                }
            }
            else
            {
                fileName = Path.GetDirectoryName(selectedPath);
                string folderName = selectedPath.Remove(0, fileName.Length + 1);
                message = string.Format("Are you sure you want to delete the folder '{0}'? This will also delete all of the contents of this folder. This cannot be undone!", folderName);

                //get our message box
                DialogResult messageBox = MessageBox.Show(message, "Delete Folder", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

                if (messageBox == DialogResult.Yes)
                {
                    //delete folder
                    Directory.Delete(selectedPath, true);
                }
            }
        }

        //open in explorer
        private void projectFileTree_menuItem1_ContextMenuClick(object sender, EventArgs e)
        {
            //get directory path
            string directory = Path.GetDirectoryName(projectFileTree.SelectedNode.Tag.ToString());

            //create a windows explorer processinfo to be exectued
            ProcessStartInfo processStartInfo = new ProcessStartInfo();
            processStartInfo.FileName = directory;
            processStartInfo.UseShellExecute = true;
            processStartInfo.Verb = "open";

            //start the process
            Process.Start(processStartInfo);
        }

        private void highlightedTextBox_Load(object sender, EventArgs e)
        {
            highlightedTextBox.Language = FastColoredTextBoxNS.Language.Lua;
        }

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            About aboutWindow = new About();
            aboutWindow.ShowDialog();
        }

        private void EditorWindow_Load(object sender, EventArgs e)
        {
            Console.SetOut(new ConsoleOutput(consoleOutput));
        }

        private void projectToolStripMenuItem2_Click(object sender, EventArgs e)
        {
            OpenFileDialog choofdlog = new OpenFileDialog();
            choofdlog.InitialDirectory = Application.StartupPath;

            choofdlog.Filter = "Telltale Script Editor Project (*.tseproj)|*.tseproj";
            choofdlog.FilterIndex = 1;
            choofdlog.Multiselect = false;

            if (choofdlog.ShowDialog() == DialogResult.OK)
            {
                string sFileName = choofdlog.FileName;
                WorkingDirectory = Path.GetDirectoryName(sFileName);
                fileManager = new FileManagement(operationProgressBar, projectFileTree, WorkingDirectory, this);
                if(fileManager.LoadProject(sFileName))
                    fileManager.PopulateFileGUI();
                else
                {
                    fileManager = null;
                }
            }
        }

        void projectFileTree_NodeDoubleClick(object sender, TreeNodeMouseClickEventArgs e)
        {
            try
            {
                if (!e.Node.Text.Contains("."))
                    return;

                if(!e.Node.Text.EndsWith(".ttarch2") && !e.Node.Text.EndsWith(".lua") && !e.Node.Text.EndsWith(".tseproj") && !e.Node.Text.EndsWith(".txt"))
                {
                    MessageBox.Show("This file format isn't supported!", "You can't do that!");
                    return;
                }

                if(e.Node.Text.EndsWith(".ttarch2"))
                {
                    var importArchive = MessageBox.Show("Would you like to unpack this archive?", "Confirm Action", MessageBoxButtons.YesNo);

                    if(importArchive == DialogResult.No)
                        return;
                    else if(importArchive == DialogResult.Yes)
                    {
                        fileManager.ImportTelltaleArchive(e.Node.Tag.ToString(), additionalDebugInfoToolStripMenuItem.Checked);
                    }

                    return;
                }

                if(highlightedTextBox.IsChanged)
                {
                    var confirmChange = MessageBox.Show("There are unsaved changes! Would you like to save them before continuing?", "There are unsaved changes!", MessageBoxButtons.YesNoCancel);
                    if (confirmChange == DialogResult.Cancel)
                        return;
                    else if (confirmChange == DialogResult.Yes)
                        highlightedTextBox.SaveToFile(activeFile, Encoding.UTF8);
                }

                activeFile = e.Node.Tag.ToString();
                highlightedTextBox.Text = File.ReadAllText(e.Node.Tag.ToString());
                highlightedTextBox.ClearUndo();
                highlightedTextBox.IsChanged = false;
                this.Text = $"Telltale Script Editor | {Path.GetFileName(e.Node.Tag.ToString())}";
                highlightedTextBox.Visible = true;
            }
            catch (System.ComponentModel.Win32Exception)
            {
                MessageBox.Show("File not found.");
            }
        }

        private void saveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Save();
        }

        private void saveAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SaveAs();
        }

        private void Save()
        {
            if (activeFile == null)
            {
                MessageBox.Show("No file is currently open!", "You can't do that.");
                return;
            }

            if(Path.GetExtension(activeFile) != ".tseproj")
            {
                highlightedTextBox.SaveToFile(activeFile, Encoding.UTF8);
                highlightedTextBox.IsChanged = false;
            }
            else
            {
                fileManager = new FileManagement(operationProgressBar, projectFileTree, WorkingDirectory, this);
                var ogBuffer = File.ReadAllText(activeFile);
                highlightedTextBox.SaveToFile(activeFile, Encoding.UTF8);
                if (fileManager.LoadProject(activeFile))
                {
                    highlightedTextBox.Text = File.ReadAllText(activeFile);
                    fileManager.PopulateFileGUI();
                    MessageBox.Show("Project updated!", "Success!");
                    highlightedTextBox.IsChanged = false;
                }
                else
                {
                    highlightedTextBox.Text = ogBuffer;
                    File.WriteAllText(activeFile, ogBuffer);
                    highlightedTextBox.IsChanged = false;
                    MessageBox.Show("The tseproj file you tried to save was invalid & won't be saved.", "Something went wrong...");
                    fileManager.LoadProject(activeFile);
                }
            }
        }

        private void SaveAs()
        {
            if (activeFile == null)
            {
                MessageBox.Show("No file is currently open!", "You can't do that.");
                return;
            }

            if (Path.GetExtension(activeFile) == ".tseproj")
            {
                MessageBox.Show("Sorry, but you can't use Save As on tseproj files! It'd probably break things.", "You can't do that.");
                return;
            }

            using (SaveFileDialog dialog = new SaveFileDialog())
            {
                dialog.Filter = "All files (*.*)|*.*";
                dialog.FilterIndex = 2;
                dialog.RestoreDirectory = true;

                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    highlightedTextBox.SaveToFile(dialog.FileName, Encoding.UTF8);
                }
            }
        }

        private void projectToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            string newProjectPath = null;
            using (var fbd = new FolderBrowserDialog())
            {
                fbd.SelectedPath = Application.StartupPath;
                fbd.Description = "Select a folder for your project.";
                DialogResult result = fbd.ShowDialog();


                if (result == DialogResult.OK && !string.IsNullOrWhiteSpace(fbd.SelectedPath))
                {
                    if (Directory.EnumerateFileSystemEntries(fbd.SelectedPath).Any())
                    {
                        MessageBox.Show("The folder must be empty!");
                        return;
                    }

                    newProjectPath = fbd.SelectedPath;

                    string modName = Prompt.ShowDialog("Project Name", "Create New Project");
                    string modAuthor = Prompt.ShowDialog("Mod Author", "Create New Project");
                    MessageBox.Show("Please note that the only currently supported game is The Walking Dead: The Telltale Definitive Series (TTDS).");

                    EditorProject toCreate = new EditorProject
                    {
                        formatVersion = "1",
                        mod = new ModJSON()
                        {
                            name = modName,
                            version = "1.0",
                            author = modAuthor,
                            priority = 950
                        },
                        tool = new ToolJSON()
                        {
                            game = "TTDS"
                        }
                    };

                    string modFileName = Regex.Replace(modName, @"[^A-Za-z0-9]+", "");
                    string modFileDirectory = $"{newProjectPath}\\{modFileName}.tseproj";

                    File.WriteAllText(modFileDirectory, JsonConvert.SerializeObject(toCreate, Formatting.Indented));

                    WorkingDirectory = Path.GetDirectoryName(modFileDirectory);
                    fileManager = new FileManagement(operationProgressBar, projectFileTree, WorkingDirectory, this);
                    fileManager.LoadProject(modFileDirectory);
                    fileManager.PopulateFileGUI();
                }
            }
        }

        /// <summary>
        /// Gets the 'archive' folders in the project
        /// </summary>
        /// <returns></returns>
        private List<string> GetArchiveFolders()
        {
            //temp list to contain our 'archives'
            List<string> result = new List<string>();

            //get the build and temporary folder directory (since apparently these are the only ones in the project not included in the project building)
            var buildDirectory = $"{WorkingDirectory}\\Builds";
            var tempDirectory = $"{buildDirectory}\\Temp";

            //run a loop to go through all of the directories in the project working directory
            foreach (string dirPath in Directory.GetDirectories(WorkingDirectory, "*", SearchOption.AllDirectories))
            {
                //if the current path is not the 'build directory' or 'temp directory' then we found an archive folder
                if (dirPath != buildDirectory && dirPath != tempDirectory)
                {
                    //get the name of the folder
                    string directoryName = dirPath.Remove(0, Directory.GetParent(dirPath).FullName.Length + 1);

                    //add the name of the folder
                    result.Add(directoryName);
                }
            }

            //return the final list
            return result;
        }

        private void scriptToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if(fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            //gets the list of the archive folder names (to be used for the dropdown)
            List<string> archiveNames = GetArchiveFolders();

            //opens a dropdown prompt with the 'archiveNames' as the dropdown items
            var archive = Prompt_Dropdown.ShowDialog("Select an existing archive for the script location.\nOr write a new one into the field.", "Create new Script", archiveNames);

            //if the user exists the prompt, the string will be empty, so do not continue
            if (string.IsNullOrEmpty(archive) || string.IsNullOrWhiteSpace(archive))
                return;

            var scriptName = Prompt.ShowDialog("What should the script be called?", "Create new Script");

            //if the user exists the prompt, the string will be empty, so do not continue
            if (string.IsNullOrEmpty(scriptName) || string.IsNullOrWhiteSpace(scriptName))
                return;

            if (!scriptName.EndsWith(".lua"))
                scriptName += ".lua";

            if (!Directory.Exists($"{fileManager.WorkingDirectory}\\{archive}"))
                Directory.CreateDirectory($"{fileManager.WorkingDirectory}\\{archive}");

            File.Create($"{fileManager.WorkingDirectory}\\{archive}\\{scriptName}").Close();
        }

        //open ttarch
        private void tTARCH2ArchiveToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            if (fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            OpenFileDialog choofdlog = new OpenFileDialog();
            
            choofdlog.Filter = "Telltale Archive (*.ttarch2)|*.ttarch2";
            choofdlog.FilterIndex = 1;
            choofdlog.Multiselect = false;

            if (choofdlog.ShowDialog() == DialogResult.OK)
            {
                string sFileName = choofdlog.FileName;

                fileManager.ImportTelltaleArchive(sFileName, additionalDebugInfoToolStripMenuItem.Checked);
            }
        }


        private void buildToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            fileManager.BuildProject();
        }

        private void undoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if(highlightedTextBox.Visible == true)
                highlightedTextBox.Undo();
        }

        private void redoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if(highlightedTextBox.Visible == true)
                highlightedTextBox.Redo();
        }

        private void buildRunToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            fileManager.BuildProject(true);
        }

        private void gitHubToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Process.Start("https://github.com/Telltale-Modding-Group/Telltale-Script-Editor");
        }

        private void documentationToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Process.Start("https://github.com/Telltale-Modding-Group/Telltale-Script-Editor/wiki");
        }

        private void consoleOutput_TextChanged(object sender, EventArgs e)
        {

        }

        private void preferencesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Preferences prefsWindow = new Preferences();
            prefsWindow.ShowDialog();
        }

        private void openToolStripMenuItem_Click(object sender, EventArgs e)
        {

        }

        private void showProjectInfoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            string infoString = 
               $"Name: {fileManager.CurrentProject.mod.name}\n" +
               $"Author: {fileManager.CurrentProject.mod.author}\n" +
               $"Version: {fileManager.CurrentProject.mod.version}\n" +
               $"Priority: {fileManager.CurrentProject.mod.priority}";
            MessageBox.Show(infoString, "Project Info");

        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void projectFileTree_AfterSelect(object sender, TreeViewEventArgs e)
        {

        }

        private void folderToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (fileManager == null)
            {
                MessageBox.Show("You need to open or create a project first.", "You can't do that!");
                return;
            }

            string folderName = Prompt.ShowDialog("Folder Name", "Create New Folder");

            if (string.IsNullOrEmpty(folderName))
                return;

            string newFolder = WorkingDirectory + "/" + folderName;

            Directory.CreateDirectory(newFolder);
        }
    }
}
