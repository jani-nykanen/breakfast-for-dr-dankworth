/**
 * Player object
 * 
 * (c) 2018 Jani Nykänen
 */


 // Attack type
enum AtkType {
    Sword = 0,
    Bow = 1
};


// Player class
class Player extends GameObject {

    // Constants
    private readonly ATTACK_SPEED = 5;
    private readonly SPIN_TIME = 28.0;

    // Sprite
    private spr : Sprite;
    // Sword sprite
    private sprSword : Sprite;
    // Bow sprite
    private sprBow : Sprite;
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


    // Constructor
    public constructor(x : number, y: number) {

        super(x, y);

        // Create sprites
        this.spr = new Sprite(16, 16);
        this.sprSword = new Sprite(24, 24);
        this.sprBow = new Sprite(16, 16);

        // Set defaults
        this.dir = 0;
        this.acceleration = 0.2;
        this.attacking = false;
        this.spinLoad = 0.0;
        this.loadingSpin = false;
        this.spinTimer = 0.0;
        this.atk = AtkType.Sword;
    }


    // Control
    private control(vpad : Vpad, tm : number) {

        const DELTA = 0.01;
        const SPEED = 1.0;
        const PI = Math.PI;

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
        }
        // Attack
        else if(!this.attacking && s1 == State.Pressed) {

            this.attacking = true;
            this.atk = AtkType.Sword;

            this.spr.setFrame(3 + this.dir, 0);
            this.sprSword.setFrame(this.dir,0);
        }
        // Release attack
        else if(this.attacking 
            && s1 == State.Up
            && this.spr.getFrame() == 3 
            && this.spr.getFrameTimer() >= this.ATTACK_SPEED ) {

            this.spr.setFrame(this.dir, 0);
            this.attacking = false;
        }
        // Check bow
        else if(!this.attacking 
            && !this.loadingSpin 
            && this.spinTimer <= 0.0 
            && s2 == State.Pressed) {

            this.attacking = true;
            this.atk = AtkType.Bow;

            this.spr.setFrame(6, this.dir);
            this.sprBow.setFrame(0, this.dir);
        }
        
    }


    // Animate
    private animate(tm : number) {

        const DELTA = 0.01;
        const RELEASE_ATTACK_TIME = 18;
        const SPIN_CHANGE = 3;
        const BOW_TIME = 30;

        // Update "spin loading"
        if(this.loadingSpin) {

            this.spinLoad += 1.0 * tm;
            this.sprSword.setFrame(this.dir, 4);
        }

        // If spinning
        if(this.spinTimer > 0.0) {

            this.spinTimer -= 1.0 * tm;
            // If time is out, reset row
            if(this.spinTimer <= 0.0) {

                this.dir = [0, 2, 1, 2] [this.startRow];
                if(this.startRow == 1) 
                    this.flip = Flip.Horizontal;
                else
                    this.flip = Flip.None;
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

                    this.spinLoad = 0.0;
                    this.loadingSpin = true;
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

        // Left
        if(this.pos.x-8 < p.x) {

            cam.move(-1, 0);
        }
        // Right
        else if(this.pos.x+8 > 160+p.x) {

            cam.move(1, 0);
        }
        // Top
        else if(this.pos.y-16 < p.y) {

            cam.move(0, -1);
        }
        // Bottom
        else if(this.pos.y > 144+p.y -16) {

            cam.move(0, 1);
        }
    }


    // Update camera moving event
    public camMoveEvent(cam: Camera, tm: number) {

        const MOVE_AMOUNT = 16;

        let s = cam.getMoveSpeed() * (MOVE_AMOUNT/60);
        let tx = cam.getTranslation().x * s;
        let ty = cam.getTranslation().y * s;

        this.pos.x += tx * tm;
        this.pos.y += ty * tm;
    }


    // Update
    public update(vpad : Vpad, cam: Camera, tm : number) {

        // Check camera
        this.checkCamera(cam, tm);

        // Camera move event, ignore the rest (but still
        // animate!)
        if(cam.isMoving()) {

            this.camMoveEvent(cam, tm);
            this.animate(tm);
            return;
        }

        // Control
        this.control(vpad, tm);
        // Move
        this.move(tm);
        // Animate
        this.animate(tm);

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

        this.sprSword.draw(g, ass.getBitmap("sword"), 
                this.pos.x + bx, this.pos.y+by, flip);
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
                this.pos.x + bx, this.pos.y+by, this.flip);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Determine frameskip
        let frameSkip = 0;
        if(this.loadingSpin && Math.floor(this.spinLoad / 4) % 2 == 0)
            frameSkip = 4;
        
        // Draw sprite
        this.spr.draw(g, ass.getBitmap("player"), 
            this.pos.x-8, this.pos.y-16, this.flip, frameSkip);

        // Draw weapon
        if(this.attacking 
            || this.loadingSpin 
            || this.spinTimer > 0.0) {

            // Sword
            if(this.atk == AtkType.Sword)
                this.drawSword(g, ass);

            // Bow
            else if(this.atk == AtkType.Bow)
                this.drawBow(g, ass);
        }
    }

}
