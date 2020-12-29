let squareArray = [];
let boardX, boardY, onTurn, mouseOnBoard;


function setup(){
   //setup p2p connection
   connectionSetup();
   if(windowWidth > windowHeight){
      canvas = createCanvas(Math.round(windowHeight*0.9), Math.round(windowHeight*0.9));
   }
   else canvas = createCanvas(Math.round(windowWidth*0.9), Math.round(windowWidth*0.9));
   let canvasX = (windowWidth - width) / 2;
   let canvasY = (windowHeight - height) / 2;
   canvas.position(canvasX, canvasY);
   for (var x = 0; x < width; x += width / 15) {
		for (var y = 0; y < height; y += height / 15) {
			stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
}

function draw() {
   if (squareArray.length % 2 == 0) {
      if (host) {
         onTurn = true;
      }
      if (!host) {
         onTurn = false;
      }
   }
   else{
      if (!host) {
         onTurn = true;
      }
      if (host) {
         onTurn = false;
      }
   }
  
   if((0 <= mouseX && mouseX <= canvas.width) && (0 <= mouseY && mouseY <= canvas.height)){
      boardX = Math.floor(mouseX/(canvas.width/15));
      boardY = Math.floor(mouseY/(canvas.height/15));
      mouseOnBoard = true;
   }
   else mouseOnBoard = false;

   if (typeof conn !== 'undefined') {
      if(mouseIsPressed && onTurn && mouseOnBoard){
         if(!checkSquareOccupied(squareArray, boardX, boardY)[0]){
            squareArray.push({host: host, x: boardX, y: boardY});
            console.log(squareArray);
            conn.send(squareArray);
         }
      }
      else drawLastMove(squareArray);
  }
}

function drawLastMove(squareArray){
   if (squareArray.length > 0) {
      let x = squareArray[squareArray.length-1].x;
      let y = squareArray[squareArray.length-1].y;
      stroke(255);
      strokeWeight(0);
      if (onTurn) {
         fill(0, 0, 255);
      }
      else fill(255, 0, 0);
      rect(x*(canvas.width/15), y*(canvas.height/15),canvas.width/15,canvas.height/15);
   }
}

function checkSquareOccupied(squareArray,x,y){
      for (let i = 0; i < squareArray.length; i++) {
         if (squareArray[i].x == x && squareArray[i].y == y) {
            return [true, squareArray[i]];
         }
      }
      return [false];
}

document.getElementById("reset").onclick = function(){
   background(255);
   for (var x = 0; x < width; x += width / 15) {
		for (var y = 0; y < height; y += height / 15) {
			stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
   }
   squareArray = [];
}

function checkWinCondition(squareArray){
   let dir = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
   if (squareArray.length > 0) {
      let x = squareArray[squareArray.length-1].x;
      let y = squareArray[squareArray.length-1].y;
      fillSquare(x,y,color(255,0,0));
      for (let i = 0; i < dir.length; i++) {
         if(checkSquareOccupied(squareArray,x+dir[i][0],y+dir[i][1])[0] && checkSquareOccupied(squareArray,x+dir[i][0],y+dir[i][1])[1].host == host){
            
            console.log("square occupied in dir by same player:", dir[i]);
         }
      }
   }
}

function fillSquare(x,y,color) {
   fill(color);
   rect(x*(canvas.width/15), y*(canvas.height/15),canvas.width/15,canvas.height/15);
}