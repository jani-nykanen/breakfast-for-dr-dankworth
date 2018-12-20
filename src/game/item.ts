/**
 * A collectable item
 * 
 * (c) 2018 Jani Nykänen
 */

// Item class
class Item {

    // Constants
    private readonly EXISTENCE_TIME = 240;

    // Position
    private pos : Vec2;
    // Timer
    private timer : number;
    // Sprite
    private spr : Sprite;
    // ID
    private id : number;
    // Does exist
    private exist : boolean;


    // Constructor
    public constructor() {

        this.pos = new Vec2();
        this.spr = new Sprite(16, 16);

        this.exist = false;
    }


    // Create self
    public createSelf(x : number, y : number, id : number) {

        this.pos.x = x;
        this.pos.y = y;
        this.timer = this.EXISTENCE_TIME;
        this.id = id;
        this.spr.setFrame(0, this.id);

        this.exist = true;
    }


    // Update
    public update(tm : number, cam : Camera) {

        if(!this.exist) return;

        // Update timer
        this.timer -= 1.0 * tm;
        // If camera is moving or time is out,
        // destroy self
        if(cam.isMoving() || this.timer <= 0.0) {

            this.exist = false;
            return;
        }
    }


    // Player collision
    public getPlayerCollision(pl : Player) {

        const DIM = 8;

        if(!this.exist) return;

        // TODO: Collision
        let px = pl.getPos().x;
        let py = pl.getPos().y;
        let dw = pl.getDim().x/2;
        let dh = pl.getDim().y/2;

        let x = this.pos.x-DIM/2;
        let y = this.pos.y-DIM/2;
        let w = DIM;
        let h = DIM;

        if(px + dw >= x && px - dw <= x+w
        && py + dh >= y && py - dh <= y+h) {

            this.exist = false;

            // Death event
            if(this.id == 0) {

                pl.addGem();
            }
            else if(this.id == 1) {

                pl.addHeart();
            }
            else {

                pl.addArrow();
            }
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        const FLICKER_TIME = 60;

        if(!this.exist) return;

        let t = this.timer;
        if(t < FLICKER_TIME && Math.floor(t/4) % 2 == 0)
            return;

        this.spr.draw(g, ass.getBitmap("items"), 
            this.pos.x-8, this.pos.y-8);
    }


    // Does exist
    public doesExist() : boolean {

        return this.exist;
    }

}
