//code
clientId = '484509333166751751'

getInfos = function() {
						try{windowName   	 = document.title;}catch(err){}
						show = null;
						try{show 		 	 = document.querySelector('.text-link').textContent;}catch(err){}
						try{episode 		 = document.querySelector('.ellipsis').textContent;}catch(err){}
						return {
							show: show,
							episode: episode,
							title: windowName
						};
					};

async function injectRun(sender) {					
	infos = await getInfos();
	
	data = {largeImageKey: 'crunchyroll_logo_name', largeImageText: 'Crunchyroll'};
	
	if (infos) {
		if (infos['show']){
			if (infos['title'].indexOf(infos['show']) != -1){
				infos['episode'] = infos['episode'].replace(infos['show'],"");
				data['details'] = infos['show'];
				data['state'] = infos['episode'];
			}else{
				data['details'] = 'browsing';
				data['state'] = 'idle';
			}
		}else{
			data['details'] = 'browsing';
			data['state'] = 'idle';
		}
	}
	console.log(data);
	sender('retrieveData', data);
}

module.exports.injectRun = injectRun;
module.exports.clientId = clientId;