goog.provide("Hurricane.Data");
goog.require("Hurricane.Base");



var Data = {
	// Eventually Use Local DB Storage for Persisting Cache data.  
	Init: function() {
		
	}
}

var Collection = HBase.extend({
	_className: "Collection",
	// Fields
	innerList: null,
	type: Object,
	
	// Constructor
	ctor: function(genericType, data) {
		this.type = genericType || Object;
		this.innerList = new Array();
		//this._super();
	},
	// Methods
	Add: function(item) {
		if (item instanceof this.type)
		{
			this.innerList.push(item);
		}
	},
	Remove: function(item) {
		if (item instanceof this.type)
		{
			var index = this.innerList.indexOf(item);
			if (index >= 0)
			{
				return this.innerList.splice(index, 1);
			}
		}
	},
	RemoveAt: function(index) {
		if (index in this.innerList)
		{
			return this.innerList.splice(index, 1);
		}	
	},
	ItemAt: function(index) {
		if (item instanceof this.type)
		{
			return this.innerList[index] || null;
		}
	},
	Count: function() {
		return this. innerList.length || -1;
	},
	
	// Extension Style Methods
	First: function() {
		if (this.Count() > 0) return this.ItemAt(0);
		throw "No Elements Available";
	},
	FirstOrDefault: function() {
		return this.ItemAt(0);
	},
	forEach: function(delegate) {
		return this.innerList.forEach(delegate);	
	}
});

var Dictionary = Collection.extend({
	_className: "Dictionary",
	// Fields
	index: null,
	keyField: null,
	
	// Constructor
	ctor: function(genericType, keyField, data)
	{
		if (!(keyField in genericType.prototype))
		{
			throw "Dictionary KeyField not present in Generic Type argument";
		}
		this.keyField = keyField;
		this.index = new Array();
		
		this._super(genericType, data);
	},
	// Methods
	Add: function(item) {
		if (item instanceof this.type)
		{
			this.innerList.push(item);
			this.index[item[this.keyField]] = this.innerList.indexOf(item);
		}
	},
	Remove: function(item) {
		if (item instanceof this.type)
		{
			var index = this.index[item[this.keyField]];
			delete this.index[item[this.keyField]];
			for (i in this.index)
			{
				if (this.index[i] > index)
				{
					this.index[i]--;
				}
			}
			return this.innerList.splice(index, 1);
			
		}
	},
	RemoveAt: function(key)
	{
		if (key in this.index)
		{
			var index = this.index[key];
			delete this.index[key];
			for (i in this.index)
			{
				if (this.index[i] > index)
				{
					this.index[i]--;
				}
			}
			return this.innerList.splice(index, 1);
			
		}
	},
	Item: function(key) {
		if (key in this.index)
		{
			return this.innerList[this.index[key]];
		}
		return null;
	},
	ItemAt: function(index) {
		return this.innerList[index] || null;
	}
});

$.Hurricane.Data = Data;
var $Data = $.Hurricane.Data;
