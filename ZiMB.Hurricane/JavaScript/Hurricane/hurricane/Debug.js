goog.provide("Hurricane.Debug");
goog.require("Hurricane.Base");
goog.require("goog.debug.DebugWindow");
goog.require("goog.debug.DivConsole");
goog.require("goog.debug.FancyWindow");
var Debug = {
    Levels: {
        INFO: 0,
        LOG: 1,
        WARN: 2,
        ERROR: 3
    },
    Logger: goog.debug.Logger.getLogger("Hurricane"),
    InitWindow: function()
    {
        if (!this.Window)
        {
            this.Window = new goog.debug.DebugWindow("debug", "Hurricane: ")
            this.Window.enabled_ = true;
            $HD.Logger.addHandler(function (record) {
                //$HD.Window.addLogRecord(record);
            });
            this.Window.init();
        }
    },
    InitFancyWindow: function() {
        if (!this.Window)
        {
            this.Window = new goog.debug.FancyWindow("debug", "Hurricane: ");
            this.Window.setEnabled(true);
            this.Window.init();

        }
    },
    InitConsole: function() {
        if (!this.Console) {
            var div = document.createElement("div");
            $('body').append(div);
            this.Console = new goog.debug.DivConsole(div);
            this.Console.setCapturing(true);
            $HD.Logger.addHandler(function (record) {
                $HD.Console.addLogRecord(record);
            });
        }
    },
    InitStatus: function() {
        if (!this.Status) {
            
        }
    },
    WriteDebugMessage: function (msg, severity, ex) {
        //if (!this.Window) this.InitFancyWindow();
        var ex = ex || null;
        var sev = goog.debug.Logger.Level.INFO;
        switch (severity) {
            case 1:
                sev = goog.debug.Logger.Level.LOG;
                break;
            case 2:
                sev = goog.debug.Logger.Level.WARN;
                break;
            case 3:
                sev = goog.debug.Logger.Level.ERROR;
                break;
            

        }
        if (ex != null) {
            this.Logger.log(sev, msg, ex);
        }
        else {
            this.Logger.log(sev, msg);
        }
    },
    Level: 0,
    Console:null,
    Status: null,
    Window: null
    /*
    InitStatus: function(selector)
    {
    	this.Status = $(selector);
    },
    
    */
};


function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
}


$.Hurricane.Debug = Debug;
var $HD = $.Hurricane.Debug;
