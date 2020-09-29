function clock2D(canvasID){
  var canvas = document.getElementById(canvasID);
  var hour, minute;
  
  date = new Date();
  hour = date.getHours() % 12;
  minute = date.getMinutes();

  drawClock(canvas);
}

function drawClock(canvas){
  var centerRadius = 2;
  context = canvas.getContext("2d");
  origin = canvas.width / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(origin, origin, origin, 0, 2 * Math.PI);
  context.stroke();

  context.beginPath();
  context.arc(origin, origin, centerRadius, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
}