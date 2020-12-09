using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor
{
    public partial class Preferences : Form
    {
        public Preferences()
        {
            InitializeComponent();
        }

        private void exeBrowse_Click(object sender, EventArgs e)
        {
            OpenFileDialog exeFinder = new OpenFileDialog();
            exeFinder.Title = "Please specify your game executable (TWD:TTDS)";
            exeFinder.InitialDirectory = "C:\\";
            exeFinder.Filter = "WDC.exe (WDC.exe)|WDC.exe";
            exeFinder.RestoreDirectory = true;
            if (exeFinder.ShowDialog() == DialogResult.OK)
            {
                exeBox.Text = exeFinder.FileName;
            }
        }

        private void Preferences_Closing(object sender, EventArgs e)
        {
            Console.WriteLine("Saved preferences to file.");
        }
    }
}
