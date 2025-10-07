
        initSpinningBlossom();


        const cosplayItems = document.querySelectorAll('.cosplay-item');
        const cosplayViewer = document.getElementById('cosplayViewer');
        const cosplayImage = document.getElementById('cosplayImage');
        const closeViewer = document.querySelector('.close-viewer');

        cosplayItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img').src;
                cosplayImage.src = img;
                cosplayViewer.classList.add('active');
            });
        });

        if (closeViewer) {
            closeViewer.addEventListener('click', () => {
                cosplayViewer.classList.remove('active');
            });
        }


        document.addEventListener('keydown', (e) => {