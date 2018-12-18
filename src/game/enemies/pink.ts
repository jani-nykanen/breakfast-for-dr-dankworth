/**
 * A pink enemy
 * 
 * (c) 2018 Jani Nykänen
 */

 // Elephant class
 // TODO: This is just a copy of elephant, so
 // AI is temporarily a copy
class Pink extends Enemy {


    // Constructor
    public constructor(x : number, y : number) {

        super(x, y);

        this.id = 3;

        this.acceleration = 0.1;

        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.power = 2;

        this.spr.setFrame(this.id+1, 0);
    }


    // Update AI
    protected updateAI(tm : number) {

        const SPEED = 1.0;
        const ANIM_SPEED = 10;
        const WAIT_SPEED = 30;

        // Animate
        let oframe = this.spr.getFrame();
        this.spr.animate(this.id+1,0,3, 
            oframe == 0 ? WAIT_SPEED : ANIM_SPEED, tm);

        // Set speeds
        if(this.spr.getFrame() == 0) {

            this.target.x = 0;
            this.target.y = 0;

        }
        else if(oframe == 0 && oframe != this.spr.getFrame()) {

            // Set speed target
            let angle = Math.random() * Math.PI*2;

            this.target.x = Math.cos(angle) * SPEED;
            this.target.y = Math.sin(angle) * SPEED;
        }
    }


    // Player event
    protected playerEvent(pl : Player, tm : number) {

        // ...
    }


    // Collision event
    protected collisionEvent(x : number, y : number, dir : number) {

        let mul = -1;
        if(this.hurtTimer > 0.0) {

            mul = 0;
        }

        if(dir == 0 || dir == 1) {

            this.speed.y *= mul;
            this.target.y *= mul;
        }
        else {

            this.speed.x *= mul;
            this.target.x *= mul;
        }
    }
}
