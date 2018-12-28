/**
 * A face
 * 
 * (c) 2018 Jani Nykänen
 */

// Face class
class Face extends Enemy {

    // Constants
    private readonly DEFAULT_SPEED = 0.5; 
    private readonly SPEED_BONUS = 0.25;

    // Secondary sprite
    private secSpr : Sprite;


    // Respawn
    protected respawn() {

        let dir = Math.random() * Math.PI * 2;

        this.spr.setFrame(0, 0);
        this.secSpr.setFrame(0, 0);

        // Set default speed
        this.target.x = Math.cos(dir)* this.DEFAULT_SPEED;
        this.target.y = Math.sin(dir)* this.DEFAULT_SPEED;
        this.speed.x = 0;
        this.speed.y = 0;

        this.pos = this.startPos.copy();
    }


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.startPos = new Vec2(x, y);

        this.id = 0;
        this.acceleration = 0.1;
        this.maxHealth = 40;
        this.power = 2;
        this.health = this.maxHealth;

        // Does not take collisions
        this.takeCollision = false;
        this.isStatic = false;
        this.dying = false;
        this.exist = true;

        // Create a bigger sprite
        this.spr = new Sprite(32, 32);

        // Create a secondary sprite
        this.secSpr = new Sprite(32, 32);
        
        this.dim.x = 28;
        this.dim.y = 28;
        this.dhbox.x = 32;
        this.dhbox.y = 32;

        this.inCamera = true;
        this.isBoss = true;

        this.respawn();
    }


    // Update AI
    protected updateAI(tm : number) {

        const DARK_TIME = 90;
        const VISIBLE_TIME = 120;
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
        if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/4)%2 == 0) {

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


    // Hurt event
    protected hurtEvent(angle : number) {

        if(this.hurtTimer > 0) return;

        // Compute speed
        let tspeed = this.DEFAULT_SPEED + 
            (1.0 - this.health/this.maxHealth * this.SPEED_BONUS);

        this.target.x = Math.cos(angle) * tspeed;
        this.target.y = Math.sin(angle) * tspeed;

        this.speed.x = this.target.x;
        this.speed.y =  this.target.y;
    }


    // Draw
    public overrideDraw(g : Graphics, ass : Assets) {

        let b = ass.getBitmap("face");

        // Draw sprite
        this.spr.draw(g, b, 
            this.pos.x-this.spr.getWidth()/2,
            this.pos.y-this.spr.getHeight()/2);  
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        if(dir == 0 || dir == 1) {

            this.speed.y *= -1;
            this.target.y *= -1;
        }
        else  {

            this.speed.x *= -1;
            this.target.x *= -1;
        }
    }
}
