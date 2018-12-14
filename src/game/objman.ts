/**
 * Object manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Object manager class
class ObjectManager {

    // Constants
    private readonly ARROW_COUNT = 8;

    // Player
    private player : Player;
    // Arrows
    private arrows : Array<Arrow>;


    // Constructor
    public constructor() {

        // Create player
        this.player = new Player(80, 72);

        // Create an array of arrows
        if(this.arrows == null)
            this.arrows = new Array<Arrow> (this.ARROW_COUNT);
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            this.arrows[i] = new Arrow();
        }
    }


    // Update
    public update(vpad : Vpad, cam : Camera, tm : number) {

        // Update player
        this.player.update(vpad, cam, this.arrows, tm);

        // Update arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            this.arrows[i].update(cam, tm);
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw player
        this.player.draw(g, ass);

        // Draw arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            this.arrows[i].draw(g, ass);
        }
    }
}
