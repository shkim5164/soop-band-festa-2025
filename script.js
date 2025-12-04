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

    // Initialize RSVP from localStorage
    loadRSVPData();

    // Form submission
    const rsvpForm = document.getElementById('rsvpForm');
    rsvpForm.addEventListener('submit', handleRSVPSubmit);

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

// ===== RSVP Functionality =====
function handleRSVPSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        team: formData.get('team'),
        attendance: formData.get('attendance'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    saveRSVPResponse(response);

    // Update UI
    updateRSVPStats();
    addToRecentResponses(response);

    // Show success modal
    showModal();

    // Reset form
    e.target.reset();
}

function saveRSVPResponse(response) {
    let responses = JSON.parse(localStorage.getItem('soop_rsvp_responses') || '[]');
    
    // Check if user already responded (by name)
    const existingIndex = responses.findIndex(r => r.name === response.name);
    if (existingIndex !== -1) {
        responses[existingIndex] = response;
    } else {
        responses.push(response);
    }
    
    localStorage.setItem('soop_rsvp_responses', JSON.stringify(responses));
}

function loadRSVPData() {
    updateRSVPStats();
    loadRecentResponses();
}

function updateRSVPStats() {
    const responses = JSON.parse(localStorage.getItem('soop_rsvp_responses') || '[]');
    
    const attending = responses.filter(r => r.attendance === 'yes').length;
    const maybe = responses.filter(r => r.attendance === 'maybe').length;
    const notAttending = responses.filter(r => r.attendance === 'no').length;

    document.getElementById('attendingCount').textContent = attending;
    document.getElementById('maybeCount').textContent = maybe;
    document.getElementById('notAttendingCount').textContent = notAttending;
}

function loadRecentResponses() {
    const responses = JSON.parse(localStorage.getItem('soop_rsvp_responses') || '[]');
    const responseList = document.querySelector('.response-list');
    responseList.innerHTML = '';

    // Show last 10 responses, most recent first
    const recentResponses = responses.slice(-10).reverse();
    
    recentResponses.forEach(response => {
        addToRecentResponses(response, false);
    });

    if (responses.length === 0) {
        responseList.innerHTML = '<li style="color: var(--color-text-muted); text-align: center;">아직 응답이 없습니다</li>';
    }
}

function addToRecentResponses(response, prepend = true) {
    const responseList = document.querySelector('.response-list');
    
    // Remove "no responses" message if present
    const emptyMessage = responseList.querySelector('li[style*="text-align"]');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    const li = document.createElement('li');
    
    const statusClass = response.attendance;
    const statusText = {
        'yes': '참석',
        'maybe': '미정',
        'no': '불참'
    };

    li.innerHTML = `
        <span class="response-status ${statusClass}"></span>
        <span class="response-name">${escapeHtml(response.name)}</span>
        <span style="color: var(--color-text-muted); font-size: 0.8rem;">${statusText[response.attendance]}</span>
    `;

    if (prepend) {
        responseList.prepend(li);
        // Keep only last 10
        while (responseList.children.length > 10) {
            responseList.removeChild(responseList.lastChild);
        }
    } else {
        responseList.appendChild(li);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Modal =====
function showModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Close modal on backdrop click
document.getElementById('successModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
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

// ===== Keyboard Accessibility =====
document.addEventListener('keydown', (e) => {
    // Close modal on Escape
    if (e.key === 'Escape') {
        closeModal();
    }
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

