/**
 * Environment-related dying elements
 * 
 * (c) 2018 Jani Nykänen
 */

// "Env. death" element class
class EnvDeath {

    // Position
    private pos : Vec2;
    // ID
    private id : number;
    // Sprite
    private spr : Sprite;

    // Does exist
    private exist : boolean;


    // Constructor
    public constructor() {

        this.spr = new Sprite(16, 16);
        this.exist = false;
    }


    // Create self
    public createSelf(x : number, y : number, id = 0) {

        this.pos = new Vec2(x, y);
        this.id = id;
        this.exist = true;

        this.spr.setFrame(this.id, 0);
    }


    // Update
    public update(tm : number) {

        const ANIM_SPEED = 8;

        if(!this.exist) return;

        // Animate
        this.spr.animate(this.id, 0, 4, ANIM_SPEED, tm);
        if(this.spr.getFrame() == 4)
            this.exist = false;
    }


    // Draw 
    public draw(g : Graphics, ass : Assets, frameSkip = 0) {

        if(!this.exist) return;

        // Draw sprite
        this.spr.draw(g, ass.getBitmap("envdeath"), 
            this.pos.x, this.pos.y, 
            Flip.None, frameSkip);
    }


    // Does exist
    public doesExist() : boolean {

        return this.exist;
    }
}
