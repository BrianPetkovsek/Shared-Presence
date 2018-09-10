process.chdir('src');

const {BrowserWindow, app, ipcMain} = require('electron');
const {Client} 			   = require('discord-rpc');
const widevine             = require('electron-widevinecdm');
rpc                  	   = new Client({transport: 'ipc'});

widevine.load(app);

let mainWindow,

    WindowSettings = {
        backgroundColor: '#FFF',
        useContentSize: false,
        autoHideMenuBar: true,
        resizable: true,
        center: true,
        frame: true,
        alwaysOnTop: false,
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            plugins: true
        }
    },
	
    login = (tries = 0) => {
        if (tries > 10) return mainWindow.webContents.executeJavaScript(connectionNotice);
        tries += 1;
		console.log("Login attempt: "+tries);
		rpc.login({clientId}).catch(e => setTimeout(() => login(tries), 10E3));
		console.log("Login successful");
		requestData();
    },
	
	connectionNotice = `let notice = document.createElement('div'),
						close_btn = document.createElement('span');
						notice.className = 'error-notice';
						notice.setAttribute('style', 'position: fixed; top: 0px; background: #ef5858; border-bottom: 3px solid #e61616; border-radius: 3px; z-index: 101; color: white; width: 99%; line-height: 2em; text-align: center; margin: 0.5%;');
						close_btn.className = 'close-btn';
						close_btn.innerHTML = '&times;';
						close_btn.setAttribute('style', 'float: right; margin-right: 0.5%; font-size: 20px;');
						notice.innerHTML = 'Failed to connect to Discord IRC. Connection timed out.';
						notice.appendChild(close_btn);
						document.body.appendChild(notice);
						notice.onclick = () => document.body.removeChild(notice);
						setTimeout(() => document.body.removeChild(notice), 15E3);`;
			
app.on('ready', () => {
    mainWindow = new BrowserWindow(WindowSettings);	
    //mainWindow.maximize();
	mainWindow.loadURL(`file:///${__dirname}/main.html`);
	login();
});

pastData = {};
clientId = "485341906411454465";
ipcEvent = null;
ipcMain.on('getSenderEvent', (event, arg) => {  
	if (clientId != arg) {
		clientId = arg
		rpc.destroy();
		rpc = new Client({transport: 'ipc'});
		login();
	}
	pastData = {};
	console.log('getSenderEvent');
	ipcEvent = event.sender;
});

rpc.on('ready', () => {
	console.log("ready");
	requestData();
});

rpc.on('connected', () => {
	console.log("connected");		
});

rpc.on('destroy', () => {
	console.log("destroy");	
});

function requestData(){
	if (rpc && mainWindow && rpc.isON) {
		ipcEvent.send('requestData');
		resetInterval();
	}
};

timerTime = 5E3;
timer = setInterval(() => {
			requestData();
		}, timerTime);

function resetInterval(){
	clearInterval(global.timer);
	global.timer = setInterval(() => {
				requestData();
			}, timerTime);
};

ipcMain.on('retrieveData', (event, data, filter=[]) => {  
	console.log('retrieveData');
	if (eqSet(data, pastData, filter)){
		console.log('Data is the same not sending');
	}else{
		console.log(data);
		rpc.setActivity(data);
		pastData = data
	}
});

/*
function removeAd(){
	a = document.getElementById("movie_player");
	z = document.getElementById("improved-toggle");
	if (a.getAdState() == 1 && !a.getProgressState()['allowSeeking']) {
		a.cueVideoById(a.getVideoData()['video_id']); 
		a.playVideo();
		a.setAutonav(z.active);
	}
}

b = window.setInterval(removeAd,2500);
*/
function eqSet(as,bs,filter=[]){
	if (Object.keys(as).length != Object.keys(bs).length) return false;
	for (var key in as){
		if (!filter.includes(key) && 
			(!bs.hasOwnProperty(key) || as[key] != bs[key])) return false;
	}
	return true;
}

app.on('window-all-closed', () => {
	rpc.destroy();
    app.quit();
});

//stops extra app instances from opening
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
	// Someone tried to run a second instance, we should focus our window.
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
});

if (shouldQuit) {
	app.quit();
	return;
}

//only allows one electron window open (does not count electron-navigation tabs)
var iSWindowOpen = false;
app.on('browser-window-created', function(event, window) {
	if (iSWindowOpen){
		window.loadURL('javascript:window.close();');
		console.log("Close new window");
	}else{
		iSWindowOpen = true;
		console.log("Open one window");
	}
});

