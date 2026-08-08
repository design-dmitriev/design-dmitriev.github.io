
// --- Gallery Filters ---
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-row');

    if (filterBtns.length > 0 && projects.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.color = 'var(--text-muted)';
                });
                btn.classList.add('active');
                btn.style.color = 'var(--hero-accent)';

                const filter = btn.getAttribute('data-filter');

                // Filter projects
                projects.forEach(project => {
                    const category = project.getAttribute('data-category') || 'all';
                    
                    if (filter === 'all' || category === filter) {
                        // Show
                        gsap.to(project, {
                            height: 'auto',
                            autoAlpha: 1,
                            duration: 0.4,
                            ease: 'power2.out',
                            onStart: () => {
                                project.style.display = 'flex';
                            }
                        });
                    } else {
                        // Hide
                        gsap.to(project, {
                            height: 0,
                            autoAlpha: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                project.style.display = 'none';
                            }
                        });
                    }
                });
                
                // Refresh scroll trigger to account for new heights
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 450);
            });
        });
    }
});
