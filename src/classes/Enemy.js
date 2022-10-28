import ghost from '../images/ghost.png'
import scaredGhost from '../images/scaredGhost.png';
import scaredGhost2 from "../images/scaredGhost2.png";
import pac from '../images/pac1.png';
import A_star from './A_star.js';
const fx = [-1,0,1,0];          ///left,up,right,down
const fy = [0,-1,0,1];
const rot = [180,270,0,90];

export default class Enemy{
    constructor(y,x,tileSize,velocity,tileMap){
        this.x=x;
        this.y=y;
        this.tileSize=tileSize;
        this.velocity=velocity;
        this.tileMap = tileMap;
        this.#loadEnemyImages();
        this.currentMove=0;
        this.directionTimerDefault = this.#random(2,8);
        this.directionTimer=this.directionTimerDefault;
        
        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
    }

    drawRect(ctx,x, y)
    {
        ctx.beginPath();
        ctx.fillStyle="red";
        // ctx.arc(5*32,6*32,10,0,2*Math.PI);
        ctx.fillRect(x*this.tileSize+12,y*this.tileSize+12,8,8);
        ctx.stroke();
        ctx.fillStyle="black";
    }
    drawPath(ctx,ara){
        for(let i=0;i<ara.length;i++){
            this.drawRect(ctx,ara[i][1],ara[i][0]);
        }
    }
    getPacmanNextPosition(x,y,move){
        let newX=x/this.tileSize,newY=y/this.tileSize;
        if(move === 0)newX = Math.floor(x/this.tileSize);
        if(move === 1)newY = Math.floor(y/this.tileSize);
        if(move === 2)newX = Math.ceil(x/this.tileSize);
        if(move === 3)newY = Math.ceil(y/this.tileSize);
        return [newX,newY];
    }
    getMove(x,y){
        
        for(let k=0;k<4;k++){
            if(fx[k]==x&&fy[k]==y)
                return k;
        }
        return -1;
    }
    getNextMove(ara)
    {
        console.log('x,y ',this.x/this.tileSize,this.y/this.tileSize);
        for(let i=ara.length-1;i>=0;i--){
            let mv = this.getMove(ara[i][1]-Math.round(this.x/this.tileSize),ara[i][0]-Math.round(this.y/this.tileSize))
            console.log('cur ',ara[i][0],ara[i][1],'mv ',mv);
            if(mv>=0)
                return mv;
        }
        return this.currentMove;
    }
    getNextCell(src,dest)
    {
        let path = A_star(src,dest,this.tileMap.map);
        let ara = []
        for(let i=0;i<Math.min(path.length,3);i++)
        ara.push(path[i])
        console.log("path = ",src,dest);
        console.log('ara ',ara)
        let mv = this.getNextMove(ara);
        this.currentMove = mv;
        console.log('mv ',mv);
        console.log(path)
    }
    
    draw(ctx,pause,pacman){
        let src = [Math.round(this.x/32),Math.round(this.y/32)];
        let dest = this.getPacmanNextPosition(pacman.x,pacman.y,pacman.currentMove);
            
        // let destination = [pacman.y/32,pacman.x/32];
        // let src = [this.y/32,this.x/32];
        // let path = A_star(src,destination,this.tileMap.map)
        // this.drawPath(ctx,path);
        // console.log('src,dst,nxt_cell',src,dest,nextCell)
        // console.log('enemy draw',this.x,this.y,this.tileSize)
        if (!pause) {
            this.#move();
            this.#changeDirection(src,dest,pacman.powerDotActive);
        }
      
        this.#setImage(ctx,pacman)
    }
    #setImage(ctx,pacman){
        // console.log('setImage',pacman)
        if(pacman.powerDotActive){
            this.#setImageWhenPowerDotIsActive(pacman);
            if(pacman.powerDotAboutToExpire){

                // console.log('about to expire')
                this.scaredAboutToExpireTimer--;
                if(this.scaredAboutToExpireTimer===0){
                    this.scaredAboutToExpireTimer=this.scaredAboutToExpireTimerDefault;
                    if(this.image === this.scaredGhost){
                        this.image = this.scaredGhost2;
                    }
                    else this.image = this.scaredGhost; 
                }
            }
            else this.image = this.scaredGhost;
        }
        else
        {
            this.image = this.normalGhost;
            // console.log('power dot off')
        }

        // console.log('this.image',this.image)
        ctx.drawImage(this.image,this.x,this.y,this.tileSize,this.tileSize);
    }
    #setImageWhenPowerDotIsActive(pacman){
        // console.log("power dot active",pacman)
        if(pacman.powerDotAboutToExpire){
            
            this.scaredAboutToExpireTimer--;
            if(this.scaredAboutToExpireTimer===0){
                this.scaredAboutToExpireTimer=this.scaredAboutToExpireTimerDefault;
                if(this.image === scaredGhost){
                    this.image = this.scaredGhost2;
                }
                else this.image = this.scaredGhost; 
            }
        }
        else this.image = this.scaredGhost;
    }
    #loadEnemyImages(){
        this.normalGhost = new Image();
        this.normalGhost.src = ghost;
        this.scaredGhost = new Image();
        this.scaredGhost.src = scaredGhost;
        this.scaredGhost2 = new Image();
        this.scaredGhost2.src= scaredGhost2;

        // console.log("load image");
        this.image = this.normalGhost;
        
    }
    #random(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    }
    #move(){
        // console.log('enemy move',this.x,this.y,this.currentMove);
        if(!this.tileMap.checkCollision(this.x,this.y,this.currentMove)){
            this.x += fx[this.currentMove]*this.velocity;
            this.y += fy[this.currentMove]*this.velocity;
        }
    }
    #randomMove()
    {
            this.directionTimer--;
            // console.log('enemy direction timer',this.directionTimer,this.x,this.y,this.currentMove,this)
            if(this.directionTimer===0)
            {
                this.directionTimer = this.directionTimerDefault;
                let newMove = Math.floor(Math.random()*4);
                if(Math.abs(newMove-this.currentMove)==2)return;
                // console.log('newMove ',newMove,'timer',this.directionTimer);
                if(!this.tileMap.checkCollision(this.x,this.y,newMove)){
                    this.currentMove = newMove;
                }
            }
    }
    #changeDirection(src,dest,val){
        if(this.x%this.tileSize===0 && this.y%this.tileSize === 0)
        {
            if(val)
                this.#randomMove()
            else
                this.getNextCell(src,dest);
            ////////////////////
            
            
        }
    }
    collideWith(pacman){
        const size = this.tileSize/2;
        if(this.x < pacman.x + size && this.x + size > pacman.x && 
           this.y < pacman.y + size && this.y + size > pacman.y)return true;
           else return false;
    }
}