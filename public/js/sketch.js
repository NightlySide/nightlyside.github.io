function setup() {
    createCanvas(windowWidth, windowHeight);
    dots = []

    for (i = 0; i < 100; i++) {
        x = random(-50, windowWidth + 50);
        y = random(-50, windowHeight + 50);
        dots.push(new Dot(x, y));
    }
}

function draw() {
    background(51, 51, 51);

    for (i = 0; i < dots.length; i++) {
        dots[i].update();
    }
}

function mousePressed() {
    for (i = 0; i < dots.length; i++) {
        distance = sqrt(pow((mouseX - dots[i].position.x), 2) + pow((mouseY - dots[i].position.y), 2));
        force = 40000 / pow(distance, 1.7);
        direction = new Vector(mouseX, mouseY);
        direction.sub(dots[i].position);
        direction.inverse();
        direction.normalize();
        direction.mult(force);
        dots[i].applyForce(direction);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Dot {
    constructor(x, y) {
        this.position = new Vector(x, y);
        var r = random(10, 15);
        this.velocity = new Vector(r / 100, r / 100);
        this.acceleration = new Vector(0, 0);

        this.diameter = r;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    constrainToScreen(eps = 50) {
        if (this.position.x > windowWidth + 50) {
            this.position.x -= windowWidth + 100;
        } else if (this.position.x < -50) {
            this.position.x += windowWidth + 100;
        }

        if (this.position.y > windowHeight + 50) {
            this.position.y -= windowHeight + 100;
        } else if (this.position.y < -50) {
            this.position.y += windowHeight + 100;
        }
    }

    display() {
        ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }

    update() {
        this.constrainToScreen();
        this.display();

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration = new Vector(0, 0);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    abs() {
        return sqrt(x * x + y * y);
    }

    normalize() {
        this.x /= this.abs();
        this.y /= this.abs();
        print(this);
    }

    mult(lambda) {
        this.x *= lambda;
        this.y *= lambda;
    }

    inverse() {
        this.x *= -1;
        this.y *= -1;
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}