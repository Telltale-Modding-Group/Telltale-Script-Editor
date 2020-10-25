using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor.Util.GUI
{
    public static class LoadingBar
    {
        public static ProgressBar ShowDialog(string text, string caption)
        {
            Form loading = new Form()
            {
                Width = 500,
                Height = 150,
                FormBorderStyle = FormBorderStyle.FixedDialog,
                Text = caption,
                StartPosition = FormStartPosition.CenterScreen
            };
            Label textLabel = new Label() { Left = 50, Top = 20, Text = text, AutoSize = true };
            ProgressBar progressBar = new ProgressBar() { Left = 50, Top = 50, Width = 400 };
            loading.Controls.Add(progressBar);
            loading.Controls.Add(textLabel);

            loading.ShowDialog();

            return progressBar;
        }
    }
}
