# Tetris Game

A **simple Tetris game** implemented using **Vanilla JavaScript, HTML, and CSS**. This project brings the classic Tetris gameplay to your browser, offering a fun and nostalgic experience with clean and responsive design.

## View it Online
You can play Tetris by visiting the following link:
[Tetris](https://www.andyswebgames.com/games/tetris/)

## Features
- Classic Tetris mechanics.
- Intuitive keyboard controls for gameplay.
- Dynamic score tracking.
- Statistics with shape counts.
- Game over detection.

## Requirements
- A modern web browser (Chrome, Firefox, Edge, etc.).

## Installation
1. Clone or download the repository:
   git clone https://github.com/AndyStubbs/Tetris.git
   cd Tetris
2. Open the `index.html` file in your browser to start playing.

## How to Play
- **Arrow Keys**:
  - **Left Arrow**: Move the tetromino left.
  - **Right Arrow**: Move the tetromino right.
  - **Up Arrow**: Rotate the tetromino.
  - **Down Arrow**: Drop the tetromino faster.

### Objective
- Arrange falling tetromino blocks to complete full horizontal lines. Completed lines are cleared, earning you points.
- The game speeds up as you progress. Avoid letting the blocks reach the top of the play area!

## How It Works
1. The game grid is dynamically created using HTML and styled with CSS for a clean look.
2. JavaScript handles all gameplay mechanics, including block movement, collision detection, line clearing, and score tracking.
3. The game loop runs using `requestAnimationFrame` for smooth performance.
