//code
clientId = '485341906411454465'

async function injectRun(sender) {						
	data = {largeImageKey: 'crunchyroll_logo_name', largeImageText: 'Crunchyroll'};
	console.log(data);
	sender('retrieveData', data);
}

module.exports.injectRun = injectRun;
module.exports.clientId = clientId;