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

    // TEMP
    private pos = {x: 80, y: 72}


    // Initialize
    public init(ass : Assets, vpad: Vpad) {

        // Store references
        this.ass = ass;
        this.vpad = vpad;
    }


    // Update
    public update(tm: number) {      

        let s = this.vpad.getStick();
        this.pos.x += s.x * 2 * tm;
        this.pos.y += s.y * 2 * tm;
    }


    // Draw
    public draw(g : Graphics)  {     

        // Clear screen
        g.clearScreen(170, 170, 170);

        // Draw moving red rectangle
        g.setColor(255, 0, 0, 1.0);
        g.fillRect(this.pos.x-16,this.pos.y-16,32,32);

        // Hello world!
        g.drawText(this.ass.getBitmap("font"), "Hello world!",
            16, 16, 0, 0,false);
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
