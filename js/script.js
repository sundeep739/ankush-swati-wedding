/* =====================================================
   ANKUSH & SWATI WEDDING WEBSITE - JAVASCRIPT
   ===================================================== */

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCountdown();
    initTabs();
    initGallery();
    initRSVPForm();
    initScrollEffects();
    initCalendarButtons();
});

// =====================================================
// NAVIGATION
// =====================================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.remove('scrolled');
            if (window.scrollY < 50) {
                navbar.classList.add('transparent');
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// COUNTDOWN TIMER
// =====================================================
function initCountdown() {
    const weddingDate = new Date('February 25, 2026 15:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p class="countdown-complete">Today is the day! 🎉</p>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =====================================================
// TABS (Travel Section)
// =====================================================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// =====================================================
// GALLERY & LIGHTBOX
// =====================================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    
    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    }
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// =====================================================
// RSVP FORM
// =====================================================
let currentStep = 1;
const totalSteps = 3;

function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Update progress on load
    updateProgress();
}

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) return;
    
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgress();
    
    // Scroll to form top
    document.querySelector('.rsvp-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgress();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    
    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateStep(step) {
    const currentStepEl = document.getElementById(`step${step}`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#E91E63';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields');
    }
    
    return isValid;
}

// Toggle headcount visibility
function toggleHeadcount(event, show) {
    const headcountEl = document.getElementById(`${event}Headcount`);
    headcountEl.style.display = show ? 'block' : 'none';
    
    // Show transport option for wedding
    if (event === 'wedding') {
        const transportEl = document.getElementById('weddingTransport');
        transportEl.style.display = show ? 'block' : 'none';
        if (!show) {
            document.getElementById('transportCount').style.display = 'none';
        }
    }
}

function toggleTransportCount(show) {
    const transportCountEl = document.getElementById('transportCount');
    transportCountEl.style.display = show ? 'block' : 'none';
}

// Form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    console.log('RSVP Data:', data);
    
    // Here you would send to your backend
    // Example with fetch:
    /*
    try {
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showSuccess(data);
        } else {
            showToast('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Something went wrong. Please try again.');
    }
    */
    
    // For demo, just show success
    showSuccess(data);
}

function showSuccess(data) {
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');
    const summary = document.getElementById('successSummary');
    
    // Build summary
    let summaryHTML = '<h4>Your RSVP Summary:</h4><ul>';
    summaryHTML += `<li>👤 <strong>Name:</strong> ${data.respondentName}</li>`;
    
    if (data.haldiAttend === 'yes') {
        summaryHTML += `<li>🌼 <strong>Haldi & Mehndi:</strong> ${data.haldiCount || 'Yes'} guests</li>`;
    }
    if (data.sangeetAttend === 'yes') {
        summaryHTML += `<li>🎶 <strong>Sangeet & Matkor:</strong> ${data.sangeetCount || 'Yes'} guests</li>`;
    }
    if (data.weddingAttend === 'yes') {
        summaryHTML += `<li>💒 <strong>Wedding Ceremony:</strong> ${data.weddingCount || 'Yes'} guests</li>`;
        if (data.weddingTransport === 'yes') {
            summaryHTML += `<li>🚌 <strong>Transport needed:</strong> ${data.transportHeadcount || 'Yes'} people</li>`;
        }
    }
    if (data.receptionAttend === 'yes') {
        summaryHTML += `<li>🚢 <strong>Reception:</strong> ${data.receptionCount || 'Yes'} guests</li>`;
    }
    
    summaryHTML += '</ul>';
    summary.innerHTML = summaryHTML;
    
    // Hide form, show success
    form.style.display = 'none';
    success.style.display = 'block';
    
    // Scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// =====================================================
// SCROLL EFFECTS
// =====================================================
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    
    // Back to top button visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Animate elements on scroll (simple implementation)
    const animateElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
}

// =====================================================
// CALENDAR FUNCTIONALITY
// =====================================================
function initCalendarButtons() {
    const calendarBtns = document.querySelectorAll('.add-to-calendar');
    
    calendarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventData = {
                title: btn.dataset.title,
                date: btn.dataset.date,
                time: btn.dataset.time,
                duration: parseInt(btn.dataset.duration),
                location: btn.dataset.location
            };
            
            downloadICS(eventData);
        });
    });
    
    // Save the Date button
    const saveTheDateBtn = document.getElementById('saveTheDateBtn');
    if (saveTheDateBtn) {
        saveTheDateBtn.addEventListener('click', () => {
            downloadICS({
                title: "Ankush & Swati's Wedding",
                date: '2026-02-25',
                time: '15:00',
                duration: 6,
                location: 'Kolkata, India'
            });
        });
    }
}

function downloadICS(event) {
    const { title, date, time, duration, location } = event;
    
    // Parse date and time
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
    
    const formatDate = (d) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ankush & Swati Wedding//EN
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:Join us for our wedding celebration!
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    link.click();
    
    showToast('Calendar event downloaded! 📅');
}

function downloadAllCalendarEvents() {
    const events = [
        { title: 'Ankush & Swati - Haldi & Mehndi', date: '2026-02-23', time: '13:00', duration: 5, location: 'Lila Bhawan, Kolkata' },
        { title: 'Ankush & Swati - Sangeet & Matkor', date: '2026-02-24', time: '16:00', duration: 6, location: 'Lila Bhawan, Kolkata' },
        { title: 'Ankush & Swati - Wedding Ceremony', date: '2026-02-25', time: '15:00', duration: 6, location: 'Barrackpur, Kolkata' },
        { title: 'Ankush & Swati - Reception', date: '2026-02-28', time: '18:00', duration: 5, location: 'Babughat, Kolkata' }
    ];
    
    events.forEach((event, index) => {
        setTimeout(() => downloadICS(event), index * 500);
    });
}

// =====================================================
// SHARE FUNCTIONALITY
// =====================================================
function shareWebsite() {
    const url = window.location.href;
    const title = "Ankush & Swati's Wedding";
    const text = "Join us for our wedding celebrations in Kolkata! 💒";
    
    if (navigator.share) {
        navigator.share({ title, text, url })
            .catch(console.error);
    } else {
        copyLink();
    }
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = encodeURIComponent(`Join us for Ankush & Swati's wedding! 💒🎉\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard! 🔗'))
        .catch(() => showToast('Could not copy link'));
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}