/**
 * A dialogue box
 * 
 * (c) 2018 Jani Nykänen
 */

class Dialogue {

    // Constants
    private readonly APPEAR_TIME = 30;

    // Is active
    private active : boolean;
    // Text
    private text : string;
    // Timer
    private timer : number;
    // Special event ID
    private spcEvent : number;


    // Constructor
    public constructor() {

        this.active = false;
        this.text = "";
    }


    // Activate
    public activate(text : string, spcEvent = 0) {

        this.text = text;
        this.active = true;
        this.timer = this.APPEAR_TIME;
        this.spcEvent = spcEvent;
    }


    // Trigger special event
    private triggerSpcEvent(gameRef : Game) {

        switch(this.spcEvent) {

        case 1:
            gameRef.spcEvent1();
            break;

        default:
            break;
        }
    }


    // Update
    public update(vpad : Vpad, tm : number, gameRef : Game, audio : AudioPlayer) {

        if(!this.active) return;

        // Update time
        if(this.timer > 0.0) {

            this.timer -= 1.0 * tm;
            return;
        }

        // Check enter press
        if(vpad.getButton("start") == State.Pressed) {

            // Trigger special event
            this.triggerSpcEvent(gameRef);
            // Deactivate
            this.active = false;

            // Resume music
            audio.resumeLoopedSample();
        }
    } 


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Yes, fixed size. Shut up.
        const WIDTH = 128;
        const HEIGHT = 48;
        const YOFF = 8;
        const CENTER_X = 80;
        const CENTER_Y = YOFF + HEIGHT/2;
        const DELTA = 0.01;

        const TEXT_X = -2;
        const TEXT_Y = 0;

        const TEXT_XOFF = -8;
        const TEXT_YOFF = -4;

        if(!this.active || this.timer >= this.APPEAR_TIME-DELTA) return;

        // Compute scale
        let s = 1.0 - Math.max(0, this.timer) / this.APPEAR_TIME;
        let w = WIDTH * s;
        let h = HEIGHT * s;
        let x = CENTER_X - w/2;
        let y = CENTER_Y - h/2;

        // Reset coordinates
        g.translate();

        // Draw box
        g.setColor(255, 255, 255, 1.0);
        g.fillRect(x-2, y-2, w+4, h+4);

        g.setColor(0, 0, 0, 1.0);
        g.fillRect(x-1, y-1, w+2, h+2);

        g.setColor(255, 222, 140, 1.0);
        g.fillRect(x, y, w, h);

        if(this.timer <= 0.0) {

            // Draw text
            g.drawText(ass.getBitmap("font"), this.text,
                80-WIDTH/2+TEXT_X, YOFF + TEXT_Y, 
                TEXT_XOFF, TEXT_YOFF);
        }
    }


    // Is active
    public isActive() : boolean {

        return this.active;
    }
}
