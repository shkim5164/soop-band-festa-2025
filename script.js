// ===== Tab Functionality =====
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    setupScrollAnimations();
});

// ===== Scroll Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.band-card, .song-card').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// ===== Floating Nav Active State =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ===== Console Easter Egg =====
console.log(`
🎸 SOOP Band Festa 2025 🎸
━━━━━━━━━━━━━━━━━━━━━━━━
기울어진밴드 · 부정교합 · 공팔공삼 · 숲소리

2025.12.13.Sat PM 05:00
카야스테이지

See you there! 🤘
`);
