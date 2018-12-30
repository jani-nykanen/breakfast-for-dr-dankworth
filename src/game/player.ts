/**
 * Player object
 * 
 * (c) 2018 Jani Nykänen
 */


 // Attack type
enum AtkType {
    Sword = 0,
    Bow = 1,
    SpcSword = 2,
};


// Player class
class Player extends GameObject {

    // Constants
    private readonly ATTACK_SPEED = 5;
    private readonly SPIN_TIME = 28.0;
    private readonly INITIAL_LIFE = 6;
    private readonly INITIAL_ARROW_MAX = 10;

    // Checkpoint
    private checkpoint : Vec2;

    // Sprite
    private spr : Sprite;
    // Sword sprite
    private sprSword : Sprite;
    // Bow sprite
    private sprBow : Sprite;
    // Death sprite
    private sprDeath : Sprite;
    // Flip
    private flip : Flip;

    // Direction
    private dir : number;
    // Is attacking
    private attacking : boolean;
    // Spin load timer
    private spinLoad : number;
    // Is loading spin
    private loadingSpin : boolean;
    // Spin timer
    private spinTimer : number;
    // Starting row for spinning
    private startRow : number;
    // Attack type
    private atk : AtkType;
    // Hurt timer
    private hurtTimer : number;
    // Is dying
    private dying : boolean;

    // Sword level
    private swordLevel : number;
    // Bow level
    private bowLevel : number;
    // Speed level
    private speedLevel : number;

    // Is swimming
    private swimming : boolean;
    // Is climbing stairs
    private stairs : boolean;
    // Is jumping
    private jumping : boolean;
    // Jump target
    private jumpTarget : number;
    // Gravity
    private gravity : number;

    // Life
    private life : number;
    // Maximum life
    private maxLife : number;
    // Arrow count
    private arrowCount : number;
    // Arrow max
    private arrowMax : number;
    // Gem count
    private gemCount : number;
    // Crystal count
    private crystalCount : number;
    // Crystal max
    private crystalMax : number;

    // Hitbox
    private hbox : Hitbox;
    // Special hitbox
    private spcHbox : Hitbox;

    // Item info
    private itemInfo : any;

    // Lying timer
    private lieTimer : number;

    // Is the death sound played
    private deathSoundPlayed : boolean;
    // Is the hurt sound played
    private hurtSoundPlayed : boolean;

    // Sounds
    private sDeath : any;
    private sHurt : any;
    private sSword : any;
    private sSword2 : any;
    private sArrow : any;
    private sGem : any;
    private sHealth : any;
    private sArrowPick : any;
    private sJump : any;


    // Constructor
    public constructor(x : number, y: number, ass : Assets) {

        super(x, y);

        // Get samples
        this.sDeath = ass.getSample("death");
        this.sHurt = ass.getSample("hurt");
        this.sSword = ass.getSample("sword");
        this.sSword2 = ass.getSample("sword2");
        this.sArrow = ass.getSample("arrow");
        this.sGem = ass.getSample("gem");
        this.sHealth = ass.getSample("health");
        this.sArrowPick = ass.getSample("arrowPick");
        this.sJump = ass.getSample("jump");

        // Set checkpoint
        this.checkpoint = new Vec2(x, y);

        // Store item info
        this.itemInfo = ass.getDocument("itemInfo");

        // Create sprites
        this.spr = new Sprite(16, 16);
        this.spr.setFrame(7, 2);
        this.sprSword = new Sprite(24, 24);
        this.sprBow = new Sprite(16, 16);
        this.sprDeath = new Sprite(24, 24);
        this.lieTimer = 1;

        // Create hitboxes
        this.hbox = new Hitbox();
        this.spcHbox = new Hitbox();

        // Dimensions
        this.dim = new Vec2(8, 10);
        this.center = new Vec2(0, -3);

        // Default skill levels
        this.swordLevel = 0;
        this.bowLevel = 0;
        this.swimmingSkill = 0;
        this.speedLevel = 0;

        // Set defaults
        this.dir = 0;
        this.acceleration = 0.15;
        this.attacking = false;
        this.spinLoad = 0.0;
        this.loadingSpin = false;
        this.spinTimer = 0.0;
        this.atk = AtkType.Sword;
        this.hurtTimer = 0.0;

        this.swimming = false;
        this.stairs = false;
        this.jumping = false;
        this.dying = false;

        this.life = this.INITIAL_LIFE;
        this.maxLife = this.INITIAL_LIFE;
        this.arrowCount = 0;
        this.arrowMax = this.INITIAL_ARROW_MAX;
        this.gemCount = 0;
        this.crystalCount = 0;
        this.crystalMax = 0;

        this.deathSoundPlayed = false;
        this.hurtSoundPlayed = true;

        this.inCamera = true;
    }


    // Shoot an arrow
    private shootArrow(arrows : Array<Arrow>) {

        const SPEED = 4;

        // Find the first non-existent arrow
        let a : Arrow;
        a = null;
        for(let i = 0; i < arrows.length; ++ i) {

            a = arrows[i];
            if(!a.doesExist()) {
                break;
            }
        }
        if(a == null) return;

        // Check creation position & speed
        let x = this.pos.x;
        let y = this.pos.y;
        let sx = 0;
        let sy = 0;

        // TODO: switch
        if(this.dir == 0) {

            y += 16;
            sy = 1;
        }
        else if(this.dir == 1) {

            y -= 16;
            sy = -1;
        }
        else if(this.dir == 2) {

            if(this.flip == Flip.Horizontal) {

                x -= 16;
                sx = -1;
            }
            else {

                x += 16;
                sx = 1;
            }
        }

        // Create arrow
        a.createSelf(x, y, sx*SPEED, sy*SPEED, this.dir, this.flip,
            this.bowLevel == 2 ? 1 : 0);
    }


    // Control
    private control(vpad : Vpad, arrows : Array<Arrow>, audio : AudioPlayer, tm : number) {

        const DELTA = 0.01;
        const SPEED = 1.0;
        const SWIM_MOD = 0.5;
        const STAIR_MOD = 0.33;
        const PI = Math.PI;
        const RUN_FACTOR = 1.25;

        // Movement
        let s = vpad.getStick();
        if(!this.attacking && this.spinTimer <= 0.0) {

            this.target.x = SPEED * s.x;
            this.target.y = SPEED * s.y;
        }
        else {

            this.target.x = 0,
            this.target.y = 0;
        }

        // Get direction
        if(!this.loadingSpin && this.spinTimer <= 0.0
            && !this.attacking &&  vpad.getStickDistance() > DELTA)  {

            let angle = Math.atan2(s.y, s.x) + PI;
            this.flip = Flip.None;

            // Down
            if(angle >= PI + PI/4 && angle < PI*2-PI/4)
                this.dir = 0;

            // Left
            else if(angle >= PI - PI/4 && angle < PI+PI/4)
                this.dir = 2;

            // Top
            else if(angle >= PI/4 && angle < PI-PI/4)
                this.dir = 1;

            // Right
            else {

                this.flip = Flip.Horizontal;
                this.dir = 2;
            }
        }

        // Swimming
        if(this.swimming) {

            this.target.x *= SWIM_MOD;
            this.target.y *= SWIM_MOD;

            return;
        }

        // If on stairs
        if(this.stairs) {

            this.target.y *= STAIR_MOD;
        }

        let s1 = vpad.getButton("fire1");
        let s2 = vpad.getButton("fire2");

        // Spin released
        if(this.loadingSpin && s1 == State.Up) {

            this.loadingSpin = false;
            this.spinLoad = 0.0;

            this.spinTimer = this.SPIN_TIME;

            // Determine starting row/direction
            this.startRow = [0, 2, 3] [this.dir];
            if(this.flip == Flip.Horizontal)
                this.startRow = 1;

            // Play sound
            audio.playSample(this.sSword2, 0.5);
        }
        // Check sword attack
        else if(this.swordLevel > 0 && !this.attacking && s1 == State.Pressed) {

            this.attacking = true;
            this.atk = AtkType.Sword;

            this.spr.setFrame(3 + this.dir, 0);
            this.sprSword.setFrame(this.dir,0);

            // Sword sound
            audio.playSample(this.sSword, 0.5);
            
        }
        // Release attack
        else if(this.attacking 
            && s1 == State.Up
            && this.spr.getFrame() == 3 
            && this.spr.getFrameTimer() >= this.ATTACK_SPEED ) {

            this.spr.setFrame(this.dir, 0);
            this.attacking = false;
        }
        // Check bow attack
        else if(!this.attacking 
            && this.bowLevel > 0
            && !this.loadingSpin 
            && this.spinTimer <= 0.0 
            && s2 == State.Pressed
            && this.arrowCount > 0) {

            this.attacking = true;
            this.atk = AtkType.Bow;

            this.spr.setFrame(6, this.dir);
            this.sprBow.setFrame(0, this.dir);

            // Shoot arrow
            this.shootArrow(arrows);
            -- this.arrowCount;

            // Play sound
            audio.playSample(this.sArrow, 0.5);
        }
        
        // Apply speed factor
        if(this.speedLevel > 0) {

            this.target.x *= this.speedLevel * RUN_FACTOR;
            this.target.y *= this.speedLevel * RUN_FACTOR;
        }
    }


    // Animate
    private animate(tm : number) {

        const DELTA = 0.01;
        const RELEASE_ATTACK_TIME = 18;
        const SPIN_CHANGE = 3;
        const BOW_TIME = 30;
        const SWIM_SPEED = 10;
        const SPC_TIME = 20;

        // Update "spin loading"
        if(this.loadingSpin) {

            this.spinLoad += 1.0 * tm;
            this.sprSword.setFrame(this.dir, 4);
        }

        // If swimming
        if(this.swimming) {

            if(this.totalSpeed < DELTA)
            this.spr.animate(7 + this.dir, 0, 0, 0, tm);
            else
                this.spr.animate(7 + this.dir, 0, 1, SWIM_SPEED, tm);
        }
        // If spinning
        else if(this.spinTimer > 0.0) {

            this.spinTimer -= 1.0 * tm;
            // If time is out, reset row
            if(this.spinTimer <= 0.0) {

                this.dir = [0, 2, 1, 2] [this.startRow];
                if(this.startRow == 1) 
                    this.flip = Flip.Horizontal;
                else
                    this.flip = Flip.None;

                this.attacking = false;
            }
            else {

                // Compute row & direction
                let row = (this.startRow +
                    (( (this.SPIN_TIME-this.spinTimer) / SPIN_CHANGE) | 0)) % 4;
                this.dir = [0, 2, 1, 2] [row];
                if(row == 1) 
                    this.flip = Flip.Horizontal;
                else
                    this.flip = Flip.None;

                this.spr.setFrame(3+this.dir, 3);
                this.sprSword.setFrame(this.dir, 2); 
            }
        }
        // Attacking
        else if(this.attacking) {

            // Bow
            if(this.atk == AtkType.Bow) {

                this.spr.animate(6, this.dir, this.dir+1, BOW_TIME, tm);
                if(this.spr.getFrame() == this.dir+1) {

                    this.spr.setFrame(this.dir, 0);
                    this.attacking = false;
                }
            }
            // Special sword
            else if(this.atk == AtkType.SpcSword) {

                this.spr.animate(3+this.dir,3, 4, SPC_TIME, tm);
                if(this.spr.getFrame() == 4) {

                    this.spr.setFrame(this.dir, 0);
                    this.attacking = false;
                }
                this.sprSword.setFrame(this.dir, 4);
            }
            // Sword
            else {

                let t = this.spr.getFrame() == 3 ? 
                    RELEASE_ATTACK_TIME : this.ATTACK_SPEED;

                // Animate attacking
                this.spr.animate(3+ this.dir, 0, 4, t, tm);
                // Animate sword
                this.sprSword.animate(this.dir, 0, 4, t, tm);

                // Stop
                if(this.spr.getFrame() == 4) {

                    this.spr.setFrame(this.dir, 0);
                    this.attacking = false;

                    // Set spinning attack loading
                    this.spinLoad = 0.0;
                    this.loadingSpin = true;
                    // Update special hitbox
                    this.spcHbox.updateID();
                }

            }

        }
        else {

            // Not moving
            if(this.totalSpeed < DELTA) {

                this.spr.animate(this.dir,0,0,0,tm);
            }
            // Moving
            else {

                let s = 10.0 - this.totalSpeed*3;
                this.spr.animate(this.dir, 0, 3, s, tm);
            }
        }

    }


    // Check camera
    private checkCamera(cam : Camera, tm : number) {

        let p = cam.getVirtualPos();

        // Move camera if allowed
        if(cam.canMove()) {

            // Left
            if(this.target.x < 0 && this.pos.x-8 < p.x) {

                cam.move(-1, 0);
            }
            // Right
            else if(this.target.x > 0  && this.pos.x+8 > 160+p.x) {

                cam.move(1, 0);
            }
            // Top
            else if(this.target.y < 0 && this.pos.y-8 < p.y) {

                cam.move(0, -1);
            }
            // Bottom
            else if(this.target.y > 0 && this.pos.y+8 > 144+p.y -16) {

                cam.move(0, 1);
            }
        }

        if(!cam.isMoving()) {

            // Camera side collisions
            this.getWallCollision(p.x,p.y+cam.HEIGHT,cam.WIDTH, 0, tm);
            this.getWallCollision(p.x,p.y,cam.WIDTH, 1, tm);
            this.getWallCollision(p.x + cam.WIDTH,p.y,cam.HEIGHT, 2, tm);
            this.getWallCollision(p.x,p.y,cam.HEIGHT, 3, tm);
        }
    }


    // Update camera moving event
    private camMoveEvent(cam: Camera, tm: number) {

        const MOVE_AMOUNT = 16;

        let s = cam.getMoveSpeed() * (MOVE_AMOUNT/60);
        let tx = cam.getTranslation().x * s;
        let ty = cam.getTranslation().y * s;

        this.pos.x += tx * tm;
        this.pos.y += ty * tm;
    }


    // Jump
    private jump(tm : number) {

        const GRAV_DELTA = 0.1;
        const MAX_GRAV = 2.0;

        // Animate
        this.spr.setFrame(6, 3);
        
        // Disable attacking
        this.attacking = false;
        this.loadingSpin = false;
        this.spinTimer = 0.0;

        // Set speed to zero
        this.speed.x = 0;
        this.speed.y = 0;
        this.target.x = 0;
        this.target.y = 0;

        // Update gravity
        if(this.gravity < MAX_GRAV) {
            
            this.gravity += GRAV_DELTA * tm;
            if(this.gravity > MAX_GRAV)
                this.gravity = MAX_GRAV;
        }
        this.pos.y += this.gravity * tm;

        // Check if target reached
        if(this.pos.y > this.jumpTarget) {

            this.pos.y = this.jumpTarget;
            this.jumping = false;
        }
    }


    // Update special hitbox
    private updateSpcHitbox() {

        const WIDTH = 16;
        const HEIGHT = 9;
        const SPC_DMG = 2;

        let x = this.pos.x;
        let y = this.pos.y;

        let w = 0;
        let h = 0;

        // Determine damage
        let dmg = this.swordLevel == 2 ? (SPC_DMG+1) : SPC_DMG;

        switch(this.dir) {

        // Down
        case 0:
            x += -8;
            y += 8;
            w = HEIGHT;
            h = WIDTH;
            break;

        // Up
        case 1:
            y -= 8 + WIDTH;
            w = HEIGHT;
            h = WIDTH;
            break;

        // Side
        case 2:

            w = WIDTH;
            h = HEIGHT;
            y -= 1;

            if(this.flip == Flip.Horizontal) {

                x -= 8 + WIDTH;
            }   
            else {

                x += 8;
            }

            break;

        default:
            break;
        }

        // Set hitbox
        this.spcHbox.setHitbox(x, y, w, h, dmg);
    }


    // Update hitbox
    private updateHitbox() {

        const SPIN_WIDTH = 34;
        const SPIN_HEIGHT = 34;

        const SWORD_WIDTH = 24;
        const SWORD_HEIGHT = 12;
        const SWORD_MARGIN = 4;

        let swordPower = this.swordLevel == 2 ? 2 : 1;

        this.spcHbox.toggleExistence(this.loadingSpin);
        // Update special hitbox, if loading a spin attack
        if(this.loadingSpin) {

            this.updateSpcHitbox();
        }

        // If not attacking, stop here
        if(!this.attacking && this.spinTimer <= 0.0) {

            this.hbox.terminate();
            return;
        }

        // If hitbox is already in the game, do not
        // recreate it
        if(this.hbox.doesExist())   
            return;

        // Spinning
        if(this.spinTimer > 0.0) {

            this.hbox.createSelf(
                this.pos.x-SPIN_WIDTH/2, this.pos.y-SPIN_HEIGHT/2,
                SPIN_WIDTH, SPIN_HEIGHT, 
                swordPower + 1,
                this.swordLevel >= 2); // Increased damage
        }
        // Sword attack
        else if(this.attacking && this.atk == AtkType.Sword) {

            let x = 0, y = 0, w = 0, h = 0;
            // Down
            if(this.dir == 0) {

                x = this.pos.x-SWORD_WIDTH/2;
                y = this.pos.y+8 + SWORD_MARGIN;

                w = SWORD_WIDTH;
                h = SWORD_HEIGHT;
            }
            // Up
            else if(this.dir == 1) {

                x = this.pos.x-SWORD_WIDTH/2;
                y = this.pos.y-8-SWORD_HEIGHT-SWORD_MARGIN;

                w = SWORD_WIDTH;
                h = SWORD_HEIGHT;
            }
            // Left & right
            else if(this.dir == 2) {

                y = this.pos.y-8 - SWORD_WIDTH/2;
                if(this.flip == Flip.Horizontal) {

                    x = this.pos.x-8 - SWORD_HEIGHT-SWORD_MARGIN;
                }
                else {

                    x = this.pos.x+8+SWORD_MARGIN;
                }

                w = SWORD_HEIGHT;
                h = SWORD_WIDTH;
            }

            this.hbox.createSelf(x, y, w, h, swordPower,
                this.swordLevel >= 2);
        }
    }


    // Respawn
    public respawn(cam : Camera) {

        this.pos = this.checkpoint.copy();
        this.speed.x = 0;
        this.speed.y = 0;
        this.target.x = 0;
        this.target.y = 0;

        // Set camera
        let px = (this.pos.x / cam.WIDTH) | 0;
        let py = (this.pos.y / cam.HEIGHT) | 0;
        cam.setPos(px, py);

        // Set values
        this.life = this.maxLife;
        this.dying = false;
        this.attacking = false;
        this.loadingSpin = false;
        this.spinTimer = 0.0;

        this.spr.setFrame(7, 2);
        this.lieTimer = 1;

        this.deathSoundPlayed = false;
        this.hurtSoundPlayed = true;
    }


    // Update death
    private updateDeath(audio : AudioPlayer,  gameRef : Game, tm : number) {

        const DEATH_SPEED = 8;

        // Play death sound
        if(!this.deathSoundPlayed) {

            audio.stopSample();
            audio.playSample(this.sDeath, 0.50);
        
            this.deathSoundPlayed = true;
        }

        this.sprDeath.animate(0, 0, 7, DEATH_SPEED, tm);
        if(this.sprDeath.getFrame() == 7) {

            gameRef.softReset();
        }
    }


    // Update
    public update(vpad : Vpad, cam: Camera, gameRef: Game,
         arrows : Array<Arrow>, audio : AudioPlayer, 
         tm : number) {

        // Lie without moving for one frame
        if(this.lieTimer > 0) {

            this.lieTimer -= 1.0 *tm;
            this.spr.setFrame(7, 2);
            return;
        }

        // Check camera
        this.checkCamera(cam, tm);

        // Camera move event, ignore the rest (but still
        // animate!)
        if(cam.isMoving()) {

            this.camMoveEvent(cam, tm);
            this.animate(tm);
            return;
        }

        // Update death
        if(this.dying) {

            this.updateDeath(audio, gameRef, tm);
            return;
        }

        // Update hurt timer
        if(this.hurtTimer > 0.0) {

            // Play hurt sound
            if(!this.hurtSoundPlayed) {

                audio.playSample(this.sHurt, 0.40);
                this.hurtSoundPlayed = true;
            }

            this.hurtTimer -= 1.0 * tm;
        }

        // Jump
        if(this.jumping) {

            this.jump(tm);
            return;
        }

        // Control
        this.control(vpad, arrows, audio, tm);
        // Move
        this.move(tm);
        // Animate
        this.animate(tm);

        // Update hitbox
        this.updateHitbox();

        // Not swimming!
        this.swimming = false;
        // And not climbing stairs
        this.stairs = false;
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        if(dir == 0 || dir == 1)
            this.speed.y = 0;
        else
            this.speed.x = 0;
    }


    // Get collision that slows down
    // TODO: Method for "does overlay/intersect"
    public getSlowingCollision(x : number, y : number, w : number, h : number, stairs = false) {

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;
        let dw = this.dim.x/2;
        let dh = this.dim.y/2;

        if(px + dw >= x && px - dw <= x+w
        && py + dh >= y && py - dh <= y+h) {

            if(stairs)
                this.setToStairs();
            else
                this.setToSwimming();
        }
    }


    // Get jump (=ledge) collision
    public getJumpCollision(x : number, y : number, w : number, h : number, audio: AudioPlayer) {

        if(this.jumping) return;

        const JUMP = 1.25;

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;
        let dw = this.dim.x/2;
        let dh = this.dim.y/2;

        if(this.speed.y > 0.0 && px + dw >= x && px - dw <= x+w
        && py + dh >= y && py - dh <= y+h) {

            // Set jumping
            this.jumpTarget = this.pos.y+ (32 - (this.pos.y%16));
            this.gravity = -JUMP;
            this.jumping = true;

            // Play sound
            audio.playSample(this.sJump, 0.40);
        }
    }


    // Get collision that slows down
    public getHurtCollision(x : number, y : number, w : number, h : number, dmg = 1) {

        const HURT_TIME = 60.0;
        const KNOCKBACK = 3.75;

        if(this.hurtTimer > 0.0 || this.dying)
            return;

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;
        let dw = this.dim.x/2;
        let dh = this.dim.y/2;

        if(px + dw >= x && px - dw <= x+w
        && py + dh >= y && py - dh <= y+h) {

            this.life -= dmg;
            this.hurtTimer = HURT_TIME;
            this.hurtSoundPlayed = false;

            // Knockback
            let cx = this.pos.x - (x+w/2);
            let cy = this.pos.y - (y+h/2);
            let angle = Math.atan2(cy, cx);

            this.speed.x += Math.cos(angle) * KNOCKBACK;
            this.speed.y += Math.sin(angle) * KNOCKBACK;

            if(this.life <= 0) {

                this.life = 0;
                this.dying = true;
                this.sprDeath.setFrame(0, 0);
                this.hurtTimer = 0;
            }
        }
    }


    // Lock collision
    public lockCollision(x : number, y : number, w : number, h : number) : boolean {

        const MARGIN = 2;

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;
        let dw = this.dim.x/2 + MARGIN;
        let dh = this.dim.y/2 + MARGIN;

        return px + dw >= x && px - dw <= x+w
            && py + dh >= y && py - dh <= y+h;
    }


    // Draw sword
    private drawSword(g: Graphics, ass: Assets) {

        let bx = 0;
        let by = 0;

        let flip = this.flip;
        if(this.dir == 0) {

            bx = -12 -4;
            by -= 8;

            if(this.spinTimer > 0) {

                flip = Flip.Horizontal;
            }
        }
        else if(this.dir == 1) {

            bx = -7;
            by -= 32;

            if(this.spinTimer > 0) {

                flip = Flip.Horizontal;
            }
        }
        else if(this.dir == 2) {
            
            if(this.flip == Flip.Horizontal) {
                bx -= 24;
            }
            else if(this.spinTimer > 0) {

                flip = Flip.Vertical;
            }
            by = -20+1;
        }

        // Draw the sprite
        this.sprSword.draw(g, ass.getBitmap("sword"), 
                this.pos.x + bx, this.pos.y+8 +by, flip,
                this.swordLevel == 2 ? 5 : 0);
    }


    // Draw bow
    public drawBow(g : Graphics, ass: Assets) {

        let bx = 0;
        let by = 0;

        if(this.dir == 0) {

            bx = -8;
        }
        else if(this.dir == 1) {

            bx = -8;
            by = -32;
        }
        else if(this.dir == 2) {
            
            if(this.flip == Flip.Horizontal) 
                bx -= 16+8;
            else
                bx += 8;

            by -= 16;
        }

        this.sprBow.draw(g, ass.getBitmap("bow"), 
                this.pos.x + bx, this.pos.y+8+by, this.flip);
    }


    // Draw shadow
    public drawShadow(g : Graphics, ass : Assets) {

        if(this.swimming) return;

        let b = ass.getBitmap("player");

        // Determine position & size
        let x = this.pos.x-8;
        let y = this.pos.y-7;
        let frame = 0;
        if(!this.jumping) {

            frame = this.dir == 2 ? 3 : 4;
        }
        else {

            y = this.jumpTarget-7;

            let dif = this.jumpTarget - this.pos.y;
            frame = Math.max(0, 4 - ((dif / 8)|0));
        }

        // Draw shadow
        g.drawBitmapRegion(b, frame*16, 160, 16, 16,
            x,y);
    }


    // Draw death
    private drawDeath(g : Graphics, ass : Assets) {

        this.sprDeath.draw(g, ass.getBitmap("death"), this.pos.x-12, this.pos.y-12);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        const LIE_BONUS = 4;

        // Draw death
        if(this.dying) {

            this.drawDeath(g, ass);
            return;
        }

        // Determine frameskip
        let frameSkip = 0;
        // Hurt
        if(this.hurtTimer > 0.0 && Math.floor(this.hurtTimer / 4) % 2 == 0)
            frameSkip = 8;
        // Loading spin
        else if(this.loadingSpin && Math.floor(this.spinLoad / 4) % 2 == 0)
            frameSkip = 4;
        
        // Draw sprite
        let ty = this.lieTimer > 0 ? LIE_BONUS : 0;
        this.spr.draw(g, ass.getBitmap("player"), 
            this.pos.x-8, this.pos.y-8 + ty, this.flip, frameSkip);

        // Draw weapon
        if(this.attacking 
            || this.loadingSpin 
            || this.spinTimer > 0.0) {

            // Sword
            if(this.atk == AtkType.Sword || this.atk == AtkType.SpcSword)
                this.drawSword(g, ass);

            // Bow
            else if(this.atk == AtkType.Bow)
                this.drawBow(g, ass);
        }
    }


    // Update HUD data
    public updateHUDData(h : HUD) {

        h.updateData(this.life, this.maxLife,
            this.arrowCount, this.gemCount);
    }


    // Set to swimming
    public setToSwimming() {

        this.swimming = true;

        // Disable attacking
        this.attacking = false;
        this.loadingSpin = false;
        this.spinTimer = 0.0;
    }


    // Set to climbing stairs
    public setToStairs() {

        this.stairs = true;
    }


    // Get hitbox
    public getHitbox() : Hitbox {

        return this.hbox;
    }


    // Get special hitbox
    public getSpcHitbox() : Hitbox {

        return this.spcHbox;
    }


    // Disable spin attack
    public disableSpinAttack() {

        this.spcHbox.toggleExistence(false);
        this.loadingSpin = false;

        this.atk = AtkType.SpcSword;
        this.attacking = true;
    }


    // Is attacking
    public isAttacking(ignoreSpin = false) : boolean {

        return this.attacking || this.spinTimer > 0 || 
            (!ignoreSpin && this.loadingSpin);
    }


    // Add gem
    public addGem(audio: AudioPlayer) {

        if(this.gemCount < 99)
            ++ this.gemCount;

        // Play sound
        audio.playSample(this.sGem, 0.5);
        
    }


    // Add heart
    public addHeart(audio : AudioPlayer) {

        this.life += 2;
        if(this.life > this.maxLife)
            this.life = this.maxLife;

        // Play sound
        audio.playSample(this.sHealth, 0.5);
    }


    // Add an arrow
    public addArrow(audio : AudioPlayer) {

        if(this.arrowCount < this.arrowMax)
            ++ this.arrowCount; 

        // Play sound
        audio.playSample(this.sArrowPick, 0.5);
    }


    // Item effect
    private itemEffect(id : number) {

        const ACC_BONUS = 1.25;

        switch(id) {

        // Crystal shard
        case 0:
        case 1:
            ++ this.crystalCount;
            break;

        // Sword
        case 2:
            this.swordLevel = 1;
            break;

        // Bow
        case 3:
            this.bowLevel = 1;
            this.arrowCount = this.arrowMax;
            break;

        // Swimming trunks
        case 4:
            this.swimmingSkill = 1;
            break;

        // Snorkel
        case 5:
            this.swimmingSkill = 2;
            break;

        // Pink sword
        case 6:
            this.swordLevel = 2;
            break;

        // Pink arrows
        case 7:
            this.bowLevel = 2;
            this.arrowCount = this.arrowMax;
            break;
        
        // Extra heart
        case 8:
            this.maxLife += 2;
            this.life += 2;
            break;

        // Quiver
        case 9:
            this.arrowMax += 10;
            this.arrowCount += 10;
            break;

        // Key
        case 10:
            this.hasKey = true; 
            break;

        // Speed boots
        case 11:
            this.speedLevel = 1;
            this.acceleration *= ACC_BONUS;
            break;

        default:
            break;
        }
    }


    // Obtain an item
    public obtainItem(id : number, x : number, y : number, w : number, h: number, 
        dialogue: Dialogue, audio : AudioPlayer, ass : Assets) : boolean {

        let px = this.pos.x-this.center.x;
        let py = this.pos.y-this.center.y;
        let dw = this.dim.x/2;
        let dh = this.dim.y/2;

        // Make the crystal shards have the
        // same ID
        if(id == 2) id = 1;

        // Check price
        let price = this.itemInfo.prices[id-1];
        if(this.gemCount < price) {

            return;
        }

        // If collide
        if(px + dw >= x && px - dw <= x+w
        && py + dh >= y && py - dh <= y+h) {

            // Reduce gems
            this.gemCount -= price;

            // Activate dialogue
            let text = this.itemInfo.text[id-1];
            if(id == 1) {

                // Replace X with how many left, or
                // if them all, use additional text
                let left = this.crystalMax-(this.crystalCount+1);
                if(left != 0)
                    text = text.replace("X", String(left));
                else
                    text = this.itemInfo.text[1];
            }

            dialogue.activate(text, 
                id == 13 ? 1 : 0); // TODO: Change to more general

            // Item effect
            this.itemEffect(id-1);

            // Set new checkpoint
            this.checkpoint = new Vec2(x+8, y+8);

            // Pausem usic
            audio.pauseLoopedSample();
            // Play sound
            audio.playSample(ass.getSample("item"), 0.35);

            return true;
        }

        return false;
    }


    // Is loading spin
    public isLoadingSpin() : boolean {

        return this.loadingSpin;
    }


    // Is dying
    public isDying() : boolean {

        return this.dying;
    }


    // Set checkpoint
    public setCheckpoint(x : number, y : number) {

        this.checkpoint.x = x;
        this.checkpoint.y = y;
    }


    // Set crystal max
    public setCrystalMax(c : number) {

        this.crystalMax = c;
    }


    // Get remaining crystals
    public getRemainingCrystals() : number {

        return Math.max(0, this.crystalMax - this.crystalCount);
    }


    // Set direction
    public setDir(dir : number) {

        this.dir = dir;
        this.speed.x = 0;
        this.speed.y = 0;

        this.attacking = false;
        this.spinTimer = 0;
        this.loadingSpin = false;
    }
}
