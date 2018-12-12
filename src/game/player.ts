/**
 * Player object
 * 
 * (c) 2018 Jani Nykänen
 */

// Player class
class Player extends GameObject {

    // Sprite
    private spr : Sprite;
    // Sword sprite
    private sprSword : Sprite;
    // Flip
    private flip : Flip;

    // Direction
    private dir : number;
    // Is attacking
    private attacking : boolean;

    // Constructor
    public constructor(x : number, y: number) {

        super(x, y);

        // Create components 
        this.spr = new Sprite(16, 16);
        this.sprSword = new Sprite(24, 24);

        // Set defaults
        this.dir = 0;
        this.acceleration = 0.2;
        this.attacking = false;
    }


    // Control
    private control(vpad : Vpad, tm : number) {

        const DELTA = 0.01;
        const SPEED = 1.0;
        const PI = Math.PI;

        // Movement
        let s = vpad.getStick();
        if(!this.attacking) {

            this.target.x = SPEED * s.x;
            this.target.y = SPEED * s.y;
        }

        // Get direction
        if(!this.attacking &&  vpad.getStickDistance() > DELTA)  {

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

        // Attack
        if(!this.attacking && vpad.getButton("fire1") == State.Pressed) {

            this.attacking = true;
            // TODO: "setFrame" to sprite?
            this.spr.animate(3 + this.dir, 0, 0, 0, 0);
            this.sprSword.animate(this.dir,0,0,0,0);

            this.target.x = 0,
            this.target.y = 0;
        }
    }


    // Animate
    private animate(tm : number) {

        const DELTA = 0.01;
        const ATTACK_SPEED = 5;
        
        // Attacking
        if(this.attacking) {

            // Animate attacking
            this.spr.animate(3+ this.dir, 0, 4, ATTACK_SPEED, tm);
            // Animate sword
            this.sprSword.animate(this.dir, 0, 4, ATTACK_SPEED, tm);

            if(this.spr.getFrame() == 4) {

                this.spr.animate(this.dir, 0, 0, 0,tm);
                this.attacking = false;
            }

        }
        else {

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


    // Draw sword
    private drawSword(g: Graphics, ass: Assets) {

        let bx = 0;
        let by = 0;

        if(this.dir == 0) {

            bx = -12 -4;
            by -= 8;
        }
        else if(this.dir == 1) {

            bx = -7;
            by -= 32;
        }
        else if(this.dir == 2) {
            
            if(this.flip == Flip.Horizontal) {
                bx -= 24;
            }
            by = -20+1;
        }

        this.sprSword.draw(g, ass.getBitmap("sword"), 
                this.pos.x + bx, this.pos.y+by, this.flip);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("player"), 
            this.pos.x-8, this.pos.y-16, this.flip);

        // Draw sword
        if(this.attacking) {

            this.drawSword(g, ass);
        }
    }

}
