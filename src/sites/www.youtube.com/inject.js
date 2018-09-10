//code
getEpochTime = function(){return Math.round((new Date()).getTime() / 1000)};

clientId = '472976802206187520';


hasSeeked = false;
getInfos = function() {
		windowName = null;
		try{windowName = document.title;}catch(err){}
		player = null;
		try{player = document.getElementById("movie_player");}catch(err){}
		videoDuration = player.getDuration();
		videoCurrentTime = player.getCurrentTime();
		videoData = player.getVideoData();
		creator = videoData['author'];
		videoName = videoData['title'];
		isLive = videoData['isLive'];
		playerVideo = player.getElementsByTagName('video')[0]
		videoPaused = playerVideo.paused;
		playerVideo.onseeking = function(){
			global.hasSeeked = true;
		};
		return {
			videoDuration: videoDuration,
			videoCurrentTime: videoCurrentTime,
			videoName: videoName,
			windowName: windowName,
			creator: creator,
			isLive: isLive,
			videoPaused: videoPaused
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
		endTimestamp: endTime
	}
	*/
	rpcData = {largeImageKey: 'youtube_png', largeImageText: 'Youtube'}
	console.log(infos);
	if (infos) {
		let {isLive, creator, videoName, videoDuration, videoCurrentTime, videoPaused} = infos;
		if (videoDuration && videoCurrentTime) {
			if (!isLive){
				if (!videoPaused){
					vidDur = videoDuration;
					vidCurtime = videoCurrentTime;
					
					a = getEpochTime()+(vidDur - vidCurtime);
					rpcData.endTimestamp = a;
					rpcData.state = 'By: '+ creator;
				}else{
					videoName += ' By: '+ creator;
					rpcData.state = 'paused';
				}
			}else{
				videoName = "LIVE - " + videoName;
				if (!videoPaused){
					rpcData.state = 'By: '+ creator;
				}else{
					videoName += ' By: '+ creator;
					rpcData.state = 'paused';
				}
			}
			rpcData.details = videoName;
			
		}else{
			rpcData.details = 'browsing';
			rpcData.state = 'idle';
		}
	}
	
	if (global.hasSeeked){
		//update with endTimestamp has seeked
		global.hasSeeked = false;
		sender('retrieveData', rpcData);
	}else{
		//ignore endTimestamp has not seeked
		sender('retrieveData', rpcData, ['endTimestamp']);
	}
};

module.exports.injectRun = injectRun;
module.exports.clientId = clientId;