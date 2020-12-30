let squareArray = [];
let boardX, boardY, onTurn, mouseOnBoard, winCount = 0, otherWinCount = 0, gameEnd = false, hitArray = [], reset = false;


function setup(){
   //setup p2p connection
   connectionSetup();
   if(windowWidth > windowHeight){
      canvas = createCanvas(Math.round(windowHeight*0.9), Math.round(windowHeight*0.9));
   }
   else canvas = createCanvas(Math.round(windowWidth*0.9), Math.round(windowWidth*0.9));
   let canvasX = (windowWidth - width) / 10;
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
   canvas.hide();
   document.getElementById("score").innerHTML = "0:0";
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
   if (reset) {
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
      document.getElementById("reset").style.visibility = "hidden";
      host = !host;
      reset = false;
   }
   if((0 <= mouseX && mouseX <= canvas.width) && (0 <= mouseY && mouseY <= canvas.height)){
      boardX = Math.floor(mouseX/(canvas.width/15));
      boardY = Math.floor(mouseY/(canvas.height/15));
      mouseOnBoard = true;
   }
   else mouseOnBoard = false;

   if (typeof conn !== 'undefined') {
      document.getElementById("connSetup").style.visibility = "hidden";
      if (!gameEnd) { 
         if(mouseIsPressed && onTurn && mouseOnBoard){
            if(!checkSquareOccupied(squareArray, boardX, boardY)[0]){
               squareArray.push({host: host, x: boardX, y: boardY});
               conn.send({squareArray: squareArray});
               if (checkWinCondition(squareArray)[0]){
                  gameEnd = true;
                  winCount++;
                  conn.send({gameEnd: true, hitArray: checkWinCondition(squareArray)[1], myWinCount: winCount});
               }
               console.log({squareArray: squareArray});
            }
         }
         else drawLastMove(squareArray);
      }
      else{
         drawLastMove(squareArray);
         console.log("game end");
         console.log("hitArray", hitArray);
         visualiseWinningRow(hitArray, squareArray);
         document.getElementById("score").innerHTML = winCount + ":" + otherWinCount;
         document.getElementById("reset").style.visibility = "visible";
         gameEnd = false;
      }
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
      return [false, [{host: undefined, x: undefined, y: undefined}]];
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
   document.getElementById("reset").style.visibility = "hidden";
   squareArray = [];
   host = !host;
   conn.send({reset: true});
}


function checkWinCondition(squareArray){
   hitArray = [];
   let dir = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
   if (squareArray.length > 0) {
      let x = squareArray[squareArray.length-1].x;
      let y = squareArray[squareArray.length-1].y;
      for (let i = 0; i < dir.length; i++) {
         if(checkSquareOccupied(squareArray,x+dir[i][0],y+dir[i][1])[0] && checkSquareOccupied(squareArray,x+dir[i][0],y+dir[i][1])[1].host == host){
            let hits = 2;
            hitArray.push([x+dir[i][0],y+dir[i][1]]);
            hitArray.push([x,y]);
            for (let ii = 2; true; ii++) {
               if(checkSquareOccupied(squareArray,x+(ii*dir[i][0]),y+(ii*dir[i][1]))[0] && checkSquareOccupied(squareArray,x+(ii*dir[i][0]),y+(ii*dir[i][1]))[1].host == host){
                  hits++;
                  hitArray.push([x+(ii*dir[i][0]),y+(ii*dir[i][1])]);
               }
               else break;
            }
            for (let iii = 1; true; iii++) {
               if (checkSquareOccupied(squareArray,x-(iii*dir[i][0]),y-(iii*dir[i][1]))[0] && checkSquareOccupied(squareArray,x-(iii*dir[i][0]),y-(iii*dir[i][1]))[1].host == host){
                  hits++;
                  hitArray.push([x-(iii*dir[i][0]),y-(iii*dir[i][1])]);
               }
               else break;
            }
            if(hits == 4){
               console.log("hitArray from inside:",hitArray);
               return [true, hitArray];
            }
         }
      }
      return false;
   }
   return false;
}

function fillSquare(x,y,color) {
   fill(color);
   rect(x*(canvas.width/15), y*(canvas.height/15),canvas.width/15,canvas.height/15);
}

function visualiseWinningRow(hitArray, squareArray) {
   for (let i = 0; i < squareArray.length; i++) {
      fillSquare(squareArray[i].x, squareArray[i].y, color(255,255,255));
      if (host == squareArray[i].host) {
         fillSquare(squareArray[i].x, squareArray[i].y, color(255,0,0,100));
      }
      else fillSquare(squareArray[i].x, squareArray[i].y, color(0,0,255,100));
   }
   for (let ii = 0; ii < hitArray.length; ii++) {
      if (host == squareArray[squareArray.length-1].host) {
         fillSquare(hitArray[ii][0], hitArray[ii][1], color(255,0,0,255));
      }
      else fillSquare(hitArray[ii][0], hitArray[ii][1], color(0,0,255,255));
   }
}