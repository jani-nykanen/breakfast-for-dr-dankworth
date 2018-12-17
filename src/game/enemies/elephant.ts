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


    // Respawn
    protected respawn() {

        this.waiting = true;
        this.moveTimer = this.WAIT_TIME;
    }


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 0;
        this.waiting = true;
        this.moveTimer = this.WAIT_TIME;

        this.acceleration = 0.1;

        this.maxHealth = 2;
        this.health = this.maxHealth;

        this.spr.setFrame(this.id+1, 0);
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 0.5;
        const ANIM_SPEED = 6;
        const DELTA = 0.01;

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
            this.spr.setFrame(1, 0);
        }
        else if(this.totalSpeed >= DELTA) {

            // Animate
            this.spr.animate(1, 0, 3, ANIM_SPEED, tm);

            this.flip = this.speed.x >= 0 ? Flip.None : Flip.Horizontal;
        }


    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // ...
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        let mul = -1;
        if(this.hurtTimer > 0.0) {

            mul = 0;
        }

        if(dir == 0 || dir == 1) {

            this.speed.y *= mul;
            this.target.y *= mul;
        }
        else {

            this.speed.x *= mul;
            this.target.x *= mul;
        }
    }
}
