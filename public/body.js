class Body {
    constructor(data, fillColor, strokeColor) {

        if (typeof fillColor != "undefined") {
            this.fillColor = fillColor;
        } else {
            this.fillColor = color("white");
        }
        if (typeof strokeColor != "undefined") {
            this.strokeColor = strokeColor;
        } else {
            this.strokeColor = color("black");
        }

        this.body = world.add(
            data
        );

    }

    // from here: https://stackoverflow.com/questions/62457529/how-do-you-get-the-axis-and-angle-representation-of-a-quaternion-in-three-js 
    getAxisAndAngelFromQuaternion(q) {
        const angle = 2 * Math.acos(q.w);
        var s;
        if (1 - q.w * q.w < 0.000001) {
            // test to avoid divide by zero, s is always positive due to sqrt
            // if s close to zero then direction of axis not important
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
            s = 1;
        } else {
            s = Math.sqrt(1 - q.w * q.w);
        }
        return [q.x / s, q.y / s, q.z / s, angle];
    }

    update() {
        this.bodyPosition = this.body.getPosition();

        this.bodyQuaternionRaw = this.body.getQuaternion();
        this.axisAngle = this.getAxisAndAngelFromQuaternion(this.bodyQuaternionRaw)
        // console.log(this.axisAngle);

        this.r = this.axisAngle[3]
        this.v = createVector(this.axisAngle[0], this.axisAngle[1], this.axisAngle[2]);

        // console.log(this.r);
        // console.log(this.v);
    }

    display() {

        // console.log(this.body);
        // console.log(this.body.name);
        // console.log(this.body.quaternion);
        // console.log(this.body.shapes.type);

        push();
        fill(color(this.fillColor))
        stroke(color(this.strokeColor));
        strokeWeight(1);
        translate(this.bodyPosition.x * conv, this.bodyPosition.y * conv, this.bodyPosition.z * conv);


        if (this.body.quaternion.w == 1 && this.body.quaternion.x == 0) {
        } else {
            // if (this.body.isStatic != true && this.body.isKinematic != true) {  // otherwise no data
            rotate(this.r, this.v)
        }

        // shape specific
        if (this.body.shapes.type == 2) {
            box(this.body.shapes.width * conv, this.body.shapes.height * conv, this.body.shapes.depth * conv)
        } else if (this.body.shapes.type == 3) {
            cylinder(this.body.shapes.radius * conv, this.body.shapes.height * conv);
        }
        pop();
    }
}


class AppleSystem {

    constructor(amount) {
        this.bodies = []


        for (let i = 0; i < amount; i++) {

            var bodySize = getRandomFromList([2, 1, 0.5]);
            var fillColor = getRandomFromList([
                color(255, 0, 0, 255),
                color(0, 255, 0, 255)
            ]);
            var strokeColor = getRandomFromList([
                color(0, 0, 0, 255),
            ]);

            var data = {
                type: 'box', // type of shape : sphere, box, cylinder 
                size: [bodySize, bodySize, bodySize], // size of shape
                pos: [getRandomFromInterval(-40, 40), 3, getRandomFromInterval(-40, 40)], // start position in degree
                rot: [0, 0, 0], // start rotation in degree
                move: true, // dynamic or statique
                density: 100,  // 1
                friction: 0.5,
                restitution: 0.9,
                noSleep: true,
                // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
            };
            this.bodies.push(new Body(data, fillColor, strokeColor));
        }
    }

    updateDisplay() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
            this.bodies[i].display();
        }
    }
}


class Pusher extends Body {
    constructor(data, fillColor, strokeColor) {
        super(data, fillColor, strokeColor);

        this.waveAcc = 0;
        this.waveVel = 0;

        this.angle = 0;
        this.waveZOffset = + getRandomFromInterval(-10, 10);
    }

    move() {
        // this.waveVel += this.waveAcc;
        // this.waveZ = this.body.getPosition().z - this.waveVel;

        this.sineValue = sin(this.angle);
        this.waveZ = map(this.sineValue, -1, 1, -50, 50);
        this.waveZ += this.waveZOffset;

        // faster rising than shrinking
        if (this.sineValue > sin(this.angle + 0.01)) {
            // console.log("rising");
            this.angle += 0.03
        }
        else {
            // console.log("shrinking");
            this.angle += 0.015
        }
        this.body.setPosition({ x: this.body.getPosition().x, y: this.body.getPosition().y, z: this.waveZ });
    }
}

class PusherSystem {

    constructor(ground_width) {

        this.widthPusher = 5;
        this.amount = ground_width / this.widthPusher;

        this.bodies = []

        var fillColor = color(0, 0, 255, 100);
        var strokeColor = color("black");

        for (let i = 0; i < this.amount; i++) {
            var data = {
                type: 'box',
                size: [this.widthPusher, 10, this.widthPusher],
                pos: [i * this.widthPusher - ground_width / 2, 0, 50], // start position in degree
                // rot: [0, 0, 0],
                rot: [0, getRandomFromInterval(-60, 60), 0],
                move: true,
                density: 1,
                kinematic: true,
                noSleep: true,
                material: 'kinematic',
            };

            this.bodies.push(new Pusher(data, fillColor, strokeColor));
        }
    }

    updateDisplay() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].move();
            this.bodies[i].update();

            if (MODE == 5) {
                this.bodies[i].display();
            }
        }
    }
}