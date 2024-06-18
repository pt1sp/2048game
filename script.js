// index.htmlのscoreというidを持つ要素を取得し、scoreElに代入
const scoreEl = document.getElementById("score");

// 4x4の盤面を表す2次元配列
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// スコアを表す変数の初期化
let score = 0;

// ゲームを開始する関数
function startGame() {
  // 盤面を初期化
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  // 最初に2つのタイルを追加
  addNewTile();
  addNewTile();

  updateBoard();
}

// 新しいタイルを追加する関数
function addNewTile() {
  // 空のタイルの位置を保持する配列
  const emptyTiles = [];

  //   盤面の各マスをチェックし、値が0のマスをemptyTilesに追加
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }

  //   emptyTilesが空でない場合、ランダムに選んだ空のマスに2か4を追加
  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    // Math.random()が0.0より小さい場合は2を、そうでない場合は4をnewValueに代入
    const newValue = Math.random() < 0.9 ? 2 : 4;
    // boardのrow行col列にnewValueを代入
    board[row][col] = newValue;
  }
}

// 盤面を更新する関数
function updateBoard() {
  // game-boardというidを持つ要素を取得し、gameBoardに代入
  const gameBoard = document.getElementById("game-board");
  //   gameBoardの中身を空にする
  gameBoard.innerHTML = "";

  //   盤面の各マスに対して、その値に応じたタイルを作成し、gameBoardに追加
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // 盤面の各マスの値を取得
      const tileValue = board[row][col];
      //   div要素を作成し、tileに代入
      const tile = document.createElement("div");

      //   tileにクラス名tileを追加
      tile.className = "tile";
      //   tileValueが0でない場合、tileのtextContentにtileValueを代入
      tile.textContent = tileValue !== 0 ? tileValue : "";

      //   tileの背景色を設定
      tile.style.backgroundColor = getTileColor(tileValue);
      //   tileの文字色をtileValueが2, 4, 8の場合は#6b6359、それ以外の場合は#fffに設定
      tile.style.color = [2, 4, 8].includes(tileValue) ? "#6b6359" : "#fff";

      //   gameBoardにtileを追加
      gameBoard.appendChild(tile);
    }
  }
}

// タイルの背景色を取得する関数
function getTileColor(value) {
  // valueが0の場合は#c8bdaeを返す
  if (value === 0) return "#c8bdae";

  //   2,4,8,16,32,64,128,256の場合に対応する色をcolors配列に定義
  const colors = [
    "#e7dfd3",
    "#E7DBBD",
    "#EFAC73",
    "#F48E5F",
    "#EB7A54",
    "#F45B38",
    "#E8C96A",
    "#ECC95C",
  ];

  //   valueが2のi乗の場合、colors[i]を返す
  for (let i in colors) {
    if (2 ** i === value) {
      return colors[i];
    }
  }

  //   タイルの数字が512以上の場合は#ecc95cを返す
  return "#ecc95c";
}

// タイルを移動する関数
function moveTiles(direction) {
  // タイルが移動したかどうかを表すbool型の変数tileMovedをfalseで初期化
  let tileMoved = false;
  console.log(direction);
  //   directionがupの場合、rowIndicesに[0,1,2,3]を代入、そうでない場合は[3,2,1,0]を代入
  const rowIndices = direction === "up" ? [0, 1, 2, 3] : [3, 2, 1, 0];
  //   directionがleftの場合、colIndicesに[0,1,2,3]を代入、そうでない場合は[3,2,1,0]を代入
  const colIndices = direction === "left" ? [0, 1, 2, 3] : [3, 2, 1, 0];

  //   盤面の各マスに対して、指定された方向にタイルを移動させる
  for (let row of rowIndices) {
    for (let col of colIndices) {
      // 盤面の各マスの値を取得
      const currentValue = board[row][col];

      //   値が0（タイルなし）の場合はスキップ
      if (currentValue === 0) continue;

      let newRow = row;
      let newCol = col;
      let currentRow = row;
      let currentCol = col;

      //   指定された方向にタイルを移動させる
      while (true) {
        if (direction === "up") {
          newRow--;
          currentRow = newRow + 1;
        } else if (direction === "down") {
          newRow++;
          currentRow = newRow - 1;
        } else if (direction === "left") {
          newCol--;
          currentCol = newCol + 1;
        } else if (direction === "right") {
          newCol++;
          currentCol = newCol - 1;
        }

        // 移動先が盤面の範囲外の場合、移動を終了
        if (newRow < 0 || newRow >= 4 || newCol < 0 || newCol >= 4) {
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }

        // 移動先のマスの値を取得
        const newValue = board[newRow][newCol];

        // 移動先が空の場合、タイルを移動
        if (newValue === 0) {
          // 移動先のマスにcurrentValueを代入
          board[newRow][newCol] = currentValue;
          //   移動元のマスを空にする
          board[currentRow][currentCol] = 0;
          //   タイルが移動したことを示すtileMovedをtrueにする
          tileMoved = true;
        } else if (newValue === currentValue) {
          // 移動先のマスと移動元のマスの値が等しい場合、合体させる
          board[newRow][newCol] += currentValue;
          //   移動元のマスを空にする
          board[currentRow][currentCol] = 0;
          //   タイルが移動したことを示すtileMovedをtrueにする
          tileMoved = true;
          //   スコアを更新
          score += currentValue;
          //   scoreElのtextContentをscoreに設定
          scoreEl.innerText = score;
          break;
        } else {
          // 移動先のマスと移動元のマスの値が異なる場合、移動を終了
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }
      }
    }
  }

  //   タイルが移動した場合、新しいタイルを追加し、盤面を更新
  if (tileMoved) {
    addNewTile();
    updateBoard();
  }
}

// キーボードの矢印キーが押されたときにそれぞれの値を取得し、moveTiles関数を呼び出す
document.addEventListener("keydown", function (event) {
  console.log(event.key);
  if (event.key === "ArrowUp") {
    moveTiles("up");
  } else if (event.key === "ArrowDown") {
    moveTiles("down");
  } else if (event.key === "ArrowLeft") {
    moveTiles("left");
  } else if (event.key === "ArrowRight") {
    moveTiles("right");
  }
});

// new-game-btnというidを持つ要素を取得し、newGameBtnに代入
const newGameBtn = document.getElementById("new-game-btn");
// newGameBtnがクリックされたときにstartGame関数を呼び出す
newGameBtn.addEventListener("click", startGame);

// ゲームを開始
startGame();
