// Simple Mobile Menu Handler

document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileNav');
    const closeBtn = document.getElementById('mobileCloseBtn');
    
    if (!menuBtn || !mobileMenu) return;
    
    function openMenu() {
        mobileMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Open menu
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openMenu();
    });
    
    // Close menu with X button
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }
    
    // Close menu when clicking overlay
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === this) {
            closeMenu();
        }
    });
    
    // Close menu when clicking nav links
    const navLinks = mobileMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
            closeMenu();
        }
    });
});