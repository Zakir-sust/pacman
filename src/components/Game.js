import React from 'react'
import {useEffect,useRef,useState} from 'react'
import TileMap from '../classes/TileMap.js'
import map from '../classes/map.js'
// import Pacman from '../classes/Pacman.js'
export default function Game() {
    const canvasRef = useRef(null)
    const [cnt,setCnt] = useState(2);
       
    useEffect(()=>{
        console.log('useEffect cnt = ',cnt);
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const tileSize = 32
        const tileMap = new TileMap(map[cnt],tileSize)
        const velocity = 2;
        const pacman = tileMap.getPacman(velocity);
        const enemies = tileMap.getEnemies(2)
        console.log('map = ',tileMap)
        console.log('enemies = ',enemies)
        console.log('pacman ',pacman)
        let gameOver = false;
        let gameWin = false;
        tileMap.setCanvasSize(canvas)
        const render = ()=>{
            console.log("gameLoop - ",cnt)
            tileMap.draw(ctx);
            pacman.draw(ctx,pause(),enemies);
            
            enemies.forEach((enemy)=>enemy.draw(ctx,pause(),pacman));
            checkGameOver();
            if(!gameWin)
                requestAnimationFrame(render)
            // console.log('pause values ',gameOver,gameWin,pacman.madeFirstMove)
        }
        
        function checkGameOver(){
            if(!gameOver){
                gameOver = isGameOver();
                if(gameOver){
                    console.log('GAME OVER');
                }
            }
            if(!gameWin){
                gameWin = tileMap.didWin();
                if(gameWin){
                    console.log("WIN!!!")
                        setCnt(1-cnt);   
                }
            }
        }
        function isGameOver(){
            return enemies.some(
                (enemy)=>{
                    return !pacman.powerDotActive && enemy.collideWith(pacman);
                }
            )
        }
        function pause() {
            return !pacman.madeFirstMove || gameOver || gameWin;
        }
        
        render()
    },[cnt])
    return (
        
            <canvas id = 'canvas' width='500px' height='400px' ref={canvasRef}></canvas>
       
    )
}
