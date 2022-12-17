const Cat = require('./Cat');

/* eslint-disable no-restricted-globals */
/* eslint-disable default-case */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scale = 0.2; // Cars scale
const speed = 3; // скорость метеоритов

const open = document.getElementById('modal-block');
const close = document.getElementById('close');

class Cat {
  constructor(image, x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.dead = false;
    this.isPlayer = isPlayer;

    this.image = new Image();

    const obj = this;

    // eslint-disable-next-line prefer-arrow-callback
    this.image.addEventListener('load', function () {
      obj.loaded = true;
    });

    this.image.src = image;
  }

  Update() {
    if (!this.isPlayer) {
      this.y += speed;
    }

    if (this.y > canvas.height + 50) {
      this.dead = true;
    }
  }
  // столкновение объектов

  Collide(cat) {
    let hit = false;

    if (
      this.y < cat.y + cat.image.height * scale &&
      this.y + this.image.height * scale > cat.y
    ) {
      // If there is collision by y
      if (
        this.x + this.image.width * scale > cat.x &&
        this.x < cat.x + cat.image.width * scale
      ) {
        // If there is collision by x
        hit = true;
      }
    }
    return hit;
  }

  Move(v, d) {
    if (v === 'x') {
      // Движение x
      // eslint-disable-next-line no-param-reassign
      d *= 2;

      this.x += d; // Смена позиции

      // откат изменений, если машина ушла за пределы экрана
      if (this.x + this.image.width * scale > canvas.width) {
        this.x -= d;
      }

      if (this.x < 0) {
        this.x = 0;
      }
      // Движение y
    } else {
      this.y += d;

      if (this.y + this.image.height * scale > canvas.height) {
        this.y -= d;
      }

      if (this.y < 0) {
        this.y = 0;
      }
    }
  }
}

let timer = null;
const UPDATE_TIME = 1000 / 60;

Resize();

window.addEventListener('resize', Resize); // Изменить размер канваз с окном

// Forbidding openning the context menu to make the game play better on mobile devices
// Контекстное меню

// canvas.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
//   return false;
// });

window.addEventListener('keydown', function (e) {
  KeyDown(e);
}); // Отвечает за реакцию на кнопки

const objects = []; // Объекты игры

const player = new Cat(
  'images/cat-l.gif',
  canvas.width / 2,
  canvas.height / 2,
  true
); // Объек игрока

Start();

function Start() {
  if (!player.dead) {
    timer = setInterval(Update, UPDATE_TIME); // Обновление игры 60 раз в секунду
  }
}

function Stop() {
  clearInterval(timer); // Конец игры
  timer = null;
}

function Update() {
  if (RandomInteger(0, 1000) > 980) {
    //генерация астероидов
    objects.push(
      new Cat(
        'images/meteor.gif',
        RandomInteger(30, canvas.width - 50),
        RandomInteger(250, 400) * -1,
        false
      )
    );
  }

  player.Update();

  if (player.dead) {
    Stop();
  }

  let isDead = false;

  for (let i = 0; i < objects.length; i += 1) {
    objects[i].Update();

    if (objects[i].dead) {
      isDead = true;
    }
  }

  if (isDead) {
    objects.shift();
  }

  let hit = false;

  for (let i = 0; i < objects.length; i += 1) {
    hit = player.Collide(objects[i]);

    if (hit) {
      alert('You lose!\nBut it was a niceTry! 🥺👉👈');
      Stop();
      player.dead = true;
      break;
    }
  }

  Draw();
}

function Draw() {
  // Работаем с графикой
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Чистим канваз

  DrawCat(player);

  for (let i = 0; i < objects.length; i += 1) {
    DrawCat(objects[i]);
  }
}

function DrawCat(cat) {
  ctx.drawImage(
    cat.image,
    0,
    0,
    cat.image.width,
    cat.image.height,
    cat.x,
    cat.y,
    cat.image.width * scale,
    cat.image.height * scale
  );
}

// ключевое движение
// eslint-disable-next-line no-unused-vars
function KeyDown(e) {
  switch (e.keyCode) {
    case 37: // влево
      player.image.src = 'images/cat-l.gif';
      player.Move('x', -speed - 20);
      break;

    case 39: // вправо
      player.image.src = 'images/cat-r.gif';
      player.Move('x', speed + 20);
      break;

    case 38: // вверх
      player.Move('y', -speed - 20);
      break;

    case 40: // вниз
      player.Move('y', speed + 20);
      break;

    case 27: // выход
      if (timer == null) {
        Start();
      } else {
        Stop();
        open.style.left = '0';
      }
      break;
  }
}

close.addEventListener('click', () => {
  open.style.left = '-100"+ "vw';
});

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// генерация астероидов
function RandomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
