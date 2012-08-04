(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var BattleShapes = {};

BattleShapes = {
    canvas: null,
    context: null,
    color: null,
    battlefield: null,
    viewport: null,
    init: function () {
        this.color = new Color(0, 0, 0);
        this.battlefield = new BattleField();
        this.viewport = new ViewPort();
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 800;
        this.canvas.height = 480;
        this.context = canvas.getContext('2d');

        this.viewport.start();
    }
}
var BattleField = new JS.Class({
    width: 1000,
    height: 1000,
    initialize: function () {

    }

});

var ViewPort = new JS.Class({
    offset: { x: 0, y: 0 },
    start: null,
    previous: null,
    shapes: [],
    initialize: function () {
        

    },
    start: function() {
        this.start = Date.now();
        this.draw();
    },
    draw: function () {
        var elapsed = Date.now() - this.previous;
        this.previous = Date.now();
        

        // Store the current transformation matrix
        BattleShapes.context.save();
        
        // Use the identity matrix while clearing the canvas
        BattleShapes.context.setTransform(1, 0, 0, 1, 0, 0);
        BattleShapes.context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        BattleShapes.context.restore();
        var that = this;

        this.shapes.forEach(function (item, index, array) {
            item.update(elapsed);
            if (item.cull) {
                console.log("Splicing");
                array.splice(index);
            }
            var rel = that.getPosition(item.position);
            if (rel) {
                item.draw(rel);
            }
        });


        requestAnimationFrame(this.draw.bind(this));
    },
    add: function (shape) {
        this.shapes.push(shape);
    },
    remove: function (shape) {
        
    },
    getPosition: function (shapePosition) {
        if (shapePosition.x < this.offset.x ||
            shapePosition.y < this.offset.y ||
            shapePosition.x > this.offset.x + BattleShapes.canvas.width ||
            shapePosition.y > this.offset.y + BattleShapes.canvas.height) {
            return false;
        }
        return {
            x: shapePosition.x - this.offset.x,
            y: shapePosition.y - this.offset.y
        }
    }
});

var Renderable = new JS.Class({
    id: null,    
    initialize: function() {
        this.id = Renderable.Count++;
    },
    draw: function () {

    }
});
Renderable.Count = 0;
var Shape = new JS.Class(Renderable, {
    position: {x:0,y:0},
    sides: 0,
    dimensions: 0,
    size: 0,
    color: null,
    orientation: 0,
    velocity: {},
    acceleration: {},
    created: null,
    lifespan: -1,
    cull: false,
    initialize: function (sides, dimensions, size) {
        this.callSuper();
        this.created = Date.now();
        this.color = BattleShapes.color;
        this.sides = sides;
        this.dimensions = dimensions;
        this.size = size;
        this.velocity = {
            x: 0,
            y: 0,
            z: 0,
            r: 0,
        };
        this.acceleration = {
            x: 0,
            y: 0,
            z: 0,
            r: 0,
        };
    },
    update: function (elapsed) {
        if (this.lifespan !== -1) {
            if ((Date.now() - this.created) / 1000 > this.lifespan) {
                this.cull = true;
                
            }
        }

        elapsed = elapsed / 1000;
        this.velocity.x += elapsed * this.acceleration.x;
        this.velocity.y += elapsed * this.acceleration.y;
        this.velocity.r += elapsed * this.acceleration.r;

        this.position.x += elapsed * this.velocity.x;
        this.position.y += elapsed * this.velocity.y;
        //this.position.z += elapsed * this.velocity.z;
        this.orientation += elapsed * this.velocity.r;
    },
    draw: function (position) {

    }

});

var Point = new JS.Class(Shape, {
    initialize: function () {
        this.callSuper(0, 1, 0);
    },
    draw: function (position) {
        BattleShapes.context.save();
        BattleShapes.context.translate(position.x, position.y);
        BattleShapes.context.rotate(this.orientation);
        BattleShapes.context.strokeStyle = this.color.getRGB();
        BattleShapes.context.fillStyle = this.color.getRGB();
        BattleShapes.context.fillRect(0, 0, 1, 1);
        BattleShapes.context.restore();
    }
});

var Circle = new JS.Class(Shape, {
    initialize: function (size) {
        this.callSuper(1, 2, size);
    },
    draw: function (position) {
        BattleShapes.context.save();
        BattleShapes.context.translate(position.x, position.y);
        BattleShapes.context.rotate(this.orientation);
        BattleShapes.context.strokeStyle = this.color.getRGB();
        BattleShapes.context.fillStyle = this.color.getRGB();
        BattleShapes.context.beginPath();
        BattleShapes.context.arc(0, 0, this.size, 0, 2 * Math.PI, false);
        BattleShapes.context.fill();
        BattleShapes.context.restore();
    }
});

var Line = new JS.Class(Shape, {
    initialize: function (length) {
        this.callSuper(1, 2, length);
    },
    draw: function (position) {
        BattleShapes.context.save();
        BattleShapes.context.translate(position.x, position.y);
        BattleShapes.context.rotate(this.orientation);
        BattleShapes.context.strokeStyle = this.color.getRGB();
        BattleShapes.context.fillStyle = this.color.getRGB();
        BattleShapes.context.beginPath();
        BattleShapes.context.moveTo(0, -this.size / 2);
        BattleShapes.context.lineTo(0, this.size / 2);
        BattleShapes.context.stroke();
        
        BattleShapes.context.restore();
    }
});

var Triangle = new JS.Class(Shape, {
    initialize: function (size) {
        this.callSuper(3, 2, size);
    },
    draw: function (position) {
        BattleShapes.context.save();
        BattleShapes.context.translate(position.x, position.y);
        BattleShapes.context.rotate(this.orientation);
        BattleShapes.context.strokeStyle = this.color.getRGB();
        BattleShapes.context.fillStyle = this.color.getRGB();
        BattleShapes.context.beginPath();
        BattleShapes.context.moveTo(0, -this.size / 2);
        BattleShapes.context.lineTo(-this.size / 2, this.size / 2);
        BattleShapes.context.lineTo(this.size / 2, this.size / 2);
        BattleShapes.context.lineTo(0, -this.size / 2);
        BattleShapes.context.stroke();
        BattleShapes.context.fill();
        BattleShapes.context.restore();
    }
});


var Element = new JS.Class(Renderable, {
    damage: null,
    type: null,
    shape: null,
    position: null, // Relative to Construct.
    initialize: function (type, shape, position) {

    },
    draw: function() {

    },
    cost: function () {

    }

});

/////  Elements

var Weapon = new JS.Class(Element, {

});
var Armor = new JS.Class(Element, {

});
var Chassis = new JS.Class(Element, {

});
var Armor = new JS.Class(Element, {

});
var Drive = new JS.Class(Element, {

});
var Generator = new JS.Class(Element, {

});
var Projectile = new JS.Class(Element, {

});
var ElementType = new JS.Class({
    /*
    Ammunition
    Weapon
    Chassis
    Armor
    Drive
    Power




    */

    name: null,
    // Modification Methods

});


var Construct = new JS.Class(Renderable, {
    damaage: null,
    size: null,
    type: null,
    elements: null,
    initialize: function () {
        this.size = { x: 5, y: 5 };
        this.elements = [];
    },
    draw: function() {

    },
    cost: function () {

    },
    ////   Derived Statistics \\\\\
    thrust: function () {

    },
    mass: function () {

    },
    power: function () {

    }

});

var ConstructType = new JS.Class({
    name: null
    // Just the one now... just BattleShape.

});
///////////////////////////// BEGIN MAIN LINE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
$(document).ready(function () {
    BattleShapes.init();

    /*  Test Code */
    var point = new Point();
    point.position = { x: 20, y: 20 };
    BattleShapes.viewport.add(point);
    //point.draw({ x: 20, y: 20 });

    var circle = new Circle(5);
    circle.position = { x: 50, y: 50 };
    BattleShapes.viewport.add(circle);
    //circle.draw({ x: 50, y: 50 });

    var line = new Line(5);
    line.position = { x: 100, y: 100 };
    BattleShapes.viewport.add(line);
    //line.draw({ x: 100, y: 100 });

    var triangle = new Triangle(15);
    triangle.position = { x: 100, y: 200 };
    
    
    BattleShapes.viewport.add(triangle);
  
   // triangle.draw({ x: 100, y: 200 });
});