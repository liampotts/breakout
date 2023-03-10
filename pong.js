export class Pong {
    constructor(canvas, keyMap) {

        // save canvas and keyMap as members
        this.canvas = canvas;
        this.keyMap = keyMap;
        
        // set size of canvas
        canvas.width = 640;
        canvas.height = 480;
        
        // save canvas context as member
        this.ctx = canvas.getContext('2d'); 

        // Set up the box (bouncing around the screen)
        this.box = new Box();
        this.box.minX = 100
        this.box.minY = 300
        this.box.xVel = 3; // units: pixels per frame
        this.box.yVel = 3;
    
        this.box.width = 20;
        this.box.height = 20;
        

        // Set up the player paddle (paddle on the left side)
        this.paddle = new Box();
        this.paddle.minX = 150;
        this.paddle.minY = 430;
        this.paddle.width = 100;
        this.paddle.height = 10;
        this.paddle.color = [255, 255, 255]; 
        this.paddle.isPaddle = true;
        
//        this.obstacles = [this.paddle];
//        
        
//        this.test = new Box()
//        this.test.minX = 30
//        this.test.minY = 30
//        this.test.width = 
//        this.test.height = 15
//        this.test.color = [0,255,0]
        

        this.brickArray = []
        
        
        for (let r = 0; r<4; r++){
        for (let c = 0; c < 10; c++) {
            const newBrick = new Box()
            newBrick.minX = (c+1)*8 + (c*55)
            newBrick.minY = 30+ (40*r)
            newBrick.width = 55
            newBrick.height = 15
            newBrick.randomizeColor()
            newBrick.xVel= 0
            newBrick.yVel= 0
            newBrick.isBrick = true
            this.brickArray.push(newBrick)
        }
    }

//        this.obstacles= this.obstacles.concat(this.brickArray)
       
//        
     
        // prevDraw is a member variable used for throttling framerate
        this.prevDraw = 0;
        
        // state variables
        this.gameOver = false;
        this.paused = false;
        this.gameStarted = false;
                
    }
    
    
    makeBricks(){
        return    
    }

    mainLoop() {
        // Compute the FPS
        // First get #milliseconds since previous draw
        const elapsed = performance.now() - this.prevDraw;

        if (elapsed < 1000/60) {
            return;
        }
        // 1000 seconds = elapsed * fps. So fps = 1000/elapsed
        const fps = 1000 / elapsed;
        // Write the FPS in a <p> element.
        document.getElementById('fps').innerHTML = fps;
        
        
        this.update();
        this.draw();
        
    }
    
    update() {
        // Update the obstacle using keyboard info
        if (this.keyMap['ArrowLeft']) {
            this.paddle.minX -= 6.5;
            if (this.paddle.minX < 0) {
                this.paddle.minX = 0;
            }
        }
        if (this.keyMap['ArrowRight']) {
            this.paddle.minX += 6.5;
            if (this.paddle.minX + this.paddle.width > this.canvas.width) {
                this.paddle.minX = this.canvas.width - this.paddle.width;
            }
        }
        
        if (this.keyMap['p'] && !this.gameOver) {
            this.paused = true
        }
        
        if (this.keyMap['u'] && !this.gameOver) {
            this.paused = false;
        }
        
        if (this.paused) {
            return;
        }
        
         if (this.keyMap['s'] && !this.gameOver) {
            this.gameStarted = true;
        }
        
        if (!this.gameStarted){
            return 
        }
    

        // Update the box (move, bounce, etc. according to box.xVel and box.yVel)
        const obstacles = [this.paddle].concat(this.brickArray);
        //console.log(obstacles.concat(this.brickArray))
        //console.log(obstacles)
        
        const topEdge = new Box();
        topEdge.minX = 0;
        topEdge.minY = -10;
        topEdge.width = this.canvas.width;
        topEdge.height = 10;
        obstacles.push(topEdge);
        
//        const bottomEdge = new Box();
//        bottomEdge.minX = 0;
//        bottomEdge.minY = this.canvas.height;
//        bottomEdge.width = this.canvas.width;
//        bottomEdge.height = 10;
//        obstacles.push(bottomEdge);
//        
        
        // Create left edge
        const leftEdge = new Box();
        leftEdge.minX = -10;
        leftEdge.minY = 0;
        leftEdge.width = 10;
        leftEdge.height = this.canvas.height;
        obstacles.push(leftEdge);

        // Create right edge
        const rightEdge = new Box();
        rightEdge.minX = this.canvas.width;
        rightEdge.minY = 0;
        rightEdge.width = 10;
        rightEdge.height = this.canvas.height;
        obstacles.push(rightEdge);
        
        
        
        this.box.update(obstacles);
        
        
        // Check for winning
        if (this.box.minY + this.box.height < 0) {
            // Ball too low -> I lost
            this.gameOver = true;
            this.winner = 2;

        }
        if (this.box.minY > this.canvas.height) {
            // Ball too far right -> I won
            this.gameOver = true;
            this.winner = 1;
        }
    }
    
    draw() {
        // clear background
        this.ctx.fillStyle = "rgb(10, 10, 10)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  
        
        
         if (!this.gameStarted) {
            this.ctx.font = "15px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "rgb(255,0,0)";
            const lines = ["Welcome to my breakout game.",
                   "Move the paddle with the left and right arrow keys.",
                   "Press s to start.",
                   "Press p to pause and u to unpause."];
            const lineHeight = 20;
            const y = this.canvas.height/2 - (lines.length * lineHeight)/2;
            lines.forEach((line, i) => {
                this.ctx.fillText(line, this.canvas.width/2, y + i * lineHeight);
                
            } );
             
             
         }

        
        
        if (this.paused) {
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";            
            this.ctx.fillStyle = "rgb(255,0,0)";
            this.ctx.fillText("PAUSED", this.canvas.width/2, this.canvas.height/2);
        }

        // potentially draw victory text
        if (this.gameOver) {
            let x = "You Win";
            if (this.winner == 1) {
                x = "You Lose";
            }
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)            
        }
        
        
        if (this.gameStarted){
        // Draw the box
        this.box.draw(this.ctx);
        this.paddle.draw(this.ctx);
       
        
        for (const brick of this.brickArray){
            brick.draw(this.ctx)
        }
        
        }

        // Save the value of performance.now() for FPS calculation
        this.prevDraw = performance.now();
    }
}



class Box {
    constructor() {
        this.minX = 10;
        this.minY = 30;
        this.width = 20;
        this.height = 20;
        this.xVel = 1;
        this.yVel = 1;  
        this.color = [255, 0, 0];
        this.active = true
        this.breakable = false
        this.isPaddle = false
        
    }

    randomizeColor() {
        this.color[0] = Math.round(Math.random()*255);
        this.color[1] = Math.round(Math.random()*255);
        this.color[2] = Math.round(Math.random()*255);
    }
    
    intersects(box2) {
        // the x-intervals
        const xi1 = [this.minX, this.minX + this.width];
        const xi2 = [box2.minX, box2.minX + box2.width];
        
        if (!intervalsOverlap(xi1, xi2)) {
            return false;
        }
        
        const yi1 = [this.minY, this.minY + this.height];
        const yi2 = [box2.minY, box2.minY + box2.height];
        
        return intervalsOverlap(yi1, yi2);
    }

    update(obstacles) {
        // move x and y

        // move x
        this.minX += this.xVel;

        for (const o of obstacles) {
            
            if (o.active){
                
            if (this.intersects(o)) {
                // undo the step that caused the collision
                this.minX -= this.xVel;
                
                // reverse xVel to bounce
                this.xVel *= -1;
                
                 if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                

            }
        }

        }
            
        // move y
        this.minY += this.yVel;

        for (const o of obstacles) {
             if (o.active){
            if (this.intersects(o)) {
                // undo the step that caused the collision
                this.minY -= this.yVel;
                
                // reverse yVel to bounce
                this.yVel *= -1;
                
                
                   if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                
                if (o.isPaddle){
                              
             
                    //right
                    if (this.minX > o.minX +( o.width/2)){
                       
                        let dist =  o.width -this.minX
                        let scaleFactor = (1+(Math.abs((dist-o.width)/2) / (o.width/2)) /50)
                        console.log("scale", scaleFactor)
                        this.xVel *= scaleFactor 
                        console.log('xvel', this.xVel)
                    }
                    
                    else {
                        //left
                       
                        let dist = this.minX - o.minX
                        let scaleFactor = (1+(Math.abs((dist-o.width)/2) / (o.width/2)) /50)
                        console.log('yvel', this.xVel, "scale", scaleFactor)
                        this.xVel *= scaleFactor 
                        console.log('xvel', this.xVel, "scale", scaleFactor)
                        
                    }
                       
                }
                
                
                
                
                
                //this.randomizeColor();
            }   
        }
        }
    }

    draw(ctx) {
        if (this.active){
        const [r,g,b] = this.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(this.minX, this.minY, this.width, this.height);                
        }
    }

}


function intervalsOverlap(int1, int2) {
    const [a,b] = int1;
    const [c,d] = int2;
    if (a > c) {
        return intervalsOverlap(int2, int1);
    }
    return (b > c);
}
