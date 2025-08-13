document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('schools-carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const totalSlides = 4;
    let autoSlideInterval;

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const translateX = -slideIndex * 100;
        carousel.style.transform = `translateX(${translateX}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-azota-primary');
            } else {
                dot.classList.remove('bg-azota-primary');
                dot.classList.add('bg-gray-300');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // 4 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide(); // Restart auto-slide after manual navigation
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Start auto-slide
    startAutoSlide();

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        startAutoSlide();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
                goToSlide(currentSlide);
            }
        }
    }
});