/* ===== 3D Animated Particle Background - Sage Aesthetic ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.baseSize = Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.speedZ = Math.random() * 1.8 + 0.4;

        // Custom Palette from User: #CCD5AE, #E9EDC9, #D4A373, #FAEDCD
        const colors = [
            { r: 204, g: 213, b: 174 },   // #CCD5AE (Sage Green)
            { r: 233, g: 237, b: 201 },   // #E9EDC9 (Cream Sage)
            { r: 212, g: 163, b: 115 },   // #D4A373 (Warm Bronze)
            { r: 250, g: 237, b: 205 },   // #FAEDCD (Pale Sand)
            { r: 163, g: 175, b: 131 },   // Muted Olive
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.z -= this.speedZ;
        this.x += this.speedX;
        this.y += this.speedY;

        // Parallax effect with mouse
        if (mouse.x !== null) {
            const dx = mouse.x - canvas.width / 2;
            const dy = mouse.y - canvas.height / 2;
            this.x += dx * 0.00004 * (1000 - this.z) / 1000;
            this.y += dy * 0.00004 * (1000 - this.z) / 1000;
        }

        if (this.z <= 0 || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
            this.reset();
            this.z = 1000;
        }
    }

    draw() {
        const scale = (1000 - this.z) / 1000;
        const size = this.baseSize * scale * 3.2;
        const opacity = scale * 0.85;

        // 3D position projection
        const projX = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const projY = (this.y - canvas.height / 2) * scale + canvas.height / 2;

        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(size, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
        ctx.fill();

        // Subtle soft glow
        if (size > 1.8) {
            ctx.beginPath();
            ctx.arc(projX, projY, size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity * 0.12})`;
            ctx.fill();
        }
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8500), 180);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const scaleI = (1000 - particles[i].z) / 1000;
            const scaleJ = (1000 - particles[j].z) / 1000;

            const projXI = (particles[i].x - canvas.width / 2) * scaleI + canvas.width / 2;
            const projYI = (particles[i].y - canvas.height / 2) * scaleI + canvas.height / 2;
            const projXJ = (particles[j].x - canvas.width / 2) * scaleJ + canvas.width / 2;
            const projYJ = (particles[j].y - canvas.height / 2) * scaleJ + canvas.height / 2;

            const dx = projXI - projXJ;
            const dy = projYI - projYJ;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 115) {
                const opacity = (1 - distance / 115) * 0.14 * scaleI * scaleJ;
                ctx.beginPath();
                ctx.moveTo(projXI, projYI);
                ctx.lineTo(projXJ, projYJ);
                ctx.strokeStyle = `rgba(204, 213, 174, ${opacity})`;
                ctx.lineWidth = 0.55;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Deep aesthetic gradient
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(21, 30, 23, 0.45)');
    gradient.addColorStop(1, 'rgba(14, 20, 16, 0.55)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawConnections();
    animationFrame = requestAnimationFrame(animate);
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Initialize
resizeCanvas();
initParticles();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

/* ===== Typing Effect ===== */
const typedTextElement = document.getElementById('typed-text');
const titles = [
    'Web Developer',
    'Frontend Creator',
    'UI/UX Enthusiast',
    'Creative Designer',
    'Problem Solver'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 450;
    }

    setTimeout(typeText, typeSpeed);
}

typeText();

/* ===== Navbar Scroll Effect ===== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    updateActiveNav();
});

/* ===== Active Navigation Link ===== */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 110;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ===== Mobile Menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

/* ===== Back to Top ===== */
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Scroll Reveal Animation ===== */
function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 90) {
            el.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ===== Skill Bar Animation ===== */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const elementTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 40) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }
    });
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

/* ===== Contact Form Submission ===== */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    showNotification(`Thank you ${name}! Your message has been sent successfully.`, 'success');
    contactForm.reset();
});

/* ===== Notification System ===== */
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '30px',
        padding: '16px 26px',
        background: type === 'success' ? 'rgba(204, 213, 174, 0.95)' : 'rgba(212, 163, 115, 0.95)',
        color: '#0E1410',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        zIndex: '10000',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/* ===== Preloader Dismiss ===== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);
});

/* ===== Smooth Scroll Links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ===== Tilt 3D Effect for Project Cards ===== */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 22;
        const rotateY = (centerX - x) / 22;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});
