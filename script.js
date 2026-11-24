/* ===== 3D Animated Particle Background ===== */
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
        this.baseSize = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = Math.random() * 2 + 0.5;

        const colors = [
            { r: 108, g: 99, b: 255 },   // primary purple
            { r: 0, g: 212, b: 170 },     // accent teal
            { r: 255, g: 107, b: 107 },   // secondary red
            { r: 139, g: 131, b: 255 },   // light purple
            { r: 100, g: 180, b: 255 },   // blue
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
            this.x += dx * 0.00005 * (1000 - this.z) / 1000;
            this.y += dy * 0.00005 * (1000 - this.z) / 1000;
        }

        if (this.z <= 0 || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
            this.reset();
            this.z = 1000;
        }
    }

    draw() {
        const scale = (1000 - this.z) / 1000;
        const size = this.baseSize * scale * 3;
        const opacity = scale * 0.8;

        // 3D position projection
        const projX = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const projY = (this.y - canvas.height / 2) * scale + canvas.height / 2;

        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(size, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
        ctx.fill();

        // Glow effect for larger particles
        if (size > 1.5) {
            ctx.beginPath();
            ctx.arc(projX, projY, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity * 0.1})`;
            ctx.fill();
        }
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
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

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.15 * scaleI * scaleJ;
                ctx.beginPath();
                ctx.moveTo(projXI, projYI);
                ctx.lineTo(projXJ, projYJ);
                ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
    );
    gradient.addColorStop(0, 'rgba(18, 18, 42, 0.3)');
    gradient.addColorStop(1, 'rgba(10, 10, 26, 0.3)');
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
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Creative Coder',
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

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
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
        const sectionTop = section.offsetTop - 100;
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

// Close menu on link click
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

        if (elementTop < windowHeight - 100) {
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

        if (elementTop < windowHeight - 50) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }
    });
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Show success notification
    showNotification(`Thanks ${name}! Your message has been sent successfully.`, 'success');

    // Reset form
    contactForm.reset();
});

/* ===== Notification System ===== */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '30px',
        padding: '15px 25px',
        background: type === 'success' ? 'rgba(0, 212, 170, 0.95)' : 'rgba(255, 107, 107, 0.95)',
        color: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '10000',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Poppins', sans-serif"
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Animate out
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/* ===== Preloader ===== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);
});

/* ===== Smooth Section Transitions ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ===== Tilt Effect on Project Cards ===== */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ===== Skill Card Hover Glow ===== */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108, 99, 255, 0.15), var(--bg-card) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = 'var(--bg-card)';
    });
});

/* ===== Counter Animation for Stats ===== */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    updateCounter();
}

/* ===== Intersection Observer for Lazy Animations ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => {
    observer.observe(el);
});

/* ===== Dynamic Year in Footer ===== */
document.querySelector('.footer-copyright').innerHTML =
    `&copy; ${new Date().getFullYear()} All Rights Reserved.`;
