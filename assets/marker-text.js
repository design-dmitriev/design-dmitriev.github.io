// Marker Text drawing cadence adapted from Kokonut UI (MIT).
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio < 0.6) continue;
      const marker = entry.target;
      const width = marker.querySelector('svg').getBoundingClientRect().width;
      const duration = Math.min(820, Math.max(260, width / 0.9));
      marker.style.setProperty('--marker-duration', duration + 'ms');
      marker.classList.add('is-drawing');
      observer.unobserve(marker);
    }
  }, { threshold: 0.6 });

  document.querySelectorAll('.marker-text').forEach(marker => {
    marker.dataset.markerPending = '';
    observer.observe(marker);
  });
}
