            });
        });


        function createBlossomPetal() {
            const blossomContainer = document.querySelector('.blossom-container');
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

                particle.style.animation = `burstOut 0.8s ease-out forwards`;
                particle.style.setProperty('animation', `burstOut 0.8s ease-out forwards`);


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
