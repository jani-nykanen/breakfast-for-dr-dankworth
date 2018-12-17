/**
 * A chicken
 * 
 * (c) 2018 Jani Nykänen
 */

// Chicken class
class Chicken extends Enemy {

    // Target
    private ptarget : Vec2;
    // Move mode
    private moveMode : boolean;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 2;

        this.acceleration = 0.05;
        
        this.maxHealth = 1;
        this.health = this.maxHealth;

        this.spr.setFrame(this.id+1, 0);
    
        this.ptarget = new Vec2();
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED1 = 1.0;
        const SPEED2 = -0.35;
        const ANIM_SPEED1 = 5;
        const ANIM_SPEED2 = 7;

        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;

        let angle = Math.atan2(py, px);

        let speed = this.moveMode  ? SPEED1 : SPEED2;
        let animSpeed = this.moveMode  ? ANIM_SPEED1 : ANIM_SPEED2;

        this.target.x = Math.cos(angle) * speed;
        this.target.y = Math.sin(angle) * speed;

        // Animate
        this.spr.animate(this.id+1, 0, 3, animSpeed, tm);
        this.flip = this.target.x >= 0 ? Flip.None : Flip.Horizontal;
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        const DELTA = 0.01;

        // Determine the movement direction
        this.moveMode = pl.getTotalSpeed() > DELTA;

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
