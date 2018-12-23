/**
 * Global scene
 * 
 * (c) 2018 Jani Nykänen
 */

// Global class
class Global implements Scene {

    // Transition
    private trans : Transition;


    // Initialize
    public init() {

        // Create global components
        this.trans = new Transition();
    }


    // Update
    public update(tm: number) {      

         // Update transition
         this.trans.update(tm);
    }


    // Draw
    public draw(g : Graphics)  {     

        // Draw transition
        this.trans.draw(g);
    }

    
    // Get name
    public getName() {

        return "global";
    }


    // Get transition
    public getTransition() : Transition {

        return this.trans;
    }
}
