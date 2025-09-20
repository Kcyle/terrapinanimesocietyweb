class AudioManager {
    constructor() {
        this.volume = 0.5;
        this.sounds = {
            swoosh: null,
            click: null
        };
        this.init();
    }

    init() {

        this.sounds.swoosh = new Audio('audio/swoosh.mp3');
        this.sounds.click = new Audio('audio/click.mp3');

        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
                sound.preload = 'auto';
            }
        });

        this.setupVolumeControl();
        this.addSoundEvents();
    }

    setupVolumeControl() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumePercentage = document.querySelector('.volume-percentage');
        const audioIcon = document.querySelector('.audio-icon');

        if (volumeSlider && volumePercentage) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = e.target.value / 100;
                volumePercentage.textContent = e.target.value + '%';

                Object.values(this.sounds).forEach(sound => {
                    if (sound) sound.volume = this.volume;
                });

                if (audioIcon) {
                    if (this.volume === 0) {
                        audioIcon.textContent = '🔇';
                    } else if (this.volume < 0.3) {
                        audioIcon.textContent = '🔈';
                    } else if (this.volume < 0.7) {
                        audioIcon.textContent = '🔉';
                    } else {
                        audioIcon.textContent = '🔊';
                    }
                }

                this.playSound('click', this.volume * 0.3);
            });
        }
    }

    addSoundEvents() {
        const buttons = document.querySelectorAll('.btn, .volunteer-btn, .apply-btn, .submit-btn, .rsvp-btn, .season-tab, .watch-trailer-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.playSound('click');
            });
        });

        const interactiveElements = document.querySelectorAll('.thumbnail, .slide-nav, .dot, .mobile-toggle, .cosplay-item');
        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playSound('click');
            });
        });
    }

    playSound(soundName, customVolume = null) {
        const sound = this.sounds[soundName];
        if (sound && this.volume > 0) {
            sound.currentTime = 0;
            sound.volume = customVolume !== null ? customVolume : this.volume;
            sound.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }
}


const audioManager = new AudioManager();


let isTransitioning = false;

function triggerPageTransition(callback) {
    if (isTransitioning) return;
    isTransitioning = true;

    const transition = document.getElementById('pageTransition');
    if (!transition) return;

    transition.style.display = 'block';
    transition.style.pointerEvents = 'auto';

    const elements = transition.querySelectorAll('.shoji-door-left, .shoji-door-right, .door-seal, .energy-line, .kanji, .door-mascot');
    elements.forEach(element => {
        element.style.animation = 'none';
        element.offsetHeight;
    });

    setTimeout(() => {
        document.querySelector('.shoji-door-left').style.animation = 'shojiSlideLeft 1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards';
        document.querySelector('.shoji-door-right').style.animation = 'shojiSlideRight 1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards';
        document.querySelector('.door-seal').style.animation = 'sealRotateBreak 1s ease-out forwards';
        document.querySelector('.door-mascot').style.animation = 'mascotDoorAppear 1s ease-in-out forwards';

        document.querySelectorAll('.energy-line').forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'energyBurst 1s ease-out forwards';
            }, index * 50);
        });

        document.querySelectorAll('.kanji').forEach((kanji, index) => {
            setTimeout(() => {
                kanji.style.animation = 'kanjiFloat 1.2s ease-out forwards';
            }, index * 100);
        });
    }, 10);

    setTimeout(() => {
        if (callback) callback();
    }, 300);

    setTimeout(() => {
        transition.style.display = 'none';
        transition.style.pointerEvents = 'none';
        isTransitioning = false;
    }, 1200);
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
        if (animatedBg) {
            animatedBg.classList.add('loaded');
        }
    }, 100);
});


function initSpinningBlossom() {
    const blossom = document.getElementById('spinningBlossomCenter');
    if (!blossom) return;

    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
        const scale = 0.5 + (scrollProgress * 3);
        const rotation = scrollProgress * 360;
        const opacity = 0.3;

        blossom.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        blossom.style.opacity = opacity;
    });
}

initSpinningBlossom();


function createBlossomPetal() {
    const blossomContainer = document.querySelector('.blossom-container');
    if (!blossomContainer) return;

    const petal = document.createElement('div');
    petal.className = 'blossom-petal';

    const img = document.createElement('img');
    img.src = 'images/blossom.png';
    img.alt = 'Blossom';
    petal.appendChild(img);

    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = '-50px';
    petal.style.animationDuration = (Math.random() * 10 + 12) + 's, ' + (Math.random() * 3 + 3) + 's';
    petal.style.animationDelay = '0s';
    petal.style.width = (Math.random() * 10 + 16) + 'px';
    petal.style.height = petal.style.width;

    petal.addEventListener('click', function (e) {
        e.stopPropagation();
        createBlossomBurst(e.pageX, e.pageY);
        createRipple(e.pageX, e.pageY);
        this.style.animation = 'none';
        this.style.transform = 'scale(0) rotate(720deg)';
        this.style.opacity = '0';
        this.style.transition = 'all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
        setTimeout(() => {
            this.remove();
        }, 500);
    });

    blossomContainer.appendChild(petal);

    setTimeout(() => {
        if (petal.parentElement) {
            petal.remove();
        }
    }, 25000);
}

function createBlossomBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'blossom-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';

        const angle = (i / 12) * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        particle.style.setProperty('--endX', endX + 'px');
        particle.style.setProperty('--endY', endY + 'px');

        const keyframes = [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
        ];

        particle.animate(keyframes, {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
        });

        burst.appendChild(particle);
    }

    document.body.appendChild(burst);

    setTimeout(() => {
        burst.remove();
    }, 1000);
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'blossom-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}


setInterval(createBlossomPetal, 2000);

for (let i = 0; i < 5; i++) {
    setTimeout(createBlossomPetal, i * 500);
}

let currentAnime = 1;
const totalAnime = 5;
let autoSlideInterval;

function changeAnime(direction) {
    const slides = document.querySelectorAll('.anime-slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const dots = document.querySelectorAll('.dot');

    if (!slides.length) return;

    slides[currentAnime - 1].classList.remove('active');
    if (thumbnails[currentAnime - 1]) thumbnails[currentAnime - 1].classList.remove('active');
    if (dots[currentAnime - 1]) dots[currentAnime - 1].classList.remove('active');

    currentAnime += direction;
    if (currentAnime > totalAnime) currentAnime = 1;
    if (currentAnime < 1) currentAnime = totalAnime;

    slides[currentAnime - 1].classList.add('active');
    if (thumbnails[currentAnime - 1]) thumbnails[currentAnime - 1].classList.add('active');
    if (dots[currentAnime - 1]) dots[currentAnime - 1].classList.add('active');

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = (currentAnime / totalAnime * 100) + '%';
    }

    resetAutoSlide();
}

function goToAnime(animeNumber) {
    const difference = animeNumber - currentAnime;
    if (difference !== 0) {
        changeAnime(difference);
    }
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        changeAnime(1);
    }, 7000);
}


if (document.querySelector('.anime-slider')) {
    resetAutoSlide();
}

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const audioContainer = document.querySelector('.audio-control-container');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        document.body.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
        document.body.classList.remove('scrolled');
    }


    let hideTimeout;
    if (audioContainer) {
        audioContainer.classList.remove('hidden');
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (window.scrollY > 200) {
                audioContainer.classList.add('hidden');
            }
        }, 1000);
    }
});


const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}


function showFormNotAvailable() {
    alert('This form is not open/available yet.');
}


const seasonTabs = document.querySelectorAll('.season-tab');
const animeGrids = document.querySelectorAll('.anime-grid');

seasonTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        seasonTabs.forEach(t => t.classList.remove('active'));
        animeGrids.forEach(grid => grid.classList.remove('active'));

        this.classList.add('active');

        const season = this.getAttribute('data-season');
        const targetGrid = document.querySelector(`#${season}`);
        if (targetGrid) {
            targetGrid.classList.add('active');
        }
    });
});


const cosplayItems = document.querySelectorAll('.cosplay-item');
const cosplayViewer = document.getElementById('cosplayViewer');
const cosplayImage = document.getElementById('cosplayImage');
const closeViewer = document.querySelector('.close-viewer');

cosplayItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img').src;
        if (cosplayImage) cosplayImage.src = img;
        if (cosplayViewer) cosplayViewer.classList.add('active');
    });
});

if (closeViewer) {
    closeViewer.addEventListener('click', () => {
        cosplayViewer.classList.remove('active');
    });
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cosplayViewer && cosplayViewer.classList.contains('active')) {
        cosplayViewer.classList.remove('active');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const hero = document.querySelector('.hero-content');
        if (hero) {
            const elements = hero.querySelectorAll('.stagger-element');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    }, 100);
});


window.changeAnime = changeAnime;
window.goToAnime = goToAnime;
window.showFormNotAvailable = showFormNotAvailable;