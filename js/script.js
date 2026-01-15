/* =====================================================
   ANKUSH & SWATI WEDDING - JAVASCRIPT
   With Multi-language Support & Google Sheets RSVP
   ===================================================== */

// =====================================================
// CONFIGURATION - UPDATE THIS!
// =====================================================
const CONFIG = {
    // 👇 PASTE YOUR GOOGLE APPS SCRIPT URL HERE
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw52pG3-IbBn3-0dhmN1RWkrcmaiSgOlJxm2arvFb-qgHrCoHFnyB1XzHXgVWe_t7g/exec',
    
    // Wedding date
    WEDDING_DATE: 'February 25, 2026 15:00:00',
    
    // Default language
    DEFAULT_LANGUAGE: 'en'
};

// =====================================================
// LANGUAGE SYSTEM
// =====================================================
let currentLanguage = CONFIG.DEFAULT_LANGUAGE;

const translations = {
    // You can add more translations here if needed
    toastMessages: {
        en: {
            linkCopied: 'Link copied to clipboard! 🔗',
            calendarDownloaded: 'Calendar event downloaded! 📅',
            fillRequired: 'Please fill in all required fields',
            submitting: 'Submitting...',
            submitError: 'Something went wrong. Please try again.',
            rsvpSuccess: 'RSVP submitted successfully!'
        },
        hi: {
            linkCopied: 'लिंक कॉपी हो गया! 🔗',
            calendarDownloaded: 'कैलेंडर इवेंट डाउनलोड हो गया! 📅',
            fillRequired: 'कृपया सभी आवश्यक फ़ील्ड भरें',
            submitting: 'जमा हो रहा है...',
            submitError: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
            rsvpSuccess: 'RSVP सफलतापूर्वक जमा हो गया!'
        },
        bn: {
            linkCopied: 'লিঙ্ক কপি হয়েছে! 🔗',
            calendarDownloaded: 'ক্যালেন্ডার ইভেন্ট ডাউনলোড হয়েছে! 📅',
            fillRequired: 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
            submitting: 'জমা হচ্ছে...',
            submitError: 'কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            rsvpSuccess: 'RSVP সফলভাবে জমা হয়েছে!'
        }
    }
};

function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Load saved language preference
    const savedLang = localStorage.getItem('wedding-language');
    if (savedLang && ['en', 'hi', 'bn'].includes(savedLang)) {
        currentLanguage = savedLang;
        updateLanguage(currentLanguage);
        
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
        });
    }
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            currentLanguage = lang;
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update all text
            updateLanguage(lang);
            
            // Save preference
            localStorage.setItem('wedding-language', lang);
            
            // Update HTML lang attribute
            document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'hi' ? 'hi' : 'bn');
        });
    });
}

function updateLanguage(lang) {
    // Update all elements with data-[lang] attributes
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(el => {
        const translation = el.getAttribute(`data-${lang}`);
        if (translation) {
            // Check if element has child nodes that should be preserved
            if (el.querySelector('span') || el.tagName === 'BUTTON' || el.tagName === 'A') {
                // For buttons/links with icons, only update text
                const icon = el.textContent.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu);
                el.textContent = translation;
            } else {
                el.textContent = translation;
            }
        }
    });
    
    // Update placeholder texts if needed
    updatePlaceholders(lang);
}

function updatePlaceholders(lang) {
    const placeholders = {
        en: {
            name: 'Enter your full name',
            family: 'e.g., The Sharma Family',
            phone: '+91 XXXXX XXXXX',
            email: 'your@email.com',
            dietary: 'e.g., Vegetarian, vegan, nut allergy...',
            accessibility: 'e.g., Wheelchair access...',
            notes: 'Messages, arrival dates...'
        },
        hi: {
            name: 'अपना पूरा नाम दर्ज करें',
            family: 'जैसे, शर्मा परिवार',
            phone: '+91 XXXXX XXXXX',
            email: 'आपका@ईमेल.com',
            dietary: 'जैसे, शाकाहारी, वीगन, नट एलर्जी...',
            accessibility: 'जैसे, व्हीलचेयर एक्सेस...',
            notes: 'संदेश, आगमन तिथियां...'
        },
        bn: {
            name: 'আপনার পুরো নাম লিখুন',
            family: 'যেমন, শর্মা পরিবার',
            phone: '+91 XXXXX XXXXX',
            email: 'আপনার@ইমেল.com',
            dietary: 'যেমন, নিরামিষ, ভেগান, বাদাম অ্যালার্জি...',
            accessibility: 'যেমন, হুইলচেয়ার অ্যাক্সেস...',
            notes: 'বার্তা, আগমনের তারিখ...'
        }
    };
    
    const p = placeholders[lang];
    if (p) {
        const nameInput = document.getElementById('respondentName');
        const familyInput = document.getElementById('familyName');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const dietaryInput = document.getElementById('dietary');
        const accessibilityInput = document.getElementById('accessibility');
        const notesInput = document.getElementById('additionalNotes');
        
        if (nameInput) nameInput.placeholder = p.name;
        if (familyInput) familyInput.placeholder = p.family;
        if (phoneInput) phoneInput.placeholder = p.phone;
        if (emailInput) emailInput.placeholder = p.email;
        if (dietaryInput) dietaryInput.placeholder = p.dietary;
        if (accessibilityInput) accessibilityInput.placeholder = p.accessibility;
        if (notesInput) notesInput.placeholder = p.notes;
    }
}

function getTranslation(key) {
    return translations.toastMessages[currentLanguage]?.[key] || translations.toastMessages.en[key];
}

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSelector();
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
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
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
    const weddingDate = new Date(CONFIG.WEDDING_DATE).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.innerHTML = '<p class="countdown-complete">🎉 The day is here! 🎉</p>';
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
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
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) targetTab.classList.add('active');
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
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return img ? img.src : '';
    }).filter(src => src);
    
    function openLightbox(index) {
        currentIndex = index;
        if (images[currentIndex]) {
            lightboxImg.src = images[currentIndex];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
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
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
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
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    updateProgress();
}

function nextStep(step) {
    if (!validateStep(currentStep)) return;
    
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const nextStepEl = document.getElementById(`step${step}`);
    
    if (currentStepEl) currentStepEl.classList.remove('active');
    if (nextStepEl) nextStepEl.classList.add('active');
    
    currentStep = step;
    updateProgress();
    
    const form = document.querySelector('.rsvp-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function prevStep(step) {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const prevStepEl = document.getElementById(`step${step}`);
    
    if (currentStepEl) currentStepEl.classList.remove('active');
    if (prevStepEl) prevStepEl.classList.add('active');
    
    currentStep = step;
    updateProgress();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    const percentage = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    
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
    if (!currentStepEl) return true;
    
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#C41E3A';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showToast(getTranslation('fillRequired'));
    }
    
    return isValid;
}

// Toggle headcount visibility
function toggleHeadcount(event, show) {
    const headcountEl = document.getElementById(`${event}Headcount`);
    if (headcountEl) {
        headcountEl.style.display = show ? 'block' : 'none';
    }
    
    if (event === 'wedding') {
        const transportEl = document.getElementById('weddingTransport');
        if (transportEl) {
            transportEl.style.display = show ? 'block' : 'none';
        }
        if (!show) {
            const transportCountEl = document.getElementById('transportCount');
            if (transportCountEl) transportCountEl.style.display = 'none';
        }
    }
}

function toggleTransportCount(show) {
    const transportCountEl = document.getElementById('transportCount');
    if (transportCountEl) {
        transportCountEl.style.display = show ? 'block' : 'none';
    }
}

// Form submission with Google Sheets
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.timestamp = new Date().toISOString();
    data.language = currentLanguage;
    
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn ? submitBtn.textContent : '';
    
    try {
        if (submitBtn) {
            submitBtn.textContent = getTranslation('submitting');
            submitBtn.disabled = true;
        }
        
        // Check if Google Script URL is configured
        if (CONFIG.GOOGLE_SCRIPT_URL && !CONFIG.GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
            await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            console.log('RSVP Data (Google Sheets not configured):', data);
        }
        
        showSuccess(data);
        showToast(getTranslation('rsvpSuccess'));
        
    } catch (error) {
        console.error('Error:', error);
        showToast(getTranslation('submitError'));
        
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

function showSuccess(data) {
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');
    const summary = document.getElementById('successSummary');
    
    if (!success) return;
    
    // Build summary
    let summaryHTML = `<h4>${currentLanguage === 'hi' ? 'आपका RSVP सारांश:' : currentLanguage === 'bn' ? 'আপনার RSVP সারাংশ:' : 'Your RSVP Summary:'}</h4><ul>`;
    summaryHTML += `<li>👤 <strong>${currentLanguage === 'hi' ? 'नाम:' : currentLanguage === 'bn' ? 'নাম:' : 'Name:'}</strong> ${data.respondentName}</li>`;
    
    if (data.haldiAttend === 'yes') {
        summaryHTML += `<li>🌼 <strong>Haldi & Mehndi:</strong> ${data.haldiCount || '✓'}</li>`;
    }
    if (data.sangeetAttend === 'yes') {
        summaryHTML += `<li>🎶 <strong>Sangeet & Matkor:</strong> ${data.sangeetCount || '✓'}</li>`;
    }
    if (data.weddingAttend === 'yes') {
        summaryHTML += `<li>💒 <strong>Wedding:</strong> ${data.weddingCount || '✓'}</li>`;
        if (data.weddingTransport === 'yes') {
            summaryHTML += `<li>🚌 <strong>Transport:</strong> ${data.transportHeadcount || '✓'}</li>`;
        }
    }
    if (data.receptionAttend === 'yes') {
        summaryHTML += `<li>🚢 <strong>Reception:</strong> ${data.receptionCount || '✓'}</li>`;
    }
    
    summaryHTML += '</ul>';
    
    if (summary) summary.innerHTML = summaryHTML;
    if (form) form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// =====================================================
// SCROLL EFFECTS
// =====================================================
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('[data-aos]');
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => observer.observe(el));
    }
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
    
    showToast(getTranslation('calendarDownloaded'));
}

// =====================================================
// SHARE FUNCTIONALITY
// =====================================================
function shareWebsite() {
    const url = window.location.href;
    const title = "Ankush & Swati's Wedding";
    const text = currentLanguage === 'hi' 
        ? "अंकुश और स्वाति की शादी में आपको आमंत्रित किया गया है! 💒"
        : currentLanguage === 'bn'
        ? "অঙ্কুশ এবং স্বাতির বিয়েতে আপনাকে আমন্ত্রণ জানানো হয়েছে! 💒"
        : "You're invited to Ankush & Swati's wedding! 💒";
    
    if (navigator.share) {
        navigator.share({ title, text, url }).catch(console.error);
    } else {
        copyLink();
    }
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = currentLanguage === 'hi'
        ? encodeURIComponent(`🎊 अंकुश और स्वाति की शादी में आपका स्वागत है!\n\n📅 25 फरवरी 2026\n📍 कोलकाता\n\n${url}`)
        : currentLanguage === 'bn'
        ? encodeURIComponent(`🎊 অঙ্কুশ এবং স্বাতির বিয়েতে আপনাকে স্বাগতম!\n\n📅 25 ফেব্রুয়ারি 2026\n📍 কলকাতা\n\n${url}`)
        : encodeURIComponent(`🎊 You're invited to Ankush & Swati's Wedding!\n\n📅 25 February 2026\n📍 Kolkata, India\n\n${url}`);
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast(getTranslation('linkCopied')))
        .catch(() => showToast('Could not copy link'));
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}