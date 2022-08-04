/*
错误：1.设置高和宽
      2.random(0,255) 传入两个值
      3.碰撞中distance的计算放入if判断中，color尾缀
      4.Ball.prototype.what = function(){};   感叹号后的分号;
      5.创建ball类exists属性漏掉
      6.setControls方法中switch case条件ArrowUp
*/
const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min,max){
  const num = Math.floor(Math.random()* (max-min)) + min; 
  return num;
}

function randomColor(){
  return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
}

function Shape(x,y,velX,velY,exists){
  this.x=x;
  this.y=y;
  this.velX=velX;
  this.velY=velY;
  this.exists=exists;
}

function Ball(x,y,velX,velY,exists,color,size){
    Shape.call(this,x,y,velX,velY,exists);

    this.color=color;
    this.size=size;
}

Ball.prototype = Object.create(Shape.prototype);//函数所实例化得到的对象都可以找到公用的属性和方法。
Ball.prototype.constructor = Ball;

Ball.prototype.draw=function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x,this.y,this.size,0, 2*Math.PI);
  ctx.fill();
};

Ball.prototype.update = function(){

  if( (this.x + this.size) >= width || (this.x + this.size) <= 0 ){
    this.velX = -(this.velX);
  }

  if( (this.y + this.size >= height) || (this.y + this.size) <= 0 ){
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;

};

Ball.prototype.collisionDetect = function(){
for(let j=0; j < balls.length;j++){
  if(this !== balls[j]){
    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx*dx + dy*dy);
  

  if(distance < this.size + balls[j].size){
      this.color = balls[j].color = randomColor();
      }
    }
  }
};

function EvilCircle(x,y,exists){
    Shape.call(this,x,y,20,20,exists);

    this.color = 'white';
    this.size = 12;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor=EvilCircle;

EvilCircle.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth  = 3;
    ctx.arc(this.x,this.y,this.size,0 , 2*Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function(){
    if( (this.x + this.size) >= width ){
        this.x -= this.size  ;
    }

    if( (this.x + this.size) <= 0 ){
        this.x += this.size;
    }
    
    if( (this.y + this.size >= height) ){
        this.y -= this.size;
    }

    if( (this.y + this.size <= 0) ){
        this.y += this.size;
    }
};

EvilCircle.prototype.setControls = function(){
    window.onkeydown = e => {
        switch(e.key){
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.x -= this.velX;
            break;

            case 'd':
            case 'D':
            case 'ArrowRight':
                this.x += this.velX;
            break;

            case 's':
            case 'S':
            case 'ArrowDown':
                this.y += this.velY;
            break;

            case 'w':
            case 'W':
            case 'ArrowUp':
                this.y -= this.velY;
            break;
        }
    };
};

EvilCircle.prototype.collisionDetect = function(){
    for(let j=0; j < balls.length;j++){
        if( balls[j].exists ){
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance < this.size + balls[j].size){
            balls[j].exists = false ;
            count--;
            para.textContent = '剩余彩球数：' + count;
            }
        }
    }
};

const balls = [];

while(balls.length < 25){
  const size = random(10,20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height -size),
    random(-7,7),
    random(-7,7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = '剩余彩球数：' + count;
}

let evil = new EvilCircle(random(0, width),random(0, height),true);
evil.setControls();


function loop(){
  ctx.fillStyle = 'rgb(0,0,0,0.25)';  //画布颜色为半透明黑色
ctx.fillRect(0,0,width,height);//  q起始的坐标，绘制矩形的宽高

for(let i=0 ;i< balls.length ; i++){
    if(balls[i].exists) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    }
}

evil.draw();
evil.checkBounds();
evil.collisionDetect();

requestAnimationFrame(loop);
}

loop();