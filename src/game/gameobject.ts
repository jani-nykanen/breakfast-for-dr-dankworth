/**
 * A base game object class
 * 
 * (c) 2018 Jani Nykänen
 */

// Game object class
class GameObject {

    // Position
    protected pos : Vec2;
    // Speed
    protected speed : Vec2;
    // Target speed
    protected target : Vec2;
    // protected length, "total speed"
    protected totalSpeed : number;

    // Acceleration
    protected acceleration =0.2;

    // Does exist
    protected exist : boolean;


    // Constructor
    public constructor(x: number, y: number) {

        this.pos = new Vec2(x, y);
        this.speed = new Vec2();
        this.target = new Vec2();

        this.exist = true;
    }


    // Update speed
    private updateSpeed(speed : number, target : number, 
        acc : number, tm : number) : number {
        
        if (speed < target) {
    
            speed += acc * tm;
            if (speed > target) {
    
                speed = target;
            }
        }
        else if (speed > target) {
    
            speed -= acc * tm;
            if (speed < target) {
    
                speed = target;
            }
        }
    
        return speed;
    }


    // Move
    protected move(tm : number) {

        // Update speed
        this.speed.x = this.updateSpeed(this.speed.x, this.target.x, this.acceleration, tm);
        this.speed.y = this.updateSpeed(this.speed.y, this.target.y, this.acceleration, tm);

        // Compute total speed
        this.totalSpeed = Math.sqrt(this.speed.x*this.speed.x 
            + this.speed.y*this.speed.y);

        // Move
        this.pos.x += this.speed.x * tm;
        this.pos.y += this.speed.y * tm;
    }


    // Does exist
    public DoesExist() : boolean {

        return this.exist;
    }
}
