/**
 * A hitbox
 * 
 * (c) 2018 Jani Nykänen
 */

// Hitbox class
class Hitbox {

    // Area
    private x : number;
    private y : number;
    private w : number;
    private h : number;

    // ID
    private id : number;
    // Does exist
    private exist : boolean;


    // Constructor
    public constructor() {

        this.exist = false;
        this.id = -1;
    }

    
    // Create
    public createSelf(x : number, y : number, w : number, h : number) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        ++ this.id;

        this.exist = true;
    }


    // "Terminate"
    public terminate() {

        this.exist = false;
    }


    // Does exist
    public doesExist() : boolean {

        return this.exist;
    }


    // Get ID
    public getID() : number {

        return this.id;
    }


    // Does overlay another rectangle
    public doesOverlay(x : number, y : number, w : number, h : number) : boolean {

        return x+w >= this.x && x <= this.x+this.w &&
            y+h >= this.y && y <= this.y+this.h;
    }
}
