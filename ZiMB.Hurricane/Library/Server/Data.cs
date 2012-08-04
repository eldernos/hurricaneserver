using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Raven.Client.Document;
using Raven.Client.Embedded;
using ZiMB.Hurricane.Library.IDE;

namespace ZiMB.Hurricane.Library.Server
{
    public static class Data
    {
        #region Fields
        private static dynamic documentStore;
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
        public static void Start()
        {
            documentStore = new EmbeddableDocumentStore
            {
                DataDirectory = Hurricane.DataPath + "DataBase",
                UseEmbeddedHttpServer = true,
                
            };
            Raven.Database.Server.NonAdminHttp.EnsureCanListenToWhenInNonAdminContext(8080);
            documentStore.Initialize();
        }
        #endregion

    }
}
