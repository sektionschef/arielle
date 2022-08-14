class Body {
    constructor() {
        this.body = world.add({
            type: 'box', // type of shape : sphere, box, cylinder 
            size: [3, 2, 3], // size of shape
            pos: [0, 5, 0], // start position in degree
            rot: [0, 0, 0], // start rotation in degree
            move: true, // dynamic or statique
            density: 1,
            friction: 0.2,
            restitution: 0.2,
            // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        });

    }
}

