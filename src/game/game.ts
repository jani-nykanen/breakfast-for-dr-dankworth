/**
 * Game scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Game class
class Game implements Scene {

    // Reference to global objects
    private ass : Assets;
    private vpad : Vpad;
    private trans : Transition;

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

        // Update once to get proper
        // graphics for the fading
        this.update(0);

        // Set transition
        this.trans.activate(Fade.Out, 2.0, null);

    }


    // Initialize
    public init(ass : Assets, vpad: Vpad, evMan: EventMan) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
        this.trans = evMan.getGlobalScene().getTransition();

        // Create a dialogue box
        this.dialogue = new Dialogue();
        // Create pause
        this.pause = new Pause();
    }


    // Update
    public update(tm: number) {      

        if(this.trans.isActive()) return;

        // Check dialogue
        if(this.dialogue.isActive()) {

            // Update dialogue
            this.dialogue.update(this.vpad, tm, this);
            return;
        }

        // Check pause
        if(this.pause.isActive()) {

            // Update pause
            this.pause.update(this.vpad);
            return;
        }
        // Activate pause
        else if(this.vpad.getButton("start") == State.Pressed ||
               this.vpad.getButton("cancel") == State.Pressed) {

            this.pause.activate();
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
            this.trans,
            tm);

        // Update camera
        this.cam.update(tm);

        // Update hud
        this.hud.update(tm);

        if(state != this.cam.isMoving() && state == false) {

            // Update map looping
            this.objMan.handleMapLoop(this.cam, this.stage);
        }
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

        // ...
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
        }, 255, 255, 255);
        
    }


    // Special event 2
    public spcEvent2() {

        this.trans.activate(Fade.In, 1.0, () => {

            this.objMan.spcEvent2(this.cam);
            if(this.worldMode == 1) {

                this.worldMode = 2;
                this.cam.toggleMovement(false);
            }

        }, 255, 255, 255);
        
    }
}
