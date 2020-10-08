const grid = document.querySelector(".grid");
const generate_Button = document.getElementById("gen_btn");
const fragment = document.createDocumentFragment();
const row_inp = document.getElementById("rows");
const col_inp = document.getElementById("cols");
var modal = document.getElementById("myModal");
let rows, col;
let data = [];

//Adding Event Listener
generate_Button.addEventListener("click", createModel);

//generate random bombs model
function generateBombs() {
  let bombs = [];
  let bombCount = rows * col * 0.25;
  for (let i = 0; i < bombCount; i++) {
    bombs.push([
      Math.floor(Math.random() * Math.floor(rows)),
      Math.floor(Math.random() * Math.floor(col))
    ]);
  }
  //adding bomb variable in data object
  bombs.map(item => {
    data[item[0]][item[1]].bomb = true;
  });
}

//create data for MineSweeper board
function createModel() {
  rows = parseInt(row_inp.value.trim(""));
  col = parseInt(col_inp.value.trim(""));
  data = [];
  for (let i = 0; i < rows; i++) {
    data.push([]);
    for (let j = 0; j < col; j++) {
      //populating our model
      data[i].push({
        id: `${i}${j}`,
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
  console.log("data after finding neighbors", data);
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
  grid.innerHTML = "";
  grid.style.height = `${rows * 50}px`;
  grid.style.width = `${col * 50}px`;
  data.map(item => {
    for (let j = 0; j < item.length; j++) {
      const square = document.createElement("div");
      // $(square).addClass("btn btn-success");
      square.setAttribute("id", `${item[j].row}${item[j].col}`);
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
  console.log(selectedRow, selectedCol);
  e.target.className = "alreadyClicked";
  e.target.disabled = true;
  if (selectedItem.bomb) {
    modal.style.display = "block";
    let image = document.createElement("img");
    image.className = "bomb";
    image.src = "bomb.jpg";
    e.target.appendChild(image);
    e.target.className = "bomb";
    document.getElementById("over").className = "appear";
  } else if (count > 0) {
    e.target.innerHTML = `<span class='digit'>${count}</span>`;
  } else {
    e.target.className = "zeroBombNearby";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    grid.innerHTML = "";
  }
};
