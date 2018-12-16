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


    // Reset game
    private reset() {

        // (Re)create objects
        this.objMan = new ObjectManager();
        // Create stage
        this.stage = new Stage();

        // Create HUD
        this.hud = new HUD();
        // Create camera
        this.cam = new Camera(0, 0);
    }


    // On loaded
    public onLoaded() {

        // Set map
        this.stage.setMap(this.ass);
        // Parse objects
        this.stage.parseObjects(this.objMan);
    }


    // Initialize
    public init(ass : Assets, vpad: Vpad) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;

        // (Re)set stuff
        this.reset();
    }


    // Update
    public update(tm: number) {      

        if(!this.cam.isMoving()) {
            
            // Update stage
            this.stage.update(tm);
        }

        // Update objects
        this.objMan.update(this.vpad, this.cam, this.stage, this.hud, tm);

        // Update camera
        this.cam.update(tm);

        // Update hud
        this.hud.update(tm);
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
