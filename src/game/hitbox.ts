/**
 * A hitbox
 * 
 * (c) 2018 Jani Nykänen
 */

// Hit ID
let _hitID = -1;


// Hitbox class
class Hitbox {

    // Area
    private x : number;
    private y : number;
    private w : number;
    private h : number;

    // Damange
    private dmg : number;
    // ID
    private id : number;
    // Does exist
    private exist : boolean;
    // Is boosted
    private boosted : boolean;


    // Constructor
    public constructor() {

        this.exist = false;
        this.id = -1;
        this.dmg = 1;
    }

    
    // Create
    public createSelf(x : number, y : number, w : number, h : number, dmg = 1, boosted = false) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.dmg = dmg;

        ++ _hitID;
        this.id = _hitID;
        this.boosted = boosted;
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


    // Toggle existence
    public toggleExistence(state : boolean) {

        this.exist = state;
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


    // Get damage
    public getDamage() : number {

        return this.dmg;
    }


    // Set hitbox
    public setHitbox(x : number, y : number, w : number, h : number, dmg = 1) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.dmg = dmg;
    }


    // Set new ID
    public updateID(id = -1) {

        if(id < 0) {

            ++ _hitID;
            this.id = _hitID; 
        }
        else {

            this.id = id;
        }
    }


    // Is boosted
    public isBoosted() : boolean {

        return this.boosted;
    }
}
