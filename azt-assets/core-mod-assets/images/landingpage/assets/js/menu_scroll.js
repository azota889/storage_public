let isScrolled = false;
let ticking = false;

function updateNavbar() {
    if (window.innerWidth >= 768) {
        const navbar = document.getElementById('navbar');
        const navbarLogo = document.getElementById('navbar-logo');
        const currentScrollY = window.scrollY;

        const scrollThreshold = isScrolled ? 80 : 120;
        const scrolled = currentScrollY > scrollThreshold;

        if (scrolled !== isScrolled) {
            isScrolled = scrolled;

            if (scrolled) {
                navbar.classList.remove('md:py-8');
                navbar.classList.add('md:py-4');
                navbarLogo.classList.remove('md:h-10');
                navbarLogo.classList.add('md:h-8');
            } else {
                navbar.classList.remove('md:py-4');
                navbar.classList.add('md:py-8');
                navbarLogo.classList.remove('md:h-8');
                navbarLogo.classList.add('md:h-10');
            }
        }
    }
    ticking = false;
}

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });