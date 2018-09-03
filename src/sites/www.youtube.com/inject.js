//code
getEpochTime = function(){return Math.round((new Date()).getTime() / 1000)};

clientId = '472976802206187520';

getInfos = function() {
		windowName = null;
		try{windowName   	 = document.title;}catch(err){}
		videoDuration = null;
		try{videoDuration    = document.querySelector('.ytp-time-duration').textContent;}catch(err){}
        videoCurrentTime = null;
		try{videoCurrentTime = document.querySelector('.ytp-time-current').textContent;}catch(err){}
        creator = null;
		try{creator 		 = document.querySelector('.yt-simple-endpoint.style-scope.yt-formatted-string').textContent;}catch(err){}
		videoName = null;
		try{videoName 		 = document.querySelector('.title.style-scope.ytd-video-primary-info-renderer').textContent;}catch(err){}
		viewData = null;
		try{viewData 		 = document.querySelector('.view-count.style-scope.yt-view-count-renderer').textContent;}catch(err){}
		return {
			videoDuration: videoDuration,
			videoCurrentTime: videoCurrentTime,
			videoName: videoName,
			title: windowName,
			creator: creator,
			viewData: viewData
		}};

		
function toSeconds(strArr){
	strArr = strArr.reverse()
	time = parseInt(strArr[0]);
	timeStamps = [1,60,60*60,60*60*24];
	for(i = 1; i < strArr.length; i++){
		time += parseInt(strArr[i])*timeStamps[i];
	}
	return time;
};
		
tempTime = -1;
savedTimestap = -1;
		
async function injectRun(sender) {					
	infos = await getInfos();
	/*
	{
		details: details,
		state: state,
		largeImageKey: 'youtube_png',
		largeImageText: 'Youtube',
		smallImageKey,
		smallImageText,
		instance: false,
		endTimestamp: endTime
	}
	*/
	data = {largeImageKey: 'youtube_png', largeImageText: 'Youtube'}
	if (infos) {
		if (infos["videoName"] == infos['title'].replace(" - YouTube","")){
			viewData = infos['viewData'].split(" ");
			infos['live'] = viewData[1] != "views";
			infos['views'] = viewData[0];
			if (!infos['live']){
				if (infos['videoCurrentTime'] != tempTime){
					vidDur_dhms = infos['videoDuration'].split(':');
					vidCurtime_dhms = infos['videoCurrentTime'].split(':');
					tempTime = infos['videoCurrentTime']
					vidDur = toSeconds(vidDur_dhms);
					vidCurtime = toSeconds(vidCurtime_dhms);
					
					a = getEpochTime()+(vidDur - vidCurtime);
					data['endTimestamp'] = a;
					savedTimestap = a;
				}else{
					data['endTimestamp'] = savedTimestap;
				}
			}
			data['details'] = infos['videoName']
			//data['state'] = 'by: '+ infos['creator']
		}else{
			data['details'] = 'browsing'
			data['state'] = 'idle'
		}
	}
	
	sender('retrieveData', data);
};

module.exports.injectRun = injectRun;
module.exports.clientId = clientId;