
// ============================================
// 12. 3D Tilt Effect for Cards
// ============================================
(function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation
            // Center of card is (rect.width/2, rect.height/2)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Add a subtle shine/glow effect based on mouse position
            // We can use a radial gradient on the existing ::before or a new element
            // card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.05) 0%, rgba(22, 27, 34, 0.4) 100%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            // card.style.background = 'rgba(22, 27, 34, 0.4)';
        });
    });
})();

// ============================================
// 13. Profile Photo Parallax
// ============================================
(function () {
    const photoContainer = document.querySelector('.profile-photo-container');
    const photo = document.querySelector('.profile-photo');
    const glow = document.querySelector('.photo-glow');

    if (!photoContainer || !photo) return;

    // Make the container larger to allow movement
    // photoContainer.style.transformStyle = "preserve-3d";

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;

        photo.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
        if (glow) glow.style.transform = `translate(${-x}px, ${-y}px) rotate(${Date.now() / 50}deg)`;
    });
})();
