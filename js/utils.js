function determineWinner(timerId){
    clearTimeout(timerId);
    var endgameLabel = document.querySelector("#endgame");
    if (player.health === enemy.health){
        endgameLabel.innerHTML = "TIE!!!";
    }

    else if(player.health > enemy.health){
        endgameLabel.innerHTML = 'PLAYER 1 WINS!!!';
    }
    else if (player.health < enemy.health){
        endgameLabel.innerHTML = 'PLAYER 2 WINS!!!';
    }
    window.removeEventListener('keydown', keyDownEvent);
}

let timer = 61; //Es 61 porque por algun motivo se decrementa antes de mostrarse, no estoy seguro todavia porque
let timerId;
function decreaseTimer(){
    let timerConteiner = document.querySelector("#timer");
    timerConteiner.innerHTML = timer; 
    if (timer > 0){
       timerId = setTimeout(decreaseTimer, 1000)
       timer--;
       timerConteiner.innerHTML= timer;
    }

    if (timer === 0){
        determineWinner(timerId);
    }
    
}