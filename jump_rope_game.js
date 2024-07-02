function jump() {
    if (!isJumping) {
        isJumping = true;
        player.style.bottom = '100px';
        setTimeout(() => {
            player.style.bottom = '0px';
            isJumping = false;
        }, 500);
    }
}