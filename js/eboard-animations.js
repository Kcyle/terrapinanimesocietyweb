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