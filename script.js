window.onload = function() {
    const playerContainer = document.getElementById('player-container');
    const player = document.getElementById('player');
    const ropePath = document.getElementById('rope-path');
    const scoreValue = document.getElementById('score-value');
    const speedValue = document.getElementById('speed-value');
    const jumpHeightValue = document.getElementById('jump-height-value');
    const startButton = document.getElementById('start-button');
    const gameArea = document.getElementById('game-area');

    let score = 0;
    let isJumping = false;
    let ropeAngle = 0;
    let gameInterval;
    let baseSpeed = 3;
    let currentSpeed = baseSpeed;
    let jumpCount = 0;
    let currentJumpHeight = 0;
    const MAX_JUMP_HEIGHT = 50;

    function jump() {
        if (!isJumping) {
            isJumping = true;
            let jumpHeight = 0;
            const jumpInterval = setInterval(() => {
                if (jumpHeight < MAX_JUMP_HEIGHT) {
                    jumpHeight += 5;
                    playerContainer.style.bottom = jumpHeight + 'px';
                    currentJumpHeight = jumpHeight;
                    jumpHeightValue.textContent = currentJumpHeight;
                    
                    if (jumpHeight === 5) {
                        player.classList.add('jumping');
                    }
                } else {
                    clearInterval(jumpInterval);
                    const fallInterval = setInterval(() => {
                        if (jumpHeight > 0) {
                            jumpHeight -= 5;
                            playerContainer.style.bottom = jumpHeight + 'px';
                            currentJumpHeight = jumpHeight;
                            jumpHeightValue.textContent = currentJumpHeight;
                        } else {
                            clearInterval(fallInterval);
                            isJumping = false;
                            currentJumpHeight = 0;
                            jumpHeightValue.textContent = currentJumpHeight;
                            player.classList.remove('jumping');
                        }
                    }, 20);
                }
            }, 20);
        }
    }

    function moveRope() {
        ropeAngle += currentSpeed;
        if (ropeAngle >= 360) ropeAngle = 0;
        
        const radians = ropeAngle * Math.PI / 180;
        const amplitude = 150;
        const y = amplitude * Math.abs(Math.sin(radians));
        
        const path = `M0,400 Q150,${400 - y} 300,400`;
        ropePath.setAttribute('d', path);

        checkCollision(400 - y);
        console.log('Rope path:', path);  // 디버깅용 로그 추가
    }

    function checkCollision(ropeHeight) {
        const playerBottom = parseInt(playerContainer.style.bottom || '0');
        const playerHeight = playerContainer.offsetHeight;

        if (ropeHeight <= 5 && playerBottom < 5) {
            endGame();
        } else if (ropeHeight <= playerHeight && playerBottom >= ropeHeight - 5) {
            score++;
            jumpCount++;
            scoreValue.textContent = score;
            
            if (jumpCount % 3 === 0) {
                randomizeSpeed();
            }
            
            if (jumpCount % 5 === 0) {
                baseSpeed++;
                currentSpeed = baseSpeed;
            }
            
            updateSpeedDisplay();
        }
    }

    function randomizeSpeed() {
        const minSpeed = Math.max(1, baseSpeed - 2);
        const maxSpeed = baseSpeed + 2;
        currentSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        currentSpeed = Math.round(currentSpeed * 10) / 10;
    }

    function updateSpeedDisplay() {
        speedValue.textContent = currentSpeed.toFixed(1);
    }

    function startGame() {
        console.log('Game started');
        score = 0;
        jumpCount = 0;
        baseSpeed = 3;
        currentSpeed = baseSpeed;
        scoreValue.textContent = score;
        updateSpeedDisplay();
        jumpHeightValue.textContent = '0';
        startButton.disabled = true;
        
        // 로프 초기화
        moveRope();
        
        gameInterval = setInterval(moveRope, 20);
        document.addEventListener('keydown', handleKeyPress);
    }

    function endGame() {
        clearInterval(gameInterval);
        alert(`게임 오버! 최종 점수: ${score}`);
        startButton.disabled = false;
        document.removeEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(e) {
        if (e.code === 'Space') {
            jump();
        }
    }

    startButton.addEventListener('click', startGame);

    // 페이지 로드 시 강아지 이미지 위치 초기화
    playerContainer.style.bottom = '0px';
    console.log('Page loaded');

    // 이미지 로딩 확인
    player.onload = () => console.log('Image loaded successfully');
    player.onerror = () => console.log('Error loading image');

    console.log('Script initialized');
};
