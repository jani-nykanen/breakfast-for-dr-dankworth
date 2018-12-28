/**
 * Transition
 * 
 * (c) 2018 Jani Nykänen
 */

// Fade modes
enum Fade {
    In  = 0,
    Out = 1,
}

// Transition class
class Transition {

    // Max time
    private readonly MAX_TIME = 60;

    // Timer
    private timer : number;
    // Mode
    private mode : Fade;
    // Speed
    private speed : number;
    // Callback function
    private callback : () => void;
    // Is active
    private active : boolean;
    // Color
    private color = {r:0,g:0,b:0};


    // Constructor
    public constructor() {

        this.active = false;
    }


    // Activate
    public activate(mode : Fade, speed : number, callback?: () => void, r=0,g=0,b=0) {

        this.mode = mode;
        this.speed = speed;
        this.callback = callback;
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;

        this.timer = this.MAX_TIME;
        this.active = true;
    }


    // Deactivate
    public deactivate() {

        this.active = false;
        this.timer = 0;
    }


    // Update
    public update(tm : number) {

        if(!this.active) return;

        // Update timer
        this.timer -= this.speed * tm;
        if(this.timer <= 0.0) {

            if(this.mode == Fade.In) {

                this.timer += this.MAX_TIME;
                if(this.callback != null) {

                    this.callback();
                }
                this.mode = Fade.Out;
            }
            else {

                this.active = false;
            }
        }
    }


    // Draw
    public draw(g : Graphics) {

        const DIV = 8;

        if(!this.active) return;

        let w = g.getCanvasSize()[0];
        let h = g.getCanvasSize()[1];

        let alpha = this.timer / this.MAX_TIME;
        if(this.mode == Fade.In)
            alpha = 1.0 - alpha;

        // Emulate "GBC" style
        alpha = ((alpha*DIV)|0) / DIV;

        // Fill screen
        g.setColor(this.color.r, this.color.g, this.color.b, alpha);
        g.fillRect(0 ,0, w, h);
    }


    // Is active
    public isActive() : boolean {

        return this.active;
    }
}
