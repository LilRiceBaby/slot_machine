// 1. Load wallet
// 2. Choose lines to bet on (1-3)
// 3. Enter bet per line
// 4. Spin the grid
// 5. Check for matches
// 6. Pay out winnings
// 7. Ask to replay

const prompt = require("prompt-sync")();

const GRID_ROWS = 3;
const GRID_COLS = 3;

const SYMBOL_POOL = {
  X: 2,
  Y: 4,
  Z: 6,
  W: 8,
};

const SYMBOL_PAYOUT = {
  X: 5,
  Y: 4,
  Z: 3,
  W: 2,
};

// Step 1 - Load wallet
const loadWallet = () => {
  while (true) {
    const inputCash = prompt("Enter deposit amount: $");
    const cash = parseFloat(inputCash);

    if (isNaN(cash) || cash <= 0) {
      console.log("Not valid. Try again.");
    } else {
      return cash;
    }
  }
};

// Step 2 - Choose lines to bet on
const chooseLines = () => {
  while (true) {
    const lines = prompt("How many lines you wanna play (1-3)? ");
    const pickedLines = parseInt(lines);

    if (isNaN(pickedLines) || pickedLines < 1 || pickedLines > 3) {
      console.log("Pick between 1 and 3 lines.");
    } else {
      return pickedLines;
    }
  }
};

// Step 3 - Enter bet per line
const setBet = (wallet, lines) => {
  while (true) {
    const betInput = prompt("Enter your bet per line: $");
    const bet = parseFloat(betInput);

    if (isNaN(bet) || bet <= 0 || bet > wallet / lines) {
      console.log("Invalid bet. Too high or not a number.");
    } else {
      return bet;
    }
  }
};

// Step 4 - Spin the machine (grid)
const spinGrid = () => {
  const symbols = [];
  for (const [symbol, freq] of Object.entries(SYMBOL_POOL)) {
    for (let i = 0; i < freq; i++) {
      symbols.push(symbol);
    }
  }

  const columns = [];
  for (let i = 0; i < GRID_COLS; i++) {
    const col = [];
    const symbolClone = [...symbols];

    for (let j = 0; j < GRID_ROWS; j++) {
      const randIdx = Math.floor(Math.random() * symbolClone.length);
      col.push(symbolClone[randIdx]);
      symbolClone.splice(randIdx, 1);
    }

    columns.push(col);
  }

  return columns;
};

// Step 5 - Turn columns into rows
const columnsToRows = (columns) => {
  const rows = [];

  for (let i = 0; i < GRID_ROWS; i++) {
    const row = [];
    for (let j = 0; j < GRID_COLS; j++) {
      row.push(columns[j][i]);
    }
    rows.push(row);
  }

  return rows;
};

// Step 6 - Display results
const displayGrid = (rows) => {
  for (const row of rows) {
    console.log(row.join(" | "));
  }
};

// Step 7 - Check for win
const calculateWinnings = (rows, bet, linesPlayed) => {
  let payout = 0;

  for (let i = 0; i < linesPlayed; i++) {
    const row = rows[i];
    const first = row[0];
    const isWin = row.every(sym => sym === first);

    if (isWin) {
      payout += bet * SYMBOL_PAYOUT[first];
    }
  }

  return payout;
};

// Full Game
const runGame = () => {
  let cash = loadWallet();

  while (true) {
    console.log(`\nYour balance: $${cash}`);
    const lines = chooseLines();
    const bet = setBet(cash, lines);
    cash -= bet * lines;

    const spun = spinGrid();
    const resultGrid = columnsToRows(spun);

    displayGrid(resultGrid);

    const winnings = calculateWinnings(resultGrid, bet, lines);
    cash += winnings;

    console.log(`You won: $${winnings}`);
    console.log(`Updated balance: $${cash}`);

    if (cash <= 0) {
      console.log("You’re out of funds. Game over.");
      break;
    }

    const again = prompt("Wanna spin again? (y/n): ");
    if (again.toLowerCase() !== "y") {
      console.log("Thanks for playing, my friend.");
      break;
    }
  }
};

runGame();
