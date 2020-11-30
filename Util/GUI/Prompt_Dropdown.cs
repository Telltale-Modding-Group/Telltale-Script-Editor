using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor.Util.GUI
{
    public static class Prompt_Dropdown
    {
        public static string ShowDialog(string text, string caption, List<string> comboboxItems)
        {
            Form prompt = new Form()
            {
                Width = 500,
                Height = 150,
                FormBorderStyle = FormBorderStyle.FixedDialog,
                Text = caption,
                StartPosition = FormStartPosition.CenterScreen
            };
            Label textLabel = new Label() { Left = 50, Top = 20, Text = text, AutoSize = true };

            //create a new combobox
            ComboBox comboBox = new ComboBox() { Left = 50, Top = 50, Width = 400, DropDownStyle = ComboBoxStyle.DropDown };

            //run a loop to add each of the combobox items string into the actual combobox element
            foreach (string item in comboboxItems)
            {
                comboBox.Items.Add(item);
            }

            Button confirmation = new Button() { Text = "Ok", Left = 350, Width = 100, Top = 70, DialogResult = DialogResult.OK };
            confirmation.Click += (sender, e) => { prompt.Close(); };
            prompt.Controls.Add(comboBox);
            prompt.Controls.Add(confirmation);
            prompt.Controls.Add(textLabel);
            prompt.AcceptButton = confirmation;

            //if the prompt is accepted, return the string of the selected item, otherwise return an empty string
            return prompt.ShowDialog() == DialogResult.OK ? comboBox.SelectedItem.ToString() : "";
        }
    }
}
