using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor.Util.GUI
{
    public static class FileSystemTreeView
    {
        private static ProgressBar progressBar1;

        public static void LoadDirectory(string x, TreeView y, ProgressBar z)
        {
            Cursor.Current = Cursors.WaitCursor;
            DirectoryInfo di = new DirectoryInfo(x);
            progressBar1 = z;
            progressBar1.Value = 0;
            //Setting ProgressBar Maximum Value  
            progressBar1.Maximum = Directory.GetFiles(x, "*.*", SearchOption.AllDirectories).Length + Directory.GetDirectories(x, "**", SearchOption.AllDirectories).Length;
            TreeNode tds = y.Nodes.Add(di.Name);
            tds.Tag = di.FullName;
            tds.StateImageIndex = 0;
            LoadFiles(x, tds);
            LoadSubDirectories(x, tds);
        }

        private static void LoadSubDirectories(string x, TreeNode y)
        {
            
            string[] subdirectoryEntries = Directory.GetDirectories(x);
            // Loop through them to see if they have any other subdirectories  
            foreach (string subdirectory in subdirectoryEntries)
            {
                DirectoryInfo di = new DirectoryInfo(subdirectory);
                TreeNode tds = y.Nodes.Add(di.Name);
                tds.StateImageIndex = 0;

                tds.Tag = di.FullName;
                LoadFiles(subdirectory, tds);
                LoadSubDirectories(subdirectory, tds);
                UpdateProgress();
            }
        }

        private static void LoadFiles(string x, TreeNode y)
        {
            string[] Files = Directory.GetFiles(x, "*.*");

            // Loop through them to see files  
            foreach (string file in Files)
            {
                FileInfo fi = new FileInfo(file);
                TreeNode tds = y.Nodes.Add(fi.Name);
                tds.Tag = fi.FullName;
                if(fi.Name.EndsWith(".tseproj")) tds.ForeColor = Color.FromArgb(230, 20, 20);
                if (fi.Name.EndsWith(".lua")) tds.ForeColor = Color.FromArgb(20, 230, 20);
                tds.StateImageIndex = 1;
                UpdateProgress();
            }
        }

        private static void UpdateProgress()
        {
            double x = (((double)progressBar1.Value / (double)progressBar1.Maximum) * 100);
            double percent = Math.Round(x, 1);
            if (progressBar1.Value < progressBar1.Maximum)
            {
                progressBar1.Value++;
            }
            Application.DoEvents();
        }
    }
}
