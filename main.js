const cols = 7, rows = cols - 1;
const _width = 700, _height = 600;
const s = _width / cols;
const strokeWeightValue = 5;
let grid = (() => {
    let a = [];
    for (let i = 0; i < 7; i++) a.push([]);
    return a;
})();

class Player {
    constructor(startPlayer) {
        this.current = startPlayer === "Yellow";
    }
    set current(value) {
        document.getElementById("currentPlayer").textContent = value;
        this._current = value;
    }
    get current() {
        return this._current;
    }
}
const player = new Player("Red");

function setup() {
    createCanvas(_width, _height);
}
function draw() {
    background(0);
    drawLines();
    displayPlates();
}

function mouseReleased() {
    const x = floor(mouseX / s);
    if(grid[x].length < rows) grid[x].push(player.current);
    // checkForWin(x, floor(mouseY / s));
    player.current = !player.current;
}

function drawLines() {
    push();
    stroke(255);
    for (let i = 0; i < grid.length; i++) {
        line(i * s, 0, i * s, _height);
        line(0, i * s, _width, i * s);
    }
    line(_width, 0, _width, _height);
    pop();
}

function displayPlates() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            push();
            if(grid[i][j]) fill(255,240,0);
            else fill(155, 0, 0);
            circle(i * s + s / 2, _height - j * s - s / 2, s);
            pop();
        }
        
    }
}

function checkForWin(i, jI) {
    let possibilities = [];
    const j = jI || grid[i].length - 1;
    const current = grid[i][j];

    // negative diagonal
    if(checkNeighbours(i - 1, j + 1, current)) {
        possibilities.push(0);
    } else if(checkNeighbours(i + 1, j - 1, current)) {
        possibilities.push(8);
    }

    // vertical
    if(checkNeighbours(i, j + 1, current)) {
        possibilities.push(1);
    } else if(checkNeighbours(i, j - 1, current)) {
        possibilities.push(7);
    }

    // positive diagonal
    if(checkNeighbours(i + 1, j + 1, current)) {
        possibilities.push(2);
    } else if(checkNeighbours(i - 1, j - 1, current)) {
        possibilities.push(6);
    }

    // horizontal
    if(checkNeighbours(i - 1, j, current)) {
        possibilities.push(3);
    } else if(checkNeighbours(i + 1, j, current)) {
        possibilities.push(5);
    }

    for (let i = 0; i < possibilities.length; i++) {
        console.log(recurseInDirection(i, j, possibilities[i], 0));
        
    }
}

function checkNeighbours(i, j, current) {
    try{
        return grid[i][j] === current;
    } catch(e){}
    return false;
}

function recurseInDirection(i, j, dir, recursionCount) {
    if(!checkForWin(i, j, dir)) return 1;
    else if(recursionCount > 2) return 1;

    let count = 0;
    switch (dir) {
        case 0:
            count += recurseInDirection(i - 1, j + 1, dir, recursionCount + 1);
            break;
        case 1:
            count += recurseInDirection(i, j + 1, dir, recursionCount + 1);
            break;
        case 2:
            count += recurseInDirection(i + 1, j + 1, dir, recursionCount + 1);
            break;
        case 3:
            count += recurseInDirection(i - 1, j, dir, recursionCount + 1);
            break;
        case 5:
            count += recurseInDirection(i + 1, j, dir, recursionCount + 1);
            break;
        case 6:
            count += recurseInDirection(i - 1, j - 1, dir, recursionCount + 1);
            break;
        case 7:
            count += recurseInDirection(i, j - 1, dir, recursionCount + 1);
            break;
        case 8:
            count += recurseInDirection(i + 1, j - 1, dir, recursionCount + 1);
            break;
    }
    return count += 1;
}

function testCheckNeighbours() {
    const j = grid[i].length - 1;
    const current = grid[i][j];
    //top right
    if(checkNeighbours(i + 1, j + 1, current)) console.log("top right");
    // right
    if(checkNeighbours(i + 1, j, current)) console.log("right");
    // bottom right
    if(checkNeighbours(i + 1, j - 1, current)) console.log("bottom right");
    //bottom
    if(checkNeighbours(i, j - 1, current)) console.log("bottom");
    // bottom left
    if(checkNeighbours(i - 1, j - 1, current)) console.log("bottom left");
    // left
    if(checkNeighbours(i - 1, j, current)) console.log("left");
    //top left
    if(checkNeighbours(i - 1, j + 1, current)) console.log("top left");
}