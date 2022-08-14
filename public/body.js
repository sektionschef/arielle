class Body {
    constructor(data) {
        this.body = world.add(
            data
        );

    }

    update() {
        this.bodyPosition = this.body.getPosition();

        this.bodyQuaternionRaw = this.body.getQuaternion();
        this.bodyQuaternion = new toxi.geom.Quaternion(this.bodyQuaternionRaw.x, this.bodyQuaternionRaw.y, this.bodyQuaternionRaw.z, this.bodyQuaternionRaw.w);
        // console.log(this.bodyQuaternionRaw);
        this.axisAngle = this.bodyQuaternion.toAxisAngle();
        // console.log(this.axisAngle);

        this.r = this.axisAngle[0]
        this.v = createVector(this.axisAngle[1], this.axisAngle[2], this.axisAngle[3]);

        // console.log(this.r);
        // console.log(this.v);
    }

    display(colorCode) {

        push();
        fill(color(colorCode))
        rotate(this.r, this.v)
        translate(this.bodyPosition.x * conv, this.bodyPosition.y * conv, this.bodyPosition.z * conv);
        box(this.body.shapes.width * conv, this.body.shapes.height * conv, this.body.shapes.depth * conv)
        pop();
    }
}

