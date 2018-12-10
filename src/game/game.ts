/**
 * Game scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Game class
class Game implements Scene {

    // Reference to global objects
    private ass : Assets;

    // TEMP
    private pos : number;


    // Initialize
    public init(ass : Assets) {

        // Store references
        this.ass = ass;

        // ...
        this.pos = 0.0;
    }


    // Update
    public update(tm: number) {      

         // ...
         this.pos += 2.0 * tm;
         this.pos %= 160;
    }


    // Draw
    public draw(g : Graphics)  {     

        // Clear screen
        g.clearScreen(170, 170, 170);

        // Draw moving red rectangle
        g.setColor(255, 0, 0, 1.0);
        g.fillRect(this.pos,16,64,48);
        g.fillRect(this.pos - 160,16,64,48);

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
