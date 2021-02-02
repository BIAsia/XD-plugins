/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


let scenegraph = require("scenegraph"); 
var assets = require("assets");
const {Color} = require("scenegraph"); 
var shadowList = [];
var nodeList = [];
let renameColorNum = 0, newColorNum = 0;

function rectangleHandlerFunction(selection) { 
	// 初始化
	shadowList = [];
	nodeList = [];

	let select = selection.items;
	select.forEach((node)=>{traverseChildrenToFindShadow(node);});
	outputShadowDetails();

	// for test
	if (JSON.stringify(shadowList[0]) == JSON.stringify(shadowList[1])) console.log("ok");
	//showAlert(newColorNum, renameColorNum);
	
	/*
	if (selection.hasArtboards){
		// 选中的是画板
		var artboardnames = [];
		select.forEach((artboard) => {
			artboard.children.foreach((child))
		})

	} else {
		// 选中的是画板内or外的内容
	}*/

/*
    const newElement = new Rectangle(); 
    newElement.width = 100;
    newElement.height = 50;
    newElement.fill = new Color("Purple");

    selection.insertionParent.addChild(newElement);
    newElement.moveInParentCoordinates(100, 100);*/

}


// 遍历寻找阴影
function traverseChildrenToFindShadow(root){
	if (root.isContainer){
		root.children.forEach((children,i)=>{
			traverseChildrenToFindShadow(children);
		})
	} else {
		if (root.shadow != null){
			// 有阴影
			shadowList.push(root.shadow);
			nodeList.push(root);
		}
	}
}

// 输出阴影信息
function outputShadowDetails(){
	for (var i = 0; i < shadowList.length; i++) {
		let shadow = shadowList[i];
		let node = nodeList[i];
		let alpha = (shadow.color.toRgba().a/255).toFixed(2);
		console.log("(" + i + ") ");
		outputParentDetails(node);
		console.log(" color: #" + shadow.color.toHex(true) + "," + alpha +  
					" x: " + shadow.x +
					" y: " + shadow.y +
					" blur: " + shadow.blur);
		addColorToAssets(shadow.color);
	}
}

// 添加颜色到 Assets
function addColorToAssets(shadowcolor){
	if (assets.colors.delete(new Color(shadowcolor))==1) {
        console.log("color repeated")
        renameColorNum++;
        newColorNum--;
    }
    assets.colors.add({color: shadowcolor});
    console.log("added successful! \n");
    newColorNum++;
}

// 添加阴影成功提示
async function showAlert(newColorNum, renameColorNum){
    await alert(newColorNum + "shadow colors has been added to Assets", //[1]
    "Including " + renameColorNum + " repeated shadow colors",
    "Go to Assets Panel to see your colors :D"); //[2]
}

// 统计重复阴影
function analyzeRepeatShadow(){
	let tempshadow = shadowList[0];
	let shadowAssets = [], repeatNum = [0];
	for (var i = 0; i < shadowList.length; i++) {
		if (tempshadow == shadowList[i]){
			shadowAssets.push(tempshadow);
			repeatNum[shadowAssets.length-1]++;
		} 
	}
}

// 输出路径信息
function outputParentDetails(child){
	if (child.parent != null){
		console.log(child.name);
		outputParentDetails(child.parent);
	}
}

module.exports = {
    commands: {
        createRectangle: rectangleHandlerFunction
    }
};
