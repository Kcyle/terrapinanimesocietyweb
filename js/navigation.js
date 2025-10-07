            if (e.key === 'ArrowRight') changeAnime(1);
            if (e.key === 'ArrowLeft') changeAnime(-1);
        });

        let isTransitioning = false;

        function triggerPageTransition(callback) {
            if (isTransitioning) return;
            isTransitioning = true;

            const transition = document.getElementById('pageTransition');


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

            }
        }

        const audioManager = new AudioManager();
        function navigateToEvents() {
            audioManager.playSound('swoosh');
            triggerPageTransition(() => {

                const sections = document.querySelectorAll('.page-section');
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.classList.remove('transitioning-in');
                    section.classList.remove('transitioning-out');
                });


                const eventsSection = document.getElementById('events');
                if (eventsSection) {
                    eventsSection.classList.add('active');
                    eventsSection.classList.add('transitioning-in');
                }


                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }


        function navigateToPromotions() {
            audioManager.playSound('swoosh');
            triggerPageTransition(() => {

                const sections = document.querySelectorAll('.page-section');
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.classList.remove('transitioning-in');
                    section.classList.remove('transitioning-out');
                });


                const promotionsSection = document.getElementById('promotions');
                if (promotionsSection) {
                    promotionsSection.classList.add('active');
                    promotionsSection.classList.add('transitioning-in');
                }


            alert('This form is not open/available yet.');
        }


        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });


        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.page-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                audioManager.playSound('swoosh');
                triggerPageTransition(() => {

                    sections.forEach(section => {
                        section.classList.remove('active');
                        section.classList.remove('transitioning-in');
                        section.classList.remove('transitioning-out');
                    });


                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                        targetSection.classList.add('transitioning-in');


                        if (targetId === 'eboard') {
                            setTimeout(() => {
                                const eboardGrid = document.querySelector('.eboard-grid');
                                if (eboardGrid) {
                                    eboardGrid.classList.add('animated');
                                }
                            }, 800);
                        }

                        if (targetId === 'subgroups') {
                            setTimeout(() => {
                                const subgroupsContainer = document.querySelector('.subgroups-container');
                                if (subgroupsContainer) {
                                    subgroupsContainer.classList.add('animated');
                                }
                            }, 800);
                        }


                        const staggerElements = targetSection.querySelectorAll('.card, .member-card, .subgroup-item, .anime-card, .genre-card');
                        staggerElements.forEach((el, index) => {
                            el.style.opacity = '0';
                            el.style.transform = 'translateY(30px)';
                            setTimeout(() => {
                                el.style.transition = 'all 0.6s ease';
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }


                    navMenu.classList.remove('active');

