/**
 * 2D vector
 * 
 * (c) 2018 Jani Nykänen
 */

// Vector class
class Vec2 {

    public x : number;
    public y : number;

    // Constructor
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    
    // Copy
    public copy() : Vec2 {

        return new Vec2(this.x, this.y);
    }
}
