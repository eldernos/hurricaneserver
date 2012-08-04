goog.provide("Hurricane.Instructions");
goog.require("Hurricane.Base");

var InstructionManager = {
    count: 0,
    instructions: [],
    Update: function (elapsedTime) {
        var finished = [];
        InstructionManager.instructions.forEach(function (element, index) {
            element.Update(elapsedTime);
            if (element.finished) finished[finished.length] = index;
        });
        for (var i = 0; i < finished.length; i++) {
            delete InstructionManager.instructions[finished[i]];
        }

    },
    AddInstruction: function (instruction) {
        this.instructions.push(instruction);
	},
	MoveToAccurate: function(positionedObject, position, timeToTake)
	{
		var deltaVector3 = new $3.Vector3(0,0,0).sub(position, positionedObject.position);
		var inst = new Instruction(positionedObject, "position", "Move", deltaVector3, timeToTake);
		this.AddInstruction(inst);
	},
	MoveToSpeed: function(positionedObject, position, speed) {
		var deltaVector3 = new $3.Vector3(0,0,0).sub(position, positionedObject.position);
		var distance = deltaVector3.length();
		var timeToTake = distance / speed * 1000;
		var inst = new Instruction(positionedObject, "position", "Move", deltaVector3, timeToTake);
		this.AddInstruction(inst);
	}
}
/***
 * This function ONLY works with Vector3 Properties and methods that take Vector3 as parameters.
 */
var Instruction = HBase.extend({
	_className: "Instruction",
	// Fields
	target: null,
	duration: 0,
	property: null,
	delta: null,
	startValue: null,
	endValue: null,
	//startValue: null,
	method: null,
	finished: false,
	gradual: true,
	totalElapsed: 0,
	
	// Constructors
	ctor: function(target, property, method, delta, duration) {
		this.target = target;
		this.property = property;
		this.method = method;
		this.duration = duration;
		
		this.delta = delta;
		this.startValue = this.target[property].clone();
		this.endValue = this.startValue.clone().addSelf(delta);
		
	},
	// Methods
	Update: function(elapsed) {
		this.totalElapsed += elapsed;
        if (this.totalElapsed >= this.duration) {
            // Instruction is finished.  Set final value and mark as finished.
            var remaining = new $3.Vector3(0,0,0).sub(this.endValue, this.target[this.property]);
            this.target[this.method].call(this.target, remaining);            
            this.finished = true;
            return;
        }
        
        var percentComplete = this.totalElapsed / this.duration;
        var partialVector = this.startValue.clone();
     	partialVector.x = (this.endValue.x - this.startValue.x) * percentComplete;
     	partialVector.y = (this.endValue.y - this.startValue.y) * percentComplete;
     	partialVector.z = (this.endValue.z - this.startValue.z) * percentComplete;
     	
     	var alreadyAdded = new $3.Vector3(0, 0, 0).sub(this.target[this.property], this.startValue);
     	
     	var deltaValue = new $3.Vector3(0,0,0).sub(partialVector, alreadyAdded);
     		
      	this.target[this.method].call(this.target, deltaValue);
      	
	}
});
/*
var Instruction = HBase.extend({
	// Fields
	target: null,
	method: null,
	duration: 0, // <-- In milliseconds.
	originalValue: "",
	endValue: "",
	gradual: true,
	finished: false,
	totalElapsed: 0,
	
	
	// Constructors
	init: function(target, property, method, delta, duration) {
		this.target = target;
		this.originalValue = target[property];
		if (typeof delta == 'string')
		{
			this.endValue = delta;
		} 
		else if (typeof delta == 'number')
		{
			this.endValue = this.originalValue + delta;
		}
		else
		{
			for (prop in delta) {
				this.endValue = this.originalValue;
				this.endValue[prop] += delta[prop];
			}
		}
		this.method = method || null;
		this.duration = duration;
		
	},
	// Methods
	Update: function(elapsed) {
		this.totalElapsed += elapsedTime;
        if (this.totalElapsed >= this.duration) {
            // Instruction is finished.  Set final value and mark as finished.
            this.SetTargetValue(this.endValue);
            //this.target[this.property] = this.originalValue + this.deltaValue;
            this.finished = true;
            return;
        }
        
        var percentComplete = this.totalElapsed / this.duration;
       	
	},
	SetTargetValue: function(value) {
		if (typeof this.method == 'function')
		{
			this.target[this.method].call(this.target, value);
		}
		else
		{
			this.target[this.property] = value;
		}
	}
});
*/
/*
var Instruction = HBase.extend({
	// Fields
	target: {},
    duration: 0,
    originalValue: "",
    member: false,
    deltaValue: 0,
    gradual: true,
    finished: false,
    totalElapsed: 0,
	
	// Constructors
	init: function(positionedObject, member, deltaValue, duration) {
		// Delta Value is object or scalar...  object needs to enumerate properties and change them all ?
		this.member = member;
        this.deltaValue = deltaValue;
        this.duration = duration;
        this.originalValue = positionedObject[property];
        this.target = positionedObject;
	},
	
	// Methods
	Update: function(elapsed) {
		this.totalElapsed += elapsedTime;
        if (this.totalElapsed >= this.duration) {
            // Instruction is finished.  Set final value and mark as finished.
            this.target[this.property] = this.originalValue + this.deltaValue;
            this.finished = true;
            return;
        }
        
        var percentComplete = this.totalElapsed / this.duration;
        
        if (typeof this.deltaValue == 'number' || typeof this.deltaValue == 'string')
        {
        	// Parm  is straight value ... just multiply.
        	var completedChange = percentComplete * this.deltaValue;	
        }
        else
      	{
      		// Parm is object, go through members to multiply.
      		
      	}
        
        
        if (typeof this.)
        this.target[this.property] = this.originalValue + completedChange;

	},
	GetObjectChange: function(obj, percentComplete) {
		
	}
});
*/

$.Hurricane.InstructionManager = InstructionManager;