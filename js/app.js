// Inicialización de Listeners e interacciones del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Formularios
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchYouTube();
    });

    document.getElementById('audioForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const videoId = document.getElementById('video_id').value.trim();

        if (!videoId) {
            alert('Please enter a YouTube video ID.');
            return;
        }

        loadMetadata(videoId);
        loadAndPlay(videoId);
    });

    // Botones UI
    document.getElementById('btnScreenOff').addEventListener('click', enableScreenOffMode);
    document.getElementById('btnImmersive').addEventListener('click', toggleImmersiveMode);
    document.getElementById('pauseResumeBtn').addEventListener('click', togglePauseResume);
    document.getElementById('btnPrevTrack').addEventListener('click', playPreviousTrack);
    document.getElementById('btnNextTrack').addEventListener('click', playNextRecommendedManual);
    document.getElementById('btnAccordion').addEventListener('click', toggleRecommendedAccordion);
    document.getElementById('screenOffOverlay').addEventListener('click', disableScreenOffMode);

    // Scrubber
    const scrubber = document.getElementById('scrubber');
    scrubber.addEventListener('input', function() {
        isScrubbing = true;
        const duration = player && player.getDuration ? player.getDuration() : 0;
        const seekTo = duration * (this.value / 100);
        document.getElementById('currentTime').textContent = formatTime(seekTo);
    });

    scrubber.addEventListener('change', function() {
        const duration = player && player.getDuration ? player.getDuration() : 0;
        const seekTo = duration * (this.value / 100);

        if (player && duration > 0) {
            player.seekTo(seekTo, true);
        }
        isScrubbing = false;
    });
});

// Búsqueda AJAX
function searchYouTube() {
    const query = document.getElementById('searchBox').value.trim();
    const container = document.getElementById('searchResults');

    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    container.innerHTML = '<div style="color:#aaa; text-align:center;">Searching...</div>';

    fetch('?ajax=search&q=' + encodeURIComponent(query))
        .then(response => response.json())
        .then(results => {
            container.innerHTML = '';

            if (results.error) {
                container.innerHTML = '<div style="color:#ff7777;">' + escapeHtml(results.error) + '</div>';
                return;
            }

            if (!results.length) {
                container.innerHTML = '<div style="color:#aaa;">No results found.</div>';
                return;
            }

            results.forEach(video => {
                const item = document.createElement('div');
                item.className = 'search-result';
                item.innerHTML = `
                    <img src="${escapeHtml(video.thumbnail)}" alt="">
                    <div>
                        <div class="search-result-title">${escapeHtml(video.title)}</div>
                        <div class="search-result-date">Posted: ${formatDate(video.publishedAt)}</div>
                    </div>
                `;

                item.addEventListener('click', function() {
                    playSelectedVideo(video);
                });

                container.appendChild(item);
            });
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<div style="color:#ff7777;">Search failed.</div>';
        });
}

function playSelectedVideo(video) {
    document.getElementById('video_id').value = video.videoId;
    document.getElementById('searchResults').innerHTML = '';

    setNowPlaying(video);
    loadAndPlay(video.videoId);
    loadRecommendedContent(video.title, video.videoId);
}

function loadMetadata(videoId) {
    fetch('?ajax=metadata&video_id=' + encodeURIComponent(videoId))
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.warn(data.error);
                return;
            }

            setNowPlaying({
                videoId: videoId,
                title: data.title,
                thumbnail: data.thumbnail
            });
        })
        .catch(error => {
            console.error('Metadata error:', error);
        });
}

// Utilidades generales
function formatTime(seconds) {
    seconds = Math.floor(seconds || 0);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
