import React, { useEffect,useRef } from 'react';
import './Canvas.less';
import { gameManager } from '../core/GameManager';
import { Game } from '../core/Game';
import { useNavigate } from 'react-router-dom';

export default ({...prop})=>{
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const game = new Game(canvasRef.current!,navigate);
        return () => game.destroy();
      }, [gameManager.restartCount])
    return (
        <aside className="webgl-wrapper">
        <canvas 
        onClick={() => gameManager.emit("canvas-click")}
         ref={canvasRef} 
         className="webgl-canvas" {...prop}>No Canvas!</canvas>
      </aside>
    )
}