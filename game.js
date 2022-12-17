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
}
