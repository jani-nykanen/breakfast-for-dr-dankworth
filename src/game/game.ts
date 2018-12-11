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


    // Reset game
    private reset() {

        this.objMan = new ObjectManager();
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

        // Update player
        this.objMan.update(this.vpad, tm);
    }


    // Draw
    public draw(g : Graphics)  {     

        // Clear screen
        g.clearScreen(170, 170, 170);

        // Draw player
        this.objMan.draw(g, this.ass);

        // Hello world!
        g.drawText(this.ass.getBitmap("font"), "Hello world!",
            2, 2, 0, 0,false);
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
