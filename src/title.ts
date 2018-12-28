/**
 * Title screen scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Title screen  class
class TitleScreen implements Scene {

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;
    private evMan : EventMan;


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;
        this.evMan = evMan;
    }


    // Update
    public update(tm: number) {      

        if(this.trans.isActive()) return;

        if(this.vpad.getButton("start") == State.Pressed ||
         this.vpad.getButton("fire1") == State.Pressed) {

            // Start sound
            this.audio.playSample(this.ass.getSample("pause"), 0.50);

            // Change to game
            this.trans.activate(Fade.In, 1.0, () => {

                this.evMan.changeScene("game");
            }, 255, 255, 255);  
        }
    }


    // Draw
    public draw(g : Graphics)  {     

        g.drawBitmap(this.ass.getBitmap("title"), 0, 0);
    }


    // Change to
    public changeTo() {      

        // ...
    }

    
    // Get name
    public getName() {

        return "title";
    }

}
