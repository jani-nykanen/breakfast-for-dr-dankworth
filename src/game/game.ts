/**
 * Game scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Game class
class Game implements Scene {

    // Constants
    // TODO: Put into an array
    private readonly VOLUME1 = 0.30;
    private readonly VOLUME2 = 0.40;
    private readonly VOLUME3 = 0.50;

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;
    private audio : AudioPlayer;
    private evman : EventMan;

    // Game object manager
    private objMan : ObjectManager;
    // HUD
    private hud : HUD;
    // Camera
    private cam : Camera;
    // Stage
    private stage : Stage;
    // Dialogue box
    private dialogue : Dialogue;
    // Pause screen
    private pause : Pause;

    // World mode
    private worldMode : number;


    // Reset game
    private reset() {

        // (Re)create objects
        this.objMan = new ObjectManager(this.ass);
        // Create stage
        this.stage = new Stage();

        // Create HUD
        this.hud = new HUD();
        // Create camera
        this.cam = new Camera(0, 0);

        // Set defaults
        this.worldMode = 0;

    }


    // On loaded
    public onLoaded() {

        // (Re)set stuff
        this.reset();

        // Set map
        this.stage.setMap(this.ass);
        // Parse objects
        this.stage.parseObjects(this.objMan, this.cam);
        // Pass stage data to the game objects
        this.objMan.onLoaded(this.stage);

        // Update once to get proper
        // graphics for the fading
        this.update(0);
    }


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan, audio: AudioPlayer) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();
        this.audio = audio;
        this.evman = evMan;

        // Create a dialogue box
        this.dialogue = new Dialogue();
        // Create pause
        this.pause = new Pause();
    }


    // Update
    public update(tm: number) {      

        // Update shaking camera
        this.cam.updateShake(tm);

        if(this.trans.isActive()) return;

        // Check dialogue
        if(this.dialogue.isActive()) {

            // Update dialogue
            this.dialogue.update(this.vpad, tm, this, this.audio);
            return;
        }

        // Check pause
        if(this.pause.isActive()) {

            // Update pause
            this.pause.update(this.vpad, this.audio, this.ass);
            return;
        }
        // Activate pause
        else if(this.vpad.getButton("start") == State.Pressed ||
               this.vpad.getButton("cancel") == State.Pressed) {

            this.pause.activate(this.audio, this.ass);
            return;
        }

        let state = this.cam.isMoving();
        if(!state) {
            
            // Update stage
            this.stage.update(tm);
        }

        // Update objects
        this.objMan.update(this.vpad, this.cam, this.stage, 
            this.hud, this.dialogue, this, this.worldMode != 2,
            this.audio, this.ass,
            tm);

        // Update camera
        this.cam.update(tm);

        // Update hud
        this.hud.update(tm);

        if(state != this.cam.isMoving() && state == false) {

            // Update map looping
            this.objMan.handleMapLoop(this.cam, this.stage);
        }


        // TEMP!
        /*if(this.vpad.getButton("debug1") == State.Pressed) {

            this.worldMode = 1;
            this.spcEvent2();
        }
        */
    }


    // Draw
    public draw(g : Graphics)  {     

        // Clear screen
        g.clearScreen(0, 0, 0);

        // Use camera
        this.cam.useCamera(g);

        // Draw stage
        if(this.worldMode < 2) {

            this.stage.draw(g, this.ass, this.cam, this.worldMode);
        }

        // Draw objects
        this.objMan.draw(g, this.ass);

        // Draw hud
        g.translate();
        this.hud.draw(g, this.ass);

        // Draw dialogue
        this.dialogue.draw(g, this.ass);

        // Draw pause
        this.pause.draw(g, this.ass);
    }


    // Change to
    public changeTo() {      

        // Play music
        this.audio.playSample(this.ass.getSample("theme1"), this.VOLUME1, true);
    }

    
    // Get name
    public getName() {

        return "game";
    }


    // Special event 1
    public spcEvent1() {

        this.trans.activate(Fade.In, 1.0, () => {

            this.objMan.spcEvent1(this.cam);
            this.worldMode = 1;

            this.audio.playSample(this.ass.getSample("theme2"), 
                this.VOLUME2, true);
        }, 255, 255, 255);
        
    }


    // Special event 2
    public spcEvent2() {

        this.audio.stopSample();
        this.trans.activate(Fade.In, 1.0, () => {

            this.objMan.spcEvent2(this.cam, this.worldMode == 1);
            if(this.worldMode == 1) {

                this.worldMode = 2;
                this.cam.toggleMovement(false);

                this.audio.playSample(this.ass.getSample("theme3"), 
                    this.VOLUME3, true);

                // Set dialogue
                this.dialogue.activate(
                   this.ass.getDocument("dialogue").boss1
                );
            }

        }, 255, 255, 255);
        
    }


    // Final event 1
    public finalEvent1() {

        this.dialogue.activate(
            this.ass.getDocument("dialogue").boss2, 2
         ); 

        // Shake camera
        this.cam.toggleShake(true);
    }


    // Final event 2
    public finalEvent2() {

        // Fade in
        this.trans.activate(Fade.In, 0.5, () => {
            
            // Stop music
            this.audio.stopSample();

            // Change to the ending scene
            this.evman.changeScene("ending");

        }, 255, 255, 255);
    }


    // Soft reset
    public softReset() {

        this.trans.activate(Fade.In, 2.0, () => {

            this.objMan.respawn(this.cam);

            let s = ["theme1", "theme2", "theme3"] [this.worldMode];
            let vol = [this.VOLUME1, this.VOLUME2, this.VOLUME3] [this.worldMode];

            // Re-play music
            if(s != null)
                this.audio.playSample(this.ass.getSample(s), vol, true);
        },
        0,0,0);
    }

}
