// Initialize YouTube Iframe API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer;
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'BmGt9dBphSo',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'rel': 0
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Content Hydration ---
    const urlParams = new URLSearchParams(window.location.search);
    const passId = urlParams.get('id');

    async function hydratePassData() {
        if (!passId) return; // Load default values if no ID provided

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
            if (data.img) {
                if (document.getElementById('dynImage')) document.getElementById('dynImage').src = data.img;
                if (document.getElementById('dynDreamImage')) document.getElementById('dynDreamImage').src = data.img;
            }
        } catch (error) {
            console.error('Error fetching pass data:', error);
        }
    }
    
    // Call the async function
    hydratePassData();
    // ---------------------------------

    const revealBtn = document.getElementById('revealBtn');
    const countdownEl = document.getElementById('countdown');
    const destValueEl = document.getElementById('destinationValue');
    const boardingPass = document.getElementById('boardingPass');
    const viewInvBtn = document.getElementById('viewInvitationBtn');

    let count = 5;

    revealBtn.addEventListener('click', () => {
        // Play youtube music
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.playVideo();
        }
        
        // Change button state
        revealBtn.style.opacity = '0.5';
        revealBtn.style.pointerEvents = 'none';
        revealBtn.innerHTML = 'REVEALING...';
        
        // Hide question mark, show countdown
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
        void countdownEl.offsetWidth; // trigger reflow
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
        // Flip the entire boarding pass 180 degrees to reveal the image on the back
        boardingPass.classList.add('is-flipped');
        
        // Show view invitation button after flip completes
        setTimeout(() => {
            viewInvBtn.style.display = 'inline-block';
            setTimeout(() => {
                viewInvBtn.classList.add('visible');
            }, 50);
        }, 1500);
    }

    // ==========================================
    // CINEMATIC TRANSITION TO THIRD PAGE
    // ==========================================
    viewInvBtn.addEventListener('click', () => {
        // 1. Fade out the boarding pass entirely
        document.querySelector('.app-container').classList.add('fade-out');
        document.querySelector('.background-container').style.opacity = '0';
        
        const jet = document.getElementById('jetSilhouette');
        const dreamSeq = document.getElementById('dreamSequence');
        const scene1 = document.getElementById('scene1');
        const scene2 = document.getElementById('scene2');
        const scene3 = document.getElementById('scene3');
        const goldenFlash = document.querySelector('.golden-flash');
        
        const invContainer = document.getElementById('invitationContainer');
        const invCard = document.getElementById('invitationCard');
        const invBg = document.querySelector('.invitation-bg');
        
        // 2. The Jet Flyby
        setTimeout(() => {
            jet.classList.add('fly');
        }, 400);

        // 3. Dream Sequence Starts
        setTimeout(() => {
            dreamSeq.classList.add('active');
            scene1.classList.add('visible');
            scene1.classList.add('ken-burns');
        }, 800);

        // Scene 2 crossfade
        setTimeout(() => {
            scene2.classList.add('visible');
            scene2.classList.add('ken-burns');
        }, 2000);

        // Scene 3 crossfade
        setTimeout(() => {
            scene3.classList.add('visible');
            scene3.classList.add('ken-burns');
        }, 3200);

        // 4. Golden Blur Transition
        setTimeout(() => {
            goldenFlash.classList.add('flash');
            // Show the 3rd page container (bg starts blurring immediately)
            invContainer.classList.add('visible');
            invBg.classList.add('blur-heavy');
        }, 4400);

        // 5. Dream Sequence Ends & Card Drops
        setTimeout(() => {
            dreamSeq.classList.remove('active');
            goldenFlash.classList.remove('flash');
            invCard.classList.add('falling');
        }, 5200);

        // 6. Impact Moment (Card lands in center)
        setTimeout(() => {
            invCard.classList.remove('falling');
            invCard.classList.add('landed');
        }, 7700);

        // 7. The Expansion (Card unfolds/scales to become the UI)
        setTimeout(() => {
            invCard.classList.remove('landed');
            invCard.classList.add('expanding');
        }, 8700);
    });
});
