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
      //If there is collision by y
      if (
        this.x + this.image.width * scale > cat.x &&
        this.x < cat.x + cat.image.width * scale
      ) {
        //If there is collision by x
        hit = true;
      }
    }
    return hit;
  }
}
