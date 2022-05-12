import React from 'react'
import pac0 from '../images/pac0.png';
import pac1 from '../images/pac1.png';
import pac2 from '../images/pac2.png';
import ghost from '../images/ghost.png'
const fx = [-1,0,1,0];          ///left,up,right,down
const fy = [0,-1,0,1];
const rot = [180,270,0,90];
const mp = new Array(300)
mp[37]=0;
mp[38]=1;
mp[39]=2;
mp[40]=3;
export default class Pacman{
    constructor(y,x,size,velocity,tileMap){
        this.x = x;
        this.y = y;
        this.size=size;
        this.velocity=velocity;
        this.tileMap = tileMap;
        this.#loadPacmanImages();

        window.addEventListener('keydown',this.#keydown)
        this.currentMove=2;
        this.requestedMove=2;
        
        this.pacmanAnimationTimerDefault=5
        this.pacmanAnimtaionTimer=null

        this.powerDotActive = false;
        this.powerDotAboutToExpire= false;
        this.timers = [];
        this.madeFirstMove = false;
    }
    #keydown = (event)=>{
        console.log('keydown',event.keyCode)
        if(event.keyCode<37||event.keyCode>40)return
        let val = mp[event.keyCode];
        this.requestedMove = val
    }
    
    draw(ctx,pause){
        if (!pause) {
            this.#move();
          
            this.#animate();
            this.#eatPowerDot();
            this.#eatDot();
        }
    
        const halfSize = this.size/2;
        ctx.save();
        const deg = rot[this.currentMove];
        ctx.translate(this.x+halfSize,this.y+halfSize);
        ctx.rotate(deg*Math.PI/180);
        // console.log('pacman draw',this.x,this.y)
        ctx.drawImage(
            this.pacmanImages[this.pacmanImageIndex],
            -halfSize,
            -halfSize,
            this.size,
            this.size,
        )
        ctx.restore();
    }
    #loadPacmanImages(){
        const p0 = new Image();
        p0.src=pac0;
        const p1 = new Image();
        p1.src=pac1;
        const p2 = new Image();
        p2.src=pac2;
        this.pacmanImages = [p0,p1,p2,p1];
        // console.log('p1 image',p1); 
        this.pacmanImageIndex = 0;
    }
    #move(){
        ///check valid move
        // console.log("current move",this.x,this.y,this.currentMove,this.requestedMove)
        if(this.tileMap.checkCollision(this.x,this.y,this.requestedMove) === true)
        {
            if(this.tileMap.checkCollision(this.x,this.y,this.currentMove)===false){
                this.x += fx[this.currentMove]*this.velocity
                this.y += fy[this.currentMove]*this.velocity
            }
            
            this.pacmanAnimationTimer = null
            this.pacmanImageIndex=1
            return ;
        }
        else if(this.pacmanAnimationTimer==null){
            this.pacmanAnimationTimer=this.pacmanAnimationTimerDefault;
        }
        
        if(this.currentMove !== this.requestedMove){
            if(Math.abs(this.currentMove-this.requestedMove)===2)
            {
                this.currentMove=this.requestedMove;
            }
            if(this.x%this.size===0 && this.y%this.size===0){           ///set new move only when possible
                    this.currentMove = this.requestedMove;
            }
            
        }

        
        this.x += fx[this.currentMove]*this.velocity
        this.y += fy[this.currentMove]*this.velocity
        
        // console.log('x = ',this.x,' y = ',this.y,'move = ',this.requestedMove,this.currentMove)


    }
    #animate(){
        if(this.pacmanAnimationTimer===null)return;
        this.pacmanAnimationTimer--;
        if(this.pacmanAnimationTimer<=0)
        {
            this.pacmanImageIndex++;
            if(this.pacmanImageIndex===this.pacmanImages.length)this.pacmanImageIndex=0;
            this.pacmanAnimationTimer=this.pacmanAnimationTimerDefault;
            // console.log('time',this.pacmanAnimationTimer,' index',this.pacmanImageIndex)
        }
    }
    #eatDot(){
        if(this.tileMap.eatDot(this.x,this.y)){
            ///play sound
        }
    }
    #eatPowerDot(){
        if(this.tileMap.eatPowerDot(this.x,this.y)){
            this.powerDotActive = true;
            this.powerDotAboutToExpire = false;
            this.timers.forEach((timer)=>clearTimeout(timer));
            this.timers = [];
            
            console.log('power Dot eaten',this.powerDotActive,this.powerDotAboutToExpire);
            let powerDotTimer = setTimeout(()=>{
                this.powerDotActive = false;
                this.powerDotAboutToExpire=false;
                console.log('after 6 sec')
            },1000*6)
            this.timers.push(powerDotTimer);

            let powerDotAboutToExpireTimer = setTimeout(()=>{
                this.powerDotAboutToExpire = true;
                console.log('after 3 sec',this.powerDotAboutToExpire);
            },1000*3)
            this.timers.push(powerDotAboutToExpireTimer);

        }

    }
}
