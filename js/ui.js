let immersiveMode = false;
let wakeLock = null;

function toggleImmersiveMode() {
    immersiveMode = !immersiveMode;
    document.body.classList.toggle('immersive-on', immersiveMode);

    const bg = document.getElementById('immersiveBg');
    const art = document.getElementById('trackArt');

    if (immersiveMode && bg && art && art.src) {
        bg.style.backgroundImage = `url(${art.src})`;
    }

    updateImmersivePlaybackState();
}

function updateImmersiveBackground(imageUrl) {
    const bg = document.getElementById('immersiveBg');
    if (bg && imageUrl) {
        bg.style.backgroundImage = `url(${imageUrl})`;
    }
}

function updateImmersivePlaybackState() {
    const art = document.getElementById('trackArt');
    if (!art || !player || typeof player.getPlayerState !== 'function') return;

    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        art.classList.remove('paused');
    } else {
        art.classList.add('paused');
    }
}

function toggleRecommendedAccordion() {
    const body = document.getElementById('recommendedAccordionBody');
    const btn = document.getElementById('btnAccordion');

    if (!body || !btn) return;

    if (body.style.display === 'none') {
        body.style.display = 'block';
        btn.textContent = 'Recommended Content ▾';
    } else {
        body.style.display = 'none';
        btn.textContent = 'Recommended Content ▸';
    }
}

async function requestWakeLock() {
    if (!('wakeLock' in navigator)) {
        console.warn('Wake Lock API not supported on this browser.');
        return;
    }
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Wake lock released.');
        });
    } catch (err) {
        console.warn('Wake lock failed:', err.name, err.message);
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;
    }
}

function enableScreenOffMode() {
    requestWakeLock();
    const overlay = document.getElementById('screenOffOverlay');
    overlay.style.display = 'flex';
}

function disableScreenOffMode() {
    const overlay = document.getElementById('screenOffOverlay');
    overlay.style.display = 'none';
    releaseWakeLock();
}

document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});
