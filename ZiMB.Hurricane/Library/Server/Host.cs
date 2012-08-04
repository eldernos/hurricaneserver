using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SignalR;

namespace ZiMB.Hurricane.Library.Server
{
    public static class Host
    {
        #region Fields
        private static dynamic server;
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
        public static void Start() {
            string url = "http://localhost:10701/";
            //var server = new Server(url);
            server = new SignalR.Hosting.Self.Server(url);
            server.MapConnection<PersistentConnection>("/Hurricane");
            server.Start();

        }

        #endregion


    }
    public class Connection : PersistentConnection
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
        protected override Task OnConnectedAsync(IRequest request, string connectionId)
        {
            
            return base.OnConnectedAsync(request, connectionId);
        }
        protected override Task OnReceivedAsync(IRequest request, string connectionId, string data)
        {
            return base.OnReceivedAsync(request, connectionId, data);
        }
        protected override Task OnDisconnectAsync(string connectionId)
        {
            return base.OnDisconnectAsync(connectionId);
        }
        #endregion
    }
}
