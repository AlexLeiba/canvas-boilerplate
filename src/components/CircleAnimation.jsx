import React, { useEffect, useState, useRef } from "react";

export function CircleAnimation() {
  const [innerWidth, setInnerWidth] = useState(null);
  const [innerHeight, setInnerHeight] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);

    const radiusLimit = {
      maxRadius: 50,
      minRadius: 5,
    };

    const mouseValue = {
      x: 0,
      y: 0,
    };

    const colorArray = [
      "yellow",
      "purple",
      "red",
      "pink",
      "black",
      "aqua",
      "green",
      "orange",
    ];

    // Mouse coodinates
    window.addEventListener("mousemove", (e) => {
      //   console.log("called fn", e.y);
      mouseValue.x = e.x;
      mouseValue.y = e.y;
    });

    window.addEventListener("resize", () => {
      //   every time clear the canvas on resize window#
      context.width = window.innerWidth - 100;
      context.height = window.innerHeight - 100;

      //   every time clear the canvas#
      context.clearRect(
        0,
        0,
        window.innerWidth - 100,
        window.innerHeight - 100
      );

      resetAllCircles();
    });

    let circleArray = [];
    // this fn creates an array with all circle values
    function resetAllCircles() {
      // clear array before to reset values
      circleArray = [];

      // More circles loop
      for (let index = 0; index < 100; index++) {
        let x = Math.random() * (innerWidth - 100);
        let y = Math.random() * (innerHeight - 100);
        // the dimension will be random up to innerWidth or innerHeight

        let moveX = (Math.random() - 0.5) * 1;
        let moveY = (Math.random() - 0.5) * 1;
        //Math random always return by default a value up to 1, so  if we get 0 value - 0.5 this will return an negative value, in this way we will have both negative or positive value

        const radius = Math.ceil(Math.random() * 8 + 3);

        //a new array with as many cricles as we want to draw related to (for loop)
        circleArray.push(
          Circle(
            x,
            y,
            moveX,
            moveY,
            Math.PI * 2,
            false,
            colorArray[Math.ceil(Math.random() * colorArray.length)],
            radius,
            radius
          )
        );

        console.log("circle", Circle());
      }
    }

    // canvas drawing object
    const context = canvasRef.current.getContext("2d");

    // takes arguments:  x, y , radius, startEngle, endAngle, drawCounterClockwise:boolean - sepcify which direction should arc to be drawn

    function Circle(
      xV,
      yV,
      moveXV,
      moveYV,
      drawCounterClockwise,
      value,
      color,
      radius,
      initialRadius
    ) {
      // we gonna draw a circle whenever this is called
      function draw() {
        // we have to specify the begin path each time to not use the same path of other lines canvas
        context.beginPath();

        //arc takes as arguments:  x, y , radius, startEngle, endAngle, drawCounterClockwise:boolean - sepcify which direction should arc to be drawn
        context.arc(
          xV, //positions x
          yV, //positions y
          radius, //the circle size
          0, //start engle
          Math.PI * 2, //to have a whole engle
          drawCounterClockwise,
          false
        );

        context.fillStyle = color;
        context.fill();
        context.stroke();
      }

      function update() {
        // we have to specify the begin path each time to not use the same path of other lines canvas

        //   once x === with innerwidth of the screen change the increment in decrement of x by adding negative value
        if (xV + radius > window.innerWidth - 100 || xV - radius < 0) {
          moveXV = -moveXV;
        }

        if (yV + radius > window.innerHeight - 100 || yV - radius < 0) {
          moveYV = -moveYV;
        }

        //   value x +  -moveX value will decrement the x value
        xV += moveXV;
        yV += moveYV;

        //positions between mouse and circle
        if (
          mouseValue.x - xV < 50 &&
          mouseValue.x - xV > -50 &&
          mouseValue.y - yV < 50 &&
          mouseValue.y - yV > -50 &&
          radius < radiusLimit.maxRadius
        ) {
          radius += 1;
        } else if (radius > initialRadius) {
          radius -= 1;
        }

        draw();
      }

      return { update };
    }

    resetAllCircles();

    // this fn creates a loop for us
    function animating() {
      requestAnimationFrame(animating);

      //   every time clear the canvas to not draw the circle  but to animate them#
      context.clearRect(
        0,
        0,
        window.innerWidth - 100,
        window.innerHeight - 100
      );

      for (let index = 0; index < circleArray.length; index++) {
        // to acces all items in this array
        // console.log("update", circleArray[index]);

        // circleArray is an array with what Circle fn returns (update callback fn ) and this will be called each our animation renders
        circleArray[index].update();
      }
    }

    animating();
  }, [canvasRef.current]);

  return (
    <div>
      CanvasApp
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={innerWidth - 100}
        height={innerHeight - 100}
      />
    </div>
  );
}
