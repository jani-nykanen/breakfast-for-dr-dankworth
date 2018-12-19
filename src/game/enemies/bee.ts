/**
 * A bee
 * 
 * (c) 2018 Jani Nykänen
 */

// Bee class
class Bee extends Enemy {

    // Target
    private ptarget : Vec2;
    // Target modification angle
    private angle : number;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 6;
        this.acceleration = 0.1;
        this.maxHealth = 1;
        this.health = this.maxHealth;
        
        // Does not take collisions
        this.takeCollision = false;

        this.spr.setFrame(this.id+1, 0);
    
        this.ptarget = new Vec2();
        this.angle = 0;

    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 1.0;
        const ANIM_SPEED = 3;
        const ANGLE_DELTA = 0.025;
        const DIST_MOD = 32;

        // Update angle
        this.angle += ANGLE_DELTA * tm;
        if(this.angle >= Math.PI*2)
            this.angle -= Math.PI*2;

        // Calculate modified target
        let tx = this.ptarget.x + Math.cos(this.angle)*DIST_MOD;
        let ty = this.ptarget.y + Math.sin(this.angle)*DIST_MOD;

        let px = this.pos.x - tx;
        let py = this.pos.y - ty;
        let a = Math.atan2(py, px);

        this.target.x = -Math.cos(a) * SPEED;
        this.target.y = -Math.sin(a) * SPEED;

        // Animate
        this.spr.animate(this.id+1, 0, 3, ANIM_SPEED, tm);
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // Store target
        this.ptarget = pl.getPos();
        
    }

}
