import React from 'react'
import {useState,useEffect} from 'react'
import useImage from 'use-image'
import wall from '../images/wall.png'
import yellowDot from '../images/yellowDot.png'
import pinkDot from '../images/pinkDot.png'

import Pacman from './Pacman.js'
import tile1 from '../images/tile1.png'
import tile2 from '../images/tile2.png'
import tile3 from '../images/tile3.png'
import tile4 from '../images/tile4.png'
import Enemy from './Enemy.js'
const fx = [-1,0,1,0];          ///left,up,right,down
const fy = [0,-1,0,1];

export default class TileMap{
    constructor(map,tileSize){
        this.tileSize=tileSize
        this.map = map
        this.#loadImages();
        this.powerDotTimerDefault = 5;
        this.powerDotTimer = this.powerDotTimerDefault;
        
    }
    #loadImages(){
        this.wallImage = new Image();
        this.wallImage.src = tile4
        this.yellowDotImage = new Image();
        this.yellowDotImage.src=yellowDot
        this.pinkDotImage = new Image();
        this.pinkDotImage.src = pinkDot;
        this.powerDotImage = this.pinkDotImage;

    }
    #animatePowerDot(){
        this.powerDotTimer--;
        if(this.powerDotTimer===0){
            this.powerDotTimer = this.powerDotTimerDefault;
            if(this.powerDotImage===this.yellowDotImage)
                this.powerDotImage = this.pinkDotImage;
            else this.powerDotImage = this.yellowDotImage;
        }
    }
    setCanvasSize(canvas)
    {
        canvas.width = this.map[0].length*this.tileSize
        canvas.height= this.map.length*this.tileSize
        // console.log('width:',canvas.width,' height:',canvas.height)
    }
    draw(ctx)
    {
        this.#animatePowerDot();
        for(let row = 0;row<this.map.length;row++){
            for(let column = 0;column<this.map[0].length;column++){
                let tile = this.map[row][column];
                if(tile === 1)
                    this.#drawWall(ctx,row,column)
                else if(tile === 0)
                    this.#drawYellowDot(ctx,row,column)
                else if(tile === 7)
                    this.#drawPowerDot(ctx,row,column);
                else
                    this.#drawBlank(ctx,row,column);    
            }
        }
    }
    getPacman(velocity){
        for(let r=0;r<this.map.length;r++){
            for(let c=0;c<this.map[0].length;c++){
                if(this.map[r][c] === 4){
                    this.map[r][c] = 5;
                    // console.log('position = ',r,c)
                    return new Pacman(r*this.tileSize,c*this.tileSize,this.tileSize,velocity,this);
                }
            }
        }
    }
    getEnemies(velocity){
        const enemies = []
        for(let r=0;r<this.map.length;r++){
            for(let c=0;c<this.map[0].length;c++){
                if(this.map[r][c] === 6){
                    this.map[r][c] = 5;
                    // console.log('enemy at = ',r,c)

                    enemies.push(new Enemy(r*this.tileSize,c*this.tileSize,this.tileSize,velocity,this));
                    // return new Enemy(r*this.tileSize,c*this.tileSize,this.tileSize,velocity,this);
                
                }
            }
        }
        return enemies
    }
    #drawWall(ctx,row,column){
        ctx.drawImage(this.wallImage,column*this.tileSize,row*this.tileSize,this.tileSize,this.tileSize)
    }
    #drawYellowDot(ctx,row,column){
        ctx.drawImage(this.yellowDotImage,column*this.tileSize,row*this.tileSize,this.tileSize,this.tileSize)
    }
    #drawBlank(ctx,row,column){
        ctx.fillstyle = "black";
        ctx.fillRect(column*this.tileSize,row*this.tileSize,this.tileSize,this.tileSize);
    }
    #drawPowerDot(ctx,row,column){
        ctx.drawImage(this.powerDotImage,column*this.tileSize,row*this.tileSize,this.tileSize,this.tileSize);
    }
    checkCollision(x,y,requestedMove){
        // console.log('checkCollision - ',x,y,requestedMove)
        if(x%this.tileSize===0 && y%this.tileSize===0){
            let row = y/this.tileSize
            let col =x/this.tileSize
            row += fy[requestedMove];
            col += fx[requestedMove];
            // console.log('x,y = ',x,y,' row,col = ',row,col,this.map[row][col])
            return (this.map[row][col]===1)
        }
        return false;
    } 
    eatDot(x,y){
        if(x%this.tileSize===0 && y%this.tileSize===0){
            const row = y/this.tileSize;
            const column = x/this.tileSize;
            // console.log('row,col',row,column)
            const tile = this.map[row][column];
            if(tile===0){
                this.map[row][column] = 5;
                return true;
            }
        }
        return false;
    }
    eatPowerDot(x,y){
        if(x%this.tileSize===0 && y%this.tileSize===0){
            const row = y/this.tileSize;
            const column = x/this.tileSize;
            const tile = this.map[row][column];
            // console.log('power Dot row,col',row,column,tile)
            if(tile===7){
                this.map[row][column] = 5;
                return true;
            }
        }
        return false;
    }
}