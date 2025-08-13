document.addEventListener('DOMContentLoaded', function () {
    const aboutSection = document.getElementById('about');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to trigger entrance animation
                const animateElements = entry.target.querySelectorAll('.animate-on-scroll');
                animateElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('in-view');
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    if (aboutSection) {
        // Add animate-on-scroll class to elements we want to animate
        const leftContent = aboutSection.querySelector('.space-y-8');
        const rightContent = aboutSection.querySelector('.relative.z-10');

        if (leftContent) leftContent.classList.add('animate-on-scroll');
        if (rightContent) rightContent.classList.add('animate-on-scroll');

        observer.observe(aboutSection);
    }
});
function formatNumber(num) {
    if (num >= 1000000) {
        return '+' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return '+' + (num / 1000).toFixed(0) + 'K';
    }
    return '+' + num.toString();
}

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

// Intersection Observer để trigger animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statisticsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-target'));
                setTimeout(() => {
                    animateCounter(counter, target);
                }, index * 200); // Delay mỗi counter 200ms
            });
            statisticsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Bắt đầu observe khi DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    const statisticsGrid = document.getElementById('statistics-grid');
    if (statisticsGrid) {
        statisticsObserver.observe(statisticsGrid);
    }
});