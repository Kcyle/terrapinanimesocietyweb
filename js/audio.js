            });
        }


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

                        if (this.volume === 0) {
                            audioIcon.textContent = '🔇';
                        } else if (this.volume < 0.3) {
                            audioIcon.textContent = '🔈';
                        } else if (this.volume < 0.7) {
                            audioIcon.textContent = '🔉';
                        } else {
                            audioIcon.textContent = '🔊';
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