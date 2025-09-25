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
    const x = floor(mouseX / s), y = floor(5 / (mouseY / s));
    if(!(grid[x].length < rows)) return; 
    grid[x].push(player.current);
    checkForWin(x, y);
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
    if(checkNeighbour(i - 1, j + 1, current)) {
        possibilities.push({x: -1, y: 1});
    } else if(checkNeighbour(i + 1, j - 1, current)) {
        possibilities.push({x: 1, y: -1});
    }

    // vertical
    if(checkNeighbour(i, j + 1, current)) {
        possibilities.push({x: 0, y: 1});
    } else if(checkNeighbour(i, j - 1, current)) {
        possibilities.push({x: 0, y: -1});
    }

    // positive diagonal
    if(checkNeighbour(i + 1, j + 1, current)) {
        possibilities.push({x: 1, y: 1});
    } else if(checkNeighbour(i - 1, j - 1, current)) {
        possibilities.push({x: -1, y: -1});
    }

    // horizontal
    if(checkNeighbour(i - 1, j, current)) {
        possibilities.push({x: -1, y: 0});
    } else if(checkNeighbour(i + 1, j, current)) {
        possibilities.push({x: 1, y: 0});
    }

    for (let k = 0; k < possibilities.length; k++) {
        let count = recurseInDirection(i, j, possibilities[k], current, 0);
        if(count === 4) {
            alert(`${current} has won`);
        } else if(count + recurseInDirection(i, j, {x: possibilities[k].x * -1, y: possibilities[k].y * -1}, current, 0) - 1 === 4) {
            alert(`${current} has won`);
        }
    }
}

function checkNeighbour(i, j, current) {
    if(current === undefined) return;
    try{
        return grid[i][j] === current;
    } catch(e){}
    return false;
}

function recurseInDirection(i, j, dir, current, recursionCount) {
    if(!checkNeighbour(i + dir.x, j + dir.y, current)) return 1;
    else if(recursionCount > 2) return 1;

    let count = 0;
    count += recurseInDirection(i + dir.x, j + dir.y, dir, current, recursionCount + 1)
    return count += 1;
}