/**
 * Lightning Strike Background
 * Dramatic flashes and electric bolts for bold brand presence
 */

(function () {
    // START CONFIGURATION
    const config = {
        // Lightning frequency
        minTimeBetweenStrikes: 2000,  // Minimum ms between strikes
        maxTimeBetweenStrikes: 6000,  // Maximum ms between strikes

        // Flash settings
        flashIntensity: 0.15,         // Screen flash brightness (0-1)
        flashDuration: 150,           // How long flash lasts (ms)
        flashDecay: 0.92,             // How quickly flash fades

        // Lightning bolt appearance
        boltColor: '150, 200, 255',   // Light blue electric color
        boltGlow: '100, 150, 255',    // Glow color around bolt
        glowIntensity: 0.6,

        // Bolt structure
        mainBoltThickness: 3,
        branchProbability: 0.3,       // Chance of branching at each segment
        maxBranches: 2,               // Max branches per segment
        segmentLength: 15,            // Length of each bolt segment
        jaggedness: 0.6,              // How jagged the bolt is (0-1)

        // Ambient particles (electric charge in air)
        ambientParticles: true,
        particleDensity: 0.00003,
        particleColor: '180, 220, 255',
        particleGlow: true
    };
    // END CONFIGURATION

    let canvas, ctx, width, height;
    let activeStrikes = [];
    let screenFlash = 0;
    let nextStrikeTime = 0;
    let ambientParticles = [];

    /**
     * Ambient Particle (electric charge)
     */
    class AmbientParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
            this.driftX = (Math.random() - 0.5) * 0.2;
            this.driftY = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.x += this.driftX;
            this.y += this.driftY;
            this.pulseOffset += this.pulseSpeed;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            const pulse = Math.sin(this.pulseOffset) * 0.5 + 0.5;
            const alpha = this.opacity * pulse;

            if (config.particleGlow) {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 3
                );
                gradient.addColorStop(0, `rgba(${config.particleColor}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${config.particleColor}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(this.x - this.size * 3, this.y - this.size * 3, this.size * 6, this.size * 6);
            } else {
                ctx.fillStyle = `rgba(${config.particleColor}, ${alpha})`;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }
    }

    /**
     * Lightning Strike
     */
    class LightningStrike {
        constructor() {
            // Random position across top of screen
            this.startX = Math.random() * width;
            this.startY = -20;

            // Strike downward to random point
            this.endX = this.startX + (Math.random() - 0.5) * width * 0.4;
            this.endY = Math.random() * height * 0.7 + height * 0.3; // Bottom half of screen

            this.segments = [];
            this.opacity = 1;
            this.age = 0;
            this.maxAge = 200 + Math.random() * 200; // Bolt lifetime in ms
            this.generateBolt();
        }

        generateBolt() {
            // Generate main bolt path
            let currentX = this.startX;
            let currentY = this.startY;

            const dx = this.endX - this.startX;
            const dy = this.endY - this.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.floor(distance / config.segmentLength);

            const mainPath = [{ x: currentX, y: currentY }];

            for (let i = 0; i < steps; i++) {
                const progress = (i + 1) / steps;

                // Target point along straight line
                const targetX = this.startX + dx * progress;
                const targetY = this.startY + dy * progress;

                // Add jaggedness
                const offsetX = (Math.random() - 0.5) * config.segmentLength * config.jaggedness;
                const offsetY = (Math.random() - 0.5) * config.segmentLength * config.jaggedness * 0.5;

                currentX = targetX + offsetX;
                currentY = targetY + offsetY;

                mainPath.push({ x: currentX, y: currentY });
            }

            // Ensure it reaches the end point
            mainPath.push({ x: this.endX, y: this.endY });

            // Store main path
            this.segments.push({
                path: mainPath,
                thickness: config.mainBoltThickness,
                isBranch: false
            });

            // Generate branches
            this.generateBranches(mainPath);
        }

        generateBranches(mainPath) {
            // Create branches from random points along main bolt
            for (let i = 1; i < mainPath.length - 1; i++) {
                if (Math.random() < config.branchProbability) {
                    const numBranches = Math.floor(Math.random() * config.maxBranches) + 1;

                    for (let b = 0; b < numBranches; b++) {
                        const branchPath = [mainPath[i]];
                        const branchLength = Math.random() * 5 + 3;

                        let bx = mainPath[i].x;
                        let by = mainPath[i].y;

                        // Random branch direction
                        const angle = Math.random() * Math.PI * 2;

                        for (let j = 0; j < branchLength; j++) {
                            bx += Math.cos(angle) * config.segmentLength * 0.7 + (Math.random() - 0.5) * 10;
                            by += Math.sin(angle) * config.segmentLength * 0.7 + (Math.random() - 0.5) * 10;
                            branchPath.push({ x: bx, y: by });
                        }

                        this.segments.push({
                            path: branchPath,
                            thickness: config.mainBoltThickness * 0.5,
                            isBranch: true
                        });
                    }
                }
            }
        }

        update(deltaTime) {
            this.age += deltaTime;

            // Fade out quickly
            this.opacity = 1 - (this.age / this.maxAge);
            this.opacity = Math.max(0, this.opacity);

            return this.opacity > 0;
        }

        draw() {
            // Draw each segment
            this.segments.forEach(segment => {
                const path = segment.path;
                const opacity = this.opacity * (segment.isBranch ? 0.7 : 1);

                // Draw glow
                ctx.shadowBlur = 20;
                ctx.shadowColor = `rgba(${config.boltGlow}, ${config.glowIntensity * opacity})`;

                ctx.strokeStyle = `rgba(${config.boltColor}, ${opacity})`;
                ctx.lineWidth = segment.thickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.stroke();

                // Draw bright core
                ctx.shadowBlur = 0;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                ctx.lineWidth = segment.thickness * 0.3;

                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.stroke();
            });

            ctx.shadowBlur = 0;
        }
    }

    /**
     * Initialize
     */
    function init() {
        let existingCanvas = document.getElementById('star-background-canvas');
        if (existingCanvas) {
            canvas = existingCanvas;
        } else {
            canvas = document.createElement('canvas');
            canvas.id = 'star-background-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            canvas.style.pointerEvents = 'none';
            document.body.prepend(canvas);
        }

        ctx = canvas.getContext('2d');

        handleResize();
        window.addEventListener('resize', handleResize);

        scheduleNextStrike();
        animate();
    }

    /**
     * Handle resize
     */
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        if (config.ambientParticles) {
            generateAmbientParticles();
        }
    }

    /**
     * Generate ambient particles
     */
    function generateAmbientParticles() {
        const area = width * height;
        const count = Math.floor(area * config.particleDensity);

        ambientParticles = [];
        for (let i = 0; i < count; i++) {
            ambientParticles.push(new AmbientParticle());
        }
    }

    /**
     * Schedule next lightning strike
     */
    function scheduleNextStrike() {
        const delay = Math.random() * (config.maxTimeBetweenStrikes - config.minTimeBetweenStrikes) + config.minTimeBetweenStrikes;
        nextStrikeTime = Date.now() + delay;
    }

    /**
     * Trigger lightning strike
     */
    function triggerStrike() {
        activeStrikes.push(new LightningStrike());
        screenFlash = config.flashIntensity;
        scheduleNextStrike();
    }

    /**
     * Animation loop
     */
    let lastTime = Date.now();

    function animate() {
        const now = Date.now();
        const deltaTime = now - lastTime;
        lastTime = now;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw ambient particles
        if (config.ambientParticles) {
            ambientParticles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }

        // Update and draw lightning strikes
        activeStrikes = activeStrikes.filter(strike => {
            const alive = strike.update(deltaTime);
            if (alive) strike.draw();
            return alive;
        });

        // Screen flash effect
        if (screenFlash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`;
            ctx.fillRect(0, 0, width, height);
            screenFlash *= config.flashDecay;
            if (screenFlash < 0.001) screenFlash = 0;
        }

        // Check if it's time for next strike
        if (now >= nextStrikeTime) {
            triggerStrike();
        }

        requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();