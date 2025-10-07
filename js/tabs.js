
    <script>

        (function () {
            const seasonTabs = document.querySelectorAll('#resources .season-tab');
            const animeGrids = document.querySelectorAll('#resources .anime-grid');

            seasonTabs.forEach(tab => {
                tab.addEventListener('click', function () {

                    seasonTabs.forEach(t => t.classList.remove('active'));
                    animeGrids.forEach(grid => grid.classList.remove('active'));


                    this.classList.add('active');


                    const season = this.getAttribute('data-season');
                    const targetGrid = document.querySelector(`#resources #${season}`);
                    if (targetGrid) {
                        targetGrid.classList.add('active');