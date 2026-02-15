/**
 * Uncolonized Society - Starry Night Background
 * A subtle, animated canvas background with customizable stars.
 */

(function () {
    // START CONFIGURATION
    const config = {
        starColor: '255, 255, 255', // RGB format for easy opacity manipulation
        starDensity: 0.00015, // Stars per pixel (adjust for density)
        // Movement & Animation
        moveSpeedMultiplier: 0.2, // Adjusts the speed of stars moving
        twinkleSpeed: 0.02, // Speed of opacity fluctuation
        minOpacity: 0.1, // Minimum star opacity
        maxOpacity: 0.6, // Maximum star opacity
        minSize: 0.5, // Minimum star radius
        maxSize: 1.5 // Maximum star radius
    };
    // END CONFIGURATION

    let canvas, ctx, stars = [], width, height, animationFrameId;

    /**
     * Star Class
     */
    class Star {
        constructor() {
            this.init(true);
        }

        init(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + 10; // Start slightly off-screen if not randomY
            this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;

            // Randomize speed for parallax-like effect
            // Smaller stars move slower to simulate distance
            this.speed = (this.size / config.maxSize) * config.moveSpeedMultiplier;

            // Randomize opacity initial state
            this.opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;
            // Randomize twinkle direction and speed
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
            this.twinkleStep = Math.random() * config.twinkleSpeed;
        }

        update() {
            // Move star upwards
            this.y -= this.speed;

            // Reset if it goes off screen
            if (this.y < -10) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }

            // Twinkle
            this.opacity += this.twinkleDir * this.twinkleStep;

            // Reverse twinkle direction if limits reached
            if (this.opacity >= config.maxOpacity || this.opacity <= config.minOpacity) {
                this.twinkleDir = -this.twinkleDir;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.starColor}, ${this.opacity})`;
            ctx.fill();
        }
    }

    /**
     * Initialize the star background
     */
    function init() {
        // Create canvas if it doesn't exist, or select existing one
        // We'll create it to ensure it's there
        let existingCanvas = document.getElementById('star-background-canvas');
        if (existingCanvas) {
            canvas = existingCanvas;
        } else {
            canvas = document.createElement('canvas');
            canvas.id = 'star-background-canvas';
            // Styling is handled in CSS, but let's set basic positioning here just in case CSS fails specific load
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            canvas.style.pointerEvents = 'none'; // Click-through
            document.body.prepend(canvas); // Add to beginning of body so it's behind everything by default DOM order too
        }

        ctx = canvas.getContext('2d');

        // Initial setup
        handleResize();

        // Event listeners
        window.addEventListener('resize', handleResize);

        // Start animation loop
        animate();
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        // Re-generate stars based on new dimensions
        generateStars();
    }

    /**
     * Generate star objects
     */
    function generateStars() {
        const area = width * height;
        // Density calculation: 0.00015 stars per pixel
        const numStars = Math.floor(area * config.starDensity);

        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    /**
     * Animation Loop
     */
    function animate() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize only after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
