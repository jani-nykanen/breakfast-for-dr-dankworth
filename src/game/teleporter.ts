/**
 * One that teleports, it's a
 * teleporter
 * 
 * (c) 2018 Jani Nykänen
 */

// Teleporter class
class Teleporter extends GameObject {

    // Sprite
    private spr : Sprite;
    // Mode
    private mode : number;

    // Is active
    private active : boolean;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        // Create sprite
        this.spr = new Sprite(32, 32);
    
        // Set defaults
        this.mode = 0;
        this.active = false;
    }


    // Update
    public update(tm : number, cam : Camera) {

        const ANIM_SPEED1 = 8;
        const ANIM_SPEED2 = 30;

        if(!this.exist) return;

        let p = cam.getVirtualPos();
        // Check if in camera
        this.inCamera = this.pos.x+16 >= p.x && this.pos.x-16 <= p.x+cam.WIDTH
            && this.pos.y+16 >= p.y && this.pos.y-16 <= p.y+cam.HEIGHT;

        if(!this.inCamera)
            return;

        // Animate
        if(this.active) {

            this.spr.animate(this.mode, 0, 3, 
                this.spr.getFrame() == 0 ? ANIM_SPEED2 : ANIM_SPEED1, tm);
        }
        else {

            this.spr.setFrame(this.mode, 4);
        }
    }


    // Player collision
    public onPlayerCollision(pl : Player, audio : AudioPlayer, ass : Assets) : boolean {

        const RADIUS = 12;

        if(!this.exist || !this.inCamera) return false;

        this.active = pl.getRemainingCrystals() <= 0;
        if(!this.active) return false;

        let p = pl.getCenteredPos();
        let px = p.x - this.pos.x;
        let py = p.y - this.pos.y;

        let dist = Math.sqrt(px*px + py*py);
        // Play sound
        if(dist < RADIUS) {  

            audio.playSample(ass.getSample("teleport"), 0.50);
        }

        return dist < RADIUS;
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        if(!this.exist || !this.inCamera) return;

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("teleporter"), 
            this.pos.x-16, this.pos.y-16);
    }


    // Transform
    public transform(tx : number, ty : number) {

        this.pos.x = tx;
        this.pos.y = ty;

        ++ this.mode;
    }
};