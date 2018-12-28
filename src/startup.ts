/**
 * Start-Up menu
 * 
 * (c) 2018 Jani Nykänen
 */

// Start up menu class
class StartUp implements Scene {

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;
    private evMan : EventMan;

    // Cursor pos
    private cursorPos : number;


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;
        this.evMan = evMan;

        // Set defaults
        this.cursorPos = 0;
    }


    // Update
    public update(tm: number) {      

        const EPSILON = 0.1;

        let delta = this.vpad.getStickDelta().y;
        let stick = this.vpad.getStick().y;

        // Check cursor position
        if(Math.abs(delta) > EPSILON && Math.abs(stick) > EPSILON &&
           delta/stick > 0 ) {

            this.cursorPos = this.cursorPos == 0 ? 1 : 0;
        }

        // Check if accepted
        if(this.vpad.getButton("start") == State.Pressed) {

            if(this.cursorPos == 1) {

                this.audio.toggle(false);
            } 
            else {

                this.audio.playSample(this.ass.getSample("pause"),0.50);
            }

            // Change to title
            this.evMan.changeScene("intro");

            // Set transition
            this.trans.activate(Fade.Out, 2.0, null);
        }
    }


    // Draw a box
    private drawBox(g: Graphics, x : number, y : number, w : number, h : number) {

        // Draw box
        g.setColor(255, 255, 255, 1.0);
        g.fillRect(x-2, y-2, w+4, h+4);

        g.setColor(0, 0, 0, 1.0);
        g.fillRect(x-1, y-1, w+2, h+2);

        g.setColor(255, 222, 140, 1.0);
        g.fillRect(x, y, w, h);
    }


    // Draw
    public draw(g : Graphics)  {     

        const WIDTH = 144;
        const HEIGHT = 60;
        const SMALL_WIDTH = 48;
        const SMALL_HEIGHT = 28;
        const BOX_Y = 16;
        const SMALL_Y = 8;
        const TEXT_XOFF = -8;
        const TEXT_YOFF = -3;
        const TEXT = "Would you like to\nenable audio?\nPress enter to\nconfirm.";

        g.clearScreen(0, 0, 0);

        let x = 160/2-WIDTH/2;
        let y = BOX_Y;
        let w = WIDTH;
        let h = HEIGHT;

        // Draw big box
        this.drawBox(g, x, y, w, h);
        // Draw text
        g.drawText(this.ass.getBitmap("font"),TEXT, x, y, TEXT_XOFF,TEXT_YOFF);

        y += HEIGHT + SMALL_Y;
        w = SMALL_WIDTH;
        h = SMALL_HEIGHT;

        // Draw small box
        this.drawBox(g, x, y, w, h);
        // Draw text
        let str = "";
        if(this.cursorPos == 0)
            str = "&YES\nNO";
        else
            str = "YES\n&NO";
        g.drawText(this.ass.getBitmap("font"),str, x, y, TEXT_XOFF,TEXT_YOFF);

    }


    // Change to
    public changeTo() {      

        // ...
    }

    
    // Get name
    public getName() {

        return "startup";
    }

}
