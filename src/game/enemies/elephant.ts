/**
 * An elephant
 * 
 * (c) 2018 Jani Nykänen
 */

// Elephant class
class Elephant extends Enemy {

    // Constants
    private readonly MOVE_TIME = 60;
    private readonly WAIT_TIME = 30;

    // Move timer
    private moveTimer : number;
    // Is waiting
    private waiting : boolean;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 0;
        this.waiting = true;
        this.moveTimer = this.WAIT_TIME;

        this.acceleration = 0.1;
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 0.5;
        const ANIM_SPEED = 6;

        // Update move timer
        if((this.moveTimer -= 1.0 * tm) <= 0.0) {

            this.waiting = !this.waiting;
            this.moveTimer += this.waiting ? this.WAIT_TIME : this.MOVE_TIME;

            // Set speed target
            let angle = Math.random() * Math.PI*2;

            this.target.x = Math.cos(angle) * SPEED;
            this.target.y = Math.sin(angle) * SPEED;
        }

        // Set speeds
        if(this.waiting) {

            this.target.x = 0;
            this.target.y = 0;

            // Stand
            this.spr.setFrame(0, 0);
        }
        else {

            // Animate
            this.spr.animate(0, 0, 3, ANIM_SPEED, tm);

            this.flip = this.speed.x >= 0 ? Flip.None : Flip.Horizontal;
        }


    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // ...
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        if(dir == 0 || dir == 1) {

            this.speed.y *= -1;
            this.target.y *= -1;
        }
        else {

            this.speed.x *= -1;
            this.target.x *= -1;
        }
    }
}
