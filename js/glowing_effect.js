
(function () {
    const cards = document.querySelectorAll('.card, .case-study-card');

    if (!cards.length) return;

    // Add glowing effect structure to each card
    cards.forEach(card => {
        // Ensure relative positioning
        const style = window.getComputedStyle(card);
        if (style.position === 'static') {
            card.style.position = 'relative';
        }

        // Add glow container
        const glowContainer = document.createElement('div');
        glowContainer.classList.add('glowing-effect-container');
        glowContainer.innerHTML = '<div class="glowing-effect-glow"></div>';
        card.prepend(glowContainer); // Add as first child
    });

    const handleMove = (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if mouse is within proximity
            const proximity = 100; // Adjust as needed
            const isActive =
                x > -proximity &&
                x < rect.width + proximity &&
                y > -proximity &&
                y < rect.height + proximity;

            if (isActive) {
                card.style.setProperty('--active', '1');

                // Calculate angle
                const center = { x: rect.width / 2, y: rect.height / 2 };
                const angle = (Math.atan2(y - center.y, x - center.x) * 180 / Math.PI) + 90;
                card.style.setProperty('--start', angle);
            } else {
                card.style.setProperty('--active', '0');
            }
        });
    };

    window.addEventListener('mousemove', handleMove);
})();
