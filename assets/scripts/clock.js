function clock2D(canvasID){
  var canvas = document.getElementById(canvasID);
  var hour, minute;
  
  date = new Date();
  hour = date.getHours() % 12;
  minute = date.getMinutes();

  drawClock(canvas);
}

function drawClock(canvas){
  const CENTER_RADIUS = 2;
  const NUM_TICKS = 60;
  const LONG_TICK_LENGTH = 20;
  const LONG_TICK_WIDTH = 2;
  const SHORT_TICK_LENGTH = 10;
  const SHORT_TICK_WIDTH = 1;
  const LONG_TICK_INTERVAL = 5;
  const REVOLUTION = 2 * Math.PI;
  const RADIAN = Math.PI / 180;
  const CIRCLE_DEGREES = 360;
  var tickLength = SHORT_TICK_LENGTH;


  context = canvas.getContext("2d");
  origin = canvas.width / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(origin, origin, origin, 0, REVOLUTION);
  context.stroke();

  context.beginPath();
  context.arc(origin, origin, CENTER_RADIUS, 0, REVOLUTION);
  context.fill();
  context.stroke();

  for (var i = 0; i < NUM_TICKS; i++){
    context.translate(origin, origin);
    context.rotate(RADIAN * (CIRCLE_DEGREES / NUM_TICKS));
    context.translate(-origin, -origin);

    context.beginPath();
    context.moveTo(origin, 0);
    if (i % LONG_TICK_INTERVAL == 0){
      context.lineWidth = LONG_TICK_WIDTH;
      tickLength = LONG_TICK_LENGTH
    }
    else{
      context.lineWidth = SHORT_TICK_WIDTH;
      tickLength = SHORT_TICK_LENGTH
    }
    context.lineTo(origin, tickLength);
    context.stroke();
  }

}