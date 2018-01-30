document.addEventListener('DOMContentLoaded', function () {
    snake.init();
    snake.startScreen();
});


var snake = {
    BACKGROUND_COUNT: 3, // количество картинок для фона
    FIELD_SIZE: {
        w: 20, // размер поля можно легко поменять
        h: 9
    },
    CELL_SIZE: 50,
    VELOCITY: [1, 0],
    DIRECTIONS: {
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1]
    },

    init: function () {
        snake.preloadImages();
        snake.createField();

    },

    startScreen: function () {
        var conteiner = document.querySelector('.conteiner'),
            startBg = document.createElement('div'),
            startButton = document.createElement('button'),
            width = (this.FIELD_SIZE.w * this.CELL_SIZE) + 'px',
            height = (this.FIELD_SIZE.h * this.CELL_SIZE) + 'px';


        conteiner.style.width = width;
        conteiner.style.height = height;

        startBg.style.width = width;
        startBg.style.height = height;
        startBg.className = 'start-background';

        conteiner.appendChild(startBg);


        startButton.className = 'start-button';
        console.log(startButton.className);
        startBg.appendChild(startButton);

        startButton.addEventListener('click', this.reset.bind(this));
    },

    cleanStartScreen: function () {
        var bg = document.querySelector('.start-background'),
            button = document.querySelector('.start-button');

        bg.remove();
        button.remove();
    },


    reset: function () {
        this._field.forEach(function (x) {
            return x.forEach(function (cell) {
                cell.className = 'div-block';
            });
        });

        snake.cleanStartScreen();
        snake.createSnake();
        snake.addEvents();

        this._intervalLoop = setInterval(this.loop.bind(this), 300);

        this.renderSnake();
        this.randomFood();
    },

    loop: function () {
        this.moveSnake();
        this.renderSnake();

    },

    preloadImages: function () { //загрузка картинок для фона
        var _this = this,
            tmpImage,
            imageCount = this.BACKGROUND_COUNT;

        _this._images = [];

        for (var i = 0; i < imageCount; i++) {

            tmpImage = new Image();

            tmpImage.onload = function () {
                imageCount--;
                _this._images.push(this);

                if (!imageCount) {
                    _this.generateBackground();
                }
            };

            tmpImage.src = 'img/background_0' + i + '.png';
        }
    },


    generateBackground: function () { // создание фона в canvas
        var canvas = document.querySelector('.field'),
            ctx = canvas.getContext('2d');

        canvas.width = this.FIELD_SIZE.w * this.CELL_SIZE;
        canvas.height = this.FIELD_SIZE.h * this.CELL_SIZE;

        for (var y = 0; y < this.FIELD_SIZE.h; y++) {
            for (var x = 0; x < this.FIELD_SIZE.w; x++) {
                ctx.drawImage(
                    this._images[Math.floor(Math.random() * this._images.length)],
                    x * this.CELL_SIZE,
                    y * this.CELL_SIZE
                );
            }
        }
    },

    createField: function () {
        var fragment = document.createDocumentFragment(),
            conteiner = document.querySelector('.snake-block');


        conteiner.style.width = (this.FIELD_SIZE.w * this.CELL_SIZE) + 'px';
        conteiner.style.height = (this.FIELD_SIZE.h * this.CELL_SIZE) + 'px';

        this._field = [];

        for (var x = 0; x < this.FIELD_SIZE.w; x++) {
            this._field[x] = [];

            for (var y = 0; y < this.FIELD_SIZE.h; y++) {
                this._field[x][y] = document.createElement('div');
                this.clearCell(x, y);
                this._field[x][y].style.left = (x * this.CELL_SIZE) + 'px';
                this._field[x][y].style.top = (y * this.CELL_SIZE) + 'px';
                fragment.appendChild(this._field[x][y]);
            }
        }

        conteiner.appendChild(fragment);
    },

    clearCell: function (x, y) {
        this._field[x][y].className = 'div-block';
    },

    createSnake: function () {
        var sx = Math.floor(this.FIELD_SIZE.w * 0.5),
            sy = Math.floor(this.FIELD_SIZE.h * 0.5);

        this._snake = [sx + '.' + sy];

    },

    renderSnake: function () {
        var tmpPos,
            tmpField;

        this._snake.forEach(function (pos) {
            tmpPos = pos.split('.');

            tmpField = this._field[tmpPos[0]][tmpPos[1]];


            if (tmpField.className.indexOf('snake') === -1) {
                tmpField.className = 'div-block snake';
            }
        }, this);


    },

    moveSnake: function () {
        var nextPos = this._snake[0].split('.').map(Number), // координаты головы змейки
            clearPos;

        nextPos[0] += this.VELOCITY[0];
        nextPos[1] += this.VELOCITY[1];


        if (
            (!this._field[nextPos[0]] || !this._field[nextPos[0]][nextPos[1]]) ||
            this._field[nextPos[0]][nextPos[1]].className.indexOf('div-block snake') === 0
        ) {
            clearInterval(this._intervalLoop);
            snake.startScreen();

            return;
        }

        if (this._field[nextPos[0]][nextPos[1]].className.indexOf('food') === -1) {
            clearPos = this._snake.pop().split('.').map(Number);
            this.clearCell(clearPos[0], clearPos[1]);
        } else {
            this.randomFood();
        }

        this._snake.unshift(nextPos.join('.'));
    },

    addEvents: function () {
        document.addEventListener('keydown', this.changeMove.bind(this));

    },

    changeMove: function (e) {
        var xy = this.DIRECTIONS[e.key];

        if (this.VELOCITY[0] === -xy[0] || this.VELOCITY[1] === -xy[1]) {
            return;
        }

        this.VELOCITY = [xy[0], xy[1]];

    },

    randomFood: function () {
        var empty = [];

        this._field.forEach(function (x) {
            return x.forEach(function (cell) {
                if (cell.className === 'div-block') {
                    empty.push(cell);
                }
            });
        });

        empty[Math.floor(Math.random() * empty.length)].className = 'food';
    }
};

