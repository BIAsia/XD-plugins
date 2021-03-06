/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


let scenegraph = require("scenegraph"); 
const {alert} = require("./lib/dialogs.js");
var assets = require("assets");
const {Color, Shadow} = require("scenegraph"); 
var shadowList = [];
var nodeList = [];
let renameColorNum = 0, newColorNum = 0;

function findSelectedShadowHandleFunction(selection) { 
	// 初始化
	shadowList = [];
	nodeList = [];

	let select = selection.items;
	select.forEach((node)=>{traverseChildrenToFindShadow(node);});
	outputShadowDetails();

	// for test
	if (JSON.stringify(shadowList[0]) == JSON.stringify(shadowList[1])) console.log("ok");
	//showAlert(newColorNum, renameColorNum);

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

// 遍历匹配阴影
function traverseChildrenToChangeShadow(root, shadowMatch, shadowChange){
	if (root.isContainer){
		root.children.forEach((children,i)=>{
			traverseChildrenToChangeShadow(children, shadowMatch, shadowChange);
		})
	} else {
		if (root.shadow != null){
			console.log("start matching!"); 
			// 匹配并替换阴影
			console.log(shadowMatch);
			//console.log(root.shadow);
			if (JSON.stringify(shadowMatch) == JSON.stringify(root.shadow)){
				root.shadow = shadowChange;
				console.log("Change!"); 
			}
			
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
let shadowNum = 0;
function create() {
	
	// [1]
	const html= `
	<style>
        .shadow-container {
    position: absolute;
    height: 60px;
    left: 16px;
    right: 16px;
    top: 49px;
}
.input-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    position: absolute;
    height: 60px;
    width: 194px;
    left: 0px;
    top: 2px;
}
.input-line {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;

    position: absolute;
    width: 194px;
    height: 24px;
    left: 0px;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 12px 0px;
}
.input-item {
    position: absolute;
    width: 96px;
    height: 24px;
    top: 0px;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 12px;
}
#input-hex {
    position: absolute;
    width: 72px;
    height: 24px;
}
#input-opacity {
    position: absolute;
    width: 44px;
    height: 24px;
}
#input-x, #input-y, #input-blur {
    position: absolute;
    width: 40px;
    height: 24px;
}

.custom-preview {
    position: absolute;
    height: 60px;
    left: 210px;
    right: 0px;
    top: 2px;

    background: #FFFFFF;
    border-radius: 4px;
}

.square-shadow {
    display: inline;
    position: absolute;
    width: 16px;
    height: 16px;
    left: calc(50% - 16px/2);
    top: calc(50% - 16px/2);

    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
}
.square-preview {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 20px;
    top: calc(50% - 16px/2);

    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
}


.assets-header {
    position: absolute;
    height: 19px;
    left: 0px;
    right: 0px;
    top: 142px;
    margin: 8px 0px;
}
.assets-header h5{
    display: inline;
}
.total {
    position: absolute;
    display: inline;
    right: 0px;
    top: 0px;
}

.assets-container {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 169px;
    padding: 0px;
}
.shadow-asset {
    position: absolute;
    top: 169px;
    height: 56px;
    left: 0px;
    right: 0px;

    background: #FFFFFF;
    border-radius: 4px;

    margin: 12px 0px;
}
.source {
    position: absolute;
    height: 15px;
    left: 50px;
    right: 36px;
    top: 12px;

    line-height: 15px;
}
.style-info {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;

    position: absolute;
    width: 180px;
    height: 15px;
    left: 50px;
    top: 27px;
}
.style-info span {
    position: static;
    height: 15px;
    left: 0px;
    top: 0px;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 6px;
    padding: 0px;
}
.style-info span.comment {
    margin: 0px 0px 0px 12px;
    opacity: 0.3;
}
.btn-menu {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 16px;
    top: 20px;

}
footer > button {
    position: absolute;
    width: 296px;
    height: 32px;
    left: calc(50% - 296px/2);
    bottom: 0px;
}
    </style>
    <h5>custom shadow</h5>
    <div class="shadow-container">
        <div class="input-form">
            <div class="input-line" style="top: 0px;">
                <label class="input-item" style="left: 0px;">
                    <span>hex</span>
                    <input class="text" id="input-hex" placeholder="#000000" value="#000000">
                </label>
                <label class="input-item" style="left: 108px;">
                    <span>opacity</span>
                    <input class="number" id="input-opacity" placeholder="0-1" value="0.25">
                </label>
            </div>
            <div class="input-line" style="top: 36px;">
                <label class="input-item" style="left: 0px;">
                    <span>x</span>
                    <input type="number" id="input-x" placeholder="0" value="0">
                </label>
                <label class="input-item" style="left: 64px;">
                    <span>y</span>
                    <input type="number" id="input-y" placeholder="2" value="2">
                </label>
                <label class="input-item" style="left: 128px;">
                    <span>blur</span>
                    <input type="number" id="input-blur" placeholder="4" value="4">
                </label>
            </div> 
        </div>
        <div class="custom-preview">
            <div class="square-shadow" id="square-pre" ></div>
        </div>
    </div>
    <div class="assets-header">
        <h5>Shadow assets</h5>
        <div class="total">
            <label>total:</label>
            <label id="asset-length">0</label>
        </div>
    </div>
    <div class="assets-container">
        <div class="shadow-asset">
            <div class="square-shadow square-preview" id="1_preview"></div>
            <label class="source" id="1_source">Artboard  / .. /..(Rectangle, fill#555)</label>
            <div class="style-info">
                <span class="hex" id="1_hex" >#345678</span>
                <span class="alpha" id="1_alpha">90%</span>
                <span class="comment">x:</span>
                <span class="x" id="1_x">0</span>
                <span class="comment">y:</span>
                <span class="y" id="1_y">8</span>
                <span class="comment">blur:</span>
                <span class="blur" id="1_blur">32</span>
            </div>
			<button class="btn-menu" id="1_btn" uxp-variant="action">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 9C2.32843 9 3 8.32843 3 7.5C3 6.67157 2.32843 6 1.5 6C0.671573 6 0 6.67157 0 7.5C0 8.32843 0.671573 9 1.5 9Z" fill="#24292E"/>
                    <path d="M8 9C8.82843 9 9.5 8.32843 9.5 7.5C9.5 6.67157 8.82843 6 8 6C7.17157 6 6.5 6.67157 6.5 7.5C6.5 8.32843 7.17157 9 8 9Z" fill="#24292E"/>
                    <path d="M16 7.5C16 8.32843 15.3284 9 14.5 9C13.6716 9 13 8.32843 13 7.5C13 6.67157 13.6716 6 14.5 6C15.3284 6 16 6.67157 16 7.5Z" fill="#24292E"/>
                </svg>
            </button>
        </div>
    </div>
    <footer>
        <button class="secondary" uxp-variant="action">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.8125 1.5C5.96168 1.5 6.10476 1.55927 6.21025 1.66475C6.31573 1.77024 6.375 1.91332 6.375 2.0625V5.25H9.5625C9.71167 5.25 9.85478 5.30926 9.96023 5.41475C10.0658 5.52024 10.125 5.66332 10.125 5.8125C10.125 5.96168 10.0658 6.10476 9.96023 6.21025C9.85478 6.31573 9.71167 6.375 9.5625 6.375H6.375V9.5625C6.375 9.71167 6.31573 9.85478 6.21025 9.96023C6.10476 10.0658 5.96168 10.125 5.8125 10.125C5.66332 10.125 5.52024 10.0658 5.41475 9.96023C5.30926 9.85478 5.25 9.71167 5.25 9.5625V6.375H2.0625C1.91332 6.375 1.77024 6.31573 1.66475 6.21025C1.55927 6.10476 1.5 5.96168 1.5 5.8125C1.5 5.66332 1.55927 5.52024 1.66475 5.41475C1.77024 5.30926 1.91332 5.25 2.0625 5.25H5.25V2.0625C5.25 1.91332 5.30926 1.77024 5.41475 1.66475C5.52024 1.55927 5.66332 1.5 5.8125 1.5Z" fill="#24292E"/>
                </g>
            </svg>
            <span>Add from custom shadow</span>
        </button>
    </footer>
		
	
	`;
	
	/*
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
	  }*/

	  
	  function generateShadowList(){
		const { editDocument } = require("application");
		let shadowAssets = panel.querySelector("#shadowList");
		editDocument({ editLabel: "generate shadow list"}, function(selection) {
			shadowList = [];
			nodeList = [];
			
			while (shadowAssets.firstChild){
				shadowAssets.removeChild(shadowAssets.lastChild);
			} 

			let select = selection.items;
			select.forEach((node)=>{traverseChildrenToFindShadow(node);});

			const initHTML = `
				<div class="color"></div>
				<span class="hex">#345678</span>
				<span class="alpha">90%</span>
				<span class="x">0</span>
				<span class="y">8</span>
				<span class="blur">32</span>
				<button class="editbtn" uxp-variant="action">apply</button>
			`
			
			for (var j = 0; j < shadowList.length; j++) {
				let shadow = shadowList[j];
				let alpha = (shadow.color.toRgba().a/255).toFixed(2);

				let asset = document.createElement("div");
				asset.className = "asset";
				asset.id = j;
				asset.innerHTML = initHTML;
				asset.querySelector(".color").style.background = shadow.color.toHex(true);
				asset.querySelector(".color").style.opacity = alpha;
				asset.querySelector(".hex").textContent = shadow.color.toHex(true);
				asset.querySelector(".alpha").textContent = alpha;
				if (shadow.x != 0) asset.querySelector(".x").textContent = shadow.x;
				asset.querySelector(".y").textContent = shadow.y;
				asset.querySelector(".blur").textContent = shadow.blur;

				let editbtn = asset.querySelector(".editbtn");
				editbtn.id = "editbtn_"+j;
				let shadowid = j;
				editbtn.addEventListener("click", () => {applyChange(shadowid);});

				document.querySelector("#shadowList").appendChild(asset);

				shadowNum++;
			}

		})
	  }

	  function applyChange(i){
		
		const { editDocument } = require("application");
		editDocument({ editLabel: "apply shadow change"}, function(selection,documentRoot) {
		  let hex = panel.querySelector("#inputHex").value;
		  let opacity = panel.querySelector("#inputOpacity").value;
		  let x = Number(panel.querySelector("#inputX").value);
		  let y = Number(panel.querySelector("#inputY").value);
		  let blur = Number(panel.querySelector("#inputBlur").value);

		  let shadowChange = new Shadow(x,y,blur,new Color(hex, opacity), true);
		  console.log(shadowChange);
		  traverseChildrenToChangeShadow(documentRoot, shadowList[i], shadowChange);
		})
	  }
	
	  panel = document.createElement("div"); // [9]
	  panel.innerHTML = html; // [10]
	  //panel.querySelector("form").addEventListener("submit", generateShadowList); // [11]
	  
	
	  return panel; // [12]
}

function show(event) {
	if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
	/*
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
	*/
}

module.exports = {
	panels: {
		showShadows: {
			show,
			update
		}
	},
    commands: {
        createRectangle: findSelectedShadowHandleFunction
    }
};
