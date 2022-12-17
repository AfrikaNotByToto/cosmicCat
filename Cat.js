/* eslint-disable operator-linebreak */
const canvas = document.getElementById('canvas');
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

    // eslint-disable-next-line prefer-arrow-callback, func-names
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

module.exports = Cat;
