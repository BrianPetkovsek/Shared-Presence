const {ipcRenderer} = require('electron');
const {injectRun, clientId} = require("./sites/" + window.location.hostname + "/inject.js");

ipcRenderer.on('requestData', (event, arg) => {  
    console.log('requestData');
	console.log(clientId);
	injectRun(ipcRenderer.send);
});
console.log("./sites/" + window.location.hostname + "/inject.js");
ipcRenderer.send('getSenderEvent',clientId);