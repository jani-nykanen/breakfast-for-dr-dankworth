/**
 * Base enemy type
 * 
 * (c) 2018 Jani Nykänen
 */

// Enemy class
class Enemy extends GameObject {

    // Sprite
    protected spr : Sprite;
    // ID
    protected id : number;
    // Flip
    protected flip : Flip;


    // Custom events
    protected updateAI?(tm : number) : any;
    protected playerEvent?(pl : Player, tm : number) : any;
    protected enemyCollisionEvent?() : any;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        // Dimensions
        this.dim.x = 12;
        this.dim.y = 12;
        this.center = new Vec2(0, -3);

        // Set defaults
        this.spr = new Sprite(16, 16);
        this.id = 0;
        this.flip = Flip.None;

        this.exist = true;
    }


    // Perform camera check
    public cameraCheck(cam : Camera) {

        if(!this.exist) return;

        let p = cam.getVirtualPos();

        // Check if in camera
        this.inCamera = this.pos.x+8 >= p.x && this.pos.x-8 <= p.x+cam.WIDTH
            && this.pos.y+8 >= p.y && this.pos.y-8 <= p.y+cam.HEIGHT;
    }


    // Update
    public update(cam : Camera, tm : number) {

        if(!this.exist || !this.inCamera) return;

        // Update AI
        if(this.updateAI != null)
            this.updateAI(tm);

        // Move
        this.move(tm);

        // Camera side collisions
        let p = cam.getVirtualPos();

        this.getWallCollision(p.x,p.y+cam.HEIGHT,cam.WIDTH, 0, tm);
        this.getWallCollision(p.x,p.y,cam.WIDTH, 1, tm);
        this.getWallCollision(p.x + cam.WIDTH,p.y,cam.HEIGHT, 2, tm);
        this.getWallCollision(p.x,p.y,cam.HEIGHT, 3, tm);

    }


    // Player collision
    public onPlayerCollision(pl : Player, tm : number) {

        if(!this.exist || !this.inCamera) return;

        // Player event
        if(this.playerEvent != null)
            this.playerEvent(pl, tm);

        // TODO: Check hitbox, take damage

        // TODO: Hurt collision
    }


    // Enemy collision
    public onEnemyCollision(e : Enemy) {

        const RADIUS = 8;

        if(e == this || !this.exist || !this.inCamera ||
            !e.exist || !e.inCamera) return;

        let cx = this.pos.x - e.pos.x;
        let cy = this.pos.y - e.pos.y;

        let dist = Math.sqrt(cx*cx + cy*cy);
        if(dist < RADIUS*2) {

            // Move objects
            let r = (RADIUS*2-dist)/2;
            let angle = Math.atan2(cy, cx);

            this.pos.x += Math.cos(angle) * r;
            this.pos.y += Math.sin(angle) * r;

            e.pos.x -= Math.cos(angle) * r;
            e.pos.y -= Math.sin(angle) * r;

            // Call custom collision events
            if(this.enemyCollisionEvent != null)
                this.enemyCollisionEvent();

            if(e.enemyCollisionEvent != null)
                e.enemyCollisionEvent();
        }
    }


    // Draw 
    public draw(g : Graphics, ass : Assets) {

        if(!this.exist || !this.inCamera) 
            return;

        let b = ass.getBitmap("enemies");

        // Draw sprite
        this.spr.draw(g, b, this.pos.x-8,this.pos.y-8, this.flip);
    }
}
