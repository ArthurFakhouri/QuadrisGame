let elements = 0;
let interval = null;
let moveValue = 0;
let operator = -1;
let speed = 100;

function createBlock(amount) {
    let html = '';
    for (let i = 0; i < amount; i++)
        html += '<div class="block"></div>';
    return html;
}

function createPiece(amountBlocks) {
    let html = `<div class="piece">`;
    html += createBlock(amountBlocks);
    html += '</div>';
    elements++;
    return html;
}

function validateCollide(piece) {
    let blocks = piece.children.length;
    if (moveValue === 0 || (moveValue + (blocks * 50)) === 750)
        operator *= -1;
}

function addPiece(amount) {
    let display = document.querySelector('#display');
    let html = createPiece(amount);

    display.innerHTML = html + display.innerHTML;
}

function playAudio(audio) {
    audio.volume = .2;
    audio.loop = true;
    audio.playbackRate = 1;
    audio.play();
}

function startGame() {
    let display = document.querySelector('#display');
    let btn = document.querySelector('button');
    btn.style.display = 'none';
    let audio = document.querySelector('audio');
    playAudio(audio, speed);
    let html = createPiece(3);
    let size;
    html = createPiece(3) + html;

    display.innerHTML = html;
    size = display.children.length;

    display.children[size - 1].style.transform = "translateX(300px)";
    createInterval();
}

function createInterval() {
    interval = setInterval(() => {
        let piece = display.children[0];
        validateCollide(piece);
        moveValue = moveValue + 50 * operator;
        piece.style.transform = `translateX(${moveValue}px)`
    }, speed);
}

function getPosition(node) {
    return node.style.transform.replace(/[^0-9]/g, '');
}

function calculateBlocks() {
    let display = document.querySelector('#display');
    let currentPiece = display.children[0];
    let deltaPiece = display.children[1];
    let currentPosIni = Number(getPosition(currentPiece));
    let deltaPosIni = Number(getPosition(deltaPiece));
    let currentPosEnd = currentPosIni + ((currentPiece.children.length - 1) * 50);
    let deltaPosEnd = deltaPosIni + ((deltaPiece.children.length - 1) * 50);
    let blocks = 0;

    for (let i = deltaPosIni; i <= deltaPosEnd; i += 50)
        if (i >= currentPosIni && i <= currentPosEnd)
            blocks++;

    let tl = currentPiece.children.length - blocks;
    for (let i = 0; i < tl; i++) {
        currentPiece.removeChild(currentPiece.firstChild)
        if (currentPosIni < deltaPosIni)
            currentPiece.style.transform = `translateX(${deltaPosIni}px)`;
    }
    return blocks;
}

function resetGame() {
    clearInterval(interval);
    elements = 0;
    moveValue = 0;
    operator = -1;
    speed = 100;
    document.querySelector('button').style.display = 'inline';
    document.querySelector('audio').pause();
    document.querySelector('audio').load();
    document.querySelector('#display').innerHTML = ''
}

document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        let blocks = calculateBlocks();
        if (elements === 10 && blocks === 1) {
            alert('Y O U  W I N  !!!!! CONGRATULATIONS!');
            resetGame();
            return;
        }
        if (blocks === 0) {
            alert('You Lose!');
            resetGame();
            return;
        }
        speed -= 8;
        let audio = document.querySelector('audio');
        audio.playbackRate = 1 + (((100-speed) * .7)/64);
        clearInterval(interval);
        createInterval();
        moveValue = 0;
        operator = -1;
        if (elements === 3 && blocks === 3)
            blocks--;
        if (elements === 6 && blocks === 2)
            blocks--;
        addPiece(blocks);
    }
});