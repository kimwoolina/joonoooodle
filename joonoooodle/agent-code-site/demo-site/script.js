// Demo website JavaScript

let clickCount = 0;

function showMessage() {
    clickCount++;
    const messageDiv = document.getElementById('message');

    const messages = [
        '👋 Hello! Thanks for clicking!',
        '✨ You clicked again!',
        '🎉 You\'re on a roll!',
        '🚀 Keep going!',
        '⭐ Amazing! Try asking the AI agent to modify this page!',
    ];

    const index = Math.min(clickCount - 1, messages.length - 1);
    messageDiv.textContent = messages[index];
    messageDiv.style.opacity = '1';

    // Animate the button
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    alert('Thanks for your message! (This is a demo - no actual submission happens)');
    form.reset();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add a subtle animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

console.log('Demo website loaded! Ask the AI agent to modify me!');
