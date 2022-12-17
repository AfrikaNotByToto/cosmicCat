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
  true,
); // Player's object

Start();
