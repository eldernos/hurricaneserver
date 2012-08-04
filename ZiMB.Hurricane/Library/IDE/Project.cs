using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace ZiMB.Hurricane.Library.IDE
{
    public class Project
    {
        #region Fields
        protected string path;
        protected string name;
        protected XDocument xml;
        #endregion
        #region Properties
        public string Path {
            get {return path;}   
        }
        public string Name
        {
            get { return name; }
        }
        #endregion
        #region Events
        #endregion
        #region Constructors
        protected Project(string name)
        {

        }
        #endregion
        #region Factories
        public static Project CreateNew(string name)
        {
            Project p = new Project(name);
            DirectoryInfo di = Directory.CreateDirectory(Hurricane.ProjectPath  + System.IO.Path.DirectorySeparatorChar + name);
            di.CreateSubdirectory("JavaScript");
            di.CreateSubdirectory("Templates");
            di.CreateSubdirectory("Library");
            di.CreateSubdirectory("Assets");
            p.xml = new XDocument();
            p.xml.Add(new XDeclaration("1.0", String.Empty, String.Empty));
            p.xml.Add(new XElement("HurricaneProject"), 
                new XElement("Directories", 
                        new XElement("Directory", new XAttribute("name", "JavaScript")),
                        new XElement("Directory", new XAttribute("name", "Templates")),
                        new XElement("Directory", new XAttribute("name", "Library")),
                        new XElement("Directory", new XAttribute("name", "Assets"))
                    )
                );
            p.path = di.FullName;
            p.name = name;
            p.Save();
            return p;
        }
        #endregion
        #region Methods
        public void Save()
        {
            xml.Save(path + System.IO.Path.DirectorySeparatorChar + name + ".hpj");
        }
        #endregion


    }
}
