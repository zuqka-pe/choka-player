let player;
let progressTimer = null;
let isScrubbing = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '200',
        videoId: '',
        playerVars: {
            autoplay: 0,
            controls: 0,
            mute: 0
        },
        events: {
            onStateChange: function (event) {
                updateImmersivePlaybackState();

                const btn = document.getElementById('pauseResumeBtn');

                if (event.data === YT.PlayerState.PLAYING) {
                    startProgressTimer();
                    if (btn) btn.textContent = '⏸ Pause';

                    const status = document.getElementById('queueStatus');
                    if (status) status.textContent = '';
                } else if (event.data === YT.PlayerState.PAUSED) {
                    stopProgressTimer();
                    if (btn) btn.textContent = '▶ Resume';
                } else if (event.data === YT.PlayerState.ENDED) {
                    stopProgressTimer();
                    if (btn) btn.textContent = '▶ Resume';

                    const status = document.getElementById('queueStatus');
                    if (status) status.textContent = 'Track ended. Choose another recommended item to play.';
                } else {
                    stopProgressTimer();
                }
            }
        }
    });
}

function loadAndPlay(videoId) {
    if (!player || typeof player.loadVideoById !== 'function') {
        alert('Player is still loading. Try again in a second.');
        return;
    }

    resetScrubber();

    const btn = document.getElementById('pauseResumeBtn');
    if (btn) btn.textContent = '⏸ Pause';

    const status = document.getElementById('queueStatus');
    if (status) status.textContent = '';

    player.loadVideoById(videoId);
    player.unMute();
    player.playVideo();

    startProgressTimer();
    setTimeout(updateImmersivePlaybackState, 300);
}

function togglePauseResume() {
    if (!player || typeof player.getPlayerState !== 'function') return;

    const state = player.getPlayerState();
    const btn = document.getElementById('pauseResumeBtn');

    if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        stopProgressTimer();
        if (btn) btn.textContent = '▶ Resume';
    } else {
        player.playVideo();
        startProgressTimer();
        if (btn) btn.textContent = '⏸ Pause';
    }

    setTimeout(updateImmersivePlaybackState, 150);
}

function startProgressTimer() {
    stopProgressTimer();
    progressTimer = setInterval(updateScrubber, 500);
}

function stopProgressTimer() {
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
}

function updateScrubber() {
    if (!player || isScrubbing) return;

    const current = player.getCurrentTime ? player.getCurrentTime() : 0;
    const duration = player.getDuration ? player.getDuration() : 0;

    if (duration > 0) {
        const percent = (current / duration) * 100;
        document.getElementById('scrubber').value = percent;
        document.getElementById('currentTime').textContent = formatTime(current);
        document.getElementById('duration').textContent = formatTime(duration);
    }
}

function resetScrubber() {
    document.getElementById('scrubber').value = 0;
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
}
