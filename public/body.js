class Body {
    constructor(data) {
        this.body = world.add(
            data
        );

    }

    update() {
        this.bodyPosition = this.body.getPosition();

        this.bodyQuaternionRaw = this.body.getQuaternion();
        // console.log(this.bodyQuaternionRaw);

        // this.bodyQuaternion = new toxi.geom.Quaternion(this.bodyQuaternionRaw.x, this.bodyQuaternionRaw.y, this.bodyQuaternionRaw.z, this.bodyQuaternionRaw.w);
        // console.log(this.bodyQuaternionRaw);
        // this.axisAngle = this.bodyQuaternion.toAxisAngle();

        this.axisAngle = getAxisAndAngelFromQuaternion(this.bodyQuaternionRaw)
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
        if (this.body.isStatic != true) {
            rotate(this.r, this.v)
        }

        // shape specific
        if (this.body.shapes.type == 2) {
            box(this.body.shapes.width * conv, this.body.shapes.height * conv, this.body.shapes.depth * conv)
        } else if (this.body.shapes.type == 3) {
            console.log(this.body.shapes);
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
