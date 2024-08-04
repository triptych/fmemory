import { FantasyMemoryGame } from './game.js';

const gameGrid = document.getElementById('game-grid');
const scoreElement = document.getElementById('score');
const turnsElement = document.getElementById('turns');
const restartBtn = document.getElementById('restart-btn');

const rows = 4;
const cols = 4;

const game = new FantasyMemoryGame(rows, cols, gameGrid, scoreElement, turnsElement);

game.init();

restartBtn.addEventListener('click', () => {
    game.restart();
});