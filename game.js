// ゲームの初期設定
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let bullets = [];
let enemies = [];
let gameMode = ''; // 'pc' または 'mobile' でモードを設定
let isGameOver = false;

// ゲーム開始画面
document.getElementById('pc-version').addEventListener('click', () => startGame('pc'));
document.getElementById('mobile-version').addEventListener('click', () => startGame('mobile'));

// ゲーム開始
function startGame(mode) {
    gameMode = mode;
    resetGame();
    document.getElementById('game-start-screen').style.display = 'none';
    if (gameMode === 'mobile') {
        setupMobileControls();
    } else {
        setupPCControls();
    }
    gameLoop();
}

// プレイヤー設定
function Player(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.isAlive = true;
    this.speed = 5;
    this.shootInterval = 500;  // ミリ秒単位
    this.lastShotTime = 0;
}
Player.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};
Player.prototype.shoot = function() {
    if (this.isAlive && Date.now() - this.lastShotTime > this.shootInterval) {
        bullets.push(new Bullet(this.x + this.width / 2, this.y, 'up'));
        this.lastShotTime = Date.now();
    }
};

// 弾設定
function Bullet(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = 7;
    this.direction = direction;
}
Bullet.prototype.update = function() {
    if (this.direction === 'up') {
        this.y -= this.speed;
    }
    if (this.y < 0) {
        bullets.splice(bullets.indexOf(this), 1);
    }
};
Bullet.prototype.draw = function() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// 敵設定
function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 3;
}
Enemy.prototype.update = function() {
    this.x += this.speed;
    if (this.x > canvas.width || this.x < 0) {
        this.speed = -this.speed;
    }
};
Enemy.prototype.draw = function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// ゲームリセット
function resetGame() {
    player = new Player(canvas.width / 2 - 25, canvas.height - 100);
    bullets = [];
    enemies = [];
    isGameOver = false;
    for (let i = 0; i < 5; i++) {
        enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height / 2));
    }
}

// ゲームループ
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // プレイヤーが常に弾を発射
    if (!isGameOver) {
        player.shoot();
    }
    
    // 弾と敵を更新
    bullets.forEach(bullet => bullet.update());
    enemies.forEach(enemy => enemy.update());
    
    // プレイヤー、弾、敵を描画
    player.draw();
    bullets.forEach(bullet => bullet.draw());
    enemies.forEach(enemy => enemy.draw());
    
    requestAnimationFrame(gameLoop);
}

// プレイヤーの描画
Player.prototype.draw = function() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// PC版の操作
function setupPCControls() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            player.move(-player.speed, 0);
        } else if (event.key === 'ArrowRight') {
            player.move(player.speed, 0);
        } else if (event.key === 'ArrowUp') {
            player.move(0, -player.speed);
        } else if (event.key === 'ArrowDown') {
            player.move(0, player.speed);
        }
    });
}

// スマホ版の操作
function setupMobileControls() {
    canvas.addEventListener('touchstart', function(event) {
        var touch = event.touches[0];
        player.moveTo(touch.pageX - player.width / 2, touch.pageY - player.height / 2);
    });
}

// スマホ版の移動
Player.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
};
