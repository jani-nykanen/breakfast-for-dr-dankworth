/**
 * An elephant
 * 
 * (c) 2018 Jani Nykänen
 */

// Elephant class
class Snake extends Enemy {

    // Constants
    private readonly MOVE_TIME = 60;
    private readonly WAIT_TIME = 30;

    // Target
    private ptarget : Vec2;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 1;

        this.acceleration = 0.1;
        
        this.maxHealth = 2;
        this.health = this.maxHealth;

        this.spr.setFrame(this.id+1, 0);
    
        this.ptarget = new Vec2();
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 0.5;
        const ANIM_SPEED = 6;

        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;

        let angle = Math.atan2(py, px);

        this.target.x = -Math.cos(angle) * SPEED;
        this.target.y = -Math.sin(angle) * SPEED;

        // Animate
        this.spr.animate(2, 0, 3, ANIM_SPEED, tm);
        this.flip = this.speed.x < 0 ? Flip.None : Flip.Horizontal;
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // Store target
        this.ptarget = pl.getPos();
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
