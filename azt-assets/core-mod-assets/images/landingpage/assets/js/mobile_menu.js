document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobilePanel = document.getElementById('mobile-panel');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const productsToggle = document.getElementById('mobile-products-toggle');
    const productsSubmenu = document.getElementById('mobile-products-submenu');

    // Open menu
    mobileMenuBtn.addEventListener('click', function () {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
            mobileBackdrop.classList.remove('opacity-0');
            mobilePanel.classList.remove('translate-x-full');
        }, 10);
    });

    // Close menu function
    function closeMenu() {
        mobileBackdrop.classList.add('opacity-0');
        mobilePanel.classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    // Close menu events
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileBackdrop.addEventListener('click', closeMenu);

    // Products submenu toggle
    productsToggle.addEventListener('click', function () {
        const arrow = productsToggle.querySelector('svg');
        if (productsSubmenu.classList.contains('hidden')) {
            productsSubmenu.classList.remove('hidden');
            arrow.classList.add('rotate-180');
        } else {
            productsSubmenu.classList.add('hidden');
            arrow.classList.remove('rotate-180');
        }
    });

    // Close menu when clicking on links
    const menuLinks = mobileMenu.querySelectorAll('a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Prevent body scroll when menu is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    mobileMenuBtn.addEventListener('click', function () {
        document.body.style.overflow = 'hidden';
    });

    mobileMenuClose.addEventListener('click', function () {
        document.body.style.overflow = originalStyle;
    });

    mobileBackdrop.addEventListener('click', function () {
        document.body.style.overflow = originalStyle;
    });
});
document
    .getElementById("mobile-menu-btn")
    .addEventListener("click", function () {
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.remove("hidden");
            setTimeout(() => mobileMenu.classList.add("show"), 10);
        } else {
            mobileMenu.classList.remove("show");
            setTimeout(() => mobileMenu.classList.add("hidden"), 300);
        }
    });