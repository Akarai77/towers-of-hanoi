import React from 'react'

const Disc = React.forwardRef(({index,width},ref) => {
  const bottom = index*32;
  let initialWidth,widthOffset;

  if(window.innerWidth < 1200){
    initialWidth = 50;
    widthOffset = 30;
  } else{
    initialWidth = 65;
    widthOffset = 40;
  }

  return (
  <div className='disc'
        style={{width: `${initialWidth+widthOffset*width}px`,bottom: `${bottom}px`}}
        ref={ref}
    >

    </div>
  )
});

export default Disc;