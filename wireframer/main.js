/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


const {Rectangle, Color, Text, SceneNode} = require("scenegraph"); 
var wireColor = new Color("White");
var cornerColor = new Color("#FFAC3B", 0.3);
var cornerSize = 24;

function wireframeHandlerFunction(selection) { 
	let select = selection.items;
	select.forEach((node)=>{traverseChildrenStyles(node);});
}

function addCornerHandlerFunction(selection) { 
	let select = selection.items;
	select.forEach((rectangle)=>{
		if (rectangle.constructor.name == "Rectangle"){
			var radius = rectangle.cornerRadii, bounds = rectangle.boundsInParent;
			console.log(bounds);
			let topL = {topLeft:radius.topLeft, topRight:0, bottomRight:0, bottomLeft:0},
				topR = {topLeft:0, topRight:radius.topRight, bottomRight:0, bottomLeft:0},
				bottomR = {topLeft:0, topRight:0, bottomRight:radius.bottomRight, bottomLeft:0},
				bottomL = {topLeft:0, topRight:0, bottomRight:0, bottomLeft:radius.bottomLeft};
			createNewCorner(0,0,topL, bounds, selection);
			createNewCorner(bounds.width-cornerSize,0,topR, bounds, selection);
			createNewCorner(0,bounds.height-cornerSize,bottomL, bounds, selection);
			createNewCorner(bounds.width-cornerSize,bounds.height-cornerSize,bottomR, bounds, selection);
		}
	});
}

function createNewCorner(X, Y, cornerRadii,bounds, selection){
	var newBounds = {x:bounds.x + X, y:bounds.y + Y, width:cornerSize, height:cornerSize};
	const newElement = new Rectangle();
	newElement.width = cornerSize;
	newElement.height = cornerSize;
    newElement.fill = cornerColor;
    newElement.cornerRadii = cornerRadii;
    selection.insertionParent.addChild(newElement);
    newElement.moveInParentCoordinates(newBounds.x, newBounds.y);
}

function traverseChildrenStyles(root){
	if (root.constructor.name != "Artboard" && root.opacity != 0) root.opacity = 1;
	if (root.isContainer){
		if (root.mask){
			var mask = root.mask;
			console.log(mask);
			mask.removeFromParent();
			root.addChild(mask, 0);
		}
		if (root.constructor.name == "ScrollableGroup"){} else
		root.children.forEach((children,i)=>{
			traverseChildrenStyles(children);
		})
	} else {
		if (root.constructor.name == "Text" || root.constructor.name == "Path") root.fill = wireColor;
		else {
			if (root.fillEnabled) root.fillEnabled = false;
			if (!root.strokeEnabled) root.strokeEnabled = true;
			root.stroke = wireColor;
		}
		root.shadow = null;
	}
}

module.exports = {
    commands: {
        wireframe: wireframeHandlerFunction,
        addCorner: addCornerHandlerFunction
    }
};
