document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('video-grid');
    const overlay = document.getElementById('video-overlay');
    const overlayVideo = document.getElementById('overlay-video');
    const closeBtn = document.getElementById('close-overlay');

    const TOTAL_VIDEOS = 14;
    const VIDEO_PATH = 'vidsss/';

    // Function to create video tile
    function createVideoTile(index) {
        const tile = document.createElement('div');
        tile.className = 'video-tile';

        const video = document.createElement('video');
        video.src = `${VIDEO_PATH}${index}.mp4`;
        video.muted = true;
        video.loop = true;
        video.playsInline = true; // Important for mobile
        video.autoplay = true; // Autoplay grid videos
        // Note: Autoplay might be blocked by browsers if not interacting, but muted usually works.

        // Error handling for missing videos
        video.onerror = () => {
            console.error(`Video ${index}.mp4 not found.`);
            tile.style.backgroundColor = '#222'; // Fallback
            tile.innerHTML = '<span style="color:#555; display:flex; justify-content:center; align-items:center; height:100%;">Video not found</span>';
        };

        tile.appendChild(video);

        // Click event to open overlay
        tile.addEventListener('click', () => {
            openOverlay(`${VIDEO_PATH}${index}.mp4`);
        });

        return tile;
    }

    // Generate grid
    for (let i = 1; i <= TOTAL_VIDEOS; i++) {
        gridContainer.appendChild(createVideoTile(i));
    }

    // Open Overlay
    function openOverlay(src) {
        overlay.classList.remove('hidden');
        // Force reflow/paint specific class addition for transition if needed, 
        // but removing hidden then adding active works best with a small delay or just standard class swap.
        // Let's just use 'active' class for the opacity transition and remove 'hidden'.
        // Actually, in CSS I used .overlay.active.

        // Wait a tick to allow display:flex to apply before opacity transition
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        overlayVideo.src = src;
        overlayVideo.muted = false; // Enable sound in overlay
        overlayVideo.play().catch(e => console.log("Overlay play prevented:", e));
    }

    // Close Overlay
    function closeOverlay() {
        overlay.classList.remove('active');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlayVideo.pause();
            overlayVideo.src = ""; // Reset src to stop buffering/playing
        }, 300); // Match CSS transition speed
    }

    // Event Listeners for closing
    closeBtn.addEventListener('click', closeOverlay);

    // Close on click outside video (optional but good UX)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            closeOverlay();
        }
    });
});
