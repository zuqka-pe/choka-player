let recommendedQueue = [];
let playHistory = [];
let currentTrack = null;

function loadRecommendedContent(title, currentVideoId) {
    const wrap = document.getElementById('recommendedContentWrap');
    const body = document.getElementById('recommendedAccordionBody');
    const box = document.getElementById('recommendedContent');
    const status = document.getElementById('queueStatus');
    const btn = document.getElementById('btnAccordion');

    wrap.style.display = 'block';
    body.style.display = 'block';

    if (btn) btn.textContent = 'Recommended Content ▾';

    status.textContent = '';
    box.innerHTML = '<div style="color:#aaa;">Loading recommended content...</div>';

    fetch('?ajax=search&q=' + encodeURIComponent(title))
        .then(response => response.json())
        .then(results => {
            if (results.error) {
                box.innerHTML = '<div style="color:#ff7777;">Could not load recommendations.</div>';
                return;
            }

            recommendedQueue = results
                .filter(item => item.videoId !== currentVideoId)
                .slice(0, 8);

            renderRecommendedQueue();
        })
        .catch(error => {
            console.error(error);
            box.innerHTML = '<div style="color:#ff7777;">Could not load recommendations.</div>';
        });
}

function renderRecommendedQueue() {
    const wrap = document.getElementById('recommendedContentWrap');
    const box = document.getElementById('recommendedContent');

    wrap.style.display = 'block';
    box.innerHTML = '';

    if (!recommendedQueue.length) {
        box.innerHTML = '<div style="color:#aaa;">No recommended content queued.</div>';
        updateNavControls();
        return;
    }

    recommendedQueue.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'recommended-item';

        item.innerHTML = `
            <img src="${escapeHtml(video.thumbnail)}" alt="">
            <div class="recommended-title">
                <div>${escapeHtml(video.title)}</div>
                <div class="recommended-date">Posted: ${formatDate(video.publishedAt)}</div>
            </div>
            <div class="queue-controls">
                <button type="button" class="queue-btn" onclick="playRecommendedNow(${index})">Play</button>
                <button type="button" class="queue-btn" onclick="moveRecommended(${index}, -1)">↑</button>
                <button type="button" class="queue-btn" onclick="moveRecommended(${index}, 1)">↓</button>
                <button type="button" class="queue-btn" onclick="removeRecommended(${index})">✕</button>
            </div>
        `;

        box.appendChild(item);
    });

    updateNavControls();
}

function playRecommendedNow(index) {
    const video = recommendedQueue.splice(index, 1)[0];
    if (!video) return;

    renderRecommendedQueue();
    setNowPlaying(video);
    loadAndPlay(video.videoId);
}

function removeRecommended(index) {
    recommendedQueue.splice(index, 1);
    renderRecommendedQueue();
    updateNavControls();
}

function moveRecommended(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= recommendedQueue.length) return;

    const temp = recommendedQueue[index];
    recommendedQueue[index] = recommendedQueue[newIndex];
    recommendedQueue[newIndex] = temp;

    renderRecommendedQueue();
}

function setNowPlaying(video, addToHistory = true) {
    if (addToHistory && currentTrack && currentTrack.videoId !== video.videoId) {
        playHistory.push(currentTrack);
    }

    currentTrack = video;

    document.getElementById('trackArt').src = video.thumbnail || '';
    updateImmersiveBackground(video.thumbnail);

    document.getElementById('trackTitle').textContent = 'Title: ' + (video.title || 'Unknown Title');
    document.getElementById('trackInfo').style.display = 'flex';
    document.getElementById('video_id').value = video.videoId || '';

    updateNavControls();
    updateImmersivePlaybackState();
}

function updateNavControls() {
    const nav = document.getElementById('navControls');
    if (!nav) return;

    if (recommendedQueue.length > 0 || playHistory.length > 0) {
        nav.style.display = 'block';
    } else {
        nav.style.display = 'none';
    }
}

function playNextRecommendedManual() {
    if (!recommendedQueue.length) {
        const status = document.getElementById('queueStatus');
        if (status) status.textContent = 'No next recommended song available.';
        return;
    }

    const nextVideo = recommendedQueue.shift();
    renderRecommendedQueue();
    setNowPlaying(nextVideo, true);
    loadAndPlay(nextVideo.videoId);
}

function playPreviousTrack() {
    if (!playHistory.length) {
        const status = document.getElementById('queueStatus');
        if (status) status.textContent = 'No previous song available.';
        return;
    }

    const previousVideo = playHistory.pop();
    setNowPlaying(previousVideo, false);
    loadAndPlay(previousVideo.videoId);
    updateNavControls();
}
