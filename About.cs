using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor
{
    public partial class About : Form
    {
        public About()
        {
            InitializeComponent();

            versionLabel.Text =
                "Telltale Script Editor\n" +
                $"Version {System.Reflection.Assembly.GetExecutingAssembly().GetName().Version}\n\n" +
                "If you'd like, you can support me on Patreon! I'm the person in the modding group responsible for designing this tool, and I appreciate all the support I can get!\n\n" +
                "-Violet 🖤"
                ;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Process.Start("https://www.patreon.com/droyti");
        }
    }
}
