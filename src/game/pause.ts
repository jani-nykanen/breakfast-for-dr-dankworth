/** 
 * A minimal pause screen
 * 
 * (c) 2018 Jani Nykänen
 */

// Pause class
// TODO: A base menu class for this and the dialogue?
class Pause {

    // Constants
    private readonly SOUND_VOL = 0.50;

    // Is active
    private active : boolean;


    // Constructor
    public constructor() {

        this.active = false;
    }


    // Activate
    public activate(audio: AudioPlayer, ass: Assets) {

        this.active = true;

        // Play sound & suspend music
        audio.pauseLoopedSample();
        audio.playSample(ass.getSample("pause"), this.SOUND_VOL);
    }


    // Update
    public update(vpad: Vpad, audio: AudioPlayer, ass: Assets) {

        if(!this.active) return;

        if(vpad.getButton("start") == State.Pressed ||
           vpad.getButton("cancel") == State.Pressed) {

            this.active = false;

            // Play sound & resume music
            audio.playSample(ass.getSample("pause"), this.SOUND_VOL);
            audio.resumeLoopedSample();
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        const WIDTH = 72;
        const HEIGHT = 16;
        const TEXT_XOFF = -8;
        const TEXT_Y = 2;
        const CENTER_OFF = -16;

        if(!this.active) return;

        let x = 160/2-WIDTH/2;
        let y = (144+CENTER_OFF)/2-HEIGHT/2;
        let w = WIDTH;
        let h = HEIGHT;

        // Draw box
        g.setColor(255, 255, 255, 1.0);
        g.fillRect(x-2, y-2, w+4, h+4);

        g.setColor(0, 0, 0, 1.0);
        g.fillRect(x-1, y-1, w+2, h+2);

        g.setColor(255, 222, 140, 1.0);
        g.fillRect(x, y, w, h);

        // Draw text
        g.drawText(ass.getBitmap("font"), "PAUSED",
                160/2, y + TEXT_Y, 
                TEXT_XOFF, 0, true);
    }


    // Is active
    public isActive() : boolean {

        return this.active;
    }
}
