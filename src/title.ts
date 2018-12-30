/**
 * Title screen scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Title screen  class
class TitleScreen implements Scene {

    // Constants
    private readonly TIME_MAX = 60;
    private readonly TIME_MAX_2 = 300;
    private readonly TIME_WAIT = 180;

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;
    private evMan : EventMan;

    // Timer
    private timer : number;
    // Phase
    private phase : number;


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;
        this.evMan = evMan;

        // Set defaults
        this.timer = 0;
        this.phase = 0;
    }


    // On loaded
    public onLoaded() {

        // ...
    }


    // Update
    public update(tm: number) {      

        if(this.trans.isActive()) return;

        // Update timer
        this.timer += 1.0 * tm;
        if(this.phase == 0 && this.timer >= this.TIME_MAX) {

            this.timer -= this.TIME_MAX;
        }
        
        let kbcond = this.vpad.getButton("start") == State.Pressed ||
            this.vpad.getButton("fire1") == State.Pressed;

        if(this.phase == 0) {

            if(kbcond) {

                // Stop music
                this.audio.stopSample();

                // Start sound
                this.audio.playSample(this.ass.getSample("pause"), 0.50);

                // Change phase
                this.trans.activate(Fade.In, 1.0, () => {

                    this.trans.deactivate();
                    ++ this.phase;
                    this.timer = 0;

                }, 255, 255, 255);  
            }

        }
        else if(this.timer >= this.TIME_MAX_2 + this.TIME_WAIT ||
            (kbcond && this.timer >= this.TIME_MAX_2)) {

            // Change to game
            this.trans.activate(Fade.In, 1.0, () => {

                this.evMan.changeScene("game");
            }, 255, 255, 255);  
        }
    }


    // Draw
    public draw(g : Graphics)  {     

        const TEXT_Y = 96;
        const STORY_X = 8;
        const STORY_Y = 24;
        const STORY_YOFF = 0;
        const STORY_XOFF = -8;
        const VERSION_XOFF = -10;

        let b = this.ass.getBitmap("title");

        // Phase 0
        if(this.phase == 0) {

            // Draw title screen
            g.drawBitmapRegion(b, 0, 0, 160, 144, 0, 0);

            // Draw "PRESS ENTER" text
            if(!this.trans.isActive() &&
            this.timer >= this.TIME_MAX/2) {

                g.drawBitmapRegion(b, 0, 144,160, 16, 0, TEXT_Y);
            }

            // Draw version
            g.drawText(this.ass.getBitmap("font"),
                "v."+this.ass.getDocument("version").version,
                -1,-1,VERSION_XOFF, 0);

        }
        // Phase 1
        else {

            let str = this.ass.getDocument("dialogue").story;
            let t = str.length;
            if(this.timer <= this.TIME_MAX_2) {

                t = (this.timer/this.TIME_MAX_2 * t) | 0;
            }

            g.clearScreen(255, 255, 255);

            g.drawText(this.ass.getBitmap("font"), str.substr(0, t),
                STORY_X, STORY_Y, STORY_XOFF, STORY_YOFF);
        }
    }


    // Change to
    public changeTo() {      

        const MUSIC_VOL = 0.50;
        
        // Play music
        this.audio.playSample(this.ass.getSample("theme0"), MUSIC_VOL, true);
    }

    
    // Get name
    public getName() {

        return "title";
    }

}
