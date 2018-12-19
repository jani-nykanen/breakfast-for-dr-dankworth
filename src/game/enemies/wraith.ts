/**
 * A wraith
 * 
 * (c) 2018 Jani Nykänen
 */

// Wraith class
class Wraith extends Enemy {

    // Target
    private ptarget : Vec2;
    // Distance from player
    private dist : number;
    // Move mode
    private moveMode : number;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 5;
        this.acceleration = 0.1;
        this.maxHealth = 4;
        this.health = this.maxHealth;
        this.power = 2;

        this.spr.setFrame(this.id+1, 0);
    
        this.ptarget = new Vec2();
        this.dist = 0;
        this.moveMode = 0;
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 0.5;
        const ANIM_SPEED = 7;
        const ESCAPE_MOD = 2.0;

        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;

        let angle = Math.atan2(py, px);

        let mod = [-1, ESCAPE_MOD] [this.moveMode];

        this.target.x = mod* Math.cos(angle) * SPEED;
        this.target.y = mod* Math.sin(angle) * SPEED;

        if(this.moveMode != 2) {

            // Animate
            this.spr.animate(this.id+1, 1, 2, ANIM_SPEED, tm);
        }
        
        // Determine flip
        this.flip = this.ptarget.x < this.pos.x ? Flip.Horizontal : Flip.None;
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        const MIN_DIST = 64;

        // Compute distance from the target
        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;
        this.dist = Math.sqrt(px*px + py*py);

        // Determine the movement direction
        this.moveMode = this.dist < MIN_DIST && pl.isAttacking(true) ? 1 : 0;

        // Store target
        this.ptarget = pl.getPos();

    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        if(dir == 0 || dir == 1) {

            this.speed.y = 0;
        }
        else {

            this.speed.x = 0;
        }
    }

}
