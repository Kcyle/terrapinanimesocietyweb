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

                cosplayViewer.classList.remove('active');
            }
        });

        let currentAnime = 1;
        const totalAnime = 5;


        function changeAnime(direction) {
            const slides = document.querySelectorAll('.anime-slide');
            const thumbnails = document.querySelectorAll('.thumbnail');
            const dots = document.querySelectorAll('.dot');


            slides[currentAnime - 1].classList.remove('active');
            thumbnails[currentAnime - 1].classList.remove('active');
            dots[currentAnime - 1].classList.remove('active');


            currentAnime += direction;
            if (currentAnime > totalAnime) currentAnime = 1;
            if (currentAnime < 1) currentAnime = totalAnime;


            slides[currentAnime - 1].classList.add('active');
            thumbnails[currentAnime - 1].classList.add('active');
            dots[currentAnime - 1].classList.add('active');


            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = (currentAnime / totalAnime * 100) + '%';


        }

        function goToAnime(animeNumber) {
            const difference = animeNumber - currentAnime;
            if (difference !== 0) {
                changeAnime(difference);
            }
        }


