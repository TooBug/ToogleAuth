var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 300,
		height: 500,
		'use-content-size':true,
		resizable:false,
		//icon: __dirname + '/images/logo_window.png'
	});
	mainWindow.loadUrl('file://' + __dirname + '/main.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	// 开发环境打开调试工具
	if(!/app$/.test(__dirname)){
		mainWindow.openDevTools();
	}
});
