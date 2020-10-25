using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telltale_Script_Editor.Util.FileManagement
{
    public static class SOExtension
    {
        public static IEnumerable<TreeNode> FlattenTree(this TreeView tv)
        {
            return FlattenTree(tv.Nodes);
        }

        public static IEnumerable<TreeNode> FlattenTree(this TreeNodeCollection coll)
        {
            return coll.Cast<TreeNode>()
                        .Concat(coll.Cast<TreeNode>()
                                    .SelectMany(x => FlattenTree(x.Nodes)));
        }
    }
}
