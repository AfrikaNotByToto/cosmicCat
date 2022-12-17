const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scale = 0.2; // Cars scale
const speed = 3; // скорость метеоритов

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

// window.addEventListener('keydown', function (e) {
//   KeyDown(e);
// }); // Listenning for keyboard events

const objects = []; // Объекты игры

const player = new Cat(
  'images/car.png',
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
  if (RandomInteger(0, 10000) > 9700) {
    // Generating new car
    objects.push(
      new Cat(
        'images/car_red.png',
        RandomInteger(30, canvas.width - 50),
        RandomInteger(250, 400) * -1,
        false
      )
    );
  }

  player.Update();

  if (player.dead) {
    alert('Crash!');
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
      alert('Crash!');
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

  DrawCar(player);

  for (let i = 0; i < objects.length; i += 1) {
    DrawCar(objects[i]);
  }
}

function DrawCar(car) {
  ctx.drawImage(
    car.image,
    0,
    0,
    car.image.width,
    car.image.height,
    car.x,
    car.y,
    car.image.width * scale,
    car.image.height * scale,
  );
}


