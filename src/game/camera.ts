/**
 * Camera
 * 
 * (c) 2018 Jani Nykänen
 */

// Camera class
class Camera {

    // Constants
    private readonly MOVE_TIME = 60.0;
    // Laziness
    public readonly WIDTH = 160;
    public readonly HEIGHT = 144-16;

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
    // Is looping
    private looping : boolean;
    // Loop translation
    private loopTrans : Vec2;
    // Is movement disabled
    private movementDisabled : boolean;
    // Shake
    private shake : boolean;
    // Shake amount
    private shakeAmount : Vec2;


    // Constructor
    public constructor(x : number, y: number) {

        this.shakeAmount = new Vec2();
        this.pos = new Vec2(x|0, y|0);
        this.vpos = new Vec2(this.pos.x*this.WIDTH, this.pos.y*this.HEIGHT);
        this.target = this.pos.copy();
        this.trans = new Vec2();
        this.loopTrans = new Vec2();

        this.moveTimer = 0;
        this.moving = false;
        this.looping = false;
        this.movementDisabled = false;
    }


    // Update
    public update(tm : number) {

        const SPEED = 1.0;

        // Move
        if(this.moving) {

            this.moveTimer -= 1.0 * SPEED * tm;
            if(this.moveTimer < 0.0) {

                this.moving = false;
                this.looping = false;
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

        g.translate( (-this.vpos.x+this.shakeAmount.x)|0, 
            (-this.vpos.y+this.shakeAmount.y)|0);
    }


    // Move
    public move(tx : number, ty : number) {

        if(this.moving || this.movementDisabled) return;

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


    // Set position (in grid coordinates)
    public setPos(x : number, y : number) {

        this.pos.x = x;
        this.pos.y = y;

        this.vpos.x = this.pos.x * this.WIDTH;
        this.vpos.y = this.pos.y * this.HEIGHT;
    }


    // Get position
    public getPos() : Vec2 {

        return this.pos;
    }


    // Get target
    public getTarget() : Vec2 {

        return this.target;
    }


    // Set target
    public setTarget(tx : number, ty : number, looping = false) {

        this.target.x += tx;
        this.target.y += ty;

        this.pos.x += tx;
        this.pos.y += ty;

        this.looping = looping;
        // Store loop transition
        if(looping) {

            this.loopTrans.x = tx * this.WIDTH;
            this.loopTrans.y = ty * this.HEIGHT;
        }
    }


    // Is looping
    public isLooping() : boolean {

        // Nope: we disable looping flag, do
        // certain events only happen once
        let l = this.looping;
        this.looping = false;

        return l;
    }


    // Get loop transition
    public getLoopTransition() : Vec2 {

        return this.loopTrans;
    }


    // Toggle movement
    public toggleMovement(state : boolean) {

        this.movementDisabled = !state;
    }


    // Toggle shaking
    public toggleShake(state : boolean) {

        this.shake = state;
        if(!state) {

            this.shakeAmount.x = 0;
            this.shakeAmount.y = 0;
        }
    }


    // Can move
    public canMove() : boolean {

        return !this.movementDisabled;
    }


    // Update shake
    public updateShake(tm : number) {

        const SHAKE = 4;

        if(!this.shake) {
            return;
        }

        this.shakeAmount.x = (Math.random() * 2 - 1) * SHAKE;
        this.shakeAmount.y = (Math.random() * 2 - 1) * SHAKE;
    }
}
