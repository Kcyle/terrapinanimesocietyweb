<script>


    let currentSlide = 0;
    const totalSlides = 2;

    function changeSlide(direction) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');

        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');


        currentSlide += direction;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;


        const newSlide = slides[currentSlide];
        newSlide.classList.add('active');
        indicators[currentSlide].classList.add('active');


        const cards = newSlide.querySelectorAll('.music-card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `cardSlideIn 0.6s ease forwards`;
            card.style.animationDelay = `${(index + 1) * 0.1}s`;
        });


        if (audioManager) {
            audioManager.playSound('click');
        }
    }

    function goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');


        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');


        currentSlide = slideIndex;


        const newSlide = slides[currentSlide];
        newSlide.classList.add('active');
        indicators[currentSlide].classList.add('active');


        const cards = newSlide.querySelectorAll('.music-card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `cardSlideIn 0.6s ease forwards`;
            card.style.animationDelay = `${(index + 1) * 0.1}s`;
        });


        if (audioManager) {
            audioManager.playSound('click');
        }
    }






    document.addEventListener('DOMContentLoaded', function () {
        const animatedBg = document.getElementById('animatedBg');
        const bgPulse = document.getElementById('bgPulse');
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        const speed = 0.05;


        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (animatedBg) {
                animatedBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });


        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animatePulse() {

            currentX += (mouseX - currentX) * speed;
            currentY += (mouseY - currentY) * speed;

            if (bgPulse) {
                bgPulse.style.left = currentX + 'px';
                bgPulse.style.top = currentY + 'px';
            }

            requestAnimationFrame(animatePulse);
        }
        animatePulse();


        setTimeout(() => {
            animatedBg.classList.add('loaded');
        }, 100);


        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {

                createBackgroundRipple(window.innerWidth / 2, window.innerHeight / 2);
            });
        });


        function createBackgroundRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'bg-ripple';
            ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%) scale(0);
            z-index: -1;
            pointer-events: none;
        `;

            document.body.appendChild(ripple);


            requestAnimationFrame(() => {
                ripple.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.5s ease-out';
                ripple.style.transform = 'translate(-50%, -50%) scale(20)';
                ripple.style.opacity = '0';
            });


            setTimeout(() => {
                ripple.remove();
            }, 1500);
        }


        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                animatedBg.style.filter = 'hue-rotate(10deg)';
            });

            heroSection.addEventListener('mouseleave', () => {
                animatedBg.style.filter = 'hue-rotate(0deg)';
            });
        }


        const sections = document.querySelectorAll('.page-section');
        const observerOptions = {
            threshold: 0.5
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;


                    switch (sectionId) {
                        case 'home':
                            animatedBg.style.opacity = '1';
                            break;
                        case 'events':
                            animatedBg.style.opacity = '0.8';
                            animatedBg.style.filter = 'hue-rotate(15deg) saturate(1.2)';
                            break;
                        case 'promotions':
                            animatedBg.style.opacity = '0.9';
                            animatedBg.style.filter = 'hue-rotate(-10deg) contrast(1.2)';
                            break;
                        default:
                            animatedBg.style.opacity = '0.7';
                            animatedBg.style.filter = 'none';
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    });


    document.addEventListener('click', function (e) {
        if (e.target.closest('.blossom-petal')) {
            const animatedBg = document.getElementById('animatedBg');
            if (animatedBg) {
                animatedBg.style.animation = 'none';
                setTimeout(() => {
                    animatedBg.style.animation = 'backgroundFloat 30s ease-in-out infinite';
                }, 10);
            }
        }
    });