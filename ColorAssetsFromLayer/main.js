/*
 * Developed by ZiyeLu for Adobe XD.
 *
 * Function: Add and renaming color assets from selection layers, automatically ignoring text & image.
 *
 * 2021/01/18:
   - add default name checking.
   - add color sorting.
   - support selecting artboards.

 */


const {Rectangle, Color, Text} = require("scenegraph"); 
let commands = require("commands");
const { alert } = require("./lib/dialogs.js");
var assets = require("assets");
var newColorNum, renameColorNum;
var fillList = [], fillNodeList = [];
var colorList = [], colorNodeList = [];

function ColorAddHandlerFunction(selection) { 
    newColorNum=0;renameColorNum=0;
    
    let select = selection.items;
    select.forEach((root)=>{traverseChildrenForColors(root);});

    //SortColorAssetsHandlerFunction();
    showAlert(newColorNum, renameColorNum);
}

// 遍历寻找色块
function traverseChildrenForColors(root){
    if (root.isContainer){
        root.children.forEach((children,i)=>{
            traverseChildrenForColors(children);
        })
    } else {
        if (root.hasDefaultName == false) console.log("name");
        if (root.constructor.name == "Rectangle") console.log("rectangle");
        if (root.fill.constructor.name == "Color") console.log("Color");
        if (root.constructor.name == "Rectangle" && root.fill.constructor.name == "Color" && root.hasDefaultName == false){
            // only rename
            if (assets.colors.delete(new Color(root.fill))==1) {
                console.log("color deleted")
                renameColorNum++;
                assets.colors.add({name: root.name, color: root.fill});
                console.log("color " + root.name + " is added");
            }
            
            if (assets.colors.delete(new Color(root.fill))==1) {
                console.log("color deleted")
                renameColorNum++;
                newColorNum--;
            }
            assets.colors.add({name: root.name, color: root.fill});
            console.log("color " + root.name + " is added");
            newColorNum++;
            
        }
    }
}

function SortColorAssetsHandlerFunction(){
    var assets = require("assets"), allColors = assets.colors.get();
    console.log(allColors);
    allColors.sort((colorA, colorB)=>(colorA.name > colorB.name) ? 1:-1);
    console.log(allColors);

    assets.colors.delete(allColors);
    assets.colors.add(allColors);

}

function OutColorAssetsHandlerFunction(){
    var assets = require("assets"), allColors = assets.colors.get();
    for (let i = 0; i < allColors.length; i++){
        console.log(allColors[i].name);
    }
    
}

function FillColorHandlerFunction(selection){
    let select = selection.items;
    colorList = [], colorNodeList = [];
    //fillList = [], fillNodeList = [];
    select.forEach((root)=>{traverseChildrenToFindFill(root);});
    outputColorDetails(colorList, selection);
    //outputNodeDetails(fillList, fillNodeList);
}

function traverseChildrenToFindFill(root){
    if (root.opacity != 0 && root.visible){
        if (root.isContainer && root.constructor.name != "BooleanGroup"){
            root.children.forEach((children,i)=>{
                traverseChildrenToFindFill(children);
            })
        } else if(!root.isContainer){
            /*
            if (root.fill != null ){
                // 有填充
                fillList.push(root.fill);
                fillNodeList.push(root);
            }*/
            var colorObj = {};
            if (root.fill != null && root.fillEnabled && root.fill.constructor.name == "Color"){
                colorObj['isFill'] = true;
                colorObj['fill'] = root.fill;
                colorObj['fillName'] = findColorName(root.fill);
            } else colorObj['isFill'] = false;
            if (root.stroke != null && root.strokeEnabled){
                colorObj['isStroke'] = true;
                colorObj['stroke'] = root.stroke;
                colorObj['strokeName'] = findColorName(root.stroke);
            } else colorObj['isStroke'] = false;
            colorObj['source'] = root;

            if (colorObj.isFill || colorObj.isStroke) colorList.push(colorObj);
        }
    }
}

// 输出 color 信息
function outputColorDetails(colorList, selection){
    for (var i = 0; i < colorList.length; i++) {
        let color = colorList[i];
        var bounds = getSymbolPos(color.source);
        console.log(bounds);
        createColorExample(color, bounds, selection);
    }
}

// 获取symbol信息
function getSymbolPos(child){
    if (child.symbolId != null){
        // is symbol
        console.log(child.name);
        console.log(child.boundsInParent);
        return child.boundsInParent;
    }
    else if (child.parent != null){
        //console.log(child.name);
        return getSymbolPos(child.parent);
    }
}

// 画颜色示意矩形
function createColorExample(colorObj, bound, selection){
    const newName = new Text();
    newName.text = findTokenLeastName(colorObj.source);
    console.log(newName);
    newName.styleRanges = [
        {
          length: newName.text.length,
          fontFamily: "苹方-简",
          fill: new Color("#a0a0a0"),
          fontSize: 14
        }
      ];


    const newRect = new Rectangle();
	newRect.width = 16;
	newRect.height = 16;
    newRect.fill = colorObj.fill;
    newRect.stroke = colorObj.stroke;
    

    const newComment = new Text();
    if (colorObj.isFill && colorObj.isStroke){
        newComment.text = "fill:"+ findColorName(colorObj.fill) + "\n" + "stroke:" + findColorName(colorObj.stroke);
    }
    else if (colorObj.isFill) newComment.text = findColorName(colorObj.fill);
    else if (colorObj.isStroke) newComment.text = findColorName(colorObj.stroke);
    console.log(newComment);
    newComment.styleRanges = [
        {
          length: newComment.text.length,
          fontFamily: "苹方-简",
          fontStyle: "Semibold",
          fill: new Color("#000"),
          fontSize: 16
        }
      ];

    selection.insertionParent.addChild(newName);
    newName.moveInParentCoordinates(bound.x+bound.width+72, bound.y);
    selection.insertionParent.addChild(newRect);
    newRect.moveInParentCoordinates(bound.x+bound.width+72, bound.y+14);
    selection.insertionParent.addChild(newComment);
    newComment.moveInParentCoordinates(bound.x+bound.width+72+28, bound.y+14+13);
    


    selection.items = [newName, newRect, newComment];
    commands.group();

}

function findTokenLeastName(source){
    if (source.hasDefaultName == false){
        return source.name;
    }
    switch (source.constructor.name){
        case "BooleanGroup":
            return "icon";
            break;
        case "Path":
            return "icon";
            break;
        case "Rectangle":
            return "background";
            break;
        case "Text":
            return "text";
            break;
        case "Line":
            return "cursor";
            break;
        default:
            return "not supported"
    }
}

// 输出路径信息
function outputNodeDetails(colorList, nodeList){
    for (var i = 0; i < colorList.length; i++) {
        let color = colorList[i];
        let node = nodeList[i];
        outputParentDetails(node);
        let colorName = findColorName(color);
        console.log(" color: " + colorName + "\n");
    }
}

// 输出路径信息
function outputParentDetails(child){
    if (child.parent != null){
        console.log(child.name);
        outputParentDetails(child.parent);
    }
}

//找到对应 assets 的颜色名
function findColorName(color){
    var assets = require("assets"), allColors = assets.colors.get();
    for (let i = 0; i < allColors.length; i++){
        if (JSON.stringify(allColors[i].color) == JSON.stringify(color)) return allColors[i].name;
    }
    return "No name";
}

async function showAlert(newColorNum, renameColorNum){
    await alert(newColorNum + " colors has been added to Assets", //[1]
    "And " + renameColorNum + " existed colors has been renamed.",
    "Go to Assets Panel to see your colors :D"); //[2]
}

module.exports = {
    commands: {
        addColors: ColorAddHandlerFunction,
        //sortColors: SortColorAssetsHandlerFunction,
        //outputColors: OutColorAssetsHandlerFunction,
        fillColors: FillColorHandlerFunction
    }
};
