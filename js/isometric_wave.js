
(function () {
    const container = document.createElement('div');
    container.id = 'isometric-warp-bg';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.zIndex = '-4'; // Behind everything, including shader if needed
    container.style.background = 'black';
    container.style.overflow = 'hidden';

    // Create the vignette overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.backgroundImage = 'radial-gradient(circle at center, transparent 0%, #000 100%)';
    overlay.style.opacity = '0.8';
    overlay.style.pointerEvents = 'none';

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    container.appendChild(canvas);
    container.appendChild(overlay);
    document.body.appendChild(container);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let animationFrameId;

    // Configuration
    const color = "100, 50, 250"; // Cyber-Violet RGB
    const speed = 1.5;
    const density = 50;

    // Grid Configuration
    let gridGap = density;
    let rows, cols;

    // Mouse Interaction
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Wave Physics
    let time = 0;

    const resize = () => {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        rows = Math.ceil(height / gridGap) + 5;
        cols = Math.ceil(width / gridGap) + 5;
    };

    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
    };

    // Math Helper: Smoothstep
    const smoothMix = (a, b, t) => {
        return a + (b - a) * t;
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        mouse.x = smoothMix(mouse.x, mouse.targetX, 0.1);
        mouse.y = smoothMix(mouse.y, mouse.targetY, 0.1);

        time += 0.01 * speed;

        ctx.beginPath();

        for (let y = 0; y <= rows; y++) {
            let isFirst = true;

            for (let x = 0; x <= cols; x++) {
                const baseX = (x * gridGap) - (gridGap * 2);
                const baseY = (y * gridGap) - (gridGap * 2);

                // DISTORTION LOGIC
                const wave = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 15;

                const dx = baseX - mouse.x;
                const dy = baseY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;

                const force = Math.max(0, (maxDist - dist) / maxDist);
                const interactionY = -(force * force) * 80;

                const finalX = baseX;
                const finalY = baseY + wave + interactionY;

                if (isFirst) {
                    ctx.moveTo(finalX, finalY);
                    isFirst = false;
                } else {
                    ctx.lineTo(finalX, finalY);
                }
            }
        }

        // STYLING
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color}, 0.5)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();

        animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove); // Listen on window for broader interaction if preferred, or container
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    draw();
})();
