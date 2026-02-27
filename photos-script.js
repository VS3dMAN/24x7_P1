document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('masonry-grid');
    const loader = document.getElementById('loader');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-btn');

    const IMAGE_PATH = 'images/';
    const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    const MAX_IMAGES = 100; // Upper bound for sequential scanning

    let imagesLoaded = 0;
    let totalFound = 0;

    /**
     * Try to load an image at the given path.
     * Returns a promise that resolves to true if the image exists, false otherwise.
     */
    function probeImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    /**
     * Discover images by trying sequential numbers (1, 2, 3, ...)
     * across all supported extensions.
     */
    async function discoverImages() {
        const foundImages = [];

        for (let i = 1; i <= MAX_IMAGES; i++) {
            let found = false;

            for (const ext of EXTENSIONS) {
                const src = `${IMAGE_PATH}${i}.${ext}`;
                const exists = await probeImage(src);
                if (exists) {
                    foundImages.push(src);
                    found = true;
                    break; // Found this number, move to next
                }
            }

            // If no extension matched for this number, stop scanning
            if (!found) {
                break;
            }
        }

        return foundImages;
    }

    /**
     * Create a masonry grid item for a given image source.
     */
    function createMasonryItem(src, index) {
        const item = document.createElement('div');
        item.className = 'masonry-item';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery image ${index + 1}`;
        img.loading = 'lazy';
        img.draggable = false;

        img.addEventListener('load', () => {
            imagesLoaded++;
            if (imagesLoaded >= totalFound) {
                loader.classList.add('hidden');
            }
        });

        img.addEventListener('error', () => {
            // Hide broken items
            item.style.display = 'none';
            imagesLoaded++;
            if (imagesLoaded >= totalFound) {
                loader.classList.add('hidden');
            }
        });

        // Click to open lightbox
        item.addEventListener('click', () => {
            openLightbox(src);
        });

        item.appendChild(img);
        return item;
    }

    /**
     * Open the lightbox with the given image source.
     */
    function openLightbox(src) {
        lightboxImg.src = src;
        lightboxImg.alt = 'Enlarged gallery image';

        // Show lightbox with transition
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });

        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    /**
     * Close the lightbox.
     */
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Clear image after transition
        setTimeout(() => {
            lightboxImg.src = '';
        }, 350);
    }

    // ===== Event Listeners =====

    // Close lightbox on button click
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    // Close lightbox on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ===== Initialize Gallery =====

    async function init() {
        const images = await discoverImages();
        totalFound = images.length;

        if (totalFound === 0) {
            loader.textContent = 'No images found. Add numbered images (1.jpg, 2.jpg, ...) to the images/ folder.';
            return;
        }

        images.forEach((src, index) => {
            grid.appendChild(createMasonryItem(src, index));
        });
    }

    init();
});
