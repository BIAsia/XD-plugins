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


const {Rectangle, Color} = require("scenegraph"); 
const { alert } = require("./lib/dialogs.js");
var assets = require("assets");
var newColorNum, renameColorNum;
var fillList = [], fillNodeList = [];

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
        if (root.constructor.name == "Rectangle" && root.fill.constructor.name == "Color" && root.hasDefaultName == false){
            // only rename
            if (assets.colors.delete(new Color(root.fill))==1) {
                console.log("color deleted")
                renameColorNum++;
                assets.colors.add({name: root.name, color: root.fill});
                console.log("color " + root.name + " is added");
            }
            /*
            if (assets.colors.delete(new Color(root.fill))==1) {
                console.log("color deleted")
                renameColorNum++;
                newColorNum--;
            }
            assets.colors.add({name: root.name, color: root.fill});
            console.log("color " + root.name + " is added");
            newColorNum++;
            */
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
    select.forEach((root)=>{traverseChildrenToFindFill(root);});
    outputNodeDetails(fillList, fillNodeList);
}

function traverseChildrenToFindFill(root){
    if (root.isContainer){
        root.children.forEach((children,i)=>{
            traverseChildrenToFindFill(children);
        })
    } else {
        if (root.fill != null){
            // 有填充
            fillList.push(root.fill);
            fillNodeList.push(root);
        }
    }
}

// 输出阴影信息
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
}

async function showAlert(newColorNum, renameColorNum){
    await alert(newColorNum + " colors has been added to Assets", //[1]
    "And " + renameColorNum + " existed colors has been renamed.",
    "Go to Assets Panel to see your colors :D"); //[2]
}

module.exports = {
    commands: {
        addColors: ColorAddHandlerFunction,
        sortColors: SortColorAssetsHandlerFunction,
        outputColors: OutColorAssetsHandlerFunction,
        fillColors: FillColorHandlerFunction
    }
};
