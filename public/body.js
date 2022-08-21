class Body {
    constructor(data, appleColor) {

        this.killMe = false;

        if (typeof appleColor != "undefined") {
            this.fillColor = appleColor;
            // this.strokeColor = appleColor.stroke;
            this.img = appleColor.img;
        } else {
            this.fillColor = color("white");
            // this.strokeColor = color("black");
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
        if (
            this.bodyPosition.x < -50 || this.bodyPosition.x > 50 ||
            this.bodyPosition.y < -50 || this.bodyPosition.y > 50 ||
            this.bodyPosition.z < -50 || this.bodyPosition.z > 50
        ) {
            this.killMe = true;
        }

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
        // stroke(color(this.strokeColor));
        // strokeWeight(1);
        noStroke();
        translate(this.bodyPosition.x * conv, this.bodyPosition.y * conv, this.bodyPosition.z * conv);


        if (this.body.quaternion.w == 1 && this.body.quaternion.x == 0) {
        } else {
            // if (this.body.isStatic != true && this.body.isKinematic != true) {  // otherwise no data
            rotate(this.r, this.v)
        }

        if (typeof this.img != "undefined") {
            texture(this.img);
        }
        // shape specific
        if (this.body.shapes.type == 2) {
            box(this.body.shapes.width * conv, this.body.shapes.height * conv, this.body.shapes.depth * conv)
        } else if (this.body.shapes.type == 3) {
            cylinder(this.body.shapes.radius * conv, this.body.shapes.height * conv);
        } else if (this.body.shapes.type == 1) {
            sphere(this.body.shapes.radius * conv);
        }
        pop();
    }
}


class AppleSystem {

    constructor(amount, initFall) {
        this.bodies = [];
        this.initFall = initFall;

        this.appleSize = 1;

        for (let i = 0; i < amount; i++) {

            var form = getRandomFromList([
                // { type: "sphere", size: [0.5] },
                // { type: 'cylinder', size: [0.5, 1] },
                { type: 'box', size: [this.appleSize, this.appleSize, this.appleSize] },
            ]);

            var appleColor = getRandomFromList(PALETTE.apples);

            var applePerRow = 100;
            var appleRowCount = amount / applePerRow;

            var startX = applePerRow / 2 - (i * this.appleSize) % applePerRow;  // from -45 to 45
            // console.log(startX);
            var startY = (-15 + this.appleSize / 2); // floor level - dependent on height of ground and its position.
            if (this.initFall) {
                // from above
                var startZ = -50 + Math.floor(i * this.appleSize / applePerRow);
            } else {
                var startZ = 50 + Math.floor(i * this.appleSize / applePerRow) * -1;
            }
            // console.log(startZ);

            var data = {
                type: form.type,
                size: form.size,
                // pos: [getRandomFromInterval(-50, 50), -15, getRandomFromInterval(45, 50)], // start position in degree
                pos: [startX, startY, startZ], // start position in degree
                rot: [0, 0, 0], // start rotation in degree
                move: true, // dynamic or statique
                density: 1,
                friction: 0,
                restitution: 0,
                noSleep: true,
                name: "apple_" + i,
                // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
            };
            this.bodies.push(new Body(data, appleColor));
        }
    }

    updateDisplay() {
        for (var i = this.bodies.length - 1; i >= 0; i--) {
            // for (let i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i].killMe == true) {
                this.bodies[i].body.remove();
                this.bodies.splice(i, 1);
            } else {
                this.bodies[i].update();
                this.bodies[i].display();
            }


        }
    }

    killAllCall() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].killMe = true;
        }
    }
}


class Pusher extends Body {
    constructor(data, colorCodes) {
        super(data, colorCodes);

        this.startPosition = structuredClone(this.body.getPosition());
        this.noiseOffset = this.startPosition.z;
        // console.log(this.noiseOffset);

        this.angle = 300;  // start level well out of range 90-270;
    }

    fire() {
        this.angle = 90;
    }

    move() {

        this.waveLocation = this.noiseOffset;  // offset of the middle - 0 value
        this.waveVel = 0;
        this.waveAcc = 0;

        this.sineValue = sin(this.angle);

        // rising, sin value is getting larger not smaller
        if (this.sineValue > sin(this.angle + 0.01)) {
            // console.log("rising");

            this.waveAcc = map(this.sineValue, -1, 1, 30, 60);  // starts from 100 and ends at 0
            this.waveVel += this.waveAcc;
            this.waveLocation += this.waveVel;

            if (waveIndex == 0) {
                this.angle += 0.025;
            } else if ((waveIndex == 1)) {
                this.angle += 0.020;
            } else {
                this.angle += 0.010;
            }

            this.body.setPosition({ x: this.startPosition.x, y: 0, z: this.waveLocation });
        }
        else {
            // console.log("shrinking");

            this.body.setPosition({ x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z });
        }
    }
}

class PusherSystem {

    constructor(ground_width) {
        this.ground_width = ground_width;

        this.createNoiseLine();

        this.bodies = []

        var fillColor = color(0, 0, 255, 100);
        // var strokeColor = color("black");

        for (let i = 0; i < this.amount; i++) {
            var data = {
                type: 'box',
                size: [this.widthPusher, 30, this.widthPusher],
                pos: [i * this.widthPusher - ground_width / 2, 100, this.noiseLine[i]],
                rot: [0, 60, 0],
                // rot: [0, getRandomFromInterval(-5, 5), 0],
                move: true,
                density: 1000,
                kinematic: true,
                noSleep: true,
                material: 'kinematic',
                name: "Pusher_" + i,
            };

            this.bodies.push(new Pusher(data, fillColor));
        }
    }

    createNoiseLine() {
        this.widthPusher = 1;
        this.noiseStep = 0.3;
        this.noiseRange = 10;

        this.amount = 100;  // number of particles
        this.widthPusher = this.ground_width / this.amount;

        this.noiseLine = [];
        let xoff = 0;
        for (let i = 0; i < this.amount; i++) {
            this.noiseLine.push(map(noise(xoff), 0, 1, -this.noiseRange, this.noiseRange));
            xoff += this.noiseStep
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

    fire() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].fire();
        }
    }
}


class ObstacleSystem {
    constructor(amount) {

        this.amount = amount;

        this.bodies = [];

        for (let i = 0; i < this.amount; i++) {
            var data = {
                type: 'cylinder', // type of shape : sphere, box, cylinder 
                size: [1, 30], // size of shape
                pos: [getRandomFromInterval(-50, 50), 0, getRandomFromInterval(-30, 30)], // start position in degree
                rot: [0, 0, 0], // start rotation in degree
                move: false, // dynamic or statique
                density: 1000,
                friction: 0.2,
                restitution: 0.2,
                name: "obstacle",
            }

            this.bodies.push(new Body(data, color(0, 155, 0, 100)));
        }

    }

    updateDisplay() {
        // for (var i = this.bodies.length - 1; i >= 0; i--) {
        //     // for (let i = 0; i < this.bodies.length; i++) {
        //     if (this.bodies[i].killMe == true) {
        //         this.bodies[i].body.remove();
        //         this.bodies.splice(i, 1);
        //     } else {
        //         this.bodies[i].update();
        //         this.bodies[i].display();
        //     }
        // }
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
            if (MODE == 5) {
                this.bodies[i].display();
            }
        }
    }
}