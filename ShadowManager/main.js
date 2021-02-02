/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


let scenegraph = require("scenegraph"); 
const { alert } = require("./lib/dialogs.js");
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
	showAlert(newColorNum, renameColorNum);

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
    await alert(newColorNum + " shadow colors has been added to Assets", //[1]
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

let panel;
function create() {
	// [1]
	const html = `
	<style>
		.break {
			flex-wrap: wrap;
		}
		label.row > span {
			color: #8E8E8E;
			width: 20px;
			text-align: right;
			font-size: 9px;
		}
		label.row input {
			flex: 1 1 auto;
		}
		form {
			width:90%;
			padding: 0px;
		}
		.show {
			display: block;
		}
		.hide {
			display: none;
		}
	</style>
	
	<form id="main">
		<div class="row break">
			<label class="row">
				<span>↕︎</span>
				<input type="number" uxp-quiet="true" id="txtV" value="10" placeholder="Height" />
			</label>
			<label class="row">
				<span>↔︎</span>
				<input type="number" uxp-quiet="true" id="txtH" value="10" placeholder="Width" />
			</label>
		</div>
		<footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
	</form>
	
	<p id="warning">This plugin requires you to select a rectangle in the document. Please select a rectangle.</p>
	`;
	
	  function increaseRectangleSize() { // [2]
		const { editDocument } = require("application"); // [3]
		const height = Number(document.querySelector("#txtV").value); // [4]
		const width = Number(document.querySelector("#txtH").value); // [5]
	
		// [6]
		editDocument({ editLabel: "Increase rectangle size" }, function(selection) {
		  const selectedRectangle = selection.items[0]; // [7]
		  selectedRectangle.width += width; // [8]
		  selectedRectangle.height += height;
		});
	  }
	
	  panel = document.createElement("div"); // [9]
	  panel.innerHTML = html; // [10]
	  panel.querySelector("form").addEventListener("submit", increaseRectangleSize); // [11]
	
	  return panel; // [12]
}

function show(event) {
	if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
	const { Rectangle } = require("scenegraph"); // [2]

	const form = document.querySelector("form"); // [3]
	const warning = document.querySelector("#warning"); // [4]

	if (!selection || !(selection.items[0] instanceof Rectangle)) { // [5]
		form.className = "hide";
		warning.className = "show";
	} else {
		form.className = "show";
		warning.className = "hide";
	}
}

module.exports = {
	panels: {
		showShadows: {
			show,
			update
		}
	},
    commands: {
        createRectangle: rectangleHandlerFunction
    }
};
