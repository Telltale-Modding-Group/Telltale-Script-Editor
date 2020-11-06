using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telltale_Script_Editor.Util.JSON
{
    class ModInfo
    {
        public string ModDisplayName { get; set; }
        public string ModVersion { get; set; }
        public string ModAuthor { get; set; }
        public string ModCompatibility { get; set; }
        public List<string> ModFiles { get; set; }
    }
}
