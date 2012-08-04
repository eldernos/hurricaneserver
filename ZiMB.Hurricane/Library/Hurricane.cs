using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZiMB.Hurricane.Library
{
    public static class Hurricane
    {
        #region Fields
        #endregion
        #region Properties
        public static string ProjectPath
        {
            get
            {
                return Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + Path.DirectorySeparatorChar + "Hurricane" + Path.DirectorySeparatorChar + "Projects" + Path.DirectorySeparatorChar;
            }
        }
        public static string DataPath
        {
            get
            {
                return Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + Path.DirectorySeparatorChar + "Hurricane" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar;
            }
        }
        #endregion
        #region Events
        #endregion
        #region Constructors
        #endregion
        #region Factories
        #endregion
        #region Methods
        #endregion

    }
}
