const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = .3;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite{
    constructor({position, velocity, color})
    {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: this.position,
            width:100,
            height:50,

        }
        this.color = color;
        this.isAttacking = false;
    }

    draw(){
        //player and enemy draw
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

        //atack box
        canvasContext.fillStyle = 'green'
        canvasContext.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        );
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }
        else{
            this.velocity.y += gravity;
        }
        
    }
}

const player = new Sprite(
    {
        position:{
            x:0,
            y:0,
        },
        velocity:{
            x:0,
            y:0
        },
        color: 'red'
    }
);

const enemy = new Sprite(
    {
        position:{
            x:canvas.width - 50,
            y:0,
        },
        velocity:{
            x:0,
            y:0
        },
        color: 'blue'
    }
);

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

function animate(){
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    const baseVelocity = 5;

    //Player movement 
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -baseVelocity;
    }
    else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = baseVelocity;
    }

    //Enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -baseVelocity;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = baseVelocity;
    }


   //dectect for collision
   if ( player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
        && player.attackBox.position.x <= enemy.position.x + enemy.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.height
        //&& player.isAttacking 
   ){
       console.log('nos tocamos')
   }
}



animate();

window.addEventListener('keydown', (event)=>{
    //PLayer Keys
    switch (event.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -13;
            break;

        //Enemy Keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -13;
            break;
    }
});

window.addEventListener('keyup', (event)=>{
    switch (event.key){
        //Player Keys
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;
        
        //Enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
}       
    console.log(event.key);
});