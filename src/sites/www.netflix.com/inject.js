//code
const moment               = require('moment');
getEpochTime = function(){return Math.round((new Date()).getTime() / 1000)};

clientId = '387083698358714368';

getInfos = function() {
        let [type, id] = window.location.pathname.split('/').slice(1, 3);
        if (type == 'browse' && type != 'watch') {
            return {
                name   : 'Browsing',
                episode: 'In the Catalogs',
                avatar : document.querySelector('img.profile-icon') && document.querySelector('img.profile-icon').getAttribute('src').split('/')[3] + '_png',
            }
        }
        if (type == 'watch' && document.querySelector(".ellipsize-text")) {
            let name = document.querySelector('.ellipsize-text'),
                span = document.querySelector('.ellipsize-text').querySelectorAll('span'),
                video = document.querySelector('.VideoContainer').getElementsByTagName('video')[0];
            return {
                name             : name.querySelector('h4') ? name.querySelector('h4').innerHTML : name.innerHTML,
                title            : span.length > 1 ? span[1].innerHTML : undefined,
                episode          : span.length ? span[0].innerHTML : undefined,
                videoDuration    : video.duration,
                videoCurrentTime : video.currentTime,
                videoPaused      : video.paused,
            }
        }
    };

		
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
	if (infos) { // if !infos don't change presence then.
        let {name, title, episode, avatar, videoDuration, videoCurrentTime, videoPaused} = infos,
            video = episode && title
                ? `${episode} - ${title}` 
                : episode,
            curr = parseInt(new Date().getTime().toString().slice(0, 10)),
            endTimestamp;
         
        if (avatar) smallImageKey = avatar;
        // if the avatar doesn't show in the Rich Presence, it means it's not supported

        smallImageText = "Idle";
        if (videoDuration && videoCurrentTime) {
            if (!videoPaused) {
                let now = moment.utc(),
                remaining = moment.duration(videoDuration - videoCurrentTime, 'seconds');
                
                smallImageText = "Playing";
                endTimestamp = now.add(remaining).unix();
            } else 
                smallImageText = "Paused";
        }
            
        // set activity less often | only update if something has changed
        if (current.avatar !== avatar || current.video !== video || current.videoPaused !== videoPaused) {
            current = {avatar, video, videoPaused};
            
            sender('retrieveData', {
                details: name,
                state: video,
                largeImageKey: 'netflix',
                largeImageText: 'Netflix',
                smallImageKey,
                smallImageText,
                instance: false,
                endTimestamp,
            });
        }
    }	
};

module.exports.injectRun = injectRun;
module.exports.clientId = clientId;