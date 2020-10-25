using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor.Util.GUI
{
    class ConsoleOutput : TextWriter
    {
        private TextBox textBox;
        public ConsoleOutput(TextBox x)
        {
            this.textBox = x;
        }


        public override void Write(char value)
        {
            textBox.AppendText(value.ToString());
        }

        public override void Write(string value)
        {
            textBox.AppendText(value);
        }

        public override Encoding Encoding
        {
            get { return Encoding.UTF8; }
        }
    }
}
