class Body {
    constructor(data) {
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

    display(colorCode) {

        // console.log(this.body);
        // console.log(this.body.shapes.type);

        push();
        fill(color(colorCode))
        translate(this.bodyPosition.x * conv, this.bodyPosition.y * conv, this.bodyPosition.z * conv);


        if (this.body.isStatic != true && this.body.isKinematic != true) {  // otherwise no data
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


class BodySystem {

    constructor(amount) {
        this.bodies = []

        var data = {
            type: 'box', // type of shape : sphere, box, cylinder 
            size: [3, 2, 3], // size of shape
            pos: [0, 15, 0], // start position in degree
            rot: [0, 0, 0], // start rotation in degree
            move: true, // dynamic or statique
            density: 1,
            friction: 0.2,
            restitution: 0.9,
            noSleep: true,
            // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        };

        for (let i = 0; i < amount; i++) {
            this.bodies.push(new Body(data));
        }
    }

    updateDisplay() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
            this.bodies[i].display("red");
        }
    }
}


class Pusher extends Body {
    constructor(data) {
        super(data);

        this.waveAcc = 0;
        this.waveVel = 0;

        this.angle = 0;
    }

    move() {
        // this.waveVel += this.waveAcc;
        // this.waveZ = this.body.getPosition().z - this.waveVel;

        this.sineValue = sin(this.angle);
        this.waveZ = map(this.sineValue, -1, 1, -50, 50);

        this.body.setPosition({ x: 0, y: 0, z: this.waveZ });
        if (this.sineValue > sin(this.angle + 0.02)) {
            console.log("rising");
            this.angle += 0.04
        }
        else {
            console.log("shrinking");
            this.angle += 0.02
        }
        // console.log(this.sineValue);
    }
}