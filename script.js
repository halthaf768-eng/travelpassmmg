document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const passId = urlParams.get('id');
    const shouldAutoplay = urlParams.get('autoplay') === '1';
    const customMusic = document.getElementById('customMusic');

    async function hydratePassData() {
        if (!passId) return;

        try {
            const response = await fetch(`/api/passes/${passId}`);
            if (!response.ok) throw new Error('Pass not found');
            const data = await response.json();

            if (data.name && document.getElementById('dynName')) {
                document.getElementById('dynName').textContent = data.name.toUpperCase();
            }
            if (data.date && document.getElementById('dynDate')) {
                document.getElementById('dynDate').textContent = data.date;
            }
            if (data.dest && document.getElementById('dynDest')) {
                document.getElementById('dynDest').textContent = data.dest;
            }
            if (data.duration && document.getElementById('dynDuration')) {
                document.getElementById('dynDuration').textContent = data.duration;
            }
            if (data.travelers && document.getElementById('dynTravelers')) {
                document.getElementById('dynTravelers').textContent = data.travelers;
            }
            if (data.msg && document.getElementById('dynMessage')) {
                document.getElementById('dynMessage').innerHTML = data.msg.replace(/\n/g, '<br>');
            }
            if (data.img && document.getElementById('dynImage')) {
                document.getElementById('dynImage').src = data.img;
            }
            if (data.music && customMusic) {
                customMusic.src = data.music;
                if (shouldAutoplay) {
                    customMusic.play().catch((error) => {
                        console.warn('Preview music could not autoplay:', error);
                    });
                }
            }

            ['scene1', 'scene2', 'scene3', 'scene4'].forEach((key, index) => {
                const image = document.getElementById(`dreamImage${index + 1}`);
                if (data[key] && image) {
                    image.src = data[key];
                }
            });
        } catch (error) {
            console.error('Error fetching pass data:', error);
        }
    }

    hydratePassData();

    const revealBtn = document.getElementById('revealBtn');
    const countdownEl = document.getElementById('countdown');
    const destValueEl = document.getElementById('destinationValue');
    const boardingPass = document.getElementById('boardingPass');
    const viewInvBtn = document.getElementById('viewInvitationBtn');

    let count = 5;

    revealBtn.addEventListener('click', () => {
        if (customMusic && customMusic.src) {
            customMusic.play().catch((error) => {
                console.warn('Music could not start:', error);
            });
        }

        revealBtn.style.opacity = '0.5';
        revealBtn.style.pointerEvents = 'none';
        revealBtn.innerHTML = 'REVEALING...';

        destValueEl.style.opacity = '0';
        setTimeout(() => {
            destValueEl.style.display = 'none';
            countdownEl.style.display = 'inline-block';
            startCountdown();
        }, 300);
    });

    function startCountdown() {
        countdownEl.style.opacity = '1';
        countdownEl.textContent = count;

        countdownEl.classList.remove('animate');
        void countdownEl.offsetWidth;
        countdownEl.classList.add('animate');

        const interval = setInterval(() => {
            count--;

            if (count > 0) {
                countdownEl.textContent = count;
                countdownEl.classList.remove('animate');
                void countdownEl.offsetWidth;
                countdownEl.classList.add('animate');
            } else {
                clearInterval(interval);
                finishReveal();
            }
        }, 1000);
    }

    function finishReveal() {
        boardingPass.classList.add('is-flipped');

        setTimeout(() => {
            viewInvBtn.style.display = 'inline-block';
            setTimeout(() => {
                viewInvBtn.classList.add('visible');
            }, 50);
        }, 1500);
    }

    viewInvBtn.addEventListener('click', () => {
        document.querySelector('.app-container').classList.add('fade-out');
        document.querySelector('.background-container').style.opacity = '0';

        const jet = document.getElementById('jetSilhouette');
        const dreamSeq = document.getElementById('dreamSequence');
        const scenes = [
            document.getElementById('scene1'),
            document.getElementById('scene2'),
            document.getElementById('scene3'),
            document.getElementById('scene4')
        ];
        const goldenFlash = document.querySelector('.golden-flash');
        const invContainer = document.getElementById('invitationContainer');
        const invCard = document.getElementById('invitationCard');
        const invBg = document.querySelector('.invitation-bg');

        setTimeout(() => {
            jet.classList.add('fly');
        }, 400);

        setTimeout(() => {
            dreamSeq.classList.add('active');
        }, 800);

        scenes.forEach((scene, index) => {
            setTimeout(() => {
                scene.classList.add('visible');
                scene.classList.add('ken-burns');
                scene.classList.add('spin-burst');
            }, 800 + (index * 850));
        });

        setTimeout(() => {
            goldenFlash.classList.add('flash');
            invContainer.classList.add('visible');
            invBg.classList.add('blur-heavy');
        }, 4600);

        setTimeout(() => {
            dreamSeq.classList.remove('active');
            goldenFlash.classList.remove('flash');
            invCard.classList.add('falling');
        }, 5400);

        setTimeout(() => {
            invCard.classList.remove('falling');
            invCard.classList.add('landed');
        }, 7900);

        setTimeout(() => {
            invCard.classList.remove('landed');
            invCard.classList.add('expanding');
        }, 8900);
    });
});
