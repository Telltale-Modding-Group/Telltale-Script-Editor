using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telltale_Script_Editor.Util.JSON
{
    public class EditorProject
    {
        public string formatVersion { get; set; }
        public ToolJSON tool { get; set; }
        public ModJSON mod { get; set; }
    }
}
