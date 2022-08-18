class Body {
    constructor(data, appleColor) {

        this.killMe = false;

        if (typeof appleColor != "undefined") {
            this.fillColor = appleColor.fill;
            this.strokeColor = appleColor.stroke;
            this.img = appleColor.img;
        } else {
            this.fillColor = color("white");
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
        stroke(color(this.strokeColor));
        strokeWeight(1);
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
        if (this.body.type == 2) {
            box(this.body.shapes.width * conv, this.body.shapes.height * conv, this.body.shapes.depth * conv)
        } else if (this.body.type == 3) {
            cylinder(this.body.shapes.radius * conv, this.body.shapes.height * conv);
        } else if (this.body.type == 1) {
            sphere(this.body.shapes.radius * conv);
        }
        pop();
    }
}


class AppleSystem {

    constructor(amount) {
        this.bodies = []


        for (let i = 0; i < amount; i++) {

            // if (waveIndex == 0) {
            //     var bodySize = 1;
            // } else if ((waveIndex == 1)) {
            //     var bodySize = 1;
            // } else {
            //     var bodySize = 1;
            // }

            var appleColor = getRandomFromList(PALETTE.apples);
            // var bodySize = getRandomFromInterval(1, 2);
            var bodySize = 1;


            var data = {
                // type: 'box', // type of shape : sphere, box, cylinder 
                // size: [bodySize, bodySize, bodySize], // size of shape
                // type: 'cylinder', // type of shape : sphere, box, cylinder 
                // size: [bodySize, bodySize], // size of shape
                type: 'sphere', // type of shape : sphere, box, cylinder 
                // size: [bodySize], // size of shape
                pos: [getRandomFromInterval(-50, 50), 0, getRandomFromInterval(40, 50)], // start position in degree
                rot: [0, 0, 0], // start rotation in degree
                move: true, // dynamic or statique
                density: 1000,  // 1
                friction: 0.5,
                restitution: 0.1,
                noSleep: true,
                name: "apple_" + i,
                // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
            };
            this.bodies.push(new Body(data, appleColor));
            console.log(this.bodies);
        }
    }

    updateDisplay() {
        for (var i = this.bodies.length - 1; i >= 0; i--) {
            // for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
            this.bodies[i].display();
            if (this.bodies[i].killMe) {
                this.bodies[i].body.remove();
                this.bodies.splice(i, 1);
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

        // this.waveAcc = 0;
        // this.waveVel = 0;

        // this.angle = 90;  // start at bottom
        this.angle = 300;
        this.waveZOffset = + getRandomFromInterval(-2, 2);  // not fully in line
    }

    fire() {
        this.angle = 90;
    }

    move() {
        // this.waveVel += this.waveAcc;
        // this.waveZ = this.body.getPosition().z - this.waveVel;

        this.sineValue = sin(this.angle);
        // this.waveZ = map(this.sineValue, -1, 1, -50, 50);
        this.waveZ = map(this.sineValue, -1, 1, -20, 150);  // FEATURE - wie weit
        this.waveZ += this.waveZOffset;

        // rising, sin value is getting larger not smaller
        if (this.sineValue > sin(this.angle + 0.01)) {
            // console.log("rising");
            // console.log(this.sineValue);

            // this.angle += 0.03
            this.angle += 0.007;
            this.body.setPosition({ x: this.body.getPosition().x, y: 0, z: this.waveZ });
        }
        else {
            // console.log("shrinking");
            // this.angle += 0.008

            this.body.setPosition({ x: this.body.getPosition().x, y: 50, z: -50 });
        }
        // overall
        // this.body.setPosition({ x: this.body.getPosition().x, y: this.body.getPosition().y, z: this.waveZ });
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
                size: [this.widthPusher, 20, this.widthPusher],
                pos: [i * this.widthPusher - ground_width / 2, 0, 50], // start position in degree
                rot: [0, 0, 0],
                // rot: [0, getRandomFromInterval(-5, 5), 0],
                move: true,
                density: 1,
                kinematic: true,
                noSleep: true,
                material: 'kinematic',
            };

            this.bodies.push(new Pusher(data, { "fill": fillColor, "stroke": strokeColor }));
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