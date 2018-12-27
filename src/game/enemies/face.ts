/**
 * A face
 * 
 * (c) 2018 Jani Nykänen
 */

// Face class
class Face extends Enemy {

    // Secondary sprite
    private secSpr : Sprite;


    // Respawn
    protected respawn() {

        this.spr.setFrame(0, 0);
    }


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 0;
        this.acceleration = 0.2;
        this.maxHealth = 30;
        this.power = 2;
        this.health = this.maxHealth;

        // Does not take collisions
        this.takeCollision = false;
        this.isStatic = false;
        this.dying = false;
        this.exist = true;

        // Create a bigger sprite
        this.spr = new Sprite(32, 32);
        this.spr.setFrame(0, 0);

        // Create a secondary sprite
        this.secSpr = new Sprite(32, 32);
        
        this.dim.x = 28;
        this.dim.y = 28;
        this.dhbox.x = 32;
        this.dhbox.y = 32;

        this.inCamera = true;
        this.isBoss = true;
    }


    // Update AI
    protected updateAI(tm : number) {

        const DARK_TIME = 90;
        const VISIBLE_TIME = 180;
        const DEF_SPEED = 8;

        let f = this.secSpr.getFrame();
        let speed = DEF_SPEED;
        if(f == 0) {

            speed = VISIBLE_TIME;
        }
        else if(f == 4) {

            speed = DARK_TIME;
        }

        // Animate secondary sprite
        this.secSpr.animate(0, 0, 6, speed, tm);

        // If hurt
        if(this.hurtTimer > 0) {

            this.spr.animate(1, 0, 1, 2, tm);
        }
        else {

            this.spr.setFrame(this.secSpr.getRow(), 
                this.secSpr.getFrame());
        }
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // ...
    }


    // Draw
    public overrideDraw(g : Graphics, ass : Assets) {

        let b = ass.getBitmap("face");

        // Draw sprite
        this.spr.draw(g, b, 
            this.pos.x-this.spr.getWidth()/2,
            this.pos.y-this.spr.getHeight()/2);  
    }
}
