import React from 'react'
import {useRef,useEffect,useState} from 'react'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils'
import debounce from "lodash.debounce";

const Canvas = () => {
const canvasRef = useRef(null)
const [width,setWidth] = useState(window.innerWidth)
const [height,setHeight] = useState(window.innerHeight)
const [stars, setStars] = useState([])



class Star {
  constructor(width,height){
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.colors = [`rgb(155,176,255`,`rgb(170,191,255`,`rgb(202,215,255`,`rgb(248,247,255`,`rgb(255,244,234`,`rgb(255,210,161`,`rgb(255,204,111`]
    this.color =  this.colors[this.getRandom(0,this.colors.length)]
    this.lifeCycle = this.getRandom(1,199)
    this.radius = this.lifeCycle / 200
    this.x =  this.getRandom(0 + this.radius, this.width - this.radius)
    this.y = this.getRandom(0 + this.radius, this.height - this.radius)
    this.dying = this.getRandom(1,2) === 2 ? true : false
  }
  getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  init(){
    this.radius = this.lifeCycle / 100
    this.color =  this.colors[this.getRandom(0,this.colors.length)]
    this.x =  this.getRandom(0 + this.radius, this.width - this.radius)
    this.y = this.getRandom(0 + this.radius, this.height - this.radius)
    this.lifeCycle = 1
    this.dying = false
  }
  live(){
    this.x += (0.5 - Math.random()) / 9
    this.y += (0.5 - Math.random()) / 9
    this.lifeCycle = this.dying ? this.lifeCycle - 1 : this.lifeCycle + 1
    this.radius = this.lifeCycle / 200
    if(this.lifeCycle > 199){
      this.dying = true
    }
    if(this.lifeCycle < 1){
      this.init()
    }
  }
  draw(ctx){
    ctx.fillStyle = this.color + `,${this.lifeCycle / 200})`
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true)
    ctx.closePath()
    ctx.fill()
  }
}

class Comet {
  constructor(){
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.x =  this.getRandom(0,this.width)
    this.y = this.getRandom(0,this.height)
    this.dy = 0.5 - Math.random() * this.getRandom(1,2)
    this.dx = 0.5 - Math.random() * this.getRandom(1,2)
    this.radius = Math.random()
    this.dying = this.getRandom(1,2) === 2 ? true : false
    this.tail = []
  }
  getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  live(){
    this.x += this.dx
    this.y += this.dy    
    this.tail.unshift({x: this.x,y:this.y})
    this.bounds()
    if(this.tail.length > 200){
      this.tail.pop()
    }
  }
  draw(ctx){
    for(let i = 0; i < this.tail.length; i++){
      ctx.fillStyle = `rgb(0,255,236,${1 /(i + 1)})`
      ctx.beginPath()
      ctx.arc(this.tail[i].x,this.tail[i].y,this.radius / i + 1,0,Math.PI*2,true)
      ctx.closePath()
      ctx.fill()
    }
  }
  bounds(){
    if(this.x > this.width){
      this.x -= this.width
      this.y = this.getRandom(0,this.height)
      this.dx = 0.5 - Math.random()
      this.dy = 0.5 - Math.random()
    }
    else if(this.x < 0){
      this.x += this.width
      this.y = this.getRandom(0,this.height)
      this.dx = 0.5 - Math.random()
      this.dy = 0.5 - Math.random()
    }
    if(this.y > this.height){
      this.y -= this.height
      this.x =  this.getRandom(0,this.width)
      this.dx = 0.5 - Math.random()
      this.dy = 0.5 - Math.random()
    } 
    else if(this.y < 0){
      this.y += this.height
      this.x =  this.getRandom(0,this.width)
      this.dx = 0.5 - Math.random()
      this.dy = 0.5 - Math.random()
    }  
}
}



const draw = (ctx, arr) => {
  ctx.clearRect(0,0,width,height)
  for(let star of arr){
    star.draw(ctx)
    star.live()
    
  }
}


const createStars = () => {
  const totalStars = Math.floor((width/100 * (height / 100)) * 10 )
  const totalComets = 2
  let stars = []
  for(let i = 0; i < totalStars; i++){
    let star = new Star(width,height)
    stars.push(star)
  }
  for(let j = 0; j < totalComets; j++){
    let comet = new Comet(width,height)
    stars.push(comet)
  }
 
  setStars(stars)
}

const alterStars = () => {  
  for(let star of stars){
    star.width = window.innerWidth
    star.height = window.innerHeight
  }
}

const adjustDimensions = () => {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)
  alterStars()
}

window.onresize = debounce(() => {
  adjustDimensions()
})

useEffect(createStars,[])


useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  let animationFrameId
  const render = () => {
    draw(ctx, stars)
    animationFrameId = window.requestAnimationFrame(render)
  }
  render()
  return () => {
    window.cancelAnimationFrame(animationFrameId)
  }

},[draw])



const canvasStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: -1,
  overflow: 'hiden'
}


return(
  <div>
    <canvas
    style={canvasStyle}
    height={height}
    width={width}
    ref={canvasRef}
    >

    </canvas>
  </div>

)

}

export default Canvas