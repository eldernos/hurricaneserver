goog.provide("Hurricane.Objects");
goog.require("Hurricane.Base");
/*
 * STATIC CLASS.
 * 
 */
var ObjectManager = {
    objects: null,
	Init: function(world)
	{
		//this.Index = new QuadTree(world.size);
	    $(this).trigger('Initialized');
	    this.objects = new Dictionary(PositionedObject, 'id');
	},
	Update: function(lapsed) {
		
	},
	Instruction: function (instruction) {
	    
	    var input = JSON.parse(instruction);
	    switch (input[0]) {
	        case 0: // Add
	            var data = input[1].Primary;
	            console.log("ADD");
	            console.dir(data);
	            var po = new PositionedObject(data.Id, new $3.Vector3(data.Pos.X, data.Pos.Y, data.Pos.Z), new $3.Vector3(1, 1, 1), new $3.Vector3(), new $3.Vector3(), data.AssetId, 0);
	            po.layer = data.Pos.Z;
	            this.objects.Add(po);
	            $H.Graphics.Register(po);
	            break;
	        case 1: // Remove
	            break;
	        case 2: // Position
	            break;
	        case 3:  // Property
	            break;
	        case 4: // AttachTo
	            break;
	        case 5: // Batch Add
	            var that = this;
	            var data = input[1].BATCH;
	            console.log("BATCH ADD");
	            console.dir(data);
	            data.forEach(function (item, index, array) {
	                var po = new PositionedObject(item.Id, new $3.Vector3(item.Position.X, item.Position.Y, item.Position.Z), new $3.Vector3(1, 1, 1), new $3.Vector3(), new $3.Vector3(), item.AssetId, 0);
	                that.objects.Add(po);
	                $H.Graphics.Register(po);
	            });
	            break;
	        case 6: // Batch Remove
	            break;
	    }
	},
	Register: function (po) {

	}
};
$.Hurricane.ObjectManager = ObjectManager;



var PositionedObject = HBase.extend({
	_className: "PositionedObject",
	// Fields
	id: null,
	position: null,  	// Vector 3
	rotation: null,
	size: null,		 	// Vector 3
	velocity: null,  	// Vector 3
	acceleration: null,	// Vector 3
	assetId: 0,  		// Int.  
	representation: null,
	layer: 0,
	
	attachedObject: null,
	attachedAxes: null,
	
	attributes: null,
	
	
	// Events
	moved: null,
	onMoved: function(previousPosition) {
		this.moved.trigger(new EventArgs({previousPosition: previousPosition}));	
	},
		
	// Constructor
    ctor: function (id, position, size, velocity, acceleration, assetId, layer) {
    	this.moved = new HEvent(this, 'Moved');
    	this.id = id || $H.Utility.newGuid();
    	this.position = position || new $3.Vector3(0, 0, 0);
    	this.size = size || new $3.Vector3(1, 1, 0);
    	this.velocity = velocity || new $3.Vector3(0, 0, 0);
    	this.acceleration = acceleration || new $3.Vector3(0, 0, 0);
    	this.assetId = assetId || 0;
    	this.layer = layer || 0;
    	this.rotation = new $3.Vector3(0, 0, 0);
    	if (this.assetId != 0)
    	{
    		this.representation = $H.Graphics.AssetManager.GetSprite(this.assetId);
    	}
    	
    	this.attributes = new Array();
    	
    },
    
    // Methods
    Move: function(vector) {
    	var prev = this.position.clone();
		this.position.addSelf(vector);
		this.onMoved(prev);
		
    },
    MoveTo: function(vector) {
        var prev = this.position.clone();
        this.position = vector;
        this.onMoved(prev);
    },
	Rotate: function(rotation) {
		this.prev = this.rotation.clone();
		this.rotation.addSelf(rotation);
		this.onMoved(prev);
	},
    AttachTo: function(positionedObject, axes)
    {
    	this.attachedObject = positionedObject;
    	this.attachedAxes = axes;
    	
    	var relativeVector = new $3.Vector3(0, 0, 0);    
    	if ('x' in this.attachedAxes) relativeVector.x = positionedObject.position.x - this.position.x;
    	if ('y' in this.attachedAxes) relativeVector.y = positionedObject.position.y - this.position.y;
    	if ('z' in this.attachedAxes) relativeVector.z = positionedObject.position.z - this.position.z;
    	
    	this.Move(relativeVector);
    	positionedObject.moved.bind(this, this.TargetMoved);	    	
    },
    TargetMoved: function(sender, eventArgs)
    {
    	var relativeVector = new $3.Vector3(0, 0, 0);
    	
    	if ('x' in this.attachedAxes) relativeVector.x = sender.position.x - this.position.x;
    	if ('y' in this.attachedAxes) relativeVector.y = sender.position.y - this.position.y;
    	if ('z' in this.attachedAxes) relativeVector.z = sender.position.z - this.position.z;
    	
    	this.Move(relativeVector);
    }
});


var World = PositionedObject.extend({
	// Fields
	_className: "World",
	
	// Constructor
	ctor: function(size)
	{
		size = size || new $3.Vector3(100, 100);
		//this._$.ctor(false, false, size);
		this._super(false, false, size);
	}
	// Methods
});
