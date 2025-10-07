            });
        }


        let hideTimeout;
        let isScrolling = false;

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


            if (audioContainer) {
                isScrolling = true;
                audioContainer.classList.remove('hidden');


                clearTimeout(hideTimeout);

                hideTimeout = setTimeout(() => {
                    if (window.scrollY > 200) {
                        audioContainer.classList.add('hidden');
                    }
                    isScrolling = false;
                }, 1000);
            }
        });


        window.addEventListener('load', () => {
            const audioContainer = document.querySelector('.audio-control-container');
            if (audioContainer) {
                setTimeout(() => {
                    if (window.scrollY > 200) {
                        audioContainer.classList.add('hidden');