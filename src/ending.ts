/**
 * Ending scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Ending class
class Ending implements Scene {

    // Constants
    private readonly PHASE_LENGTH = 120;
    private readonly MAX_PHASE = 2;

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;

    // Player sprite
    private sprPl : Sprite;
    // Phase
    private phase : number;
    // Phase timer
    private timer : number;


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;

        // Create components
        this.sprPl = new Sprite(64, 32);

        // Set defaults
        this.timer = 0;
        this.phase = 0;
    }


    // Update
    public update(tm: number) {      

        const WAKE_SPEED = 20;
        const TALK_SPEED = 15;

        if(this.trans.isActive()) return;

        // Update timer
        if(this.phase < this.MAX_PHASE) {

            this.timer += 1.0 * tm;
            if(this.timer >= this.PHASE_LENGTH) {

                this.timer -= this.PHASE_LENGTH;
                ++ this.phase;
            }
        }

        // Events
        if(this.phase == 0) {

            this.sprPl.animate(0, 0, 1, WAKE_SPEED, tm);
        }
        else if(this.phase == 1) {

            this.sprPl.animate(1, 0, 1, TALK_SPEED, tm);
        }
        else {

            this.sprPl.setFrame(1, 0);
        }
    }


    // Draw
    public draw(g : Graphics)  {     

        const PLAYER_Y = 16;
        const FAR_MUSH_X = 16;
        const FAR_MUSH_Y = 4;
        const NEAR_MUSH_X = -52;
        const NEAR_MUSH_Y = 20;

        const XOFF = -8;
        const TEXT_Y = 32;

        let b = this.ass.getBitmap("ending");

        // Clear screen
        g.clearScreen(255, 255, 255);
        // Reset camera
        g.translate();

        let x = g.getCanvasSize()[0] /2;
        let y = g.getCanvasSize()[1] /2;

        // Draw far mushroom
        g.drawBitmapRegion(b, 32, 64, 32, 32, x+FAR_MUSH_X,y+FAR_MUSH_Y);

        // Draw player
        this.sprPl.draw(g, b,
            x - this.sprPl.getWidth()/2, 
            y + PLAYER_Y);

        // Draw near mushroom
        g.drawBitmapRegion(b, 0, 64, 32, 32, x+NEAR_MUSH_X,y+NEAR_MUSH_Y);

        // Draw the end
        let str = "THE END.";
        let l = (str.length * (16+XOFF));
        let tx = x - l/2;
        let ty = TEXT_Y;

        if(this.phase >= 1) {

            let t = str.length;
            if(this.phase == 1) {

                t = (str.length * (this.timer/this.PHASE_LENGTH))|0;
            }

            g.drawText(this.ass.getBitmap("font"), str.substr(0, t),
                tx, ty, XOFF, 0, false);
        }

    }


    // Change to
    public changeTo() {      

        // ...
    }

    
    // Get name
    public getName() {

        return "ending";
    }

}
