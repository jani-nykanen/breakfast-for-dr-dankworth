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
    }


    // On loaded
    public onLoaded() {

        // (Re)set stuff
        this.reset();

        // Set map
        this.stage.setMap(this.ass);
        // Parse objects
        this.stage.parseObjects(this.objMan, this.cam);
        
    }


    // Initialize
    public init(ass : Assets, vpad: Vpad) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;

        // Create a dialogue box
        this.dialogue = new Dialogue();
    }


    // Update
    public update(tm: number) {      

        if(this.dialogue.isActive()) {

            // Update dialogue
            this.dialogue.update(this.vpad, tm);
            return;
        }
        // TEMP
        else if(this.vpad.getButton("start") == State.Pressed) {

            this.dialogue.activate("You obtained a\nDUMMY ITEM!\nIt's useless.");
            return;
        }

        let state = this.cam.isMoving();
        if(!state) {
            
            // Update stage
            this.stage.update(tm);
        }

        // Update objects
        this.objMan.update(this.vpad, this.cam, this.stage, 
            this.hud, this.dialogue, tm);

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
        g.clearScreen(170, 170, 170);

        // Use camera
        this.cam.useCamera(g);

        // Draw stage
        this.stage.draw(g, this.ass, this.cam);

        // Draw objects
        this.objMan.draw(g, this.ass);

        // Draw hud
        g.translate();
        this.hud.draw(g, this.ass);

        // Draw dialogue
        this.dialogue.draw(g, this.ass);
    }


    // Change to
    public changeTo() {      

        // ...
    }

    
    // Get name
    public getName() {

        return "game";
    }
}
