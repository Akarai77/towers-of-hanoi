import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Move } from './Move';
import Disc from './Disc';

function App() {
  
  const pegs = ["peg1", "peg2", "peg3"];
  const bases = ["base1","base2","base3"];
  const [discs, setDiscs] = useState(0);
  const discRefs = useRef([]);
  const [component, setComponent] = useState(null);
  const [discArray, setDiscArray] = useState([[], [], []]);
  const [pegHeights,setPegHeights] = useState([discs,0,0]);
  const [direction, setDirection] = useState(null);
  const [started,setStarted] = useState(false);
  const [resize,setResize] = useState(false);
  const [maxDiscs,setMaxDiscs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive,setTimerActive] = useState(false);
  const [valid,setValid] = useState(false);
  const [errMsg,setErrMsg] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setResize(!resize);
      window.location.reload();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resize]);



  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);


  useEffect(()=>{
    if(window.innerWidth < 1200){
      setMaxDiscs(4);
    } else {
      setMaxDiscs(10);
    }
  },[resize,maxDiscs])
  

  useEffect(() => {
    const newArray = [];
    for (let i = 0; i < discs; i++) {
      newArray.push(i);
    }
    setDiscArray([newArray, [], []]);
  }, [discs]);



  const addRef = (element, index) => {
    if (element) {
      discRefs.current[index] = element;
    }
  };

  useEffect(()=>{
    var newHeights = [0,0,0];
    discArray.map((discs,id)=>{
      discs.map((disc)=>{
        if(disc != null)
          newHeights[id]+=1;
      })
    })
    setPegHeights(newHeights);
  },[discArray])

  useEffect(() => {
    if (component !== null) {
      Move(component, direction, pegHeights);
    }
  }, [component]);

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 0 && value <= maxDiscs) {
      setErrMsg(null);
      setValid(true);
      setDiscs(value);
    } else {
      if(isNaN(value)){
        setErrMsg("Enter A Valid Number");
        setValid(false);
        setDiscs(0);
      }
      else if(window.innerWidth < 1200){
        setErrMsg("Maximize Screen To Accomodate More Discs!");
        setValid(false);
        setDiscs(0);
      } else {
        setErrMsg("Maximum Number of Discs Exceede!");
        setValid(false);
        setDiscs(0);
      }
    }
  };

  const handleMove = async (disc, source, destination) => {
    return new Promise((resolve) => {
      let sourceArray, destinationArray;
      setTimeout(()=>{
      console.log(`Handling move: ${disc} from ${source} to ${destination}`);
      sourceArray = discArray[source - 1];
      destinationArray = discArray[destination - 1];
      setDirection(source.toString() + destination.toString());
      setComponent(discRefs.current[disc]);
      },50) //timeout is required for refs to update properly

      setTimeout(() => {
        destinationArray[disc]=sourceArray[disc];
        sourceArray[disc] = null;
        if (source === 1) {
          if (destination === 2)
            setDiscArray([sourceArray, destinationArray, discArray[2]]);
          else if (destination === 3)
            setDiscArray([sourceArray, discArray[1], destinationArray]);
        } else if (source === 2) {
          if (destination === 1)
            setDiscArray([destinationArray, sourceArray, discArray[2]]);
          else if (destination === 3)
            setDiscArray([discArray[0], sourceArray, destinationArray]);
        } else if (source === 3) {
          if (destination === 1)
            setDiscArray([destinationArray, discArray[1], sourceArray]);
          else if (destination === 2)
            setDiscArray([discArray[0], destinationArray, sourceArray]);
        }
        resolve();
      }, 3200);
    });
  };

  const towersOfHanoi = async (n, source, auxiliary, destination) => {
    if (n === -1) {
      return;
    }
    await towersOfHanoi(n - 1, source, destination, auxiliary);
    await handleMove(n, source, destination);
    await towersOfHanoi(n - 1, auxiliary, source, destination);
  };

  return (
    <div className="container">
      <div className="time-taken">
        {
          <h2>Timer: {seconds} seconds</h2>
        }
      </div>

      <div className="pegs">
        {pegs &&
          pegs.map((peg, pegId) => (
            <div key={pegId} className="peg" id={`${peg}`}>
              <div key={pegId} className="discs">
                {discArray[pegId].map((discWidth, discId) => {
                  if (discWidth !== null)
                    return (
                      <Disc key={discId} width={discWidth} ref={(el) => addRef(el, discId)} />
                    );
                })}
              </div>
            </div>
          ))}
      </div>
      <div className="bases">
      {
        bases.map((base,id)=>{
          let baseWidth = 13;
          if(window.innerWidth > 1200 && discs > 4){
            baseWidth+=(discs-4)*2.5;
          } else if(window.innerWidth < 1200){
            baseWidth = 10;
          }
          return (
            <div key={id} className="base" id={`${base}`} style={{width: `${baseWidth}rem`}}></div>
          )
        })
      }
      </div>
      
      <div className={`button ${valid ? 'valid' : ''}`}>
        {
          started ? <button onClick={() => {window.location.reload(); setStarted(!started);}}>RESTART</button>
                  : <button onClick={async() => { setStarted(!started); setTimerActive(true); await towersOfHanoi(discs - 1, 1, 2, 3); setTimerActive(false);}}>START</button>
        }
      </div>
      
      <div className="setDiscs">
        Set Discs:
        <input type="number" name='setDiscs' min={1} max={maxDiscs} placeholder='0' onChange={handleInputChange}/>
      </div>

      <div className="err-msg">
        {errMsg}
      </div>
    </div>
  );
};

export default App;
