
// --- Header Button Visibility Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const headerBtn = document.querySelector('.header-contact-btn');
    const heroBtn = document.querySelector('.initial-contact-btn');

    if (headerBtn && heroBtn) {
        // Create an Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero button is visible (intersecting), hide header button
                // If hero button is NOT visible, show header button
                if (entry.isIntersecting) {
                    headerBtn.classList.remove('visible');
                } else {
                    headerBtn.classList.add('visible');
                }
            });
        }, {
            // Trigger when even 1 pixel of the hero button goes in/out of view
            threshold: 0,
            rootMargin: "-50px 0px 0px 0px" // Slight offset so it triggers nicely
        });

        observer.observe(heroBtn);
    }
});
