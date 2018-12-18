/**
 * A bat
 * 
 * (c) 2018 Jani Nykänen
 */

// Bat class
class Bat extends Enemy {

    // Target
    private ptarget : Vec2;
    // Distance from player
    private dist : number;
    // Move mode
    private moveMode : number;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 4;
        this.acceleration = 0.1;
        this.maxHealth = 1;
        this.health = this.maxHealth;

        // Does not take collisions
        this.takeCollision = false;

        this.spr.setFrame(this.id+1, 0);
    
        this.ptarget = new Vec2();
        this.dist = 0;
        this.moveMode = 2;
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 0.75;
        const ANIM_SPEED = 8;
        const ESCAPE_MOD = 0.5;

        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;

        let angle = Math.atan2(py, px);

        let mod = [-1, ESCAPE_MOD, 0] [this.moveMode];

        this.target.x = mod* Math.cos(angle) * SPEED;
        this.target.y = mod* Math.sin(angle) * SPEED;

        if(this.moveMode != 2) {

            // Animate
            this.spr.animate(this.id+1, 1, 2, ANIM_SPEED, tm);
        }
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        const MIN_DIST = 64;
        const ACTIVE_DIST = 96;

        // Compute distance from the target
        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;
        this.dist = Math.sqrt(px*px + py*py);

        if(this.moveMode != 2) {

            // Determine the movement direction
            this.moveMode = this.dist < MIN_DIST && pl.isAttacking() ? 1 : 0;
        }
        else if(this.dist < ACTIVE_DIST) {

            this.moveMode = 0;
        }

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
