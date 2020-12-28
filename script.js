let squareArray = [];
let boardX, boardY, onTurn;


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
   }
   if (typeof conn !== 'undefined') {
      if(mouseIsPressed && onTurn){
         if(!checkSquareOccupied(squareArray)){
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

function checkSquareOccupied(squareArray){
   if((0 <= mouseX && mouseX <= canvas.width) && (0 <= mouseY && mouseY <= canvas.height)){
      for (let i = 0; i < squareArray.length; i++) {
         if (squareArray[i].x == boardX && squareArray[i].y == boardY) {
            return true;
         }
      }
      return false;
   }
   else return true;
}