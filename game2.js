const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
const messageElement = document.getElementById('message');

let tiles = [];
const size = 4; // 4x4 puzzle
const totalTiles = size * size;

// Image paths for the tiles (1 to 15)
const images = [
    'images/images_g2_1/image1.jpg',
    'images/images_g2_1/image2.jpg',
    'images/images_g2_1/image3.jpg',
    'images/images_g2_1/image4.jpg',
    'images/images_g2_1/image5.jpg',
    'images/images_g2_1/image6.jpg',
    'images/images_g2_1/image7.jpg',
    'images/images_g2_1/image8.jpg',
    'images/images_g2_1/image9.jpg',
    'images/images_g2_1/image10.jpg',
    'images/images_g2_1/image11.jpg',
    'images/images_g2_1/image12.jpg',
    'images/images_g2_1/image13.jpg',
    'images/images_g2_1/image14.jpg',
    'images/images_g2_1/image15.jpg'
];

function initTiles() {
    tiles = [];
    for (let i = 0; i < totalTiles; i++) {
        tiles.push(i);
    }
}

function drawPuzzle() {
    puzzleContainer.innerHTML = '';
    tiles.forEach((tile, index) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        if (tile !== 0) { // Skip the empty tile (0)
            const img = document.createElement('img');
            // Assign image based on tile number (offset by -1 because arrays are 0-indexed)
            img.src = images[tile - 1];
            piece.appendChild(img);
            piece.addEventListener('click', () => moveTile(index));
        } else {
            piece.style.background = 'transparent'; // Empty tile
        }

        puzzleContainer.appendChild(piece);
    });
}

function shuffleTiles() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - size, emptyIndex + size];

    if (validMoves.includes(index)) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        drawPuzzle();
        checkWin();
    }
}

function checkWin() {
    if (tiles.join(',') === [...Array(totalTiles).keys()].join(',')) {
        messageElement.innerText = "🎉 Congratulations! You've solved the puzzle! 🎉";
    }
}

shuffleButton.addEventListener('click', () => {
    initTiles();
    shuffleTiles();
    drawPuzzle();
    messageElement.innerText = '';
});

// Initialize the puzzle
initTiles();
drawPuzzle();
