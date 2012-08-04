using System;
namespace ZiMB.Hurricane.Library.IDE
{
    public static class Builder
    {

        #region Fields
        #endregion
        #region Properties
        #endregion
        #region Events
        #endregion
        #region Constructors
        #endregion
        #region Factories
        #endregion
        #region Methods
        public static void BuildJavaScriptLibrary(Project project)
        {

        }
        public static void Publish(Project project)
        {
            // Deploy html project to IIS.  I guess eventually, other server environments. 
        }
        public static void Run(Project project)
        {
            // This loads a 'compiled' project into memory and opens its comm ports accepting signalr data connections.
        }
        public static object ExecutePython(string script)
        {
            return null;
        }
        public static object ExecuteJava(string jar)
        {
            return null;
        }
        #endregion

    }
}
