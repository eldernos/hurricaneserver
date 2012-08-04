goog.provide("Hurricane.Navigation");
goog.require("Hurricane.Base");
goog.require('Hurricane.Templates');
goog.require('goog.ui.Container');
goog.require('goog.style');

var Navigation = {
    currentScreen: {},
    
	route : function(screen) {
		if(this.currentScreen instanceof Screen) {
			this.currentScreen.stop();
			this.currentScreen.cleanup();
        }
		this.currentScreen = screen;
		this.currentScreen.load();
		this.currentScreen.start();
	},
    
	Route: function (data) {
	    var screen = {};
	    //console.dir(data);
	    switch (data.Type) {
            /*
            case "JSONT": // JsonT
                
                $.ajax({
                    url: data.Target,
                    dataType: 'text',
                    success: function (result) {

                        eval("var json = " + result);
                        screen = new Html(json);
                        Navigation.route(screen);
                    }
                });
                break;
            */
	        case "HB":

	            break;
	        case "SOY": // Google Closure Template
	            $.ajax({
	                url: data.Target,
	                dataType: 'script',
	                success: function (result) {
	                    new Soy(eval(data.Target), {}).Render(goog.dom.getElement('playArea'));
	                    var screen = new Screen(null);
	                    screen.cleanup = function () {
	                        $('#templatediv').remove();
	                    };
	                    Navigation.route(screen);
	                }
	            });
	            break;
	        case "JSVIEW": // JQuery Template

	            break;
            case "WorldView": // Main Gameplay
                screen = new WorldView({
                    assets: [1000000, 1000001, 1000002, 1000003, 1000004, 1000005, 1000006, 1000007, 1000008, 1000009, 1000010, 1000011, 1000012, 1000013, 1000014, 1000015],
                    layers: 2,
                    camera: {
                        rotation: 0

                    }
                });
                Navigation.route(screen);
                break;
            default:
                break;
        }
        
    },
	showDialog : function(dialog) {

	}
};
$.Hurricane.Navigation = Navigation;

var Screen = HBase.extend({
	_className: "Screen",
	screenData : null,
	ctor : function(screenData) {
		this.screenData = screenData;
	},
	load : function() {

	},
	start : function() {

	},
	cleanup : function() {

	},
	stop : function() {

	},
	update : function() {

	},
	input: function (method, msg) {
	    $H.Communication.send({ screenMethod: method, message: msg });
	}
});

var Html = Screen.extend({
    _className: "Html",
    container: null,
	ctor : function(screenData) {
	    var jsont = new JsonT(screenData);
	    jsont.PreRender();
	    this.container = jsont.Render(goog.dom.getElement('playArea'));
	    console.dir(this.container);
	    this._super(screenData);
	},
	load: function () {

	},
	start: function () {

	},
	cleanup: function () {
	    this.container.dispose();
	},
	stop: function () {

	},
	update: function () {

	}
});
var WorldView = Screen.extend({
	_className: "WorldView",
	timer : {},
	ctor : function(screenData) {
		this._super(screenData);

	},
	load : function() {
		//timer = setInterval(this.update, 50);
		// 1 - Load All Assets
		var that = this;
		$($.Hurricane.Graphics.AssetManager).bind('Ready', function() {
			// 2 - Initialize starting scene po's.
			/*
			that.screenData.objects().forEach(function(po, index, array) {
				$.Hurricane.Graphics.Register(po);
			});
            */
			setInterval(function() {
				$.Hurricane.Graphics.Draw();
			}, 33);
				
			// 3 - Clear and Render Scene to Graphics
		});
		$.Hurricane.Graphics.AssetManager.PreLoad(this.screenData.assets);
		$H.Graphics.Init($('#playArea'), new $3.Vector3(0, 0), new $3.Vector3(1000, 1000), new World());
		$H.InputManager.Register();
		$H.Graphics.viewport.First().displayCamera.MoveTo(new $3.Vector3(20, 20, 2000));
	},
	start : function() {

	},
	update : function(time) {

	}
});
var Dialog = Screen.extend({
	_screenName: "Dialog",
	show : function() {

	},
	hide : function() {

	}
});
