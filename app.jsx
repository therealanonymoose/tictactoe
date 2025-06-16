import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return <button className={"square"+highlight} onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : null;

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { return; }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }
  
  return (
    <>
    <div className="status">{status}</div>
    <div className="board-grid">
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => (
            <Square 
              key={row * 3 + col} 
              value={squares[row * 3 + col]} 
              onSquareClick={() => handleClick(row * 3 + col)}
              highlight = {winningLine && winningLine.includes(row * 3 + col) ? " highlight" : ""} 
            />
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

let App = function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move === currentMove) {
        return (
          <li key={move}>
            <button className="current-move">You are at move #{move}</button>
          </li>
        );
      } else {
        description = "Go to move #" + move;
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
    
    for (const line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line};
        }
    }
    
    return null;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);