/*******************************************************************************
File Name:    clock.js
Author:       Damon Holland
Date:         10/02/2020
Class:        CS360
Assignment:   JS Clocks
Hours Worked: 4 hours
Purpose:      Adds event listeners to the button on the site to update clocks.
              Upon updating, a clock with the current time will be drawn on the
              given canvases.
*******************************************************************************/

(function() {
  let intervalList = new Array();

  document.getElementById('toggle').addEventListener('click', toggleClockType);
  addInterval(updateLeftCanvas, 1000);
  addInterval(updateMidCanvas, 1000);
  addInterval(updateRightCanvas, 1000);
  window.addEventListener('load', updateLeftCanvas);
  window.addEventListener('load', updateMidCanvas);
  window.addEventListener('load', updateRightCanvas);

  function toggleClockType(e){
    toggler = e.target;
    date = new Date();
    const DIGITAL_INTERVAL = 1000;
    const ANALOG_INTERVAL = 1000 / 24;
    const MILLISECONDS_IN_SECOND = 1000;

    if (toggler.innerHTML == 'DIGITAL'){
      toggler.innerHTML = 'ANALOG';
      clearIntervals();
      addInterval(updateLeftCanvas, ANALOG_INTERVAL);
      addInterval(updateMidCanvas, ANALOG_INTERVAL);
      addInterval(updateRightCanvas, ANALOG_INTERVAL);
      
    }
    else{
      toggler.innerHTML = 'DIGITAL';
      clearIntervals();
      console.log(MILLISECONDS_IN_SECOND - date.getMilliseconds());
      setTimeout(function(){
        addInterval(updateLeftCanvas, DIGITAL_INTERVAL);
        addInterval(updateMidCanvas, DIGITAL_INTERVAL);
        addInterval(updateRightCanvas, DIGITAL_INTERVAL);
      }, MILLISECONDS_IN_SECOND - date.getMilliseconds());
    }

}

function addInterval(callbackFunction, interval){
  callbackFunction();
  intervalList.push(window.setInterval(callbackFunction, interval));
}

function clearIntervals(){
  while (intervalList.length > 0){
    window.clearInterval(intervalList.pop());
  }
}

})()

/*******************************************************************************
Function: updateLeftCanvas

Description: Updates the left canvas with the current time.

Parameters: none

Returned: none
*******************************************************************************/
function updateLeftCanvas(){
  const PST_OFFSET = 0;
  clock2D('leftCanvas', PST_OFFSET);
}

/*******************************************************************************
Function: updateMidCanvas

Description: Updates the middle canvas with the current time.

Parameters: none

Returned: none
*******************************************************************************/
function updateMidCanvas(){
  const MST_OFFSET = 1;
  clock2D('midCanvas', MST_OFFSET);
}

/*******************************************************************************
Function: updateRightCanvas

Description: Updates the right canvas with the current time.

Parameters: none

Returned: none
*******************************************************************************/
function updateRightCanvas(){
  const CST_OFFSET = 2;
  clock2D('rightCanvas', CST_OFFSET);
}

/*******************************************************************************
Function: clock2D

Description: Draws a clock with the current time on the given canvas.

Parameters: canvasID - A string containing the id of the canvas to draw a clock
            hourOffset - A number containing the hour offset relative to PST
                         the clock will display

Returned: none
*******************************************************************************/
function clock2D(canvasID, hourOffset){
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
  let hour = date.getHours() % HOURS_ON_CLOCK + hourOffset;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  context.font = FONT;
  context.textAlign = FONT_ALIGNMENT;

  //Only Draw if the canvas size is within bounds
  if(canvas.width >= SMALL_CLOCK_CUTOFF && canvas.width <= LARGE_CLOCK_CUTOFF){

    //Clear canvas and draw outer circle of clock
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(context, origin, origin, CLOCK_COLOR, CLOCK_BG_COLOR);

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

    //Draw hands of clock
    drawHourHand(context, origin, hour, minute, second);
    drawMinuteHand(context, origin, minute, second);
    drawSecondHand(context, origin, second, millisecond);

    //Draw the middle button of the clock
    drawCircle(context, origin, CENTER_RADIUS, CLOCK_COLOR, CLOCK_COLOR);
  }
}

/*******************************************************************************
Function: drawCircle

Description: Draws a circle on the given context

Parameters: context - The context to draw the circle on
            origin  - A number containing the origin of the circle
                      (only 1 point because the canvas is assumed square, and
                      circles only need to be drawn from the center)
            radius - A number containing the radius of the circle to draw
            outlineColor - The color of the outline of the circle drawn
            fillColor - The color of the inside of the circle drawn

Returned: none
*******************************************************************************/
function drawCircle(context, origin, radius, outlineColor, fillColor){
  const REVOLUTION = 2 * Math.PI;
  const DEFAULT_PEN = 1;
  setContextAttributes(context, outlineColor, fillColor, DEFAULT_PEN);
  context.beginPath();
  context.arc(origin, origin, radius, 0, REVOLUTION);
  context.fill();
  context.stroke();
}

/*******************************************************************************
Function: drawHourHand

Description: Draws an hour hand on the given context

Parameters: context - The context to draw the hour hand on
            origin  - A number containing the origin of the clock
            hour - A number containing the current hour (analog)
            minute - A number containing the current minute (analog)
            second - A number containing the current second (analog)

Returned: none
*******************************************************************************/
function drawHourHand(context, origin, hour, minute, second){
  const HAND_COLOR = 'teal';
  const HAND_WIDTH = 5;
  const HAND_RATIO = 0.5;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const HOURS_ON_CLOCK = 12;
  const MINUTES_IN_HOUR = 60;
  const SECONDS_IN_MINUTE = 60;
  let degrees = (CIRCLE_DEGREES / HOURS_ON_CLOCK) * hour;
  degrees += ((CIRCLE_DEGREES / HOURS_ON_CLOCK) * minute) / MINUTES_IN_HOUR;
  degrees += (((CIRCLE_DEGREES / HOURS_ON_CLOCK) * second) / MINUTES_IN_HOUR) /
             SECONDS_IN_MINUTE;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, HAND_RATIO * origin,
    HAND_OVERLAP, degrees);
}

/*******************************************************************************
Function: drawMinuteHand

Description: Draws a minute hand on the given context

Parameters: context - The context to draw the hour hand on
            origin  - A number containing the origin of the clock
            minute - A number containing the current minute
            minute - A number containing the current second

Returned: none
*******************************************************************************/
function drawMinuteHand(context, origin, minute, second){
  const HAND_COLOR = 'teal';
  const HAND_WIDTH = 4;
  const LONG_HAND_CUTOFF = 25;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const MINUTES_IN_HOUR = 60;
  const SECONDS_IN_MINUTE = 60;
  let degrees = (CIRCLE_DEGREES / MINUTES_IN_HOUR) * minute;
  degrees += ((CIRCLE_DEGREES / MINUTES_IN_HOUR) * second) / SECONDS_IN_MINUTE;
  let length = origin - LONG_HAND_CUTOFF;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, length, HAND_OVERLAP,
           degrees);
}

/*******************************************************************************
Function: drawSecondHand

Description: Draws a second hand on the given context

Parameters: context - The context to draw the hour hand on
            origin  - A number containing the origin of the clock
            second - A number containing the current second
            millisecond - A number containing the current millisecond

Returned: none
*******************************************************************************/
function drawSecondHand(context, origin, second, millisecond){
  const HAND_COLOR = 'black';
  const HAND_WIDTH = 1;
  const LONG_HAND_CUTOFF = 25;
  const HAND_OVERLAP = 20;
  const CIRCLE_DEGREES = 360;
  const SECONDS_IN_MINUTE = 60;
  const MILLISECONDS_IN_SECOND = 1000;
  let degrees = (CIRCLE_DEGREES / SECONDS_IN_MINUTE) * second;
  degrees += ((CIRCLE_DEGREES / SECONDS_IN_MINUTE) * millisecond) /
               MILLISECONDS_IN_SECOND;
  let length = origin - LONG_HAND_CUTOFF;

  drawHand(context, origin, HAND_COLOR, HAND_WIDTH, length, HAND_OVERLAP,
           degrees);
}

/*******************************************************************************
Function: drawHand

Description: Draws a hand on the given context

Parameters: context - The context to draw the hour hand on
            origin  - A number containing the origin of the clock
            color - The color to draw the hand
            width - A number containing the width of the hand
            length - A number containing the length of the hand
            overlap - A number containing the amount the hand should overlap
                      the center button
            degrees - A number containing the degrees of rotation the hand needs
                      to be drawn

Returned: none
*******************************************************************************/
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

/*******************************************************************************
Function: rotateContext

Description: rotates the context a given number of degrees around a given origin

Parameters: context - The context to rotate
            originX  - A number containing the origins x pos to rotate around
            originY  - A number containing the origins y pos to rotate around
            degrees - A number containing the degrees of rotation

Returned: none
*******************************************************************************/
function rotateContext(context, originX, originY, degrees){
  const RADIAN = Math.PI / 180;
  context.translate(originX, originY);
  context.rotate(RADIAN * degrees);
  context.translate(-originX, -originY);
}

/*******************************************************************************
Function: setContextAttributes

Description: sets some common attributes of the context to specified values 
             (Just to clean up the code a bit)

Parameters: context - The context to change the attributes of
            strokeColor  - The new color of the pen
            fillColor  - The new fill color of the pen
            penWidth - A number containing the new pen width

Returned: none
*******************************************************************************/
function setContextAttributes(context, strokeColor, fillColor, penWidth){
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = penWidth;
}