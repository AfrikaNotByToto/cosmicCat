const catNode = document.querySelector('.div');
const mainNode = document.querySelector('.main');
const snowflakeNodes = Array.from(document.querySelectorAll('.snowflake'));
const menuGameNode = document.querySelector('#modal-block');

class Cat {
  x = 0;

  y = 0;
  // картинка нашего кота ГЛАВНАЯ

  catNode = null;

  parentNode = null;

  keyboardKeysPressed = [];

  scoreNode = document.querySelector('#score');

  snowflakeNodes = [];

  menuGameNode = null;

  constructor(catNode, parentNode, snowflakeNodes, menuGameNode) {
    this.catNode = catNode;
    this.parentNode = parentNode;
    this.snowflakeNodes = snowflakeNodes;
    this.menuGameNode = menuGameNode;

    if (this.catNode === null) {
      throw new Error('catNode не существует');
    }

    if (this.parentNode === null) {
      throw new Error('parentNode не существует');
    }

    if (this.snowflakeNodes.length === 0) {
      throw new Error('Астероиды не переданы');
    }

    this.onInit();
  }
  // функция для иницализации и запуска игры(таймер, центровка кота и слушатель для клавиш)

  onInit() {
    this.addEventListeners();
    this.centeringCat();
    this.start();
  }
  // центровка кота, его изначальное положение

  centeringCat() {
    // getBoundingClientRect() - новую открыли для себя штуку из слушателя,
    // которая предоставляет инфу о позиции объекта и его размере в окне
    const parentRect = this.parentNode.getBoundingClientRect();

    // Вычисляем середину родительского элементас котом img по оси X
    this.x = parentRect.left + (parentRect.width - this.catNode.offsetWidth) / 2;

    // Вычисляем середину родительского элемента с котом img по оси Y
    this.y = parentRect.top + (parentRect.height - this.catNode.offsetHeight) / 2;

    // Устанавливаем кошке середину родительского элемента как начальные координаты
    this.catNode.style.left = `${this.x}px`;
    this.catNode.style.top = `${this.y}px`;
  }
  // слушатель на кнопки + запускает музыку

  addEventListeners() {
    document.addEventListener('keydown', this.moveLogic);
    document.addEventListener('keyup', this.keyUp);
    this.initMusic();
  }
  // вкл/выкл музыки

  initMusic() {
    const music = new Audio();
    music.src = './music/fun.mp3';
    music.autoplay = true;

    document.querySelector('#musicPlay').onclick = function () {
      music.play();
      music.loop = true;
    };
    document.querySelector('#musicStop').onclick = function () {
      music.pause();
    };
  }
  // проверка на столкновение

  checkForCollision() {
    for (let i = 0; i < this.snowflakeNodes.length; i += 1) {
      // отпредляет размемы метеорита и котика
      const snowflakeRect = this.snowflakeNodes[i].getBoundingClientRect();
      const catRect = this.catNode.getBoundingClientRect();
      // проверка на местоположения каждого элемента
      if (
        catRect.x < snowflakeRect.x + snowflakeRect.width / 2 &&
        catRect.x + catRect.width / 2 > snowflakeRect.x &&
        catRect.y < snowflakeRect.y + snowflakeRect.height / 2 &&
        catRect.height / 2 + catRect.y > snowflakeRect.y
      ) {
        alert('You lose!\nBut it was a niceTry!🥺👉👈');
        // перезагружает URL наподобие кнопке обновления браузера
        location.reload();
      }
    }
  }
  // основная функция движения

  moveLogic = (evt) => {
    const keypress = evt.key;

    this.keyboardKeysPressed.push(keypress);
    this.keyboardKeysPressed = this.keyboardKeysPressed.filter(
      (item, i, arr) => arr.indexOf(item) === i,
    );
    // менюшка по esc
    if (keypress === 'Escape') {
      this.menuGameNode.classList.toggle('active');
    }
    // стандартное движение
    if (keypress === 'ArrowUp') {
      this.moveY(-40);
    }
    if (keypress === 'ArrowDown') {
      this.moveY(40);
    }
    if (keypress === 'ArrowLeft') {
      this.moveX(-40);
    }
    if (keypress === 'ArrowRight') {
      this.moveX(40);
    }
    // движение по диагонали
    if (
      this.keyboardKeysPressed.includes('ArrowLeft') &&
      this.keyboardKeysPressed.includes('ArrowUp')
    ) {
      this.moveX(-30);
      this.moveY(-30);
    }

    if (
      this.keyboardKeysPressed.includes('ArrowRight') &&
      this.keyboardKeysPressed.includes('ArrowUp')
    ) {
      this.moveX(30);
      this.moveY(-30);
    }

    if (
      this.keyboardKeysPressed.includes('ArrowLeft') &&
      this.keyboardKeysPressed.includes('ArrowDown')
    ) {
      this.moveX(-30);
      this.moveY(30);
    }

    if (
      this.keyboardKeysPressed.includes('ArrowRight') &&
      this.keyboardKeysPressed.includes('ArrowDown')
    ) {
      this.moveX(30);
      this.moveY(30);
    }
    // проверка на столкновение
    this.checkForCollision();
  };
  // смена картинки котика лево/право

  moveX(shiftX) {
    const lastX = this.x;

    this.x = this.x + shiftX;

    if (this.x < 0) {
      this.x = 0;
    }
    // offsetWidth содержит полную ширину элемента
    if (this.x > this.parentNode.offsetWidth - this.catNode.offsetWidth) {
      this.x = this.parentNode.offsetWidth - this.catNode.offsetWidth;
    }

    const nextX = this.x;

    if (nextX > lastX) {
      this.changeImageCat('right');
    } else {
      this.changeImageCat('left');
    }

    this.catNode.style.left = this.x + 'px';
  }

  moveY(shiftY) {
    this.y += shiftY;
    if (this.y < 0) {
      this.y = 0;
    }
    // offsetWidth содержит полную ширину элемента
    if (this.y > this.parentNode.offsetHeight - this.catNode.offsetHeight) {
      this.y = this.parentNode.offsetHeight - this.catNode.offsetHeight;
    }

    this.catNode.style.top = this.y + 'px';
  }

  changeImageCat(direction) {
    const catImageNode = this.catNode.querySelector('img');

    if (direction === 'left') {
      catImageNode.src = './img/cat.gif';
    } else if (direction === 'right') {
      catImageNode.src = './img/cat-r.gif';
    }
  }

  // вызывается при срабатывании события keyup и используется
  // для обновления массива keyboardKeysPressed, чтобы отразить клавиши,
  // которые больше не нажимаются.

  keyUp = (e) => {
    const keypress = e.key;
    this.keyboardKeysPressed = this.keyboardKeysPressed.filter(
      (el) => el !== keypress,
    );
  };

  // Таймер начинает отсчет, когда начинается игра
  start() {
    window.timerId = window.setInterval(this.timer, 100);
  }
  // работа с idScore, функция изменяет значение инпута в Таймере в браузере

  timer = () => {
    this.checkForCollision();
    this.scoreNode.value = parseInt(this.scoreNode.value) + 1;
  };
}
// создание экземпляра класса Кэт
new Cat(catNode, mainNode, snowflakeNodes, menuGameNode); 
