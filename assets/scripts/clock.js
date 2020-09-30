document.getElementById("update").addEventListener("click", updateLeftCanvas);
document.getElementById("update").addEventListener("click", updateMidCanvas);
document.getElementById("update").addEventListener("click", updateRightCanvas);
window.addEventListener("load", updateLeftCanvas);
window.addEventListener("load", updateMidCanvas);
window.addEventListener("load", updateRightCanvas);

function updateLeftCanvas(){
  clock2D("leftCanvas");
}

function updateMidCanvas(){
  clock2D("midCanvas");
}

function updateRightCanvas(){
  clock2D("rightCanvas");
}

function clock2D(canvasID){
  const SMALL_CLOCK_CUTOFF = 100;
  const LARGE_CLOCK_CUTOFF = 500;
  const CLOCK_COLOR = 'black';
  const CLOCK_BG_COLOR = 'transparent';
  const FONT = '24px serif';
  const FONT_ALIGNMENT = 'center';
  const FONT_ROTATE_OFFSET = 6;
  const NUM_DISPLAY_OFFSET = 40;
  const WINDOW_NUM_CUTOFF = 250;
  const CENTER_RADIUS = 5;
  const CLOCK_PEN = 1;
  const LONG_TICK_INTERVAL = 5;
  const LONG_TICK_LENGTH = 20;
  const SHORT_TICK_LENGTH = 10;
  const LONG_TICK_WIDTH = 2;
  const SHORT_TICK_WIDTH = 1;
  const NUM_TICKS = 60;
  const HOURS_ON_CLOCK = 12;
  const CIRCLE_DEGREES = 360;
  let canvas = document.getElementById(canvasID);
  let context = canvas.getContext('2d');
  let origin = canvas.width / 2;
  let date = new Date();
  let hour = date.getHours() % HOURS_ON_CLOCK;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  context.font = FONT;
  context.textAlign = FONT_ALIGNMENT;

  //Only Draw if the canvas size is within bounds
  if(canvas.width >= SMALL_CLOCK_CUTOFF && canvas.width <= LARGE_CLOCK_CUTOFF){

    //Clear canvas and draw outer circle of clock
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(context, origin, origin, CLOCK_COLOR, CLOCK_BG_COLOR, CLOCK_PEN);

    //Draw the ticks of the clock
    for (let i = 1; i <= NUM_TICKS; i++){
      rotateContext(context, origin, origin, CIRCLE_DEGREES / NUM_TICKS);
      context.beginPath();
      context.moveTo(origin, 0);
      context.lineWidth = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_WIDTH :
                                                          SHORT_TICK_WIDTH;
      tickLength = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_LENGTH :
                                                   SHORT_TICK_LENGTH;
      context.lineTo(origin, tickLength);
      context.stroke();
    }

    //Draw the numbers on the clock - if it is big enough
    if(canvas.width >= WINDOW_NUM_CUTOFF){
      setContextAttributes(context, CLOCK_COLOR, CLOCK_COLOR, CLOCK_PEN);
      for (let i = 1; i <= HOURS_ON_CLOCK; i++){
        rotateContext(context, origin, origin, CIRCLE_DEGREES / HOURS_ON_CLOCK);
        context.save();
        rotateContext(context, origin, NUM_DISPLAY_OFFSET - FONT_ROTATE_OFFSET,
                     (0 - ((CIRCLE_DEGREES / HOURS_ON_CLOCK) * i)));
        context.fillText(i, origin, NUM_DISPLAY_OFFSET);
        context.restore();
      }
    }

    drawHourHand(context, origin, hour);
    drawMinuteHand(context, origin, minute);
    drawSecondHand(context, origin, second);

    //Draw the middle button of the clock
    drawCircle(context, origin, CENTER_RADIUS, CLOCK_COLOR, CLOCK_COLOR,
               CLOCK_PEN);
  }
}

function drawCircle(context, origin, radius, outlineColor, fillColor, penWidth){
  const REVOLUTION = 2 * Math.PI;
  setContextAttributes(context, outlineColor, fillColor, penWidth);
  context.beginPath();
  context.arc(origin, origin, radius, 0, REVOLUTION);
  context.fill();
  context.stroke();
}

function drawHourHand(context, origin, hour){
  const HAND_COLOR = 'teal';
  const HAND_WIDTH = 5;
  const HAND_RATIO = 0.5;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const HOURS_ON_CLOCK = 12;
  let degrees = (CIRCLE_DEGREES / HOURS_ON_CLOCK) * hour;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, HAND_RATIO * origin,
    HAND_OVERLAP, degrees);
}

function drawMinuteHand(context, origin, minute){
  const HAND_COLOR = 'teal';
  const HAND_WIDTH = 4;
  const LONG_HAND_CUTOFF = 25;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const MINUTES_IN_HOUR = 60;
  let degrees = (CIRCLE_DEGREES / MINUTES_IN_HOUR) * minute;
  let length = origin - LONG_HAND_CUTOFF;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, length, HAND_OVERLAP,
           degrees);
}

function drawSecondHand(context, origin, second){
  const HAND_COLOR = 'black';
  const HAND_WIDTH = 1;
  const LONG_HAND_CUTOFF = 25;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const SECONDS_IN_MINUTE = 60;
  let degrees = (CIRCLE_DEGREES / SECONDS_IN_MINUTE) * second;
  let length = origin - LONG_HAND_CUTOFF;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, length, HAND_OVERLAP,
           degrees);
}

function drawHand(context, origin, color, width, length, overlap, degrees){
  context.save();
  setContextAttributes(context, color, color, width);
  rotateContext(context, origin, origin, degrees);
  context.beginPath();
  context.moveTo(origin, origin + overlap);
  context.lineTo(origin, origin - (0 + length));
  context.stroke();
  context.restore();
}

function rotateContext(context, originX, originY, degrees){
  const RADIAN = Math.PI / 180;
  context.translate(originX, originY);
  context.rotate(RADIAN * degrees);
  context.translate(-originX, -originY);
}

function setContextAttributes(context, strokeColor, fillColor, penWidth){
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = penWidth;
}