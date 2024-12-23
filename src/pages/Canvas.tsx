import React, { useEffect,useRef } from 'react';
import './Canvas.less';
import { gameManager } from '../core/GameManager';

let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;

export default ({...prop})=>{
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        gameManager.task(()=>{},{name:"test"})
    },[])
    return (
        <aside className="webgl-wrapper">
            {/* canvas */}
        <canvas 
        onClick={() => gameManager.emit("canvas-click")}
         ref={canvasRef} 
         className="webgl-canvas" width={"10px"} style={{ width: "10px" }} {...prop}>No Canvas!</canvas>
      </aside>
    )
}