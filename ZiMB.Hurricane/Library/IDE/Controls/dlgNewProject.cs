using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ZiMB.Hurricane.Library.IDE.Controls
{
    public partial class dlgNewProject : Form
    {
        public string Name;
        public dlgNewProject()
        {
            InitializeComponent();
        }

        private void btnSubmit_Click(object sender, EventArgs e)
        {
            this.Name = txtProjectName.Text;
            this.Hide();
        }
    }
}
