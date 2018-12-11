/**
 * Object manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Object manager class
class ObjectManager {

    // Player
    private player : Player;


    // Constructor
    public constructor() {

        // Create player
        this.player = new Player(80, 72);
    }


    // Update
    public update(vpad : Vpad, tm : number) {

        // Update player
        this.player.update(vpad, tm);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw player
        this.player.draw(g, ass);
    }
}
