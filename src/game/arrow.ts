/**
 * Bow arrow
 * 
 * (c) 2018 Jani Nykänen
 */

// Possible TODO: Base projectile class?
// Arrow class
class Arrow extends GameObject {

    // Constants
    private readonly SIZE = 8;

    // Damage
    private dmg : number;
    // Flip
    private flip : Flip;
    // Hitbox
    private hbox : Hitbox;

    // Sprite
    private spr : Sprite;


    // Constructor
    public constructor() {

        super(0, 0);
        this.exist = false;
        this.swimmingSkill = 2;
        this.inCamera = true;
        this.hbox = new Hitbox();
        this.projectile = true;

        // Big enough
        this.acceleration = 10;

        // Create sprite
        this.spr = new Sprite(16, 16);
    }


    // Create
    public createSelf(x : number, y : number, 
        sx : number, sy: number, dir : number, flip = Flip.None, arrowType = 0) {

        this.flip = flip;
        this.spr.setFrame(1+arrowType, dir);

        this.pos = new Vec2(x, y);
        this.speed = new Vec2(sx, sy);
        this.target = this.speed.copy();

        this.exist = true;

        // Calculate damage
        this.dmg = 1 + arrowType;

        // Create hitbox
        this.hbox.createSelf(this.pos.x-this.SIZE/2, 
            this.pos.y-this.SIZE/2,
            this.SIZE, this.SIZE, this.dmg, this.dmg > 1);
    } 


    // Update
    public update(cam : Camera, tm : number) {

        if(!this.exist) return;

        this.move(tm);

        // Set hitbox
        this.hbox.setHitbox(this.pos.x-this.SIZE/2, 
            this.pos.y-this.SIZE/2,
            this.SIZE, this.SIZE, this.dmg);

        // Check if outside the camera
        let cx = cam.getVirtualPos().x;
        let cy = cam.getVirtualPos().y;

        if(this.pos.x+16 < cx || this.pos.y+16 < cy
            || this.pos.x-16 > cx+cam.WIDTH 
            || this.pos.y-16 > cy+cam.HEIGHT) {

            this.exist = false;
        }
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        this.exist = false;
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        if(!this.exist) return;

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("bow"), 
            this.pos.x-8, this.pos.y-8, this.flip);
    }


    // Get hitbox
    public getHitbox() : Hitbox {

        return this.hbox;
    }


    // Kill
    public kill() {

        this.exist = false;
    }

}
