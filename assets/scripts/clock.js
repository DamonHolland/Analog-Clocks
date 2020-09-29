document.getElementById("updateButton").addEventListener("click", refresh);
window.addEventListener("load", refresh);

function refresh(){
  clock2D("leftCanvas");
  clock2D("midCanvas");
  clock2D("rightCanvas")
}

function clock2D(canvasID){
  const SMALL_CLOCK_CUTOFF = 100;
  const LARGE_CLOCK_CUTOFF = 500;
  var canvas = document.getElementById(canvasID);
  if(canvas.width >= SMALL_CLOCK_CUTOFF && canvas.width <= LARGE_CLOCK_CUTOFF){
    const CENTER_RADIUS = 5;
    const CLOCK_COLOR = 'black';
    const CLOCK_BG_COLOR = 'transparent';
    const HAND_COLOR = 'teal';
    const HAND_OVERLAP = 20;
    const HOUR_HAND_WIDTH = 5;
    const MINUTE_HAND_WIDTH = 4;
    const SECOND_HAND_WIDTH = 1;
    const HOUR_HAND_RATIO = 0.5;
    const LONG_HAND_CUTOFF = 25;
    const LONG_TICK_INTERVAL = 5;
    const LONG_TICK_LENGTH = 20;
    const SHORT_TICK_LENGTH = 10;
    const LONG_TICK_WIDTH = 2;
    const SHORT_TICK_WIDTH = 1;
    const CIRCLE_DEGREES = 360;
    const HOURS_IN_ANALOG_DAY = 12;
    const MINUTES_IN_HOUR = 60;
    const SECONDS_IN_MINUTE = 60;
    const NUMBER_DISPLAY_OFFSET = 40;
    const FONT = '24px serif';
    const FONT_ALIGNMENT = 'center';
    const FONT_ROTATION_OFFSET = 6;
    const WINDOW_SIZE_NUMBER_CUTOFF = 250;
    var context = canvas.getContext('2d');
    var origin = canvas.width / 2;
    var date = new Date();
    var hour = date.getHours() % HOURS_IN_ANALOG_DAY;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    context.font = FONT;
    context.textAlign = FONT_ALIGNMENT;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(context, origin, origin, CLOCK_COLOR, CLOCK_BG_COLOR,
              SECOND_HAND_WIDTH);

    for (var i = 1; i <= MINUTES_IN_HOUR; i++){
      rotateContext(context, origin, origin,
                   (CIRCLE_DEGREES / MINUTES_IN_HOUR));
      context.beginPath();
      context.moveTo(origin, 0);
      context.lineWidth = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_WIDTH :
                                                          SHORT_TICK_WIDTH;
      tickLength = (i % LONG_TICK_INTERVAL == 0) ? LONG_TICK_LENGTH :
                                                  SHORT_TICK_LENGTH;
      context.lineTo(origin, tickLength);
      context.stroke();
    }

    if(canvas.width >= WINDOW_SIZE_NUMBER_CUTOFF){
      setContextAttributes(context, CLOCK_COLOR, CLOCK_COLOR,
                           SECOND_HAND_WIDTH);
      for (var i = 1; i <= HOURS_IN_ANALOG_DAY; i++){
        rotateContext(context, origin, origin,
                    (CIRCLE_DEGREES / HOURS_IN_ANALOG_DAY));
        context.save();
        rotateContext(context, origin,
                      NUMBER_DISPLAY_OFFSET - FONT_ROTATION_OFFSET,
                      (0 - ((CIRCLE_DEGREES / HOURS_IN_ANALOG_DAY) * i)));
        context.fillText(i, origin, NUMBER_DISPLAY_OFFSET);
        context.restore();
      }
    }

    drawHand(context, origin, HAND_COLOR, HOUR_HAND_WIDTH,
            HOUR_HAND_RATIO * origin, HAND_OVERLAP,
            ((CIRCLE_DEGREES / HOURS_IN_ANALOG_DAY) * hour));
    drawHand(context, origin, HAND_COLOR, MINUTE_HAND_WIDTH,
            origin - LONG_HAND_CUTOFF, HAND_OVERLAP,
            ((CIRCLE_DEGREES / MINUTES_IN_HOUR) * minute));
    drawHand(context, origin, CLOCK_COLOR, SECOND_HAND_WIDTH,
            origin - LONG_HAND_CUTOFF, HAND_OVERLAP,
            (CIRCLE_DEGREES / SECONDS_IN_MINUTE) * second);

    drawCircle(context, origin, CENTER_RADIUS, CLOCK_COLOR, CLOCK_COLOR,
              SECOND_HAND_WIDTH);
  }
}

function drawCircle(context, origin, radius, outlineColor, fillColor, penWidth){
  const REVOLUTION = 2 * Math.PI
  setContextAttributes(context, outlineColor, fillColor, penWidth);
  context.beginPath();
  context.arc(origin, origin, radius, 0, REVOLUTION);
  context.fill();
  context.stroke();
}

function drawHand(context, origin, handColor, handWidth, handLength,
                  handOverlap, rotationDegrees){
  context.save();
  setContextAttributes(context, handColor, handColor, handWidth);
  rotateContext(context, origin, origin, rotationDegrees);
  context.beginPath();
  context.moveTo(origin, origin + handOverlap);
  context.lineTo(origin, origin - (0 + handLength));
  context.stroke();
  context.restore();
}

function rotateContext(context, originX, originY, rotationDegrees){
  const RADIAN = Math.PI / 180;
  context.translate(originX, originY);
  context.rotate(RADIAN * rotationDegrees);
  context.translate(-originX, -originY);
}

function setContextAttributes(context, strokeColor, fillColor, penWidth){
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = penWidth;
}