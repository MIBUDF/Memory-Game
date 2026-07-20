const ns = "http://www.w3.org/2000/svg";
const gameArea = document.getElementById("gameArea");
let mouseClickCallback = null;
let timerId = null;

function getWidth() {
    return gameArea.viewBox.baseVal.width;
}

function getHeight() {
    return gameArea.viewBox.baseVal.height;
}

function add(shape) {
    if (shape && shape.element) {
        gameArea.appendChild(shape.element);
    }
}

function remove(shape) {
    if (!shape || !shape.element) {
        return;
    }
    if (shape.element.parentNode) {
        shape.element.parentNode.removeChild(shape.element);
    }
}

function mouseClickMethod(fn) {
    mouseClickCallback = fn;
}

gameArea.addEventListener("click", (event) => {
    if (!mouseClickCallback) {
        return;
    }

    const rect = gameArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseClickCallback({
        getX: () => x,
        getY: () => y,
    });
});

function setTimer(callback, delay) {
    stopTimer();
    timerId = setInterval(callback, delay);
    return timerId;
}

function stopTimer(id) {
    const clearId = id || timerId;
    if (clearId != null) {
        clearInterval(clearId);
    }
    if (clearId === timerId) {
        timerId = null;
    }
}

const Randomizer = {
    nextInt(min, max) {
        const low = Math.ceil(min);
        const high = Math.floor(max);
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }
};

class Rectangle {
    constructor(width, height) {
        this.element = document.createElementNS(ns, "rect");
        this.element.setAttribute("width", width);
        this.element.setAttribute("height", height);
        this.element.setAttribute("stroke", "#000");
        this.setPosition(0, 0);
        this.setColor("black");
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.setAttribute("x", x);
        this.element.setAttribute("y", y);
    }

    setColor(color) {
        this.element.setAttribute("fill", color);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Text {
    constructor(text, font) {
        this.element = document.createElementNS(ns, "text");
        this.element.textContent = text;
        this.setPosition(0, 0);
        this.setColor("black");
        this.setFont(font);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.setAttribute("x", x);
        this.element.setAttribute("y", y);
    }

    setColor(color) {
        this.element.setAttribute("fill", color);
    }

    setText(text) {
        this.element.textContent = text;
    }

    setFont(font) {
        if (font) {
            const fontParts = font.split(" ");
            this.element.setAttribute("font-size", fontParts[0]);
            this.element.setAttribute("font-family", fontParts.slice(1).join(" "));
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Circle {
    constructor(radius) {
        this.element = document.createElementNS(ns, "circle");
        this.element.setAttribute("r", radius);
        this.setPosition(0, 0);
        this.setColor("black");
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.setAttribute("cx", x);
        this.element.setAttribute("cy", y);
    }

    setColor(color) {
        this.element.setAttribute("fill", color);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Polygon {
    constructor() {
        this.element = document.createElementNS(ns, "polygon");
        this.points = [];
        this.setColor("black");
    }

    addPoint(x, y) {
        this.points.push(`${x},${y}`);
        this.element.setAttribute("points", this.points.join(" "));
    }

    setColor(color) {
        this.element.setAttribute("fill", color);
    }
}

function drawRect(x, y, width, height, color) {
    const rectangle = new Rectangle(width, height);
    rectangle.setPosition(x, y);
    rectangle.setColor(color);
    add(rectangle);
    return rectangle;
}

function drawText(x, y, text, font, color) {
    const txt = new Text(text, font);
    txt.setPosition(x, y);
    txt.setColor(color);
    add(txt);
    return txt;
}

function drawCircle(x, y, radius, color) {
    const circle = new Circle(radius);
    circle.setPosition(x, y);
    circle.setColor(color);
    add(circle);
    return circle;
}

function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    const triangle = new Polygon();
    triangle.addPoint(x1, y1);
    triangle.addPoint(x2, y2);
    triangle.addPoint(x3, y3);
    triangle.setColor(color);
    add(triangle);
    return triangle;
}

function drawDiamond(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    const diamond = new Polygon();
    diamond.addPoint(x1, y1);
    diamond.addPoint(x2, y2);
    diamond.addPoint(x3, y3);
    diamond.addPoint(x4, y4);
    diamond.setColor(color);
    add(diamond);
    return diamond;
}
