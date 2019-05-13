class figure {
    constructor(x, y, tempX, tempY, angle, color, textColor) {
        this.x = x;
        this.y = y;
        this.tempX = tempX;
        this.tempY = tempY;
        this.angle = angle;
        this.radians = this.angle * Math.PI / 180;
        this.color = color;
        this.textColor = textColor;
    }  
}

class ball extends figure{
    constructor(x, y, tempX, tempY, angle, radius, color, textColor) {
        super(x, y, tempX, tempY, angle, color, textColor);
        this.radius = radius;
        this.figure = 'ball';
    }

    get square() {
        return this.calcBallSquare();
    }

    get draw() {
        return this.drawBall();
    }

    calcBallSquare() {
        return this.radius * this.radius * Math.PI;
    }

    drawBall() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.fillStyle = this.color;
        context.fill();
        context.font = '18px Arial';
        context.fillStyle = this.textColor;
        context.fillText('Squere is: ' + parseInt(this.square), this.x + this.radius, this.y);
        context.closePath();
    }
}

class foursquare extends figure{
    constructor(x, y, tempX, tempY, angle, width, color, textColor) {
        super(x, y, tempX, tempY, angle, color, textColor);
        this.width = width;
        this.figure = 'foursquare';
    }

    get square() {
        return this.calcSquare();
    }

    get draw() {
        return this.drawSquare();
    }

    calcSquare() {
        return this.width * this.width;
    }

    drawSquare() {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.width);
        context.fillStyle = this.color;
        context.fill();
        context.font = '18px Arial';
        context.fillStyle = this.textColor;
        context.fillText('Squere is: ' + parseInt(this.square), this.x + this.width, this.y + this.width / 2);
        context.closePath();
    }
}

const canvas  = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const colors  = ['#FF9CEF', '#FFD877', '#B4FF87', '#A1CDFF', '#F591FF', '#875E90', '#FF9725', '#72FFAC', '#8C8C8C'];
const speed   = 2;

let ballsAmount      = 10;
let foursquareAmount = 10;
let figureAmount     = ballsAmount + foursquareAmount;

let figureArray = fillArray();

start(figureArray);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}


function fillArray() {
    let newFigure;
    let size;
    let toggle;
    let angle;
    let spawnPoint = -size * 2;
    let arr        = [];
    let tempX      = 0;
    let tempY      = 0;
    let minSize    = 40;
    let maxSize    = 75;
    let minAngle   = 25;
    let maxAngle   = 80;

    for(let i = 0; i < figureAmount; i++) {
        toggle = getRandomInt(0, 2);
        size   = getRandomInt(minSize, maxSize);
        angle  = getRandomInt(minAngle, maxAngle);
        if(toggle === 1)
            newFigure = new ball(spawnPoint * i, spawnPoint * i, tempX, tempY, angle, size, 'transparent');
        else 
            newFigure = new foursquare(spawnPoint * i, spawnPoint * i, tempX, tempY, angle, size, 'transparent');
        arr.push(newFigure);
    }
    return arr;
}

function start(array) {
    let colorIndex;

    array.forEach((elem, i) =>
        setTimeout(function() {
            
            setInterval(() => {
                animate(array);
                // detectCollision(array);
            }, 20);

            setInterval(setDirection, 20, elem);
            
            colorIndex = getRandomInt(0, colors.length);

            if(elem.figure === 'foursquare') {
                elem.x = 0;
                elem.y = 0;
            }
            else { 
                elem.x = elem.radius;
                elem.y = elem.radius;
            }

            elem.color = colors[colorIndex];
            elem.textColor = 'black';

        }, 5000 * i)
    );
}


function animate(array) { 
    context.clearRect(0, 0 , canvas.width, canvas.height);
    
    array.forEach((elem) => {
        elem.draw;
        changeDirection(elem);
    });
}

function changeDirection(elem) {

    elem.radians = elem.angle * Math.PI / 180;
    elem.tempX   = Math.cos(elem.radians) * speed;
    elem.tempY   = Math.sin(elem.radians) * speed;

}

function setDirection(elem) {

    elem.x += elem.tempX;
    elem.y += elem.tempY;
    if(elem.figure === 'foursquare') {
        if (elem.x > canvas.width - elem.width || elem.x < 0) {

            elem.angle = 180 - elem.angle;
            changeDirection(elem);

        } else if (elem.y > canvas.height - elem.width || elem.y < 0) {

            elem.angle = 360 - elem.angle;
            changeDirection(elem);

        }
    } else {
        if (elem.x > canvas.width - elem.radius || elem.x < 0 + elem.radius) {

            elem.angle = 180 - elem.angle;
            changeDirection(elem);

        } else if (elem.y > canvas.height - elem.radius || elem.y < 0 + elem.radius) {

            elem.angle = 360 - elem.angle;
            changeDirection(elem);

        }
    }
}

function distanceBetween(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}