// https://github.com/pixelmatrix/mapkey/blob/master/jquery.mapkey.js
goog.provide("Hurricane.Input");
goog.require("Hurricane.Base");
goog.require("Hurricane.Debug");

var InputManager = {
	// Fields
	selectedObject : null,

	// Methods
	Register : function() {
		this.SetSelectedObject($H.Config.Input.DefaultSelection);
		var c = $($H.Graphics.viewport.First().displayCanvas.domCanvas);
		c.noContext();
		c.bind("contextmenu", function(e) {
			e.preventDefault();
		});
		$(document).keydown(this.Keyboard.KeyDown);
		$(document).keypress(this.Keyboard.KeyPress);
		$(document).keyup(this.Keyboard.KeyUp);

		c.click(this.Mouse.Click);
		c.dblclick(this.Mouse.DoubleClick);
		c.mousedown(this.Mouse.MouseDown);
		// Capture right click
		c.rightClick(this.Mouse.RightClick);
		// Capture right mouse down
		c.rightMouseDown(this.Mouse.RightDown);
		// Capture right mouseup
		c.rightMouseUp(this.Mouse.RightUp);
		// Disable context menu on an element
		c.noContext();

		c.mouseenter(this.Mouse.MouseEnter);
		c.mouseleave(this.Mouse.MouseLeave);
		c.mousemove(this.Mouse.MouseMove);
		c.mouseout(this.Mouse.MouseOut);
		c.mouseover(this.Mouse.MouseOver);
		c.mouseup(this.Mouse.MouseUp);

	},
	SetSelectedObject : function(selection) {
		if(selection == "DisplayCamera") {
			this.selectedObject = $H.Graphics.viewport.First().displayCamera;
		} else {
			this.selectedObject = selection;
			$H.Graphics.viewport.First().displayCamera.AttachTo(this.selectedObject, {x: 0, y:0});
		}
		//$HD.Console.Status("Input", "Selection", this.selectedObject.attributes["name"] || this.selectedObject.id);

	},
	Keyboard : {
		KeyDown : function(event) {
			$HD.WriteDebugMessage("Key Down", $.Hurricane.Debug.Levels.INFO, event);

		},
		KeyPress : function(event) {
			$HD.WriteDebugMessage("Key Press", $.Hurricane.Debug.Levels.INFO, event);
		},
		KeyUp : function(event) {
			$HD.WriteDebugMessage("Key Up", $.Hurricane.Debug.Levels.INFO, event);
		}
	},
	Mouse : {
		Click : function(event) {
			$HD.WriteDebugMessage("Mouse Click", $.Hurricane.Debug.Levels.INFO, event);
			var pos = $H.Graphics.viewport.First().GetWorldPosition(event.pageX, event.pageY);
			switch (event.which) {
				case 1:
					// Left Click -> Set Selected Item
				
				    var item = $H.Graphics.viewport.First().GetItem(pos);
				    if (item instanceof PositionedObject) {
				        $H.InputManager.SetSelectedObject(item);
				    }
					break;
				case 2:
					// Middle Click -> Do Nothing
					break;
				case 3:
					// Right Click -> Move Selected Item

					break;
				default:
					alert('You have a strange mouse');
			}
			event.preventDefault();
		},
		RightClick : function(event) {
			var pos = $H.Graphics.viewport.First().GetWorldPosition(event.pageX, event.pageY);
			
			if($H.InputManager.selectedObject instanceof PositionedObject) {
				vec = new $3.Vector3(pos.x - $H.InputManager.selectedObject.position.x, pos.y - $H.InputManager.selectedObject.position.y);
				$H.InstructionManager.MoveToSpeed($H.InputManager.selectedObject, new $3.Vector3(pos.x, pos.y), $H.InputManager.selectedObject.attributes["speed"] || 1);
			}
		},
		DoubleClick : function(event) {
			$HD.WriteDebugMessage("Mouse Double Click", $.Hurricane.Debug.Levels.INFO, event);
		},
		MouseDown : function(event) {
			$HD.WriteDebugMessage("Mouse Down", $.Hurricane.Debug.Levels.INFO, event);
		},
		RightDown : function(event) {

		},
		MouseEnter : function(event) {
			$HD.WriteDebugMessage("Mouse Enter", $.Hurricane.Debug.Levels.INFO, event);
		},
		MouseLeave : function(event) {
			$HD.WriteDebugMessage("Mouse Leave", $.Hurricane.Debug.Levels.INFO, event);
		},
		MouseMove : function(event) {
			$HD.WriteDebugMessage("Mouse Move", $.Hurricane.Debug.Levels.INFO, event);
			var worldPosition = $H.Graphics.viewport.First().GetWorldPosition(event.pageX, event.pageY);
			//console.dir(worldPosition);
		},
		MouseOut : function(event) {
			$HD.WriteDebugMessage("Mouse Out", $.Hurricane.Debug.Levels.INFO, event);
		},
		MouseOver : function(event) {
			$HD.WriteDebugMessage("Mouse Over", $.Hurricane.Debug.Levels.INFO, event);
		},
		MouseUp : function(event) {
			$HD.WriteDebugMessage("Mouse Up", $.Hurricane.Debug.Levels.INFO, event);
		},
		RightUp : function(event) {

		}
	}

};
var KeyboardMapping = HBase.extend({
	// Fields
	keycode : 0,

	// Constructors
	init : function() {

	}
	// Methods
});
var MouseMapping = HBase.extend({
	// Fields
	button : 0,
	// Constructors
	init : function() {

	}
	// Methods
});
var CombinedMapping = HBase.extend({
	// Fields
	mappings : null,
	// Constructor
	init : function(mappings) {
		this.mappings = new Array();
	}
	// Methods

});

$.Hurricane.InputManager = InputManager;
