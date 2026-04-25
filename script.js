// ===== WEDDING INVITATION - SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initCountdown();
    initGallery();
    initRevealAnimations();
    initSmoothScroll();
    initSplashScreen();
});

// ===== SPLASH SCREEN =====
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const openBtn = document.getElementById('openInvitation');
    
    if (splashScreen && openBtn) {
        // Prepare body
        document.body.classList.add('splash-active');
        
        openBtn.addEventListener('click', () => {
            splashScreen.classList.add('opening');
            document.body.classList.remove('splash-active');
            
            // Start music automatically when opened
            if (typeof romanticMusic !== 'undefined') {
                romanticMusic.start();
                if (musicToggle) musicToggle.classList.add('playing');
                if (musicIcon) {
                    musicIcon.innerHTML = `
                        <path d="M9 18V5l12-2v13"/>
                        <circle cx="6" cy="18" r="3"/>
                        <circle cx="18" cy="16" r="3"/>
                    `;
                }
            }
            
            // Remove splash from DOM after animation
            setTimeout(() => {
                splashScreen.style.display = 'none';
                splashScreen.classList.add('hidden');
            }, 1200); // Match CSS transition duration
        });
    }
}

function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 15) + 's';
        
        const size = 1 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const hue = Math.random() > 0.5 ? '38' : '340';
        const sat = 40 + Math.random() * 20;
        const light = 40 + Math.random() * 20;
        particle.style.background = `hsl(${hue}, ${sat}%, ${light}%)`;
        
        container.appendChild(particle);
    }
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('a');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const weddingDate = new Date('2026-05-06T00:00:00').getTime();
    const totalDays = 365; // For ring animation

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update numbers with animation
        animateNumber('days', days);
        animateNumber('hours', hours);
        animateNumber('minutes', minutes);
        animateNumber('seconds', seconds);

        // Update ring progress
        const circumference = 2 * Math.PI * 54; // r=54 from SVG

        const daysProgress = 1 - (days / totalDays);
        const hoursProgress = 1 - (hours / 24);
        const minutesProgress = 1 - (minutes / 60);
        const secondsProgress = 1 - (seconds / 60);

        updateRing('ring-days', circumference, daysProgress);
        updateRing('ring-hours', circumference, hoursProgress);
        updateRing('ring-minutes', circumference, minutesProgress);
        updateRing('ring-seconds', circumference, secondsProgress);
    }

    function animateNumber(id, value) {
        const el = document.getElementById(id);
        const newValue = String(value).padStart(2, '0');
        if (el.textContent !== newValue) {
            el.style.transform = 'scale(1.1)';
            el.textContent = newValue;
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    }

    function updateRing(id, circumference, progress) {
        const ring = document.getElementById(id);
        if (ring) {
            const offset = circumference * (1 - progress);
            ring.style.strokeDashoffset = offset;
        }
    }

    // Run immediately and every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== GALLERY & LIGHTBOX =====
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const images = [
        'photos/photo1.jpeg',
        'photos/photo2.jpeg',
        'photos/photo3.jpeg',
        'photos/photo5.jpeg',
        'photos/photo4.jpeg',
        'photos/photo7.jpeg',
        'photos/photo8.jpeg',
        'photos/photo9.jpeg'
    ];

    let currentIndex = 0;

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            currentIndex = parseInt(item.dataset.index);
            openLightbox(currentIndex);
        });
    });

    function openLightbox(index) {
        lightboxImg.src = images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = images[currentIndex];
            lightboxImg.style.opacity = 1;
        }, 200);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = images[currentIndex];
            lightboxImg.style.opacity = 1;
        }, 200);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) lightboxNext.click();
            else lightboxPrev.click();
        }
    });
}

// ===== REVEAL ANIMATIONS =====
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== ROMANTIC AMBIENT MUSIC =====
class RomanticMusicGenerator {
    constructor() {
        this.audioCtx = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.intervals = [];
        this.timeouts = [];
        this.convolver = null;

        // Romantic scale: D major pentatonic + some extras for warmth
        // Frequencies for a dreamy, romantic feel
        this.notes = {
            // Low octave (bass)
            'D3': 146.83, 'E3': 164.81, 'F#3': 185.00, 'A3': 220.00, 'B3': 246.94,
            // Mid octave (melody)
            'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            // High octave (shimmer)
            'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'A5': 880.00, 'B5': 987.77,
            // Higher shimmer
            'D6': 1174.66, 'F#6': 1479.98
        };

        // Chord progressions for romantic feel: D - Bm - G - A (I - vi - IV - V)
        this.chords = [
            ['D3', 'F#4', 'A4', 'D5'],      // D major
            ['B3', 'D4', 'F#4', 'B4'],       // B minor
            ['D3', 'G4', 'B4', 'D5'],        // G major (using D bass for smoothness)
            ['A3', 'E4', 'A4', 'E5'],        // A major
            ['D3', 'F#4', 'A4', 'F#5'],      // D major (variation)
            ['B3', 'D4', 'F#4', 'D5'],       // B minor (variation)
        ];

        // Melody notes for the gentle lead
        this.melodyNotes = ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'F#5', 'A5', 'F#5', 'E5', 'D5', 'B4', 'A4', 'F#4'];
    }

    async init() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master volume
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0;
        this.masterGain.connect(this.audioCtx.destination);

        // Create reverb
        this.convolver = this.audioCtx.createConvolver();
        this.convolver.buffer = await this.createReverbBuffer(3.5, 2.5);
        
        // Reverb mix
        this.reverbGain = this.audioCtx.createGain();
        this.reverbGain.gain.value = 0.6;
        this.convolver.connect(this.reverbGain);
        this.reverbGain.connect(this.masterGain);

        // Dry mix
        this.dryGain = this.audioCtx.createGain();
        this.dryGain.gain.value = 0.4;
        this.dryGain.connect(this.masterGain);
    }

    createReverbBuffer(duration, decay) {
        const sampleRate = this.audioCtx.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioCtx.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return buffer;
    }

    // Soft piano-like tone
    playNote(freq, startTime, duration, velocity = 0.12) {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        // Slightly detuned oscillators for warmth
        osc1.type = 'sine';
        osc1.frequency.value = freq;
        
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 1.001; // Slight detune for chorus effect

        // Soft low-pass filter
        filter.type = 'lowpass';
        filter.frequency.value = freq * 3;
        filter.Q.value = 0.5;

        // Piano-like envelope: quick attack, slow decay
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(velocity, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(velocity * 0.6, startTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.convolver);
        gainNode.connect(this.dryGain);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    // Warm pad sound
    playPad(frequencies, startTime, duration) {
        frequencies.forEach(noteName => {
            const freq = this.notes[noteName];
            if (!freq) return;

            const osc = this.audioCtx.createOscillator();
            const osc2 = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            const filter = this.audioCtx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = freq;
            
            osc2.type = 'sine';
            osc2.frequency.value = freq * 2.001; // Octave up with slight detune

            filter.type = 'lowpass';
            filter.frequency.value = 800;
            filter.Q.value = 0.3;

            // Slow swell envelope
            const vol = 0.04;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(vol, startTime + duration * 0.3);
            gainNode.gain.setValueAtTime(vol, startTime + duration * 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.convolver);
            gainNode.connect(this.dryGain);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + duration + 0.1);
            osc2.stop(startTime + duration + 0.1);
        });
    }

    // Play a gentle melody note with shimmer
    playMelody(noteName, startTime, duration) {
        const freq = this.notes[noteName];
        if (!freq) return;

        // Main tone
        this.playNote(freq, startTime, duration, 0.08);
        
        // Soft octave ghost
        this.playNote(freq * 2, startTime + 0.02, duration * 0.6, 0.02);
    }

    // Schedule one cycle of music (approx 24 seconds)
    scheduleCycle() {
        if (!this.isPlaying) return;
        
        const now = this.audioCtx.currentTime + 0.1;
        const beatDuration = 2.0; // 2 seconds per beat — very slow and calm

        // Play chord pads (each chord lasts 2 beats = 4 seconds)
        this.chords.forEach((chord, i) => {
            this.playPad(chord, now + (i * beatDuration * 2), beatDuration * 2.5);
        });

        // Play gentle melody over the chords
        const melodyTiming = [0, 1.5, 3, 4, 5.5, 7, 8.5, 10, 11, 12.5, 14, 16, 18, 20];
        melodyTiming.forEach((time, i) => {
            const noteIndex = i % this.melodyNotes.length;
            // Add gentle randomness to timing
            const jitter = (Math.random() - 0.5) * 0.3;
            const noteDuration = 1.5 + Math.random() * 1.5;
            this.playMelody(this.melodyNotes[noteIndex], now + time + jitter, noteDuration);
        });

        // Schedule occasional high shimmer notes
        for (let i = 0; i < 4; i++) {
            const shimmerTime = now + Math.random() * 22;
            const shimmerNotes = ['D6', 'F#6', 'A5', 'B5'];
            const note = shimmerNotes[Math.floor(Math.random() * shimmerNotes.length)];
            this.playNote(this.notes[note], shimmerTime, 3, 0.015);
        }

        // Schedule next cycle
        const cycleLength = this.chords.length * beatDuration * 2;
        const timeout = setTimeout(() => this.scheduleCycle(), (cycleLength - 1) * 1000);
        this.timeouts.push(timeout);
    }

    async start() {
        if (this.isPlaying) return;
        
        if (!this.audioCtx) {
            await this.init();
        }

        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
        }

        this.isPlaying = true;
        
        // Fade in
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.9, this.audioCtx.currentTime + 2);

        this.scheduleCycle();
    }

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        // Fade out
        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1.5);
        }

        // Clear scheduled timeouts
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
        return this.isPlaying;
    }
}

// ===== INIT MUSIC TOGGLE =====
const romanticMusic = new RomanticMusicGenerator();
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        const playing = romanticMusic.toggle();
        musicToggle.classList.toggle('playing', playing);
        
        // Update icon
        if (playing) {
            musicIcon.innerHTML = `
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
            `;
            musicToggle.title = 'Pause Music';
        } else {
            musicIcon.innerHTML = `
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke-width="2.5"/>
            `;
            musicToggle.title = 'Play Music';
        }
    });
}
