import React from 'react'
import gsap from 'gsap';
import '@gsap/react';

const data = {
    "100vw" : [
      -486,
      486,
      971,
      -971
    ],
    "50vw" : [
      -241.5,
      241.5,
      483,
      -483
    ]
  }

export const Move = (component,direction,pegHeights) => {
  let srcPegHeight,destPegHeight,horDistArray ;
  console.log(window.innerWidth)
  srcPegHeight = pegHeights[parseInt(parseInt(direction)/10)-1];
  destPegHeight = pegHeights[parseInt(direction)%10-1];
    if(component){
      let horizontalDistance,verticalDistanceUp,verticalDistanceDown;

      if(window.innerWidth <= 1200 ){
        horDistArray = data['50vw'];
        console.log(horDistArray)
      } else if(window.innerWidth > 1200){
        horDistArray = data['100vw'];
      }

      switch(direction){
        case '21': 
        case '32': horizontalDistance = horDistArray[0]; break;
        case '12': 
        case '23': horizontalDistance = horDistArray[1]; break;
        case '13': horizontalDistance = horDistArray[2]; break;
        case '31': horizontalDistance = horDistArray[3]; break;
      }

      verticalDistanceUp = -375 + (srcPegHeight - 1)*32.5;
      verticalDistanceDown = (srcPegHeight-1)*32.5 - (destPegHeight*32.5)
        const timeline = gsap.timeline({defaults: {duration: 1}})
        timeline
          .to(component,{y: verticalDistanceUp})
          .to(component,{x: horizontalDistance}) //432 for full screen
          .to(component,{y: verticalDistanceDown})
    }
}