goog.provide("Hurricane.Events");
goog.require("Hurricane.Base");

var EventArgs = HBase.extend({
	_className: "EventArgs",
	// Fields
	data: null,
	// Constructor
	ctor: function(data) {
		this.data = data || {};
	}
	// Methods
	
});

var Dispatcher = {
	bind: function(hevent, obj, callback)
	{		
			hevent.listeners.push({obj: obj, callback: callback});
	},
	trigger: function(hevent, eventArgs) {
		
		var listeners = hevent.listeners, len = listeners.length;
		while (len--)
		{
			listeners[len].callback.call(listeners[len].obj, hevent.sender, eventArgs);
		}
		
	},
	unbind: function(hevent, callback) {
		
		var listeners = hevent.listeners, len = listeners.length;
		while (len--)
		{
			if (listeners[len].callback == callback) {
				listeners.splice(len, 1);
			}
		}
		
	}
};




var HEvent = HBase.extend({
	_className: "HEvent",
	// Fields
	name: "",
	sender: null,
	listeners: null,
	eventArgs: null,
	// Constructor
	ctor: function(sender, name) {
		this.listeners = new Array();
		this.sender = sender;
		this.name = name;
	},
	// Methods
	bind: function(obj, func) {
		Dispatcher.bind(this, obj, func);
	},
	trigger: function(eventArgs)
	{		
		Dispatcher.trigger(this, eventArgs);
	}
});
