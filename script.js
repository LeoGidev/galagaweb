// Definición de colores
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const RED = "#FF0000";

// Obtener el canvas y el contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajustar el ancho del canvas según el ancho de la pantalla del dispositivo
if (window.innerWidth < 800) { // Puedes ajustar el valor 800 según tus necesidades
    canvas.width = window.innerWidth;
} else {
    canvas.width = 800; // Ancho predeterminado en caso de ser un dispositivo con una pantalla más grande
}


// Clase para la nave del jugador
class Player {
    constructor() {
        this.width = 100;
        this.height = 100;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height;
        this.speed = 5;
        this.lives = 3;
        this.image = new Image();
        this.image.src = "img/nave.png";
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === "left" && this.x > 0) {
            this.x -= this.speed;
        }
        if (direction === "right" && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }
}

// Clase para los enemigos
class Enemy {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * -100;
        this.speed = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = Math.random() < 0.5 ? "img/asteroide1.png" : "img/asteroide2.png";
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * -100;
            this.speed = Math.random() * 2 + 1;
            this.image.src = Math.random() < 0.5 ? "img/asteroide1.png" : "img/asteroide2.png";
        }
    }
}

// Clase para los disparos
class Bullet {
    constructor(x, y) {
        this.width = 4;
        this.height = 10;
        this.x = x;
        this.y = y;
        this.speed = -10;
    }

    draw() {
        ctx.fillStyle = RED;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

// Inicialización de juego
const player = new Player();
const enemies = [];
const bullets = [];
let score = 0;

// Función para manejar la entrada del teclado
window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        player.move("left");
    } else if (event.key === "ArrowRight") {
        player.move("right");
    } else if (event.key === " ") {
        bullets.push(new Bullet(player.x + player.width / 2 - 2, player.y));
    } else if (event.key === "r") {
        resetGame();
    }
});

// Función para manejar eventos táctiles en dispositivos móviles y tabletas
canvas.addEventListener("touchstart", function(event) {
    // Obtener las coordenadas del toque
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // Calcular la posición relativa del canvas
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = touchX - canvasRect.left;
    const canvasY = touchY - canvasRect.top;

    // Determinar si el toque está a la izquierda o a la derecha del jugador
    if (canvasX < player.x + player.width / 2) {
        player.move("left");
    } else {
        player.move("right");
    }
});

// Función para manejar el final del toque en dispositivos móviles y tabletas
canvas.addEventListener("touchend", function(event) {
    // No se necesitan acciones adicionales al final del toque
});


// Función para dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    enemies.forEach(enemy => enemy.draw());

    bullets.forEach(bullet => bullet.draw());

    drawScore();
    drawLives();
    gameOver();
    gamewin();
}

// Función para actualizar la lógica del juego
function update() {
    enemies.forEach(enemy => enemy.update());

    bullets.forEach(bullet => bullet.update());

    checkCollisions();
}

// Función para dibujar el puntaje en pantalla
function drawScore() {
    ctx.fillStyle = WHITE;
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Función para dibujar las vidas en pantalla
function drawLives() {
    ctx.fillStyle = WHITE;
    ctx.font = "24px Arial";
    ctx.fillText("Lives: " + player.lives, 10, 60);
}

// Función para verificar colisiones entre enemigos y disparos
function checkCollisions() {
    bullets.forEach(bullet => {
        enemies.forEach(enemy => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bullets.indexOf(bullet), 1);
                enemies.splice(enemies.indexOf(enemy), 1);
                score += 10;
            }
        });
    });

    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            enemies.splice(enemies.indexOf(enemy), 1);
            player.lives--;
            
        }
    });
}

// Función para reiniciar el juego
function resetGame() {
    player.lives = 3;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height;
    score = 0;
    bullets.splice(0, bullets.length);
    enemies.splice(0, enemies.length);
    for (let i = 0; i < 8; i++) {
        enemies.push(new Enemy());
    }
}

// Función para manejar el final del juego
function gameOver() {
    if (player.lives < 0) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = RED;
    ctx.font = "48px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2 - 24);
    ctx.fillText("Presione R para reiniciar", canvas.width / 2 - 260, canvas.height / 2 + 24);

   
   
}
    else{
        console.log("ok");
    }
}

function gamewin(){
    if(enemies.length < 1){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = RED;
        ctx.font = "48px Arial";
        ctx.fillText("¡¡HAS GANADO!!", canvas.width / 2 - 150, canvas.height / 2 - 24);
        ctx.fillText("Presione R para reiniciar", canvas.width / 2 - 260, canvas.height / 2 + 24);

    }

}

// Función principal del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicializar el juego
resetGame();
gameLoop();
