// YOUR COMMENT HERE: Overall file description - JavaScript for the music player page.

// YOUR COMMENT HERE: URGENT - EXPLAIN DOMCONTENTLOADED. This makes sure the HTML is fully loaded before the script tries to find elements. VERY IMPORTANT.
document.addEventListener('DOMContentLoaded', function() {
    // YOUR COMMENT HERE: Getting references to HTML elements using their IDs. Storing them in variables to use later. Explain why this is generally done upfront.
    var audioPlayer = document.getElementById('custom-audio-player'); 
    // YOUR COMMENT HERE: IMPORTANT - SAFETY CHECK (though removed in most 'amateur' version). Explain why checking if 'audioPlayer' exists is good practice, even if removed here for the brief.
    if (!audioPlayer) { 
        return; 
    }

    var playPauseBtn = document.getElementById('play-pause-btn');
    var playPauseImg = document.getElementById('play-pause-img');
    // ... (get other elements) ...
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

    // YOUR COMMENT HERE: URGENT - GETTING GIF ELEMENTS. Selects all images with the 'track-gif' class. Explain querySelectorAll.
    var allTrackGifs = document.querySelectorAll('.track-gif');
    var currentActiveGif = null; // YOUR COMMENT HERE: Variable to keep track of the currently fading GIF.

    // YOUR COMMENT HERE: URGENT - TRACK DATA STRUCTURE. Explain this array of objects. Each object holds info for one song. The 'src' MUST match the 'data-track-gif' in the HTML for the overlay to work.
    var albumTracks = [
        { title: "rain", src: "rain.mp3" },                       
        { title: "where am i going?", src: "where am i going.mp3" }, 
        { title: "breaking a record", src: "breaking a record.mp3" }, 
        { title: "unbonded", src: "unbonded.mp3" },                 
        { title: "thunder", src: "thunder.mp3" }                  
    ];
    
    // YOUR COMMENT HERE: Global variables to track the current song index and playback state.
    var currentTrackIndex = 0; 
    var isPlaying = false;     

    // YOUR COMMENT HERE: URGENT - MAIN FUNCTION TO LOAD/PLAY TRACKS. This is called to switch songs. It updates the audio source, title, handles hiding/showing the correct GIF, updates the tracklist highlight, and optionally starts playback. Explain the 'shouldPlayImmediately' parameter.
    function loadAndPlayTrack(trackIndex, shouldPlayImmediately) {
        currentTrackIndex = trackIndex; 
        var currentTrackData = albumTracks[trackIndex]; 
        audioPlayer.src = currentTrackData.src; 
        currentTrackTitleDisplayPlayer.textContent = currentTrackData.title; 

        audioPlayer.load(); // YOUR COMMENT HERE: IMPORTANT - Tell the browser to load the new audio file.
        
        // YOUR COMMENT HERE: Reset UI elements for the new track.
        progressBarFill.style.width = '0%'; 
        currentTimeDisplay.textContent = "0:00";
        totalDurationDisplay.textContent = "0:00"; // Placeholder

        // YOUR COMMENT HERE: URGENT - GIF MANAGEMENT LOGIC. Explain how this hides all GIFs and then finds the correct one for the new track using the 'data-track-gif' attribute matching the audio source.
        var k; 
        for (k = 0; k < allTrackGifs.length; k++) {
            allTrackGifs[k].style.opacity = 0;
        }
        currentActiveGif = document.querySelector('.track-gif[data-track-gif="' + currentTrackData.src + '"]');

        // YOUR COMMENT HERE: URGENT - TRACKLIST HIGHLIGHT LOGIC. Explain how this loop removes the 'playing' class from all items first, then adds it back only to the current track item. This is a slightly less efficient but understandable way for a beginner.
        var allTrackItemsOnLoad = document.querySelectorAll('#album-tracklist .track-item');
        for (var j = 0; j < allTrackItemsOnLoad.length; j++) {
            allTrackItemsOnLoad[j].classList.remove('playing');
        }
        if (allTrackItemsOnLoad[currentTrackIndex]) { 
            allTrackItemsOnLoad[currentTrackIndex].classList.add('playing');
        }

        // YOUR COMMENT HERE: Starts playback and updates play/pause icon if requested.
        if (shouldPlayImmediately) {
            audioPlayer.play(); // Note: No .catch() - less robust, more beginner-like.
            isPlaying = true;
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v2.png';
        } else {
            // YOUR COMMENT HERE: Ensures play icon is shown if loading without playing.
            if (!isPlaying) { 
                playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v2.png';
            }
        }
    }

    // YOUR COMMENT HERE: Event listener - runs when audio metadata (like duration) is ready. Updates the total time display.
    audioPlayer.onloadedmetadata = function() { 
        if (audioPlayer.duration) {
            totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
        }
    };

    // YOUR COMMENT HERE: Event listener for the Play/Pause button click. Toggles play state and icon. Uses 'onclick'.
    playPauseBtn.onclick = function() { 
        // ... (play/pause logic) ...
        if (isPlaying) { 
            audioPlayer.pause();
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v2.png'; 
        } else { 
            audioPlayer.play(); 
            playPauseImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v2.png'; 
        }
        isPlaying = !isPlaying; 
    };

    // YOUR COMMENT HERE: Event listener for Next button. Updates index (with looping) and loads/plays track. Uses 'onclick'.
    nextTrackBtn.onclick = function() { 
        // ... (next track logic) ...
        currentTrackIndex++; 
        if (currentTrackIndex >= albumTracks.length) { 
            currentTrackIndex = 0; 
        }
        loadAndPlayTrack(currentTrackIndex, true); 
    };

    // YOUR COMMENT HERE: Event listener for Previous button. Updates index (with looping) and loads/plays track. Uses 'onclick'.
    prevTrackBtn.onclick = function() { 
        // ... (previous track logic) ...
        currentTrackIndex--; 
        if (currentTrackIndex < 0) { 
            currentTrackIndex = albumTracks.length - 1; 
        }
        loadAndPlayTrack(currentTrackIndex, true); 
    };

    // YOUR COMMENT HERE: URGENT - TIMEUPDATE EVENT & GIF FADING. CRITICAL LISTENER. Runs repeatedly during playback. Updates progress bar/time. Contains the COMPLEX logic for calculating GIF opacity based on playback position (fade in to midpoint, fade out after). Explain the math carefully.
    audioPlayer.ontimeupdate = function() { 
        if (audioPlayer.duration && audioPlayer.duration > 0) { 
            var percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBarFill.style.width = percentage + '%';
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);

            // --- GIF Opacity Logic ---
            if (currentActiveGif) {
                var songDuration = audioPlayer.duration;
                var currentTime = audioPlayer.currentTime;
                var midPoint = songDuration / 2;
                var targetOpacity = 0;
                var maxOpacity = 0.3; // Max 30% opacity

                // YOUR COMMENT HERE: Explain fade-in calculation (first half).
                if (currentTime <= midPoint) {
                    if (midPoint > 0) { 
                        targetOpacity = (currentTime / midPoint) * maxOpacity;
                    } else {
                        targetOpacity = maxOpacity; 
                    }
                } 
                // YOUR COMMENT HERE: Explain fade-out calculation (second half).
                else {
                    var timePastMid = currentTime - midPoint;
                    var durationOfSecondHalf = songDuration - midPoint; 
                    if (durationOfSecondHalf > 0) { 
                         targetOpacity = (1 - (timePastMid / durationOfSecondHalf)) * maxOpacity;
                    } else {
                        targetOpacity = 0; 
                    }
                }
                
                // YOUR COMMENT HERE: Explain opacity clamping (making sure it stays between 0 and maxOpacity).
                if (targetOpacity < 0) { targetOpacity = 0; }
                if (targetOpacity > maxOpacity) { targetOpacity = maxOpacity; }
                
                // YOUR COMMENT HERE: Apply the calculated opacity to the current GIF.
                currentActiveGif.style.opacity = targetOpacity; 
            }
            // --- End GIF Opacity Logic ---
        }
    };
    
    // YOUR COMMENT HERE: Event listener for when the song finishes naturally. Hides GIF and plays next track. Uses 'onended'.
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

    // YOUR COMMENT HERE: URGENT - PROGRESS BAR SEEKING. Allows clicking on the progress bar to jump in the song. Explain 'getBoundingClientRect' and the calculation to find the new time based on click position. Moderately complex for a beginner. Uses 'onclick'.
    progressBarContainer.onclick = function(event) { 
        if (audioPlayer.duration) {
            var progressBarRect = progressBarContainer.getBoundingClientRect(); 
            var clickPositionInBar = event.clientX - progressBarRect.left; 
            var barWidth = progressBarContainer.clientWidth; 
            audioPlayer.currentTime = (clickPositionInBar / barWidth) * audioPlayer.duration; 
        }
    };

    // YOUR COMMENT HERE: Event listener for Mute button. Toggles mute state and icon. Uses 'onclick'.
    muteUnmuteBtn.onclick = function() { 
        // ... (mute/unmute logic) ...
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

    // YOUR COMMENT HERE: Event listener for Volume slider. Updates volume and handles mute icon logic if volume hits 0. Uses 'oninput'.
    volumeSlider.oninput = function() { 
        // ... (volume slider logic) ...
        audioPlayer.volume = this.value; 
        if (audioPlayer.volume === 0 && !audioPlayer.muted) {
            audioPlayer.muted = true; 
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/no-audio--v1.png';
        } else if (audioPlayer.volume > 0 && audioPlayer.muted && this.value > 0) {
            audioPlayer.muted = false;
            muteUnmuteImg.src = 'https://img.icons8.com/ios-glyphs/30/ffffff/high-volume--v2.png';
        }
    };

    // YOUR COMMENT HERE: Helper function to format seconds into MM:SS format. Explain the logic, especially adding the leading zero.
    function formatTime(totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    // YOUR COMMENT HERE: URGENT - DYNAMIC TRACKLIST GENERATION & ASYNC DURATION. This loop builds the tracklist HTML. Explain how it creates each 'li' element. CRITICALLY, explain the IIFE pattern used with 'tempAudio.onloadedmetadata' to correctly get each track's duration asynchronously. This concept (closures, async callbacks in loops) is VERY difficult for beginners.
    for (var i = 0; i < albumTracks.length; i++) {
        var track = albumTracks[i];
        var listItem = document.createElement('li');
        listItem.className = 'track-item'; 
        listItem.setAttribute('data-track-index', i); // YOUR COMMENT HERE: Explain data attributes - storing track index directly on the HTML element.

        var trackNumberSpan = document.createElement('span');
        trackNumberSpan.className = 'track-number';
        trackNumberSpan.textContent = (i + 1) + "."; 

        var trackTitleSpan = document.createElement('span');
        trackTitleSpan.className = 'track-title';
        trackTitleSpan.textContent = track.title;
        
        var trackDurationSpan = document.createElement('span');
        trackDurationSpan.className = 'track-duration';
        trackDurationSpan.textContent = "--:--"; // Placeholder

        // YOUR COMMENT HERE: URGENT - IIFE FOR ASYNC CALLBACK IN LOOP. Explain this structure. The outer function `(function(...) { ... })(...)` runs immediately for each loop iteration. It creates a private scope. The *current* `trackDurationSpan` and `track.src` are passed into this scope. The inner `tempAudio.onloadedmetadata` function (which runs later) uses the *correct* `currentDurationSpan` from its surrounding scope, avoiding the common bug where all callbacks would use the *last* span created by the loop.
        ;(function(currentDurationSpan, audioSrc) {
            var tempAudio = new Audio(audioSrc); // Create temporary audio just for duration
            tempAudio.onloadedmetadata = function() { // This runs when duration is known
                currentDurationSpan.textContent = formatTime(this.duration);
            };
        })(trackDurationSpan, track.src); // Immediately call the function, passing in the current span and src
        
        listItem.appendChild(trackNumberSpan);
        listItem.appendChild(trackTitleSpan);
        listItem.appendChild(trackDurationSpan);

        // YOUR COMMENT HERE: Click listener for each track item. Uses 'this' to get the clicked element and its data attribute. Calls loadAndPlayTrack. Uses 'onclick'.
        listItem.onclick = function(event) { 
            var clickedTrackIndex = parseInt(this.getAttribute('data-track-index'));
            loadAndPlayTrack(clickedTrackIndex, true); 
        };
        albumTracklistElement.appendChild(listItem); // Add the finished item to the list
    }
    
    // YOUR COMMENT HERE: Initial setup when the page loads - load the first track (without playing) and set initial volume.
    loadAndPlayTrack(currentTrackIndex, false); 
    audioPlayer.volume = volumeSlider.value; 
}); // End of DOMContentLoaded wrapper