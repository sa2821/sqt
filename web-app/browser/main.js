import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;


let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

/*document.documentElement.style.setProperty("--next-grid-rows", next_grid_rows);
document.documentElement.style.setProperty("--next-grid-columns", next_grid_columns);

document.documentElement.style.setProperty("--hold-grid-rows", hold_grid_rows);
document.documentElement.style.setProperty("--hold-grid-columns", hold_grid_columns);*/

const grid = document.getElementById("grid");
const next_grid = document.getElementById("next_grid");
const hold_grid = document.getElementById("hold_grid");

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const next_cells = range(7).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(6).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    next_grid.append(row);
    return rows;
});


const hold_cells = range(7).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(6).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    hold_grid.append(row);
    return rows;
});


const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
    update_next_grid();
    update_hold_grid();
};

const update_next_grid = function() {
    next_cells.forEach(function(line, line_index) {
        line.forEach(function(cell, column_index) {
            //const cell = next_cells[line_index][column_index];
            cell.className = "cell";
            cell.backgroundColor = "";
        });
    });

    game.next_tetromino.grid.forEach(function(line, line_index) { 
        line.forEach(function(block, column_index) {
            const cell = next_cells[line_index + 3][column_index + 1];
            cell.className = "cell " + block;
        });
    });
};

const update_hold_grid = function() {
    hold_cells.forEach(function(line, line_index) {
        line.forEach(function(block, column_index) {
            const cell = hold_cells[line_index][column_index];
            cell.className = "cell";
            cell.backgroundColor = "";
        });
    });

    if (game.hold_tetromino) {
        game.hold_tetromino.grid.forEach(function(line, line_index) { // When changed to held_tetromino.grid the game breaks
            line.forEach(function(block, column_index) {
                const cell = hold_cells[line_index + 3][column_index + 1];
                cell.className = "cell " + block;
            });
        });
    }
};


// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
