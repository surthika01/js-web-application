// Sticky header + carousel zoom logic
// -----------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const stickyHeader = document.getElementById("stickyHeader");
  const heroSection = document.querySelector(".hero");
  const yearSpan = document.getElementById("year");

  // Set dynamic year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Sticky header behavior:
  // Show once user scrolls past the first fold (hero section),
  // and hide again when they scroll back up.
  const heroThreshold = () => {
    if (!heroSection) return 320;
    // Use ~70% of the hero height as the activation point
    return heroSection.offsetHeight * 0.7;
  };

  let lastKnownScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentY = window.scrollY || window.pageYOffset;
    const threshold = heroThreshold();

    // Only toggle visibility when we really pass the threshold,
    // so the header does not flicker on minor scroll movements.
    const shouldShow = currentY > threshold;

    if (shouldShow) {
      stickyHeader?.classList.add("sticky-header--visible");
      stickyHeader?.setAttribute("aria-hidden", "false");
    } else {
      stickyHeader?.classList.remove("sticky-header--visible");
      stickyHeader?.setAttribute("aria-hidden", "true");
    }

    lastKnownScrollY = currentY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Image carousel with hover zoom
  const mainWrapper = document.getElementById("carouselMain");
  const zoomPanel = document.getElementById("zoomPanel");
  const thumbButtons = Array.from(
    document.querySelectorAll(".carousel__thumb")
  );

  const setActiveImage = (src, index) => {
    const mainImg = mainWrapper?.querySelector("img");
    if (!mainImg || !zoomPanel) return;

    mainImg.src = src;
    mainImg.dataset.index = String(index);

    // Use the same image as a CSS background for the zoom panel
    zoomPanel.style.backgroundImage = `url("${src}")`;

    thumbButtons.forEach((btn) => {
      if (btn.dataset.index === String(index)) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });
  };

  // When user hovers a thumbnail we immediately update the main image
  thumbButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const src = button.getAttribute("data-image");
      const index = button.getAttribute("data-index");
      if (!src || index === null) return;
      setActiveImage(src, Number(index));
    });
  });

  // Zoom behavior on the main image
  const enableZoom = () => {
    if (!mainWrapper || !zoomPanel) return;

    const showZoom = () => {
      zoomPanel.classList.add("carousel__zoom-panel--visible");
      zoomPanel.setAttribute("aria-hidden", "false");
    };

    const hideZoom = () => {
      zoomPanel.classList.remove("carousel__zoom-panel--visible");
      zoomPanel.setAttribute("aria-hidden", "true");
    };

    const updateZoomPosition = (event) => {
      const rect = mainWrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate percentage position inside the image
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Move the "lens" in the zoom panel by shifting the background
      zoomPanel.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    };

    mainWrapper.addEventListener("mouseenter", showZoom);
    mainWrapper.addEventListener("mouseleave", hideZoom);
    mainWrapper.addEventListener("mousemove", updateZoomPosition);
  };

  enableZoom();
});

