import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Compute the winner for a given board.
 * @param {(null|"X"|"O")[]} squares - Flat 9-length board state.
 * @returns {("X"|"O"|null)} Winner symbol if found, otherwise null.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return v;
  }
  return null;
}

/**
 * Derive the indices for the winning line (if any).
 * @param {(null|"X"|"O")[]} squares
 * @returns {number[]|null} A 3-length array of indices if there is a winner, otherwise null.
 */
function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return [a, b, c];
  }
  return null;
}

/**
 * Check whether the board is full.
 * @param {(null|"X"|"O")[]} squares
 * @returns {boolean}
 */
function isBoardFull(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[(null|"X"|"O")[], Function]} */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** @type {[boolean, Function]} */
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const winningLine = useMemo(() => calculateWinningLine(squares), [squares]);
  const draw = useMemo(() => !winner && isBoardFull(squares), [winner, squares]);

  const currentPlayer = xIsNext ? "X" : "O";

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "It's a draw";
    return `Turn: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Invariants:
    // - Clicking does nothing if game is over or the square is already filled.
    if (winner || draw) return;
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const newGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const ariaStatus = winner
    ? `Game over. ${winner} wins.`
    : draw
      ? "Game over. Draw."
      : `Next player: ${currentPlayer}.`;

  return (
    <div className="App">
      <main className="ttt-page" aria-label="Tic Tac Toe">
        <section className="ttt-card" aria-labelledby="ttt-title">
          <header className="ttt-header">
            <div>
              <h1 id="ttt-title" className="ttt-title">
                Tic Tac Toe
              </h1>
              <p className="ttt-subtitle">Classic 3×3. Two players. First to three in a row wins.</p>
            </div>

            <button className="btn btn-primary" onClick={newGame} type="button">
              New game
            </button>
          </header>

          <div className="ttt-status" role="status" aria-live="polite" aria-atomic="true">
            <span className="ttt-status-dot" aria-hidden="true" data-state={winner ? "win" : draw ? "draw" : "play"} />
            <span className="ttt-status-text">{statusText}</span>
          </div>

          <div className="ttt-board-wrap">
            <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
              {squares.map((value, idx) => {
                const isWinning = Boolean(winningLine && winningLine.includes(idx));
                const isDisabled = Boolean(value || winner || draw);
                const labelValue = value ? value : "empty";
                return (
                  <button
                    key={idx}
                    className="ttt-square"
                    type="button"
                    role="gridcell"
                    aria-label={`Square ${idx + 1}, ${labelValue}`}
                    aria-disabled={isDisabled ? "true" : "false"}
                    disabled={isDisabled}
                    data-value={value || ""}
                    data-winning={isWinning ? "true" : "false"}
                    onClick={() => handleSquareClick(idx)}
                  >
                    <span className="ttt-mark" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="ttt-footer">
            <div className="ttt-help" aria-label="Gameplay help">
              <span className="ttt-kbd">Tip</span> Click an empty square to place your mark.
            </div>

            <div className="ttt-aria-only" aria-live="polite">
              {ariaStatus}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
