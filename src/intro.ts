/**
 * Intro scene
 * 
 * (c) 2018 Jani Nykänen
 */


// Start up menu class
class Intro implements Scene {

    // Constants
    private readonly WAIT_TIME = 120;

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;
    private evMan : EventMan;

    // Phase
    private phase : number;
    // Timer
    private timer : number;


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;
        this.evMan = evMan;

        // Set defaults
        this.phase = 0;
        this.timer = 0;
    }


    // Update
    public update(tm: number) {      

        if(this.trans.isActive()) return;

        // Update timer
        let cb : () => void;
        this.timer += 1.0 * tm;
        if(this.timer >= this.WAIT_TIME) {

            if(this.phase == 0) {

                cb = () => {
                    
                    this.timer = 0;
                    ++ this.phase;
                }
            }
            else {

                cb = () => {

                    this.evMan.changeScene("title");
                }
            }
            this.trans.activate(Fade.In, 2.0, cb);
        }
    }


    // Draw
    public draw(g : Graphics)  {     

        g.clearScreen(0, 0, 0);

        // Draw intro images
        g.drawBitmapRegion(this.ass.getBitmap("intro"), 0,
            this.phase*144, 160, 144, 0, 0);
    }


    // Change to
    public changeTo() {      

        // ...
    }

    
    // Get name
    public getName() {

        return "intro";
    }

}
