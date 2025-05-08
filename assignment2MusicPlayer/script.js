// Javascript for the functionality of the audio playing, buttons, overlays, volume slider. This was developed through research, youtube tutorials and discussions with Google's Gemini AI model. I'm very happy with how it turned out.

// DOMContentLoaded makes sure all scripts only load after the html.
document.addEventListener('DOMContentLoaded', function() {

    // Storing all the variables at the top so they can be used through the script.
   
    var audioPlayer = document.getElementById('custom-audio-player'); 
    

    var playPauseBtn = document.getElementById('play-pause-btn');
    var playPauseImg = document.getElementById('play-pause-img');
  
    var prevTrackBtn = document.getElementById('prev-track-btn');
    var nextTrackBtn = document.getElementById('next-track-btn');
    var progressBarFill = document.getElementById('progress-bar-fill');
    var progressBarContainer = document.getElementById('progress-bar-container');
    var volumeSlider = document.getElementById('volume-slider');
    var muteUnmuteBtn = document.getElementById('mute-unmute-btn');
    var muteUnmuteImg = document.getElementById('mute-unmute-img');
    var currentTrackTitleDisplayPlayer = document.getElementById('current-track-title-player');
    var albumTracklistElement = document.getElementById('album-tracklist');
    var currentTimeDisplay = document.getElementById('current-time');
    var totalDurationDisplay = document.getElementById('total-duration');

    // using querySelectorAll to get all the gifs
    var allTrackGifs = document.querySelectorAll('.track-gif');
    // This variable keeps track of whatever gif is currently fading, even if its at 0% opacity
    var currentActiveGif = null; 

    // this array holds the info for each song as an individual object.
    var albumTracks = [
        { title: "rain", src: "rain.mp3", duration: "1:15" },                       
        { title: "where am i going?", src: "where am i going.mp3", duration: "3:14" }, 
        { title: "breaking a record", src: "breaking a record.mp3", duration: "4:39" }, 
        { title: "unbonded", src: "unbonded.mp3", duration: "1:12" },                 
        { title: "thunder", src: "thunder.mp3", duration: "20:33" }                  
    ];
    
    //  variables to track which song is playing
    var currentTrackIndex = 0; 
    var isPlaying = false;     

    //this is the main function to load and play each track. it changes the audio source, title, handles the GIFs, updates the tracklist highlight, and controls the play/pause button.
    function loadAndPlayTrack(trackIndex, shouldPlayImmediately) {
        currentTrackIndex = trackIndex; 
        var currentTrackData = albumTracks[trackIndex]; 
        audioPlayer.src = currentTrackData.src; 
        currentTrackTitleDisplayPlayer.textContent = currentTrackData.title; 

        audioPlayer.load(); 
        
        // resetting UI elements when a new track is selected.
        progressBarFill.style.width = '0%'; 
        currentTimeDisplay.textContent = "0:00";
        // Set player duration display using the hardcoded value initially
        // It will be updated more accurately when metadata loads
        totalDurationDisplay.textContent = currentTrackData.duration || "0:00"; 

        // Hides gifs by default and then finds whichever one should play based on the data-track-gif attribute.
        var k; 
        for (k = 0; k < allTrackGifs.length; k++) {
            allTrackGifs[k].style.opacity = 0;
        }
        currentActiveGif = document.querySelector('.track-gif[data-track-gif="' + currentTrackData.src + '"]');

        //Highlights the currently playing track.
        var allTrackItemsOnLoad = document.querySelectorAll('#album-tracklist .track-item');
        for (var j = 0; j < allTrackItemsOnLoad.length; j++) {
            allTrackItemsOnLoad[j].classList.remove('playing');
        }
        if (allTrackItemsOnLoad[currentTrackIndex]) { 
            allTrackItemsOnLoad[currentTrackIndex].classList.add('playing');
        }

        // shouldPlayImmediately is used to make sure the site doesnt play audio when it loads up, but if the user clicks on a track or skips between them the audio plays without them having to click the play button.
        if (shouldPlayImmediately) {
            audioPlayer.play(); 
            isPlaying = true;
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v2.png';
        } else {

            if (!isPlaying) { 
                playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v2.png';
            }
        }
    }

    // Event listener that updates audio player duration display when metadata loads
    audioPlayer.onloadedmetadata = function() { 
        if (audioPlayer.duration) {
            totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
        }
    };

  // play/pause button control. Changes icon based on if a song is playing or not
    playPauseBtn.onclick = function() { 

        if (isPlaying) { 
            audioPlayer.pause();
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v2.png'; 
        } else { 
            audioPlayer.play(); 
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v2.png'; 
        }
        isPlaying = !isPlaying; 
    };

    // Next track button control
    nextTrackBtn.onclick = function() { 

        currentTrackIndex++; 
        if (currentTrackIndex >= albumTracks.length) { 
            currentTrackIndex = 0; 
        }
        loadAndPlayTrack(currentTrackIndex, true); 
    };

    // previous track button control
    prevTrackBtn.onclick = function() { 

        currentTrackIndex--; 
        if (currentTrackIndex < 0) { 
            currentTrackIndex = albumTracks.length - 1; 
        }
        loadAndPlayTrack(currentTrackIndex, true); 
    };

    // controlling both the time update on the media player box and the gif fading. runs repeatedly during playback. calculates gif opacity based on how far through the track is (0% at start and end, 30% at midpoint.) 
    audioPlayer.ontimeupdate = function() { 

        if (audioPlayer.duration && audioPlayer.duration > 0) { 
            var percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBarFill.style.width = percentage + '%';
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);

            // --- gif opacity ---
            if (currentActiveGif) {
                var songDuration = audioPlayer.duration;
                var currentTime = audioPlayer.currentTime;
                var midPoint = songDuration / 2;
                var targetOpacity = 0;
                var maxOpacity = 0.3; // maximum 30% opacity

                // raises opacity through the first half of the track
                if (currentTime <= midPoint) {
                    if (midPoint > 0) { 
                        targetOpacity = (currentTime / midPoint) * maxOpacity;
                    } else {
                        targetOpacity = maxOpacity; 
                    }
                } 
                //lowers opacity through the second half of the track
                else {
                    var timePastMid = currentTime - midPoint;
                    var durationOfSecondHalf = songDuration - midPoint; 
                    if (durationOfSecondHalf > 0) { 
                         targetOpacity = (1 - (timePastMid / durationOfSecondHalf)) * maxOpacity;
                    } else {
                        targetOpacity = 0; 
                    }
                }
                
                // this ensures the opacity stays between the set numbers
                if (targetOpacity < 0) { targetOpacity = 0; }
                if (targetOpacity > maxOpacity) { targetOpacity = maxOpacity; }
                
                // applies calculated opacity to gif.
                currentActiveGif.style.opacity = targetOpacity; 
            }

        }
    };
    
    // event listener for track ending to enable smooth playWback between songs.
    audioPlayer.onended = function() { 

        if (currentActiveGif) { 
            currentActiveGif.style.opacity = 0;
        }
        currentTrackIndex++;
        if (currentTrackIndex >= albumTracks.length) {
            currentTrackIndex = 0;
        }
        loadAndPlayTrack(currentTrackIndex, true);
    };

    // Progress bar clickthrough function. Had to research how to do this one. Calculates position in song based on how far through the progress bar the user clicks.
    progressBarContainer.onclick = function(event) { 

        if (audioPlayer.duration) {
            var progressBarRect = progressBarContainer.getBoundingClientRect(); 
            var clickPositionInBar = event.clientX - progressBarRect.left; 
            var barWidth = progressBarContainer.clientWidth; 
            audioPlayer.currentTime = (clickPositionInBar / barWidth) * audioPlayer.duration; 
        }
    };

    // Mute button control
    muteUnmuteBtn.onclick = function() { 

        audioPlayer.muted = !audioPlayer.muted; 
        if (audioPlayer.muted) {
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/no-audio--v1.png'; 
        } else {
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/high-volume--v2.png'; 
            if (audioPlayer.volume === 0) { 
                audioPlayer.volume = 0.5; 
                volumeSlider.value = 0.5;
            }
        }
    };

    // Volume slider control. Updates volume and handles mute icon logic if slid completely to the left.
    volumeSlider.oninput = function() { 

        audioPlayer.volume = this.value; 
        if (audioPlayer.volume === 0 && !audioPlayer.muted) {
            audioPlayer.muted = true; 
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/no-audio--v1.png';
        } else if (audioPlayer.volume > 0 && audioPlayer.muted && this.value > 0) {
            audioPlayer.muted = false;
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/high-volume--v2.png';
        }
    };

    // formating seconds into traditional digital clock format.
    function formatTime(totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    // --- MODIFIED SECTION ---
    // This loop builds the tracklist HTML. Durations are now read directly
    // from the albumTracks array, removing the need for async fetching.
    for (var i = 0; i < albumTracks.length; i++) {
        var track = albumTracks[i]; // fetches current track object which has gif, audio, and duration
        var listItem = document.createElement('li');
        listItem.className = 'track-item'; 
        // the track index is stored directly in the html, so this grabs it from there
        listItem.setAttribute('data-track-index', i); 

        var trackNumberSpan = document.createElement('span');
        trackNumberSpan.className = 'track-number';
        trackNumberSpan.textContent = (i + 1) + "."; 

        var trackTitleSpan = document.createElement('span');
        trackTitleSpan.className = 'track-title';
        trackTitleSpan.textContent = track.title;
        
        var trackDurationSpan = document.createElement('span');
        trackDurationSpan.className = 'track-duration';
        trackDurationSpan.textContent = track.duration || "--:--"; // Use hardcoded duration or this placeholder as a fallback

     
        
        listItem.appendChild(trackNumberSpan);
        listItem.appendChild(trackTitleSpan);
        listItem.appendChild(trackDurationSpan);

        // click listener for each track.
        listItem.onclick = function(event) { 
            var clickedTrackIndex = parseInt(this.getAttribute('data-track-index'));
            loadAndPlayTrack(clickedTrackIndex, true); 
        };
        albumTracklistElement.appendChild(listItem); 
    }

    
    // loads first track without playing it, sets default volume.
    loadAndPlayTrack(currentTrackIndex, false); 
    audioPlayer.volume = volumeSlider.value; 
})