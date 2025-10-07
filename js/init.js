            setTimeout(createBlossomPetal, i * 500);
        }


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