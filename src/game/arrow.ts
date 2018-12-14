/**
 * Bow arrow
 * 
 * (c) 2018 Jani Nykänen
 */

// Possible TODO: Base projectile class?
// Arrow class
class Arrow extends GameObject {

    // Direction
    private dir : number;
    // Flip
    private flip : Flip;

    // Sprite
    private spr : Sprite;


    // Constructor
    public constructor() {

        super(0, 0);
        this.exist = false;

        // Big enough
        this.acceleration = 10;

        // Create sprite
        this.spr = new Sprite(16, 16);
    }


    // Create
    public createSelf(x : number, y : number, 
        sx : number, sy: number, dir : number, flip = Flip.None) {

        this.flip = flip;
        this.spr.setFrame(1, dir);

        this.pos = new Vec2(x, y);
        this.speed = new Vec2(sx, sy);
        this.target = this.speed.copy();

        this.exist = true;
    } 


    // Update
    public update(cam : Camera, tm : number) {

        if(!this.exist) return;

        this.move(tm);

        // Check if outside the camera
        let cx = cam.getVirtualPos().x;
        let cy = cam.getVirtualPos().y;

        if(this.pos.x+16 < cx || this.pos.y+16 < cy
            || this.pos.x-16 > cx+cam.WIDTH 
            || this.pos.y-16 > cy+cam.HEIGHT) {

            this.exist = false;
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        if(!this.exist) return;

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("bow"), 
            this.pos.x-8, this.pos.y-8, this.flip);
    }

}
