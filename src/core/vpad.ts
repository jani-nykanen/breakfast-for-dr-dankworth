/**
 * A virtual gamepad
 * 
 * (c) 2018 Jani Nykänen
 */

// Button type
class VpadButton {
    public key : number;
    public name : string;
    constructor(key : number, name: string) {
        this.key = key | 0;
        this.name = name;
    }
}


// Vpad class
class Vpad {

    // Reference to input
    private input : InputManager;

    // "Analogue" stick
    private stick = { x: 0, y: 0 };
    // Old stick state
    private oldStick = { x: 0, y: 0 };
    // Stick delta
    private delta = { x: 0, y: 0 };
    // Stick "length"
    private len : number;

    // Buttons
    private buttons : Array<VpadButton>;


    // Constructor
    public constructor(keys : Array<number>, names : Array<string>, 
        input : InputManager) {

        this.input = input;
        this.len = 0;

        // Check minimum size
        let size = Math.min(keys.length, names.length) | 0;

        // Create button array
        this.buttons = new Array<VpadButton> (size);
        for(let i = 0; i < size; ++ i) {

            this.buttons[i] = new VpadButton(keys[i], names[i]);
        }
    }


    // Update
    public update() {

        const DELTA = 0.90;

        // Update stick
        this.oldStick.x = this.stick.x;
        this.oldStick.y = this.stick.y;

        this.stick.x = 0.0;
        this.stick.y = 0.0;

        // Left
        if(this.input.getKey(37) == State.Down) {

            this.stick.x = -1.0;
        }
        // Right
        else if(this.input.getKey(39) == State.Down) {

            this.stick.x = 1.0;
        }

        // Up
        if(this.input.getKey(38) == State.Down) {

            this.stick.y = -1.0;
        }
        // Down
        else if(this.input.getKey(40) == State.Down) {

            this.stick.y = 1.0;
        }

        // Calculate length & restrict to a unit sphere (plus 0)
        this.len = Math.sqrt(this.stick.x*this.stick.x+ this.stick.y*this.stick.y);
        if(this.len > DELTA) {
        
            this.stick.x /= this.len;
            this.stick.y /= this.len;
        }
        
        // Calculate delta
        this.delta.x = this.stick.x - this.oldStick.x;
        this.delta.y = this.stick.y - this.oldStick.y;
    }


    // Get a button
    public getButton(name : string) : State {

        // Find a corresponding button
        let e : VpadButton;
        for(let i = 0; i < this.buttons.length; ++ i) {
            
            e = this.buttons[i];
            if(e.name == name) {

                return this.input.getKey(e.key);
            }
        };
        return State.Up;
    }


    // Get stick
    public getStick() : {x: number, y: number} {

        return this.stick;
    }


    // Get stick delta
    public getStickDelta() : {x: number, y: number} {

        return this.delta;
    }


    // Get stick distance
    public getStickDistance() : number {

        return this.len;
    }
}
