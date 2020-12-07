using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telltale_Script_Editor.Util.JSON
{
    public class EditorPreferences
    {
        public string gameExe { get; set; }
        public EditorPrefsExperimental experimental { get; set; }
    }
}
