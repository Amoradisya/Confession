document.addEventListener("DOMContentLoaded", () => {
    createFloatingHearts();
    setupCardHeartIcons();

    const cupidBow = document.getElementById("cupidBow");
    const envelopeTarget = document.getElementById("envelopeTarget");
    const flyingArrow = document.getElementById("flyingArrow");
    const gameContainer = document.getElementById("gameContainer");
    const letterModal = document.getElementById("letterModal");
    const resultModal = document.getElementById("resultModal");
    const missedText = document.getElementById("missedText");

    const btnYes = document.getElementById("btnYes");
    const btnNo = document.getElementById("btnNo");

    let isFlying = false;

    // 1. ROTASI BUSUR
    document.addEventListener("mousemove", (e) => {
        if (isFlying) return;
        const rect = cupidBow.getBoundingClientRect();
        const bowX = rect.left + rect.width / 2;
        const bowY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - bowY, e.clientX - bowX) * (180 / Math.PI);
        cupidBow.style.transform = `rotate(${angle + 90}deg)`;
    });

    // 2. NEMBAK PANAH
    document.addEventListener("click", (e) => {
        if (isFlying || letterModal.style.display === "block" || resultModal.style.display === "block") return;
        if (e.target.closest("#btnYes") || e.target.closest("#btnNo")) return;

        isFlying = true;
        missedText.style.display = "none";

        flyingArrow.classList.remove("fade-out");
        flyingArrow.style.opacity = "1";

        const bowRect = cupidBow.getBoundingClientRect();
        const startX = bowRect.left + bowRect.width / 2;
        const startY = bowRect.top + bowRect.height / 2;

        const targetRect = envelopeTarget.getBoundingClientRect();
        const isHit = (
            e.clientX >= targetRect.left &&
            e.clientX <= targetRect.right &&
            e.clientY >= targetRect.top &&
            e.clientY <= targetRect.bottom
        );

        const endX = isHit ? (targetRect.left + targetRect.width / 2) : e.clientX;
        const endY = isHit ? (targetRect.top + targetRect.height / 2) : e.clientY;

        const dx = endX - startX;
        const dy = endY - startY;
        const angleRadian = Math.atan2(dy, dx);
        const angleDegree = angleRadian * (180 / Math.PI);

        flyingArrow.style.display = "block";

        const duration = 400;
        const startTime = performance.now();

        function animateArrow(currentTime) {
            const elapsed = currentTime - startTime;
            const t = Math.min(elapsed / duration, 1);

            const currentX = startX + dx * t;
            const currentY = startY + dy * t;

            flyingArrow.style.left = `${currentX - 25}px`;
            flyingArrow.style.top = `${currentY - 45}px`;
            flyingArrow.style.transform = `rotate(${angleDegree + 90}deg)`;

            if (t < 1) {
                requestAnimationFrame(animateArrow);
            } else {
                flyingArrow.classList.add("fade-out");

                setTimeout(() => {
                    flyingArrow.style.display = "none";
                    flyingArrow.classList.remove("fade-out");
                    isFlying = false;

                    if (isHit) {
                        gameContainer.style.display = "none";
                        letterModal.style.display = "block";
                    } else {
                        missedText.style.display = "block";
                    }
                }, 400);
            }
        }

        requestAnimationFrame(animateArrow);
    });

    // 3. TOMBOL NO KABUR
    function moveNoButtonRandomly() {
        const currentWidth = btnNo.offsetWidth;
        const currentHeight = btnNo.offsetHeight;

        btnNo.style.width = `${currentWidth}px`;
        btnNo.style.height = `${currentHeight}px`;
        btnNo.style.position = "fixed";

        const padding = 30;
        const maxX = window.innerWidth - currentWidth - padding;
        const maxY = window.innerHeight - currentHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
    }

    btnNo.addEventListener("mouseover", moveNoButtonRandomly);
    btnNo.addEventListener("click", moveNoButtonRandomly);

    // 4. KLIK YES -> LEDAKAN LOVE SLOW-MOTION MEMANCAR 360 DERAJAT
    btnYes.addEventListener("click", () => {
        letterModal.style.transition = "opacity 0.2s ease";
        letterModal.style.opacity = "0";

        setTimeout(() => {
            letterModal.style.display = "none";
            letterModal.style.opacity = "1";

            // Tampilkan modal hasil berisi karakter pelukan
            resultModal.style.display = "block";

            // Pemicu ledakan love bertebaran dari pusat layar ke seluruh penjuru (Slow-Motion)
            triggerGrandExplosion(100);

            // Pemicu hujan love berdebar jatuh dari atas
            triggerHeartShower();
        }, 200);
    });
});

// SETUP 3 LOVE HORIZONTAL
function setupCardHeartIcons() {
    const heartContainers = document.querySelectorAll(".heart-icons");
    const svgContent = `
        <div class="heart-icon-item">
            <svg viewBox="0 0 32 32" class="heart-svg">
                <path d="M23.6,2c-3.3,0-6.3,1.6-8.1,4.1C13.7,3.6,10.7,2,7.4,2C3.3,2,0,5.3,0,9.4c0,7.1,10.6,14.7,15.5,18.1c0.3,0.2,0.7,0.2,1,0C21.4,24.1,32,16.5,32,9.4C32,5.3,28.7,2,23.6,2z"/>
            </svg>
        </div>
    `;

    heartContainers.forEach(container => {
        container.innerHTML = svgContent + svgContent + svgContent;
    });
}

// BACKGROUND FLOATING HEARTS
function createFloatingHearts() {
    const container = document.getElementById("heartsBg");
    if (!container) return;
    container.innerHTML = "";

    const svgHeart = `
        <svg viewBox="0 0 32 32" class="heart-svg">
            <path d="M23.6,2c-3.3,0-6.3,1.6-8.1,4.1C13.7,3.6,10.7,2,7.4,2C3.3,2,0,5.3,0,9.4c0,7.1,10.6,14.7,15.5,18.1c0.3,0.2,0.7,0.2,1,0C21.4,24.1,32,16.5,32,9.4C32,5.3,28.7,2,23.6,2z"/>
        </svg>
    `;

    for (let i = 0; i < 40; i++) {
        const heart = document.createElement("div");
        heart.classList.add("small-heart");
        heart.innerHTML = svgHeart;
        heart.style.left = `${Math.random() * 100}vw`;

        const size = 12 + Math.random() * 16;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        const duration = 7 + Math.random() * 5;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${Math.random() * 8}s`;

        container.appendChild(heart);
    }
}

// LEDAKAN LOVE SLOW-MOTION DARI TENGAH MONITOR
function triggerGrandExplosion(count) {
    let container = document.getElementById("heartBurst");

    if (!container) {
        container = document.createElement("div");
        container.id = "heartBurst";
        container.className = "heart-burst-container";
        document.body.appendChild(container);
    }

    container.innerHTML = "";

    const colors = ["#ff4d6d", "#ff758f", "#ff85a2", "#ffccd5", "#d84a65", "#ffffff", "#ff1744"];

    for (let i = 0; i < count; i++) {
        const heart = document.createElement("div");
        heart.classList.add("grand-burst-heart");

        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.innerHTML = `
            <svg viewBox="0 0 32 32" class="beating-heart-svg">
                <path fill="${color}" d="M23.6,2c-3.3,0-6.3,1.6-8.1,4.1C13.7,3.6,10.7,2,7.4,2C3.3,2,0,5.3,0,9.4c0,7.1,10.6,14.7,15.5,18.1c0.3,0.2,0.7,0.2,1,0C21.4,24.1,32,16.5,32,9.4C32,5.3,28.7,2,23.6,2z"/>
            </svg>
        `;

        // Ukuran love bervariasi
        const size = 20 + Math.random() * 36;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        // Arah ledakan 360 derajat memancar merata
        const angle = Math.random() * Math.PI * 2;
        
        // Jarak lemparan meledak sampai ujung monitor
        const distance = 250 + Math.random() * 450; 
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);

        // Durasi diperlambat (1.8s sampai 2.8s)
        const duration = 1.8 + Math.random() * 1.0;
        
        // Efek transisi melambat yang sangat halus
        heart.style.animation = `fireworkExplode ${duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;

        container.appendChild(heart);

        setTimeout(() => heart.remove(), duration * 1000);
    }
}

// HUJAN LOVE FALLING DARI ATAS LAYAR
function triggerHeartShower() {
    let container = document.getElementById("heartBurst");
    if (!container) return;

    const colors = ["#ff4d6d", "#ff758f", "#ff85a2", "#ffccd5", "#d84a65"];

    for (let i = 0; i < 80; i++) {
        const heart = document.createElement("div");
        heart.classList.add("falling-beating-heart");

        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.innerHTML = `
            <svg viewBox="0 0 32 32" class="beating-heart-svg">
                <path fill="${color}" d="M23.6,2c-3.3,0-6.3,1.6-8.1,4.1C13.7,3.6,10.7,2,7.4,2C3.3,2,0,5.3,0,9.4c0,7.1,10.6,14.7,15.5,18.1c0.3,0.2,0.7,0.2,1,0C21.4,24.1,32,16.5,32,9.4C32,5.3,28.7,2,23.6,2z"/>
            </svg>
        `;

        heart.style.left = `${Math.random() * 98}vw`;
        heart.style.top = `${-20 - Math.random() * 40}vh`;

        const size = 18 + Math.random() * 26;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        const fallDuration = 3.8 + Math.random() * 4;
        const swayDuration = 2 + Math.random() * 2;
        const delay = Math.random() * 2;

        heart.style.animation = `
            petalFall ${fallDuration}s linear ${delay}s forwards,
            petalSway ${swayDuration}s ease-in-out ${delay}s infinite alternate
        `;

        container.appendChild(heart);
    }
}