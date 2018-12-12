/**
 * Camera
 * 
 * (c) 2018 Jani Nykänen
 */

// Camera class
class Camera {

    // Constants
    private readonly MOVE_TIME = 60.0;
    private readonly WIDTH = 160;
    private readonly HEIGHT = 144-16;

    // Grid position
    private pos : Vec2;
    // Target (in grid)
    private target : Vec2;
    // Virtual position
    private vpos : Vec2;
    // Translation
    private trans : Vec2;

    // Is moving
    private moving : boolean;
    // Move timer
    private moveTimer : number;


    // Constructor
    public constructor(x : number, y: number) {

        this.pos = new Vec2(x|0, y|0);
        this.vpos = new Vec2(this.pos.x*this.WIDTH, this.pos.y*this.HEIGHT);
        this.target = this.pos.copy();
        this.trans = new Vec2();

        this.moveTimer = 0;
        this.moving = false;
    }


    // Update
    public update(tm : number) {

        const SPEED = 1.0;

        // Move
        if(this.moving) {

            this.moveTimer -= 1.0 * SPEED * tm;
            if(this.moveTimer < 0.0) {

                this.moving = false;
                this.pos = this.target.copy();
            }
        
            // Calculate virtual position
            let t = this.moveTimer / this.MOVE_TIME;
            this.vpos.x = (this.pos.x * t + (1-t) * this.target.x) * this.WIDTH;
            this.vpos.y = (this.pos.y * t + (1-t) * this.target.y) * this.HEIGHT;
        }
        else {

            this.vpos.x = this.pos.x * this.WIDTH;
            this.vpos.y = this.pos.y * this.HEIGHT;
        }
    }


    // Use camera
    public useCamera(g : Graphics) {

        g.translate(-this.vpos.x, -this.vpos.y);
    }


    // Move
    public move(tx : number, ty : number) {

        if(this.moving) return;

        // Store translation
        this.trans.x = tx|0;
        this.trans.y = ty|0;

        this.target.x = this.pos.x + (tx|0);
        this.target.y = this.pos.y + (ty|0);

        this.moving = true;
        this.moveTimer = this.MOVE_TIME;
    }


    // Is moving
    public isMoving() : boolean {

        return this.moving;
    }


    // Get virtual position
    public getVirtualPos() : Vec2 {

        return this.vpos;
    }


    // Get move speed
    public getMoveSpeed() : number {

        return this.MOVE_TIME / 60.0;
    }


    // Get translation
    public getTranslation() : Vec2 {

        return this.trans;
    }
}
