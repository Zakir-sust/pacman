import ghost from '../images/ghost.png'
import scaredGhost from '../images/scaredGhost.png';
import scaredGhost2 from "../images/scaredGhost2.png";
import pac from '../images/pac1.png';
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

    draw(ctx,pause,pacman){
        // console.log('enemy draw',this.x,this.y,this.tileSize)
        if (!pause) {
            this.#move();
            this.#changeDirection();
        }
      
        this.#setImage(ctx,pacman)
    }
    #setImage(ctx,pacman){
        // console.log('setImage',pacman)
        if(pacman.powerDotActive){
            // this.#setImageWhenPowerDotIsActive(pacman);
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
    #changeDirection(){
        if(this.x%this.tileSize===0 && this.y%this.tileSize === 0)
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
    }
    collideWith(pacman){
        const size = this.tileSize/2;
        if(this.x < pacman.x + size && this.x + size > pacman.x && 
           this.y < pacman.y + size && this.y + size > pacman.y)return true;
           else return false;
    }
}