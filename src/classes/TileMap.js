import React from 'react'
import {useState,useEffect} from 'react'
import wall from '../images/wall.png'
import yellowDot from '../images/yellowDot.png'
import pinkDot from '../images/pinkDot.png'

import Pacman from './Pacman.js'
import tile1 from '../images/tile1.png'
import tile2 from '../images/tile2.png'
import tile3 from '../images/tile3.png'
import tile4 from '../images/tile4.png'
import _ from 'lodash'
import Enemy from './Enemy.js'
const fx = [-1,0,1,0];          ///left,up,right,down
const fy = [0,-1,0,1];

function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}
export default class TileMap{
    
    constructor(map,tileSize){
        this.tileSize=tileSize
        // this.map = JSON.parse(JSON.stringify(map))
        this.map = _.cloneDeep(map)
        // this.map = map.slice(0);
        // this.map = structuredClone(map)
        this.#loadImages();
        console.log('map ',map,this.map)
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
    drawRect(ctx,x, y)
    {
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(5*32,6*32,10,0,2*Math.PI);
        ctx.fillRect(x*32+12,y*32+12,8,8);
        ctx.stroke();
        ctx.fillStyle="black";
    }
    drawPath(ctx,ara){
        for(let i=0;i<ara.length;i++){
            this.drawRect(ctx,ara[i][0],ara[i][1]);
        }
    }
    draw(ctx)
    {
        let ara  = [[ 1, 1 ] ,
        [ 1, 2 ] ,
        [ 1, 3 ] ,
        [ 1, 4 ] ,
        [ 1, 5 ] ,
        [ 1, 6 ] ,
        [ 2, 6 ] ,
        [ 3, 6 ] ,
        [ 3, 7 ] ,
        [ 3, 8 ] ,
        [ 4, 8 ] ,
        [ 5, 8 ] ,
        [ 6, 8 ] ,
        [ 7, 8 ] ,
        [ 8, 8 ] ,
        ]        
        
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
        
        this.drawPath(ctx,ara);
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
    didWin(){
        let remaining = this.#dotsLeft();
        // console.log('ramaining = ',remaining)
        return remaining <= 0;         ///must change here
    }
    #dotsLeft(){
        let r  = this.map.flat().filter(tile=>tile===0).length;
        return r;
    }
}
