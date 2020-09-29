function clock2D(canvasID){
  const CENTER_RADIUS = 5;
  const NUM_TICKS = 60;
  const CLOCK_COLOR = "black", HAND_COLOR = "teal", HAND_OVERLAP = 20;
  const HOUR_HAND_WIDTH = 5, MINUTE_HAND_WIDTH = 4, SECOND_HAND_WIDTH = 1;
  const HOUR_HAND_RATIO = 0.5, LONG_HAND_CUTOFF = 25;
  const LONG_TICK_INTERVAL = 5, LONG_TICK_LENGTH = 20, LONG_TICK_WIDTH = 2;
  const SHORT_TICK_LENGTH = 10, SHORT_TICK_WIDTH = 1;
  const REVOLUTION = 2 * Math.PI, RADIAN = Math.PI / 180, CIRCLE_DEGREES = 360;
  const HOURS_IN_ANALOG_DAY = 12, MINUTES_IN_HOUR = 60, SECONDS_IN_MINUTE = 60;
  var canvas = document.getElementById(canvasID);
  var context = canvas.getContext("2d");
  var origin = canvas.width / 2;
  var date = new Date();
  var hour = date.getHours() % 12, minute = date.getMinutes(), second = date.getSeconds();
  var tickLength = SHORT_TICK_LENGTH;

  //Draw The Empty Clock
  setContextAttributes(context, CLOCK_COLOR, CLOCK_COLOR, SECOND_HAND_WIDTH);
  context.save();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(origin, origin, origin, 0, REVOLUTION);
  context.stroke();
  for (var i = 1; i <= NUM_TICKS; i++){
    context.translate(origin, origin);
    context.rotate(RADIAN * (CIRCLE_DEGREES / NUM_TICKS));
    context.translate(-origin, -origin);
    context.beginPath();
    context.moveTo(origin, 0);
    context.lineWidth = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_WIDTH : SHORT_TICK_WIDTH;
    tickLength = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_LENGTH : SHORT_TICK_LENGTH;
    context.lineTo(origin, tickLength);
    context.stroke();
  }
  context.restore();

  //Draw the hands
  //Hour Hand
  context.save();
  context.translate(origin, origin);
  context.rotate(RADIAN * (CIRCLE_DEGREES / HOURS_IN_ANALOG_DAY) * hour);
  context.translate(-origin, -origin);
  context.beginPath();
  setContextAttributes(context, HAND_COLOR, HAND_COLOR, HOUR_HAND_WIDTH);
  context.moveTo(origin, origin + HAND_OVERLAP);
  context.lineTo(origin, origin * HOUR_HAND_RATIO);
  context.stroke();
  context.restore();
  //Minute Hand
  context.save();
  context.translate(origin, origin);
  context.rotate(RADIAN * (CIRCLE_DEGREES / MINUTES_IN_HOUR) * minute);
  context.translate(-origin, -origin);
  context.beginPath();
  setContextAttributes(context, HAND_COLOR, HAND_COLOR, MINUTE_HAND_WIDTH);
  context.moveTo(origin, origin + HAND_OVERLAP);
  context.lineTo(origin, 0 + LONG_HAND_CUTOFF);
  context.stroke();
  context.restore();
  //Second Hand
  context.save();
  context.translate(origin, origin);
  context.rotate(RADIAN * (CIRCLE_DEGREES / SECONDS_IN_MINUTE) * second);
  context.translate(-origin, -origin);
  context.beginPath();
  context.moveTo(origin, origin + HAND_OVERLAP);
  context.lineTo(origin, 0 + LONG_HAND_CUTOFF);
  context.stroke();
  context.restore();

  //Draw middle button
  context.beginPath();
  context.arc(origin, origin, CENTER_RADIUS, 0, REVOLUTION);
  context.fill();
  context.stroke();
}

function setContextAttributes(context, strokeColor, fillColor, penWidth){
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = penWidth;
}