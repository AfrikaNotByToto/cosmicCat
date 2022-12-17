const open = document.getElementById("modal-block");
const close = document.getElementById("close");

class Car {
  constructor(image, x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.dead = false;
    this.isPlayer = isPlayer;

    this.image = new Image();

    var obj = this;

    this.image.addEventListener("load", function () {
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
  //столкновение объектов
  Collide(car) {
    var hit = false;

    if (
      this.y < car.y + car.image.height * scale &&
      this.y + this.image.height * scale > car.y
    ) {
      //If there is collision by y
      if (
        this.x + this.image.width * scale > car.x &&
        this.x < car.x + car.image.width * scale
      ) {
        //If there is collision by x
        hit = true;
      }
    }
    return hit;
  }

  Move(v, d) {
    if (v == "x") {
      //Moving on x
      d *= 2; //скорость передвижения влево/вправо

      this.x += d; //Changing position

      //Rolling back the changes if the car left the screen
      if (this.x + this.image.width * scale > canvas.width) {
        this.x -= d;
      }

      if (this.x < 0) {
        this.x = 0;
      }
    } //Moving on y
    else {
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

const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

var scale = 0.2; //размер всех объектов

Resize(); //Changing the canvas size on startup

window.addEventListener("resize", Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  return false;
});

window.addEventListener("keydown", function (e) {
  KeyDown(e);
}); //Listenning for keyboard events

var objects = []; //Game objects

var player = new Car(
  "images/cat-l.gif",
  canvas.width / 2,
  canvas.height / 2,
  true
); //Player's object

var speed = 3; //скорость метеоритов

Start();

function Start() {
  if (!player.dead) {
    timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
  }
}

function Stop() {
  clearInterval(timer); //Game stop
  timer = null;
}

function Update() {
  if (RandomInteger(0, 1000) > 980) {
    //генерация астероидов
    objects.push(
      new Car(
        "images/meteor.gif",
        RandomInteger(30, canvas.width - 50),
        RandomInteger(250, 400) * -1,
        false
      )
    );
  }

  player.Update();

  if (player.dead) {
    alert("Cat DIED!!!Nice TRY!!");
    Stop();
  }

  var isDead = false;

  for (var i = 0; i < objects.length; i++) {
    objects[i].Update();

    if (objects[i].dead) {
      isDead = true;
    }
  }

  if (isDead) {
    objects.shift();
  }

  var hit = false;

  for (var i = 0; i < objects.length; i++) {
    hit = player.Collide(objects[i]);

    if (hit) {
      alert("Cat DIED!!!Nice TRY!!");
      Stop();
      player.dead = true;
      break;
    }
  }

  Draw();
}

function Draw() {
  //Working with graphics
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

  DrawCar(player);

  for (var i = 0; i < objects.length; i++) {
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
    car.image.height * scale
  );
}

//движение котика
function KeyDown(e) {
  switch (e.keyCode) {
    case 37: //Left
      player.image.src = "images/cat-l.gif";
      player.Move("x", -speed - 20);
      break;

    case 39: //Right
      player.image.src = "images/cat-r.gif";
      player.Move("x", speed + 20);
      break;

    case 38: //Up
      player.Move("y", -speed - 20);
      break;

    case 40: //Down
      player.Move("y", speed + 20);
      break;

    case 27: //Esc
      if (timer == null) {
        Start();
        // close.style.left = "-100vw";
      } else {
        Stop();
        open.style.left = "0";
      }
      break;
  }
}

close.addEventListener("click", () => {
  open.style.left = "-100"+ "vw";
});

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//генерация астероидов
function RandomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
