export class FantasyMemoryGame {
    constructor(rows, cols, gridElement, scoreElement, turnsElement) {
        this.rows = rows;
        this.cols = cols;
        this.gridElement = gridElement;
        this.scoreElement = scoreElement;
        this.turnsElement = turnsElement;
        this.cards = [];
        this.flippedCards = [];
        this.score = 0;
        this.turns = 0;
        this.emojis = ['🧙‍♂️', '🧝‍♀️', '🧛‍♂️', '🧚‍♀️', '🦄', '🐉', '🗡️', '🛡️', '🏰', '🧪', '📜', '🔮'];
    }

    init() {
        this.shuffleEmojis();
        this.createCards();
        this.renderGrid();
        this.loadScore();
        this.updateScore();
        this.turns = Math.floor((this.rows * this.cols) / 2) * 2;
        this.updateTurns();
    }

    shuffleEmojis() {
        const gameEmojis = this.emojis.slice(0, (this.rows * this.cols) / 2);
        this.cards = [...gameEmojis, ...gameEmojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji) => ({ emoji, isFlipped: false, isMatched: false }));
    }

    createCards() {
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">${card.emoji}</div>
                    <div class="card-face card-back">🔥</div>
                </div>
            `;
            cardElement.addEventListener('click', () => this.flipCard(index));
            this.cards[index].element = cardElement;
        });
    }

    renderGrid() {
        this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.gridElement.innerHTML = '';
        this.cards.forEach(card => this.gridElement.appendChild(card.element));
    }

    flipCard(index) {
        if (this.flippedCards.length === 2 || this.cards[index].isFlipped || this.cards[index].isMatched) return;

        this.cards[index].isFlipped = true;
        this.cards[index].element.classList.add('flipped');
        this.flippedCards.push(index);

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        if (this.cards[index1].emoji === this.cards[index2].emoji) {
            this.cards[index1].isMatched = true;
            this.cards[index2].isMatched = true;
            this.cards[index1].element.classList.add('matched');
            this.cards[index2].element.classList.add('matched');
            this.score++;
            this.updateScore();
        } else {
            setTimeout(() => {
                this.cards[index1].isFlipped = false;
                this.cards[index2].isFlipped = false;
                this.cards[index1].element.classList.remove('flipped');
                this.cards[index2].element.classList.remove('flipped');
            }, 1000);
            this.turns--;
            this.updateTurns();
        }

        this.flippedCards = [];

        if (this.score === (this.rows * this.cols) / 2) {
            setTimeout(() => alert('Congratulations! You won!'), 500);
        } else if (this.turns === 0) {
            setTimeout(() => alert('Game over! You ran out of turns.'), 500);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        localStorage.setItem('fantasyMemoryScore', this.score);
    }

    updateTurns() {
        this.turnsElement.textContent = this.turns;
    }

    loadScore() {
        const savedScore = localStorage.getItem('fantasyMemoryScore');
        if (savedScore !== null) {
            this.score = parseInt(savedScore, 10);
        }
    }

    restart() {
        this.score = 0;
        this.turns = Math.floor((this.rows * this.cols) / 2) * 2;
        this.flippedCards = [];
        this.shuffleEmojis();
        this.createCards();
        this.renderGrid();
        this.updateScore();
        this.updateTurns();
    }
}