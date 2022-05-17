const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = .5;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite{
    constructor({position, velocity, color, offset})
    {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
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
        if (this.isAttacking){
            canvasContext.fillStyle = 'green'
            canvasContext.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }
        else{
            this.velocity.y += gravity;
        }
        
    }

    attack(){
        this.isAttacking = true;
        setTimeout(
            ()=>{
                this.isAttacking = false;
            },
            100
        );
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
        color: 'red',
        offset:{
            x:0,
            y:0
        }
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
        color: 'blue',
        offset:{
            x:-50,
            y:0
        }
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

function rectangularCollision({ rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x //el lado derecho de la attackbox >= el lado izquierdo del enemigo
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width //el lado izquiedo de la attackbox >= el lado derecho del enemigo
        //estos dos son para ateques y salto
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate(){
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    const baseVelocity = 10;

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
   if ( 
       rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
       })
       && player.isAttacking
    ){
       player.isAttacking = false;
       console.log('ataque jugador')
    }
    if ( 
        rectangularCollision({
             rectangle1: enemy,
             rectangle2: player
        })
        && enemy.isAttacking
     ){
        enemy.isAttacking = false;
        console.log('ataque enemigo')
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
            player.velocity.y = -15;
            break;
        
        case ' ':
            player.attack();
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
            enemy.velocity.y = -15;
            break;
        case 'Enter':
            enemy.attack()
            break;
    }
    console.log(event.key);
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
});
