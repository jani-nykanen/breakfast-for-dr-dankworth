/**
 * Base enemy type
 * 
 * (c) 2018 Jani Nykänen
 */

// Enemy class
class Enemy extends GameObject {

    // Constants
    protected readonly HURT_TIME = 30;

    // Sprite
    protected spr : Sprite;
    // ID
    protected id : number;
    // Flip
    protected flip : Flip;
    // Is dying
    protected dying : boolean;

    // Hurt timer
    protected hurtTimer : number;
    // Hurt id
    protected hurtID : number;

    // Health
    protected health : number;
    // Max health
    protected maxHealth : number;
    // Damage hitbox
    protected dhbox : Vec2;
    // Attack power
    protected power : number;

    // Start pos
    protected startPos : Vec2;
    // If repositioned
    protected repositioned : boolean;
    // Item created
    protected itemCreated : boolean;

    // Is static
    protected isStatic : boolean;


    // Custom events
    protected updateAI?(tm : number) : any;
    protected playerEvent?(pl : Player, tm : number) : any;
    protected enemyCollisionEvent?(angle : number) : any;
    protected respawn?() : any;


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        // Store starting position
        this.startPos = new Vec2(x, y);
        this.repositioned = false;

        // Dimensions
        this.dim.x = 12;
        this.dim.y = 12;
        this.center = new Vec2(0, -3);
        this.dhbox = new Vec2(12, 12);

        // Set defaults
        this.spr = new Sprite(16, 16);
        this.id = 0;
        this.flip = Flip.None;
        this.hurtID = -2;
        this.health = 1;
        this.maxHealth = 2;
        this.power = 1;

        this.dying = false;
        this.exist = true;
        this.itemCreated = true;

        this.inCamera = false;
    }


    // Respawn
    public respawnSelf() {

        // Respawn
        this.exist = true;
        this.spr.setFrame(this.id+1, 0);
        this.dying = false;
        this.health = this.maxHealth;
        this.hurtTimer = 0;
        this.hurtID = -1;
        this.speed.x = 0;
        this.speed.y = 0;

        if(this.respawn != null) 
            this.respawn();
    }


    // Perform camera check
    public cameraCheck(cam : Camera) {

        if(!this.exist && this.repositioned) return;

        let p = cam.getVirtualPos();

        // Check if in camera
        this.inCamera = this.pos.x+8 >= p.x && this.pos.x-8 <= p.x+cam.WIDTH
            && this.pos.y+8 >= p.y && this.pos.y-8 <= p.y+cam.HEIGHT;

        // Move back to the original position if outside the camera
        // (and camera not moving!)
        if(!cam.isMoving() && !this.inCamera && !this.repositioned) {

            this.pos.x = this.startPos.x;
            this.pos.y = this.startPos.y;

            this.repositioned = true;

            // Respawn
            this.respawnSelf();
        }
    }


    // Die
    private die(tm : number) {
        
        const PUFF_SPEED = 7;

        this.acceleration = 0.2;
        this.target.x = 0;
        this.target.y = 0;

        // Animate
        this.spr.animate(0, 0, 4, PUFF_SPEED, tm);
        if(this.spr.getFrame() == 4)
            this.exist = false;
    }


    // Update
    public update(cam : Camera, tm : number) {

        if(!this.exist || !this.inCamera || this.isStatic) return;

        this.repositioned = false;

        // Die if dying
        if(this.dying) {

            this.die(tm);
        }
        else {

            // Update hurt timer
            if(this.hurtTimer > 0.0) {

                this.hurtTimer -= 1.0 * tm;

                // Set target speed to zero
                this.target.x = 0;
                this.target.y = 0;
            }
            // Update AI
            else if(this.updateAI != null)
                this.updateAI(tm);

        }

        // Move
        this.move(tm);

        // Camera side collisions
        let p = cam.getVirtualPos();

        this.getWallCollision(p.x,p.y+cam.HEIGHT,cam.WIDTH, 0, tm);
        this.getWallCollision(p.x,p.y,cam.WIDTH, 1, tm);
        this.getWallCollision(p.x + cam.WIDTH,p.y,cam.HEIGHT, 2, tm);
        this.getWallCollision(p.x,p.y,cam.HEIGHT, 3, tm);

    }


    // Arrow collision
    public arrowCollision(arrow: Arrow) {

        if(!this.exist || !this.inCamera || this.dying ||
            arrow.doesExist() == false) return;

        // Check hitbox
        let hbox = arrow.getHitbox();
        if(hbox.doesExist() && hbox.getID() > this.hurtID) {

            if(hbox.doesOverlay(this.pos.x-this.dhbox.x/2, 
                this.pos.y-this.dhbox.y/2, 
                this.dhbox.x, this.dhbox.y)) {

                // Hurt
                this.hurtID = hbox.getID();
                this.hurtTimer = this.HURT_TIME;

                // Decrease health
                this.health -= hbox.getDamage();
                if(this.health <= 0) {

                    this.makeDead();
                }

                // Kill arrow
                arrow.kill();
            }
        }
    }


    // Die (method name "die" is
    // already taken)
    private makeDead() {

        this.dying = true;
        this.itemCreated = false;

        this.spr.setFrame(0, 0);
    }


    // Player collision
    public onPlayerCollision(pl : Player, tm : number) {

        const KNOCKBACK = 5.0;
        const BASE_ACC = 0.2;
        const POWER_MOD = 0.5;

        if(!this.exist || !this.inCamera || this.dying) return;

        // Make static (=passive) is the player
        // is dying
        this.isStatic = pl.isDying();

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;

        // Player event
        if(this.playerEvent != null)
            this.playerEvent(pl, tm);

        // Check hitbox, take damage
        let hbox = pl.getHitbox();
        // If not active, check special hitbox
        let isSpc = false;
        if(!hbox.doesExist()) {

            hbox = pl.getSpcHitbox();
            isSpc = true;
        }

        if(hbox.doesExist() && hbox.getID() > this.hurtID) {

            if(hbox.doesOverlay(this.pos.x-this.dhbox.x/2, 
                this.pos.y-this.dhbox.y/2, 
                this.dhbox.x, this.dhbox.y)) {

                this.hurtID = hbox.getID();
                this.hurtTimer = this.HURT_TIME;

                // Knockback
                let cx = this.pos.x - pl.getPos().x;
                let cy = this.pos.y - pl.getPos().y;
                let angle = Math.atan2(cy, cx);

                // Power mod
                let pwmod = 1.0 + POWER_MOD*(hbox.getDamage()-1);

                let kb =  (this.acceleration / BASE_ACC) * KNOCKBACK * pwmod;
                this.speed.x += Math.cos(angle) * kb;
                this.speed.y += Math.sin(angle) * kb;

                // Decrease health
                this.health -= hbox.getDamage();
                if(this.health <= 0) {

                    this.makeDead();
                }

                // If special, disable player spin attack
                // loading
                if(isSpc)
                    pl.disableSpinAttack();
            }
        }

        // Hurt player
        pl.getHurtCollision(
            px-this.dim.x/2, 
            py-this.dim.y/2,
            this.dim.x, this.dim.y, this.power
        );
    }


    // Enemy collision
    public onEnemyCollision(e : Enemy) {

        const RADIUS = 8;

        if(e == this || !this.exist 
            || !this.inCamera || this.dying || !this.doesTakeCollisions() ||
            !e.exist || !e.inCamera || e.dying || !e.doesTakeCollisions()) return;

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
                this.enemyCollisionEvent(angle);

            if(e.enemyCollisionEvent != null)
                e.enemyCollisionEvent(angle);
        }
    }


    // Draw 
    public draw(g : Graphics, ass : Assets) {

        if(!this.exist || !this.inCamera) 
            return;

        let b = ass.getBitmap("enemies");

        // Determine frameskip
        let frameSkip = 0;
        // Hurt
        if(!this.dying && this.hurtTimer > 0.0 && 
            Math.floor(this.hurtTimer / 4) % 2 == 0)
            frameSkip = 4;

        // Draw sprite
        this.spr.draw(g, b, this.pos.x-8,this.pos.y-8, this.flip, frameSkip);
    }


    // Is dying
    public isDying() {

        return this.dying;
    }


    // Is item to be created
    public itemToBeCreated() : boolean {

        // We set "item created" flag to true to
        // make sure item is created only once per
        // dying enemy
        let b = !this.itemCreated;
        this.itemCreated = true;

        return b;
    }
}
