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
		.asset {
			margin: 8px 0px;
			padding: 8px;
			background: #ffffff;
			border-radius: 8px;
			display: flex;
			align-items: center;
		}
	
		.color {
			width: 16px;
			height: 16px;
			border-radius: 2px;
			background: #345678;
			
			display: inline-block;
			margin: 0px 8px;
			order: 1;
		}
		.asset > span {
			padding: 0px 4px;
			order: 2;
		}
		.editbtn {
			margin: 0px 8px 0px 32px;
			align-self:flex-end;
			order: 3;
		}
		.grid {
			flex: 1 1 auto;
		}
		label.grid > input {
			width: 60px;
		}
		.show {
			display: block;
		}
		.hide {
			display: none;
		}
	</style>

	

	<form id="main">
		<div>
			<label>
				<span>color hex</span>
				<input type="text" placeholder="#000000" id="inputHex">
			</label>
			<label>
				<span>opacity</span>
				<input type="text" placeholder="1.0" value="1.0" id="inputOpacity">
			</label>
		</div>
		<div class="grid">
			<label class="grid">
				<span>x</span>
				<input type="number" placeholder="0" value="0" id="inputX">
			</label>
			<label class="grid">
				<span>y</span>
				<input type="number" placeholder="0" value="0" id="inputY">
			</label>
			<label class="grid">
				<span>blur</span>
				<input type="number" placeholder="0" value="0" id="inputBlur">
			</label>
		</div>

			<footer>
				<button id="ok" type="submit" uxp-variant="cta">Find shadows</button>
			</footer>
		</form>
	
	<div>
		<h5>Shadow assets</h5>
		<label id="colorNum">0</label>
		<label>shadows:</label>
		<form id="shadowList">
			<div class="asset">
				<div class="color" id="1_color"></div>
				<span class="hex" id="1_hex">#345678</span>
				<span class="alpha" id="1_alpha">90%</span>
				<span class="x" id="1_x">0</span>
				<span class="y" id="1_y">8</span>
				<span class="blur" id="1_blur">32</span>
				<button class="editbtn" id="1_edit" uxp-variant="action">apply</button>
			</div>
			
		</form>
		
	</div>
		
	
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
	  panel.querySelector("form").addEventListener("submit", generateShadowList); // [11]
	  
	
	  return panel; // [12]
}

function show(event) {
	if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
	const { Rectangle } = require("scenegraph"); // [2]

	const form = document.querySelector("form"); // [3]
	const warning = document.querySelector("#warning"); // [4]
	/*

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
