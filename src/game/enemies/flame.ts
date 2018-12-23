/**
 * A flame
 * 
 * (c) 2018 Jani Nykänen
 */

// Flame class
class Flame extends Enemy {

    // Target
    private ptarget : Vec2;
    // Distance from player
    private dist : number;
    // Move mode
    private moveMode : number;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 7;
        this.acceleration = 0.1;
        this.maxHealth = 6;
        this.health = this.maxHealth;
        this.power = 2;

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
        const ANIM_SPEED = 4;
        const ESCAPE_MOD = -1.0;

        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;

        let angle = Math.atan2(py, px);

        let mod = [1, 0, ESCAPE_MOD] [this.moveMode];

        this.target.x = -mod* Math.cos(angle) * SPEED;
        this.target.y = -mod* Math.sin(angle) * SPEED;

        // Animate
        this.spr.animate(this.id+1, 0, 3, ANIM_SPEED, tm);
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        const MIN_DIST = 80;

        // Compute distance from the target
        let px = this.pos.x - this.ptarget.x;
        let py = this.pos.y - this.ptarget.y;
        this.dist = Math.sqrt(px*px + py*py);

         // Determine the movement mode
        this.moveMode = this.dist < MIN_DIST && pl.isAttacking(true) ? 1 : 0;
        if(pl.isLoadingSpin())
            this.moveMode = 2;

        // Store target
        this.ptarget = pl.getPos();
        
    }

}
