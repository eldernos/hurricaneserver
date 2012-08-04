goog.provide("Hurricane.Graphics");
goog.require("Hurricane.Base");

/*
 * Graphics - STATIC CLASS.
 *
 * Manages display state for canvas objects.  Other Screen Types will be handled in other sections of the library.
 *
 *
 */

var Graphics = {
	// Fields
	viewport : null,

	// Methods
	Init: function (domElement, position, size, world) {
	    console.dir(arguments);
	    try {
	        this.scale = $H.Config.Graphics.PixelScale || this.scale;
	        this.viewport = new Dictionary(Viewport, 'id');
	        var mainVp = new Viewport(domElement, position, size, world);
		
	        this.viewport.Add(mainVp);
        }
	    catch (Exception) {
	        console.dir(Exception);
	    }
	},
	Draw : function() {
		this.viewport.forEach(function(vp, index, array) {
			vp.Draw();
		});
	},
	Register : function(positionedObject) {
		this.viewport.First().displayCamera.Register(positionedObject);
	},
	REDRAW: function() {
		this.viewport.First().displayCamera.layers.forEach(function(el, index, ar) {
			el.Invalidate();
		});
		this.viewport.First().displayCamera.Invalidate();
		this.viewport.First().Draw();
	},
	scale : 64
}

$.Hurricane.Graphics = Graphics

var CanvasObject = PositionedObject.extend({
	_className: CanvasObject,
	// Fields
	valid : false,
	children : null,
	// Constructor
	ctor : function(position, size) {

		this._super(false, position, size);
	},
	// Methods
	Move : function(vector) {
		this._super(vector);
		this.Invalidate();
	},
	Invalidate : function() {
		this.valid = false;
	},
	Draw : function() {
		this.valid = true;
	},
	Find : function(predicate) {
		var results = new Array();
		if(this.children.forEach) {
			this.children.forEach(function(item) {
				// This doesn't work yet.   Need to iterate item.children to find if THEY have Find and Children and then loop again.   Uck.  Recursion!
				/*
				 if (item.children && && item.Find)
				 {
				 results.push(item.children.Find(predicate));
				 }
				 if(predicate(item))
				 results.push(item);
				 */
			});
		}
		return results;
	}
});
var Viewport = CanvasObject.extend({
	_className: "Viewport",
	// Fields
	displayCamera : null,
	displayCanvas : null,
	cameras : null,
	// Constructor
	ctor : function(domElement, position, size, world) {
		this.cameras = new Dictionary(Camera, 'id');
		this.children = this.cameras;

		this.displayCamera = new Camera(new $3.Vector3(0, 0, 2000), new $3.Vector3(1000, 1000), this, 2, world);
		this.cameras.Add(this.displayCamera);

		this.displayCanvas = new Canvas(domElement, new $3.Vector3(0, 0), new $3.Vector3(1000, 1000));

		this._super(position, size);
	},
	// Methods
	Draw : function() {
		this.displayCamera.Draw();
		this.displayCanvas.Clear();
		this.displayCanvas.DrawImage({
			image : this.displayCamera.renderer.domElement,
			position : new $3.Vector3(0, 0),
			size: new $3.Vector3(1000, 1000),
			srcSize: new $3.Vector3(1000, 1000)

		});
		this._super();
	},
	GetWorldPosition : function(x, y) {
		var result = {
			x : 0,
			y : 0
		}
		var offset = $(this.displayCanvas.domCanvas).offset(); 
		x -= offset.left;
		y -= offset.top;
		var projector = new $3.Projector();
		var vector = new $3.Vector3((x / this.size.x ) * 2 - 1, -(y / this.size.y ) * 2 + 1, 0.5);
		projector.unprojectVector(vector, this.displayCamera.camera3);

		var ray = new $3.Ray(this.displayCamera.camera3.position, vector.subSelf(this.displayCamera.camera3.position).normalize());

		var intersects = ray.intersectObject(this.displayCamera.scene.__objects[0]);

		if(intersects.length > 0) {
			result.x = intersects[0].point.x;
			result.y = ($H.Graphics.scale * this.displayCamera.world.size.y) - intersects[0].point.y;
			result.x = Math.floor(result.x / $H.Graphics.scale);
			result.y = Math.floor(result.y / $H.Graphics.scale);
		}

		return result;
	},
	GetItem: function(worldPosition) {
		var ret = null;
		for (var top = this.displayCamera.layers.Count(); top > 0; top--) {
			var thisLayer = this.displayCamera.layers.Item(top - 1);
			thisLayer.elements.forEach(function(el, ind, array) {
				if (el.position.x == worldPosition.x && el.position.y == worldPosition.y) {
					ret = el;
					return;
				}
			});
			if (ret != null) break;
		}
		return ret;
	}
});

var Camera = CanvasObject.extend({
	_className: "Camera",
	// Fields
	layers : null,
	camera3 : null,
	renderer : null,
	scene : null,
	world : null,
	meshes : null,
	// Constructor
	ctor : function(position, size, viewPort, layers, world) {
		this.world = world;
		this.layers = new Dictionary(Layer, 'index');
		this.meshes = new Dictionary($3.Mesh, 'name');
		this.children = this.layers;
		this.camera3 = new $3.CombinedCamera(size.x, size.y, 70, 1, 10000, -1000, 1000);
		
		this.camera3.position = position;
		
		this.scene = new $3.Scene();
		this.scene.add(this.camera3);
		this.camera3.lookAt(new $3.Vector3(position.x, position.y, position.z - 1));
		this.renderer = new $3.CanvasRenderer();
		this.renderer.setSize(size.x, size.y);

		for(var i = 0; i < layers; i++) {
			var newLayer = new Layer(this, i);
			this.layers.Add(newLayer);
			// Create Geometries and apply the material.
			var material = new $3.MeshBasicMaterial({
				map : new $3.Texture(newLayer.canvas.domCanvas),largeTexture: true
			});
			material.map.needsUpdate = true;
			var geometry = new $3.PlaneGeometry(newLayer.canvas.size.x, newLayer.canvas.size.y);
			var mesh = new $3.Mesh(geometry, material);
			mesh.position.x = newLayer.canvas.size.x / 2;
			mesh.position.y = newLayer.canvas.size.y / 2;
			mesh.position.z = 0;
			mesh.name = newLayer.index;
			this.meshes.Add(mesh);
			this.scene.add(mesh);

		}
		this._super(position, size);
	},
	// Methods
	Move : function(vector) {
		this.Invalidate();
		this._super(vector);
		this.SetCamera3Position();
	},
	MoveTo: function(vector) {
	    this.Invalidate();
	    this._super(vector);
	    this.SetCamera3Position();
	},
	SetCamera3Position: function()
	{
		var x = this.position.x * $H.Graphics.scale;
		var y = (this.world.size.y * $H.Graphics.scale) - (this.position.y * $H.Graphics.scale);
		var z = this.position.z;
		this.camera3.position = new $3.Vector3(x, y, z);
		//this.camera3.position.addSelf(vector.multiplySelf(new $3.Vector3($H.Graphics.scale, $H.Graphics.scale, $H.Graphics.scale)));
	},
	Rotate : function(degrees) {
		this.Invalidate();
		var radians = (degrees * Math.PI / 180);
		var radVector = new $3.Vector3(0, 0, radians);
		this.camera3.rotation.addSelf(radVector);
		this._super(radVector);
	},
	Draw : function() {
		for(var i = 0; i < this.layers.Count(); i++) {
			if(this.layers.Item(i).Draw()) {
				//   If Scene Contains PlaneGeometry For this layer update it
				var mesh = this.meshes.Item(this.layers.Item(i).index);
				mesh.material.map.image = this.layers.Item(i).canvas.domCanvas;
				mesh.material.map.needsUpdate = true;
				this.Invalidate();
			}
		}
		if (!this.valid)
		{
			this.renderer.render(this.scene, this.camera3);
		}
	},
	Register : function(positionedObject) {
		this.layers.Item(positionedObject.layer).Register(positionedObject);
	},
	Reset : function() {

	}
});

var Layer = CanvasObject.extend({
	_className: "Layer",
	// Fields
	index : 0,
	elements : null,
	camera : null,
	canvas : null,
	// Constructor
	ctor : function(camera, index) {
		this.index = index;
		this.camera = camera;
		this.elements = new Dictionary(PositionedObject, 'id');
		this.children = this.elements;
		this.canvas = new Canvas(false, new $3.Vector3(0, 0), new $3.Vector3(camera.world.size.x * $H.Graphics.scale, camera.world.size.y * $H.Graphics.scale));
	},
	// Methods
	Register : function(positionedObject) {
		this.elements.Add(positionedObject);
		positionedObject.moved.bind(this, this.TargetMoved);
		this.Invalidate();
	},
	TargetMoved: function(sender, eventArgs) {
		var prev = eventArgs.data.previousPosition;
		var rectangle = {
			x: prev.x * $H.Graphics.scale,
			y: prev.y * $H.Graphics.scale,
			width: prev.x * $H.Graphics.scale,
			height: prev.y * $H.Graphics.scale
		};
		this.canvas.ClearRectangle(rectangle);
		this.canvas.DrawImage({
			image: sender.representation,
			position: sender.position.clone()
		});
		
		this.Invalidate();
	},
	Draw : function() {
		if(!this.valid) {
			this.canvas.Clear();
			var that = this;
			this.elements.forEach(function (po, index, array) {
			    if (!po.representation) {
			        po.representation = $H.Graphics.AssetManager.GetSprite(po.assetId);
                }
			    if (po.representation) {
			        that.canvas.DrawImage({
			            image: po.representation,
			            position: po.position.clone()

			        });
			    }
			});
			this._super();
			return true;
		}
		return false;
	},
	Invalidate : function(rectangle) {
		
		this._super();
	}
});

var Canvas = CanvasObject.extend({
	_className: "Canvas",
	// Fields
	domCanvas : null,
	domContext : null,

	// Constructor
	ctor : function(domElement, position, size) {
		this.domCanvas = document.createElement('canvas');
		this.domCanvas.id = $H.Utility.newGuid();
		this.domCanvas.tabIndex = 2;
		this.domCanvas.width = size.x;
		this.domCanvas.height = size.y;
		this.domContext = this.domCanvas.getContext('2d');

		if(domElement) {
			domElement.append(this.domCanvas)
		}
		//else { $('body').append(this.domCanvas);}

		this._super(position, size);
	},
	// Methods
	DrawImage : function(args) {
		var image = args.image || new $3.Texture();
		var srcPos = args.srcPos || new $3.Vector3(0, 0);
		var srcSize = args.srcSize || new $3.Vector3($H.Graphics.scale, $H.Graphics.scale);
		var position = args.position.multiplySelf(new $3.Vector3($H.Graphics.scale, $H.Graphics.scale, $H.Graphics.scale)) || new $3.Vector3(0, 0);
		var size = args.size || new $3.Vector3($H.Graphics.scale, $H.Graphics.scale);

		this.domContext.drawImage(image, srcPos.x, srcPos.y, srcSize.x, srcSize.y, position.x, position.y, size.x, size.y);

	},
	ClearRectangle: function(rectangle) {
		this.domContext.clearRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	},
	Clear : function() {
		this.domContext.save();
		this.domContext.setTransform(1, 0, 0, 1, 0, 0);
		this.domContext.clearRect(0, 0, this.domCanvas.width, this.domCanvas.height);
		this.domContext.restore();
	}
});

/*
 * ASSET MANAGER - STATIC CLASS
 *
 * Handles all asset retrieval and caching including textures, animations, audio, video, etc.
 *
 *
 */

var AssetManager = {
	// Fields
	assets : new Array(),
	added: 0,
	loaded: 0,
	// Methods
	Get : function(assetId) {
		if( assetId in this.assets) {
			return this.assets[assetId];
		}
		return null;
	},
	GetSprite : function(assetId) {
		var that = this;
		if( assetId in this.assets) {
			return this.assets[assetId];
		}
		this.added++;
		// Local for now.
		var image = new Image();
		image.onload = function() {
		
			var canvas = document.createElement('canvas');
			$(canvas).ready(function() {
				that.loaded++;
				if (that.loaded == that.added)
				{
					$($H.Graphics.AssetManager).trigger('Ready');
				}
			});
			canvas.height = canvas.width = $.Hurricane.Graphics.scale;
			var context = canvas.getContext('2d');
			context.drawImage(this, 0, 0, canvas.width, canvas.height);
			$H.Graphics.AssetManager.assets[assetId] = canvas;
			
			
		}
		image.src = $.Hurricane.Config.Graphics.assetPath + "?id=" + assetId;

	},
	PreLoad : function(assetIds) {
		for(var i = 0; i < assetIds.length; i++) {
			this.GetSprite(assetIds[i]);
		}
	}
	
	// Other implementations may be necessary and proper.

}

$.Hurricane.Graphics.AssetManager = AssetManager;
