goog.provide("Hurricane.Communication");
goog.require("Hurricane.Base");

//  http://www.youtube.com/watch?v=uVqp1zcMfbE   Auto generate android wrapper for games of this nature.
var Communication = {
    server: null,
    init: function () {
        $.Hurricane.Include("js/Hurricane/lib/jQuery/jquery.signalR-0.5.2.min");
        $.ajax({
            url:  $H.Config.Communication.serverUrl + "/signalr/hubs",
            dataType: "script",
            async: false,
            success: function () {
                console.log('SignalR Hubs Loaded');
                
                //$.connection.url = "http://hurricane.zimbllc.com/signalr";
                $.connection.hubServer.ServerMessage = function (message) {
                    //console.dir(message);
                    switch (message.Payload.Method) {
                        case "Navigate":
                            $.Hurricane.Navigation.Route(message.Payload.NavigationInfo);
                            if ($H.Config.debug) {
                                console.info(message.Payload.NavigationInfo);
                            }
                            break;
                        case "Instruction":
                            $.Hurricane.ObjectManager.Instruction(message.Payload.Instruction);
                            if ($H.Config.debug) {
                                console.info(message.Payload.Instruction);
                            }
                            break;
                        case "Debug":
                            if ($H.Config.debug) {
                                console.info(message.Payload.DebugMessage);
                            }
                            break;
                        default:
                            if ($H.Config.debug) {
                                console.warn("Unknown Server Response", message.Payload);
                            }
                            break;
                    }
                };

                $.connection.hub.url = $H.Config.Communication.serverUrl + "/signalr";
                $.connection.hub.gameId = $.Hurricane.Config.gameId || null;
                $.connection.hub.start().done(function () {
                    $H.Communication.server = $.connection.hubServer;
                    $H.Communication.server.gameId = $.Hurricane.Config.gameId || null;
                    $H.Communication.server.receiveMessage(JSON.stringify({}));
                    //this.server.connect(JSON.stringify({ username: "username", password: "password" }));
                });
            }

        });
        /*
        this.server.navigate = function (data) {
            $.Hurricane.Navigation.Route(JSON.parse(data));
        };
        this.server.instruction = function (data) {
            
            console.info(JSON.parse(data));
            //var instruction = JSON.parse(data);
            //console.info(instruction);
            //$.Hurricane.ObjectManager.operations[instruction[0]](instruction);
            //console.log(data);
            //Hurricane.Instance.operations[instruction[0]](instruction);
        };
        */
        
    },
    send: function (message) {
        $.Hurricane.Communication.server.input(JSON.stringify(message));
    }
};

$.Hurricane.Communication = Communication;
