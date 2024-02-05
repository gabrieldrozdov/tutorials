let demos = [
	"template.html",

	"lesson1.html",
	"lesson2.html",
	"lesson2a.html",
	"lesson3.html",
	"exercisea.html",
	"lesson4.html",
	"lesson5.html",
	"exerciseb.html",
	"lesson6.html",
	"exercisec.html",
	"lesson7.html",
	"exercised.html",

	"reusing-functions.html",
	"this-argument.html",

	"array-in-order.html",
	"array-random.html",
	"tracking-information.html",
	"css-random-numbers.html",
	"random-decisions.html",
	"changing-classes.html",

	"changing-text.html",
	"combining-text.html",
	"changing-images.html",
	"playing-audio.html",
	"editing-html.html",

	"setinterval.html",
	"settimeout.html",
	"stopping-a-loop.html",
	"multiple-elements.html",
	"random-elements1.html",
	"random-elements2.html",

	"dragging-elements.html",
	"endlesshorse.html",
	"yellow3d.html",

	"portfolio-nav.html",
	"portfolio-header.html",
	"portfolio-grid.html",
	"portfolio-footer.html",
	"portfolio-homepage.html",
]

// Generate editor
let cm;
let activeDemo = 'test-project-1.html';
function generateEditor() {
	const editor = document.querySelector('.editor-cm');
	cm = CodeMirror(editor, {
		mode: "htmlmixed",
		value: '<h1>Hello World!</h1>',
		autoCloseTags: true,
		autoCloseBrackets: true,
		matchBrackets: true,
		smartIndent: true,
		lineNumbers: true,
		tabSize: 2,
		showHint: true,
		extraKeys: {
			"Ctrl-Space": "autocomplete",
			"Ctrl-[": "indentLess",
			"Ctrl-]": "indentMore",
			'Cmd-/': 'toggleComment',
			'Ctrl-/': 'toggleComment',
		},
		lineWrapping: false,
		theme: "gdwithgd",
	});
	cm.on("change", updatePreview);

	// Initialize page with demo (load requested demo if applicable)
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));
	if (searchParams.has('demo')) {
		urlDemo = searchParams.get('demo');
		if (demos.includes(urlDemo)) {
			fetchDemo(urlDemo);
		} else {
			fetchDemo('template.html');
		}
	} else {
		fetchDemo('template.html');
	}
}
generateEditor();

// Fetch demo and populate editor
function fetchDemo(src) {
	activeDemo = src;
	const editorTitle = document.querySelector('.editor-navbar-title-file');
	editorTitle.innerText = src;
	const editorNewTab = document.querySelector('.editor-navbar-info');
	editorNewTab.href = "../demos/"+src;
	fetch("../demos/"+src)
		.then((response) => response.text())
		.then(code => {
			cm.setValue(code);
		})
}

// Update preview when changes made in editor
function updatePreview() {
	const preview = document.querySelector('.editor-iframe');
	preview.srcdoc = cm.getValue();
}

// Editor controls
let lineWrap = false;
function editorToggleWrapping() {
	lineWrap = !lineWrap;
	cm.setOption('lineWrapping', lineWrap);
}
let editorFontsize = 16;
function editorFontsizeDown() {
	const editorCM = document.querySelector('.editor-cm');
	editorFontsize -= 2;
	if (editorFontsize <= 8) {
		editorFontsize = 8;
	}
	editorCM.style.setProperty('--font-size', editorFontsize + 'px');
	cm.refresh();
}
function editorFontsizeUp() {
	const editorCM = document.querySelector('.editor-cm');
	editorFontsize += 2;
	if (editorFontsize >= 24) {
		editorFontsize = 24;
	}
	editorCM.style.setProperty('--font-size', editorFontsize + 'px');
	cm.refresh();
}
function editorReset() {
	fetchDemo(activeDemo);
}
function editorDownload() {
	let codeBlob = new Blob([ cm.getValue()], { type: 'text/html' })
	blobURL = URL.createObjectURL(codeBlob);
	let tempLink = document.createElement("a");
	tempLink.href = blobURL;
	tempLink.download = activeDemo;
	tempLink.click();
}
function editorShortcuts() {
	const shortcuts = document.querySelector('.editor-shortcuts');
	if (parseInt(shortcuts.dataset.active) == 1) {
		shortcuts.dataset.active = 0;
	} else {
		shortcuts.dataset.active = 1;
	}
}

// Navigate to prev/next demo
function prevDemo() {
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));
	let currentDemoIndex = demos.indexOf(searchParams.get('demo'));
	currentDemoIndex--;
	if (currentDemoIndex < 0) {
		currentDemoIndex = demos.length-1;
	}
	window.location.href = `?demo=${demos[currentDemoIndex]}`;
}
function nextDemo() {
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));
	let currentDemoIndex = demos.indexOf(searchParams.get('demo'));
	currentDemoIndex++;
	if (currentDemoIndex == demos.length) {
		currentDemoIndex = 0;
	}
	window.location.href = `?demo=${demos[currentDemoIndex]}`;
}