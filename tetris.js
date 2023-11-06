var g_board, g_width = 10, g_height = 20, g_tetromino, g_shape, g_speed = 500, g_lastMoveTime, g_lastDropTime,
	g_colors, g_movement, g_levelSpeed, g_fastFallingSpeed, g_movementSpeed, g_isRunning, g_next, g_nextBoard,
	g_score, g_lines, g_level, g_shapeCounts;

g_isRunning = false;
g_movementSpeed = 125;
g_fastFallingSpeed = 25;
g_levelSpeed = 500;
g_movement = "";
g_colors = [
	"white", "green", "blue", "yellow", "red", "orange", "purple"
];
g_shapes = [
	[
		[ 0, 0, 0, 0],
		[ 0, 1, 1, 0],
		[ 0, 1, 1, 0],
		[ 0, 0, 0, 0]
	],
	[
		[ 0, 0, 0, 0, 0],
		[ 0, 0, 1, 1, 0],
		[ 0, 1, 1, 0, 0],
		[ 0, 0, 0, 0, 0]		
	],
	[
		[ 0, 0, 0, 0, 0],
		[ 0, 1, 1, 1, 0],
		[ 0, 1, 0, 0, 0],
		[ 0, 0, 0, 0, 0]
	],
	[
		[ 0, 0, 0, 0],
		[ 1, 1, 1, 1],
		[ 0, 0, 0, 0]		
	],
	[
		[ 0, 0, 0, 0, 0],
		[ 0, 1, 1, 1, 0],
		[ 0, 0, 1, 0, 0],
		[ 0, 0, 0, 0, 0]		
	],
	[
		[ 0, 0, 0, 0, 0],
		[ 0, 1, 1, 1, 0],
		[ 0, 0, 0, 1, 0],
		[ 0, 0, 0, 0, 0]		
	],
	[
		[ 0, 0, 0, 0, 0],
		[ 0, 1, 1, 0, 0],
		[ 0, 0, 1, 1, 0],
		[ 0, 0, 0, 0, 0]		
	]
];
g_shapeCounts = [0, 0, 0, 0, 0, 0, 0];

window.onload = function () {
	g_board = document.getElementById("board");
	g_nextBoard = document.getElementById("nextBoard");
	initBoard(g_board, g_width, g_height);
	initBoard(g_nextBoard, 4, 4);
	for(var i = 0; i < g_shapes.length; i++) {
		var board = document.getElementById("shapeBoard_" + i);
		initBoard(board, 4, 4);
		drawShape(board, { "row": 0, "col": 0, "shape": g_shapes[i], "color": g_colors[i] });		
	}
	startGame();
};

window.onkeydown = function (e) {
	//console.log(e.keyCode);
	
	if(e.keyCode === 37) {
		g_movement = "left";		
	} else if(e.keyCode === 39) {
		g_movement = "right";
	} else if(e.keyCode === 38) {
		g_movement = "up";
	} else if(e.keyCode === 40) {
		g_movement = "down";
	} else {
		g_movement = "";
	}
	//console.log(g_movement);
	g_lastMoveTime = 0;
};

window.onkeyup = function (e) {
	g_movement = "";
	g_lastMoveTime = 0;
};

window.onblur = function (e) {
	g_movement = "";
	g_lastMoveTime = 0;
};

function initBoard(board, width, height) {
	for(var row = 0; row < height; row += 1) {
		var tr = document.createElement("tr");
		tr.dataset.row = row;
		tr.className = "row_" + row;
		for(var col = 0; col < width; col += 1) {
			var td = document.createElement("td");
			td.className = "row_" + row + "_col_" + col;
			td.dataset.col = col;
			td.dataset.isEmpty = "true";
			td.innerHTML = "&nbsp;";
			tr.appendChild(td);
		}
		board.appendChild(tr);
	}
}

function startGame() {	
	g_score = 0;
	g_lines = 0;
	g_level = 1;
	g_shapeCounts = [0, 0, 0, 0, 0, 0, 0];
	updateStats();
	updateScore();
	getNextPiece();
	g_lastDropTime = new Date().getTime();
	g_lastMoveTime = g_lastDropTime;
	g_isRunning = true;
	run();
}

function getNextPiece() {
	var index;
	
	if(g_next) {
		g_tetromino = g_next;
		g_tetromino.row = -1;
		g_tetromino.col = 3;
	} else {
		index = Math.floor(Math.random() * g_shapes.length);
		g_tetromino = {
			shape: g_shapes[ index ].slice(),
			row: -1,
			col: 3,
			color: g_colors[ index ],
			index: index
		};	
	}
	index = Math.floor(Math.random() * g_shapes.length);
	g_next = {
		shape: g_shapes[ index ].slice(),
		row: 0,
		col: 0,
		color: g_colors[ index ],
		index: index
	};
	g_shapeCounts[g_tetromino.index] += 1;
	updateStats();
	if(isShapeCollided()) {
		gameOver();
	} else {
		drawShape(g_board, g_tetromino);
		drawShape(g_nextBoard, g_next);
	}
}

function run() {
	var t;
	
	if(g_isRunning) {
		t = new Date().getTime();
		handleMovement(t);
		handleFalling(t);
		requestAnimationFrame(run);
	}	
}

function handleMovement(t) {
	if(t >= g_lastMoveTime + g_movementSpeed) {
		g_speed = g_levelSpeed;		
		
		// Check for movement
		switch(g_movement) {
			case "left":
				g_tetromino.col -= 1;
				if(isShapeCollided()) {
					g_tetromino.col += 1;
				} else {
					g_lastMoveTime = t;
				}
				break;
			case "right":
				g_tetromino.col += 1;
				if(isShapeCollided()) {
					g_tetromino.col -= 1;
				} else {
					g_lastMoveTime = t;
				}
				break;
			case "up":
				var oldShape = g_tetromino.shape;
				g_tetromino.shape = rotateShape(g_tetromino.shape);
				if(isShapeCollided()) {
					g_tetromino.shape = oldShape;
				} else {
					g_lastMoveTime = t;
				}
				break;
			case "down":
				g_speed = g_fastFallingSpeed;
				g_lastMoveTime = t;
				break;
		}
		
		drawShape(g_board, g_tetromino);
	}
}

function handleFalling(t) {
	
	// Check for falling
	if(t >= g_lastDropTime + g_speed) {
		g_tetromino.row += 1;
		g_lastDropTime = t;
		if(isShapeCollided()) {
			g_tetromino.row -= 1;
			setShape();
			getNextPiece();
			checkLineClears();
		}
		
		if(g_isRunning) {
			drawShape(g_board, g_tetromino);	
		}		
	}	
}

function checkLineClears() {
	var lineClears = [];
	for(var row = 0; row < g_height; row += 1) {
		var isLineClear = true;
		for(var col = 0; col < g_width; col += 1) {
			var className = ".row_" + row + "_col_" + col;
			var td = board.querySelector(className);
			if(td.dataset.isEmpty === "true") {
				isLineClear = false;
				break;
			}
		}
		if(isLineClear) {
			lineClears.push(row);
		}
	}
	
	if(lineClears.length > 0) {
		g_lines += lineClears.length;
		g_score += lineClears.length * 150;
		if(lineClears.length === 4) {
			g_score += 500;
		}
		if(g_lines >= g_level * 15) {
			g_level += 1;
			g_score += 1000;
			g_levelSpeed = 500 / ( g_level / 2);
		}
		updateScore();
		clearLines(lineClears);
	}
}

function updateScore() {
	document.getElementById("lineCount").innerText = g_lines;
	document.getElementById("score").innerText = g_score;
	document.getElementById("level").innerText = g_level;
}

function updateStats() {
	for(var i = 0; i < g_shapeCounts.length; i++) {
		var element = document.getElementById("shapeBoard_" + i + "_count");
		element.innerHTML = g_shapeCounts[i];
	}
}

function clearLines(lineClears) {
	var allRows = [];
	for(var i = 0; i < lineClears.length; i++) {
		var tds = g_board.querySelectorAll(".row_" + lineClears[i] + " td");
		allRows.push(tds);
		for(var j = 0; j < tds.length; j++) {
			tds[j].style.transitionDuration = (g_levelSpeed / 1000) + "s";
			clearShape(tds[j]);
			tds[j].dataset.isEmpty = "true";			
		}
	}
	
	setTimeout(function () {
		
		// Reset transition duration
		for(var i = 0; i < allRows.length; i++) {
			for(var j = 0; j < allRows[i].length; j++) {
				allRows[i][j].style.transitionDuration = "";					
			}
		}
		
		// Shift all cells above the lineClears down
		for(var i = 0; i < lineClears.length; i++) {
			for(var row = lineClears[i]; row > 0; row -= 1) {
				moveRow(row - 1, row);
			}
		}
	}, g_levelSpeed);
}

function moveRow(rowFrom, rowTo) {
	var tdsFrom = g_board.querySelectorAll(".row_" + rowFrom + " td");
	var tdsTo = g_board.querySelectorAll(".row_" + rowTo + " td");
	for(var i = 0; i < tdsTo.length; i++) {
		if(tdsFrom[i].dataset.isEmpty === "true") {
			clearShape(tdsTo[i]);
			tdsTo[i].dataset.isEmpty = "true";
		} else {
			var color = tdsFrom[i].dataset.color;
			tdsTo[i].classList.add("square");
			tdsTo[i].classList.add(color + "-square");
			tdsTo[i].dataset.color = color;	
			tdsTo[i].dataset.isEmpty = "false";
		}
		clearShape(tdsFrom[i]);
		tdsFrom[i].dataset.isEmpty = "true";
	}
}

function drawShape(board, tetromino) {
	
	clearShapes(board);
	
	// Draw all the shape pieces
	for(var row = 0; row < tetromino.shape.length; row += 1) {
		for(var col = 0; col < tetromino.shape[row].length; col += 1) {
			if(tetromino.shape[row][col] !== 0) {
				var className = ".row_" + (row + tetromino.row) + "_col_" + (col + tetromino.col);
				var td = board.querySelector(className);
				setShapeTemp(td, tetromino.color);
			}
		}
	}
}

// Clear all temp shapes
function clearShapes(board) {
	var tempShapes = board.querySelectorAll(".temp");
	for(var i = 0; i < tempShapes.length; i++) {		
		// tempShapes[i].innerHTML = "&nbsp;";
		// tempShapes[i].classList.remove("temp");
		// tempShapes[i].classList.remove("square");
		// for(var j = 0; j < g_colors.length; j++) {
		// 	tempShapes[i].classList.remove(g_colors[ j ] + "-square");	
		// }
		clearShape(tempShapes[i]);
	}
}

function clearShape(element) {
	element.innerHTML = "&nbsp;";
	element.classList.remove("temp");
	element.classList.remove("square");
	element.classList.remove(element.dataset.color + "-square");	
	element.dataset.color = "";	
	// for(var i = 0; i < g_colors.length; i++) {
	// 	element.classList.remove(g_colors[ i ] + "-square");	
	// }
}

function setShapeTemp(element, color) {
	//element.innerHTML = "&#9627;";
	element.classList.add("temp");
	element.classList.add("square");
	element.classList.add(color + "-square");
	element.dataset.color = color;
}

function setShape() {
	var squares = g_board.querySelectorAll(".temp");
	for(var i = 0; i < squares.length; i++) {
		squares[i].classList.remove("temp");
		squares[i].dataset.isEmpty = "false";		
	}
}

function isShapeCollided() {
	for(var row = 0; row < g_tetromino.shape.length; row += 1) {
		for(var col = 0; col < g_tetromino.shape[row].length; col += 1) {
			if(g_tetromino.shape[row][col] !== 0) {
				var className = ".row_" + (row + g_tetromino.row) + "_col_" + (col + g_tetromino.col);
				var td = g_board.querySelector(className);				
				if(td === null || td.dataset.isEmpty !== "true") {
					return true;
				}
			}
		}
	}
	return false;
}

function rotateShape(shape) {
    const newShape = [];
    const row = shape.length;
    const col = shape[0].length;

    for (let i=0; i < col; i++) {
        // create temporary array;
        const temp = [];

        for (let j=0; j < row; j++) {
            temp.push(shape[row-1-j][i]);
        }
        // finally, push temp array to answer array
        newShape.push(temp);
    }

    return newShape;
}

function gameOver() {
	clearShapes(g_board);	
	g_isRunning = false;
	var gameOverText = document.getElementById("gameOverText");
	gameOverText.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg)";
}
