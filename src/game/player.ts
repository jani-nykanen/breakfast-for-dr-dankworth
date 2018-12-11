/**
 * Player object
 * 
 * (c) 2018 Jani Nykänen
 */

// Player class
class Player extends GameObject {

    // Sprite
    private spr : Sprite;
    // Flip
    private flip : Flip;

    // Direction
    private dir : number;


    // Constructor
    public constructor(x : number, y: number) {

        super(x, y);

        // Create components 
        this.spr = new Sprite(16, 16);

        // Set defaults
        this.dir = 0;
        this.acceleration = 0.2;
    }


    // Control
    private control(vpad : Vpad, tm : number) {

        const DELTA = 0.01;
        const SPEED = 1.0;
        const PI = Math.PI;

        // Movement
        let s = vpad.getStick();
        this.target.x = SPEED * s.x;
        this.target.y = SPEED * s.y;

        // Get direction
        if(vpad.getStickDistance() > DELTA)  {

            let angle = Math.atan2(s.y, s.x) + PI;
            this.flip = Flip.None;

            // Down
            if(angle >= PI + PI/4 && angle < PI*2-PI/4)
                this.dir = 0;

            // Left
            else if(angle >= PI - PI/4 && angle < PI+PI/4)
                this.dir = 2;

            // Top
            else if(angle >= PI/4 && angle < PI-PI/4)
                this.dir = 1;

            // Right
            else {

                this.flip = Flip.Horizontal;
                this.dir = 2;
            }
        }
    }


    // Animate
    private animate(tm : number) {

        const DELTA = 0.01;
        
        // Not moving
        if(this.totalSpeed < DELTA) {

            this.spr.animate(this.dir,0,0,0,tm);
        }
        // Moving
        else {

            let s = 10.0 - this.totalSpeed*3;
            this.spr.animate(this.dir, 0, 3, s, tm);
        }
    }


    // Update
    public update(vpad : Vpad, tm : number) {

        // Control
        this.control(vpad, tm);
        // Move
        this.move(tm);
        // Animate
        this.animate(tm);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("player"), 
            this.pos.x-8, this.pos.y-16, this.flip)
    }

}
