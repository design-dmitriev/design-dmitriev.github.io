const travelMotion = document.querySelector(".travel-stage, .travel-banner");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const dubaiGallery = document.querySelector(".dubai-gallery");
if (dubaiGallery) {
  const section = dubaiGallery.closest("#routes");
  const sticky = section.querySelector(".dubai-sticky");
  const waves = sticky.querySelector(".dubai-waves");
  const swipeLayout = matchMedia("(max-width: 767px), (pointer: coarse)");
  const [firstCard, secondCard] = dubaiGallery.children;
  let distance = 0;
  let top = 0;
  let sectionPadding = 0;
  let scrollDriven = false;
  let frame = 0;

  function sectionStart() {
    return section.getBoundingClientRect().top + window.scrollY + sectionPadding - top;
  }

  function syncGallery() {
    frame = 0;
    if (reducedMotion.matches) return;
    const offset = window.scrollY - sectionStart();
    if (scrollDriven) dubaiGallery.scrollLeft = Math.min(distance, Math.max(0, offset));

    const lead = window.innerHeight * .35;
    const track = scrollDriven ? distance : sticky.offsetHeight + top;
    const pageProgress = Math.min(1, Math.max(0, (offset + lead) / (track + lead)));
    const progress = swipeLayout.matches && distance > 0
      ? Math.min(1, Math.max(pageProgress * .45, dubaiGallery.scrollLeft / distance))
      : pageProgress;
    waves.style.setProperty("--dubai-main-offset", 1 - Math.min(1, progress / .86));
    waves.style.setProperty("--dubai-upper-offset", 1 - Math.min(1, Math.max(0, (progress - .16) / .84)));
  }

  function measureGallery() {
    distance = Math.max(0, dubaiGallery.scrollWidth - dubaiGallery.clientWidth);
    top = parseFloat(getComputedStyle(sticky).top);
    sectionPadding = parseFloat(getComputedStyle(section).paddingTop);
    const contentHeight = dubaiGallery.getBoundingClientRect().bottom - sticky.getBoundingClientRect().top;
    scrollDriven = !swipeLayout.matches && !reducedMotion.matches && distance > 0 && contentHeight <= window.innerHeight - top - 12;
    section.style.setProperty("--dubai-scroll-span", `${distance}px`);
    section.classList.toggle("is-scroll-driven", scrollDriven);
    syncGallery();
  }

  dubaiGallery.addEventListener("keydown", (event) => {
    if (!scrollDriven || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    const step = secondCard.offsetLeft - firstCard.offsetLeft;
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    const left = Math.min(distance, Math.max(0, dubaiGallery.scrollLeft + step * direction));
    window.scrollTo({ top: sectionStart() + left, behavior: "smooth" });
  });

  function scheduleGallery() {
    if (!reducedMotion.matches && !frame) frame = requestAnimationFrame(syncGallery);
  }

  window.addEventListener("scroll", scheduleGallery, { passive: true });
  dubaiGallery.addEventListener("scroll", () => {
    if (!scrollDriven) scheduleGallery();
  }, { passive: true });
  window.addEventListener("resize", measureGallery);
  reducedMotion.addEventListener("change", measureGallery);
  swipeLayout.addEventListener("change", measureGallery);
  const galleryObserver = new ResizeObserver(measureGallery);
  galleryObserver.observe(dubaiGallery);
  measureGallery();
}

function flightRenderer(container) {
  const plane = container.querySelector(".travel-banner-plane");
  const trail = container.querySelector(".travel-banner-trail");
  const length = trail.getTotalLength();
  trail.style.strokeDasharray = `${length} ${length}`;

  return (progress) => {
    const distance = progress * length;
    const point = trail.getPointAtLength(distance);
    const before = trail.getPointAtLength(Math.max(0, distance - 6));
    const after = trail.getPointAtLength(Math.min(length, distance + 6));
    const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
    plane.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
    trail.style.strokeDashoffset = length - Math.max(0, distance - 11);
  };
}

if (travelMotion && !reducedMotion.matches) {
  const renderFlight = flightRenderer(travelMotion);
  const isBanner = travelMotion.classList.contains("travel-banner");

  if (isBanner) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      requestAnimationFrame((start) => {
        renderFlight(0);
        travelMotion.classList.add("is-animated", "has-flight");

        function advance(now) {
          const progress = Math.min(1, (now - start) / 10000);
          renderFlight(progress);
          if (progress < 1) requestAnimationFrame(advance);
        }

        requestAnimationFrame(advance);
      });
    }, { threshold: 0.25 });
    observer.observe(travelMotion);
  } else {
    let pending = false;
    function updateFlight() {
      pending = false;
      const bounds = travelMotion.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport - bounds.top) / (viewport + bounds.height);
      renderFlight(Math.max(0, Math.min(1, progress)));
      travelMotion.classList.add("has-flight");
    }

    function scheduleFlight() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(updateFlight);
    }

    addEventListener("scroll", scheduleFlight, { passive: true });
    addEventListener("resize", scheduleFlight);
    scheduleFlight();

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      travelMotion.classList.add("is-animated");
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(travelMotion);
  }
}
