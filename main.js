const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = .5;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imgSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x:590,
        y:147
    },
    imgSrc: './img/shop.png',
    scale: 2.6,
    frameMax:6
})

const player = new Fighter(
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

const enemy = new Fighter(
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

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    shop.update();
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
       enemy.health -=20;
       document.querySelector('#enemyHealth').style.width = enemy.health +'%'
    }
    if ( 
        rectangularCollision({
             rectangle1: enemy,
             rectangle2: player
        })
        && enemy.isAttacking
     ){
        enemy.isAttacking = false;
        player.health -=20;
        document.querySelector('#playerHealth').style.width = player.health +'%'
     }

     //end game base on health
     if (player.health <= 0 || enemy.health <= 0){
         determineWinner(timerId);
     }
}



animate();


function keyDownEvent(event){
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
}

window.addEventListener('keydown', keyDownEvent);

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
