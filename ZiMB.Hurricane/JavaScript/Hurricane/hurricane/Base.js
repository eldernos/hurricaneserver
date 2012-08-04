/*
* Hurricane Game Engine Version 0.0.1
* HurricaneBase.js
*
* This is the main base class of Hurricane.   Eventually it will be possible to include necessary items within this but for now include manually.
*
* Naming Convention:
* 	Class Names -  upperCased Camel Case
*  Class Fields - lowerCased Camel Case
*  Class Methods - upperCased Camel Case
*
*  All Names - No hyphens, underscores or any other odd characters.   Just letters and numbers if necessary.
*
*  Always call superclass constructors at END of current class constructor.
*/

//  Core Functionality, Class Inheritance
// http://www.ruzee.com/blog/2008/12/javascript-inheritance-via-prototypes-and-closures  Awesome.
// http://aymanh.com/9-javascript-tips-you-may-not-know

goog.provide('Hurricane.Base');
goog.require('THREE');
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  HBase = function(){};
  
  // Create a new Class that inherits from this class
  HBase.extend = function(proto) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in proto) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof proto[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(proto[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, proto[name]) :
        proto[name];
    }
    
    // The dummy class constructor
    eval("var " + (proto._className || "HBaseClass") + " = function() { if (!initializing && this.ctor) this.ctor.apply(this, arguments); } " );
    eval("var Class = " + (proto._className || "HBaseClass"));
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();
// This is the main static object for hurricane engine.   It does all other work.
var HurricaneStatic = {
	// Fields
	lastUpdate : $.now(),

	// Constructor
	Init : function(args) {
		for(var arg in args) {
			if(this.hasOwnProperty(arg)) {
				this[arg] = args[arg];
			} else {
				if( typeof (arg) == "function") {
					args[arg](this);
				}
			}
		}

	},
	// Methods
	Include : function(filePath) {
		$.ajax({
			url : filePath + ".js",
			dataType : "script",
			async : false,
			success : function() {
				//$.Hurricane.Debug("Included File: " + filePath);
			},
			error : function() {
				//$.Hurricane.Debug("ERROR:  Include file: " + filePath + " failed.");
			}
		});
	},
	Start: function () {
	    if (!this.Config.local) {
	        $.Hurricane.Communication.init();
	    }
	    if (typeof ($.Hurricane.Config.load) == 'function') {
	        $.Hurricane.Config.load();

        }
	    $.Hurricane.ObjectManager.Init();
	    //$.Hurricane.InputManager.Register();
		/*
		var viewConfig = $.Hurricane.Config.viewport || {
			element : '#canvas',
			width : 1000,
			height : 1000,
			world : new World(new $3.Vector2(100, 100))
		};
		$.Hurricane.ObjectManager.Init(viewConfig.world);
		this.Graphics.Init($(viewConfig.element), new $3.Vector3(0, 0), new $3.Vector3(viewConfig.width, viewConfig.height), viewConfig.world);
		if(!this.Config.local) {
			$.Hurricane.Communication.init();
		}
		if( typeof ($.Hurricane.Config.load) == 'function') {
			$.Hurricane.Config.load();
			
		}
		setInterval(function () { $.Hurricane.Update();}, 20);
		$.Hurricane.InputManager.Register();
		*/
	},
	Stop : function() {
	},
	Update : function() {
		var elapsed = $.now() - this.lastUpdate;
		this.lastUpdate = $.now();
		$.Hurricane.InstructionManager.Update(elapsed);
		$.Hurricane.ObjectManager.Update(elapsed);
	}
}
// This is the function extension namespace for query results.

function HurricaneFn() {
	return {
		$ : this,
		MoveToAccurate : function(position, timetotake) {

		}
	}
}

// Extend JQuery On Load
jQuery.fn.extend({
	Hurricane : HurricaneFn
});
jQuery.extend({
	Hurricane : HurricaneStatic
});
var $3 = THREE;
var $H = $.Hurricane;



