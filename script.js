const grid = document.querySelector(".grid");
const generate_Button = document.getElementById("gen_btn");
const fragment = document.createDocumentFragment();
const row_inp = document.getElementById("rows");
const col_inp = document.getElementById("cols");
const modal = document.getElementById("myModal");
const winner = document.getElementById("winner");
const loser = document.getElementById("loser");
let rows,
  col,
  safeCells,
  cellsClicked,
  bombs,
  data = [];

//Adding Event Listener
generate_Button.addEventListener("click", createModel);

//generate random bombs model
function generateBombs() {
  bombs = [];
  let dictionary = {};
  let bombCount = Math.floor(rows * col * 0.25);
  while (Object.keys(dictionary).length < bombCount) {
    x = Math.floor(Math.random() * 1000) % rows;
    y = Math.floor(Math.random() * 1000) % col;
    dictionary["" + x + "-" + y] = [x, y];
  }

  bombs = Object.keys(dictionary).map(k => dictionary[k]);
  safeCells = rows * col - bombCount;
  bombs.map(item => {
    data[item[0]][item[1]].bomb = true;
  });
  console.log("bombs", bombs);
}

//create data for MineSweeper board
function createModel() {
  rows = parseInt(row_inp.value.trim(""));
  col = parseInt(col_inp.value.trim(""));
  data = [];
  cellsClicked = 0;
  for (let i = 0; i < rows; i++) {
    data.push([]);
    for (let j = 0; j < col; j++) {
      //populating our model
      data[i].push({
        id: `${i}-${j}`,
        row: i,
        col: j,
        bomb: false,
        visible: false
      });
    }
  }
  //generate random bomb positions in board
  generateBombs();
  //get adjacent bombs count for each cell and update model
  getNeighborsWithBomb(data);
  console.log("data", data);
  createUIFromModel(data);
}

//find adjacent neighbours who have bomb
function getNeighborsWithBomb(data) {
  // possible combination of rows and columns
  let dx = [-1, -1, -1, 0, 0, 1, 1, 1];
  let dy = [-1, 0, 1, -1, 1, -1, 0, 1];

  // we are trying to find neighboring cells of item
  for (let i = 0; i < data.length; i++) {
    data[i].map(item => {
      item.neighbors = [];
      let itemRow = item.row;
      let itemCol = item.col;
      for (let j = 0; j < 8; j++) {
        if (
          isValid(itemRow + dx[j], itemCol + dy[j]) &&
          data[itemRow + dx[j]][itemCol + dy[j]].bomb
        ) {
          item.neighbors.push([itemRow + dx[j], itemCol + dy[j]]);
        }
      }
    });
  }
}

// function to check whether row and column value are valid. Used while calculating neighbors with bomb.
function isValid(x, y) {
  if (x < 0 || x >= rows || y < 0 || y >= col) {
    return false;
  }
  return true;
}

// create UI using our model - data
function createUIFromModel(data) {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.style.height = `${rows * 50}px`;
  grid.style.width = `${col * 50}px`;
  data.map(item => {
    for (let j = 0; j < item.length; j++) {
      const square = document.createElement("div");
      square.setAttribute("id", `${item[j].row}-${item[j].col}`);
      square.setAttribute("row", item[j].row);
      square.setAttribute("col", item[j].col);
      square.addEventListener("click", cellClick);
      fragment.appendChild(square);
    }
  });
  grid.appendChild(fragment);
}

// function invoked after clicking cell
function cellClick(e) {
  let selectedRow = e.target.getAttribute("row");
  let selectedCol = e.target.getAttribute("col");
  let selectedItem = data[selectedRow][selectedCol];
  let count = selectedItem.neighbors.length;
  cellsClicked++;
  e.target.className = "alreadyClicked";
  if (selectedItem.bomb) {
    // Losing condition
    modal.style.display = "block";
    loser.style.display = "block";
    appendImage(e.target);
    return;
  } else if (cellsClicked === safeCells) {
    // Winning Condition
    modal.style.display = "block";
    winner.style.display = "block";
    bombs.map(item => {
      //reveal all the bombs after winning
      let bombEle = document.getElementById(`${item[0] + "-" + item[1]}`);
      appendImage(bombEle);
    });
    return;
  } else {
    e.target.innerHTML = `<span class='color${count} digit'>${count}</span>`;
  }
}

function appendImage(ele) {
  let image = document.createElement("img");
  image.className = "bomb";
  image.src = "bomb.jpg";
  ele.appendChild(image);
  ele.className = "bomb";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    location.reload();
  }
};
