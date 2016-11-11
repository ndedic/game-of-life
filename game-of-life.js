var CanvasDrawer = (function () {
    function CanvasDrawer(canvas, grid) {
        this.canvas = canvas;
        this.grid = grid;
    }
    CanvasDrawer.prototype.draw = function () {
        var c = this.canvas;
        var ctx = c.getContext('2d');
        var xLimit = this.grid.getWidth();
        var yLimit = this.grid.getHeight();
        var cellWidth = 10;
        var cellHeight = 10;
        for (var i = 0; i < xLimit; i++) {
            for (var j = 0; j < yLimit; j++) {
                var cell = this.grid.getCells()[i][j];
                ctx.fillStyle = cell.getState() === CellState.Alive ? 'black' : 'white';
                ctx.fillRect(cell.getX() * cellWidth, cell.getY() * cellHeight, cellWidth, cellHeight);
            }
        }
    };
    return CanvasDrawer;
}());
var CellState;
(function (CellState) {
    CellState[CellState["Dead"] = 0] = "Dead";
    CellState[CellState["Alive"] = 1] = "Alive";
})(CellState || (CellState = {}));
var Cell = (function () {
    function Cell(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }
    Cell.prototype.getX = function () {
        return this.x;
    };
    Cell.prototype.getY = function () {
        return this.y;
    };
    Cell.prototype.getState = function () {
        return this.state;
    };
    Cell.prototype.setState = function (state) {
        this.state = state;
    };
    Cell.prototype.transition = function (liveNeighbours) {
        if (liveNeighbours < 2) {
            this.setState(CellState.Dead);
        }
        else if (liveNeighbours === 2 || liveNeighbours === 3) {
            this.setState(CellState.Alive);
        }
        else if (liveNeighbours > 3) {
            this.setState(CellState.Dead);
        }
        else if (liveNeighbours === 3) {
            this.setState(CellState.Alive);
        }
    };
    return Cell;
}());
var Boundary = (function () {
    function Boundary(value, limit) {
        this.value = value;
        this.limit = limit;
    }
    Boundary.prototype.getLower = function () {
        var lower = this.value - 1;
        return lower < 0 ? 0 : lower;
    };
    Boundary.prototype.getUpper = function () {
        var upper = this.value + 1;
        return upper > this.limit ? this.limit : upper;
    };
    return Boundary;
}());
var Grid = (function () {
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.generate();
    }
    Grid.prototype.getWidth = function () {
        return this.width;
    };
    Grid.prototype.getHeight = function () {
        return this.height;
    };
    Grid.prototype.getCells = function () {
        return this.cells;
    };
    Grid.prototype.generate = function () {
        for (var i = 0; i < this.width; i++) {
            var row = [];
            for (var j = 0; j < this.height; j++) {
                var cell = new Cell(i, j, Math.round(Math.random()));
                row.push(cell);
            }
            this.cells.push(row);
        }
    };
    Grid.prototype.tick = function () {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.interact(this.cells[i][j]);
            }
        }
    };
    Grid.prototype.interact = function (cell) {
        var xBound = new Boundary(cell.getX(), this.width - 1);
        var yBound = new Boundary(cell.getY(), this.height - 1);
        var liveNeighbours = 0;
        for (var i = xBound.getLower(); i <= xBound.getUpper(); i++) {
            for (var j = yBound.getLower(); j <= yBound.getUpper(); j++) {
                if (i === cell.getX() && j === cell.getY()) {
                    continue;
                }
                if (this.cells[i][j].getState() === CellState.Alive) {
                    liveNeighbours++;
                }
            }
        }
        cell.transition(liveNeighbours);
    };
    return Grid;
}());
