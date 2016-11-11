interface Drawer {
    draw();
}

class CanvasDrawer implements Drawer {

    private canvas: HTMLCanvasElement;
    private grid: Grid;

    constructor(canvas: HTMLCanvasElement, grid: Grid) {
        this.canvas = canvas;
        this.grid = grid;
    }

    draw() {

        const c = this.canvas;
        const ctx = c.getContext('2d');
        const xLimit = this.grid.getWidth();
        const yLimit = this.grid.getHeight();
        const cellWidth = 10;
        const cellHeight = 10;

        for (let i = 0; i < xLimit; i++) {
            for (let j = 0; j < yLimit; j++) {                
                let cell = this.grid.getCells()[i][j];
                ctx.fillStyle = cell.getState() === CellState.Alive ? 'black': 'white';
                ctx.fillRect(cell.getX() * cellWidth, cell.getY() * cellHeight, cellWidth, cellHeight);
            }
        }
    }
}

enum CellState {
    Dead = 0,
    Alive = 1
}

class Cell {

    private x: number;
    private y: number;
    private state: CellState;

    constructor(x: number, y: number, state: CellState) {
        this.x = x;
        this.y = y;
        this.state = state;
    }
    getX(): number {
        return this.x;
    }
    getY(): number {
        return this.y;
    }
    getState(): CellState {
        return this.state;
    }
    setState(state: CellState) {
        this.state = state;
    }
    transition(liveNeighbours: number) {
        if (liveNeighbours < 2) {
            this.setState(CellState.Dead);
        } else if (liveNeighbours === 2 || liveNeighbours === 3) {
            this.setState(CellState.Alive);
        } else if (liveNeighbours > 3) {
            this.setState(CellState.Dead);
        } else if (liveNeighbours === 3) {
            this.setState(CellState.Alive);
        }
    }
}

class Boundary {

    private value: number;
    private limit: number;

    constructor(value: number, limit: number) {
        this.value = value;
        this.limit = limit;
    }
    getLower() {
        let lower = this.value - 1;
        return lower < 0 ? 0 : lower;
    }

    getUpper() {
        let upper = this.value + 1;
        return upper > this.limit ? this.limit : upper;
    }
}

class Grid {

    private width: number;
    private height: number;
    private cells: Cell[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.generate();
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getCells() {
        return this.cells;
    }

    private generate() {
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let j = 0; j < this.height; j++) {
                let cell = new Cell(i, j, Math.round(Math.random()));
                row.push(cell);
            }
            this.cells.push(row);
        }
    }

    public tick() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.interact(this.cells[i][j]);
            }
        }
    }

    private interact(cell: Cell) {

        let xBound = new Boundary(cell.getX(), this.width - 1);
        let yBound = new Boundary(cell.getY(), this.height - 1);
        let liveNeighbours = 0;

        for (let i = xBound.getLower(); i <= xBound.getUpper(); i++) {
            for (let j = yBound.getLower(); j <= yBound.getUpper(); j++) {
                if (i === cell.getX() && j === cell.getY()) {
                    continue;
                }
                if (this.cells[i][j].getState() === CellState.Alive) {
                    liveNeighbours++;
                }
            }
        }

        cell.transition(liveNeighbours);
    }
}