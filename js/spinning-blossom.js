                });
            });
        })();

        function initSpinningBlossom() {
            const blossom = document.getElementById('spinningBlossomCenter');

            window.addEventListener('scroll', () => {
                const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
                const scale = 0.5 + (scrollProgress * 3);
                const rotation = scrollProgress * 360;
                const opacity = 0.3;

                blossom.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                blossom.style.opacity = opacity;