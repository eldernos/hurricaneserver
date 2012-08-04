using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.Integration;
using MDXInfo.Util.Script;
using WeifenLuo.WinFormsUI.Docking;
using ZiMB.Hurricane.Library.IDE;
using ZiMB.Hurricane.Library.IDE.Controls;
using ZiMB.Hurricane.Library.Server;

namespace ZiMB.Hurricane
{
    public partial class frmMain : Form
    {
        private Project currentProject;

        public frmMain()
        {
            InitializeComponent();
            Host.Start();
            Data.Start();
            dockMain.Parent = this;
        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        private void managementStudioToolStripMenuItem_Click(object sender, EventArgs e)
        {
            WebBrowser wb = new WebBrowser();
            wb.Navigate("http://localhost:10702");
        }

        private void runProjectClientToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Builder.BuildJavaScriptLibrary(currentProject);
            Builder.Publish(currentProject);
            WebBrowser wb = new WebBrowser();
            
        }

        private void newProjectToolStripMenuItem_Click(object sender, EventArgs e)
        {
            dlgNewProject np = new dlgNewProject();
            DialogResult dr = np.ShowDialog();
            Project p = Project.CreateNew(np.Name);
            this.currentProject = p;

        }

        private void exploreToolStripMenuItem_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start(currentProject.Path);
        }

        private void openToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.InitialDirectory = Hurricane.Library.Hurricane.ProjectPath;
            dlg.DefaultExt = ".hpj";
            DialogResult dr = dlg.ShowDialog();

            if (dr == System.Windows.Forms.DialogResult.OK)
            {

            }
        }

        private void newDocumentToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DockContent dc = new DockContent();
            dc.Text = "Testing";
            ScriptEditorControl sec = new ScriptEditorControl();
            sec.Dock = DockStyle.Fill;
            dc.Controls.Add(sec);
            if (dockMain.DocumentStyle == DocumentStyle.SystemMdi)
            {
                dc.MdiParent = this;
                dc.Show();
            }
            else
                dc.Show(dockMain);
        }
    }
}
