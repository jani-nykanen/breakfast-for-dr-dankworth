/**
 * Input manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Reference
let _inputRef : InputManager;

// Input states
enum State {
    Up = 0,
    Down = 1,
    Pressed = 2,
    Released = 3
};

// Input manager class
class InputManager {


    // Key states
    private keyStates : Array<State>;


    // Constructor
    public constructor() {

        const KEY_MAX = 256;

        // Set reference to self
        _inputRef = this;

        // Set event listeners
        window.addEventListener("keydown", function(e) {
            e.preventDefault();
            _inputRef.keyPressed(e.keyCode);
        });
        window.addEventListener("keyup", function(e) {
            e.preventDefault();
            _inputRef.keyReleased(e.keyCode);
        });

        // Create an array of states
        this.keyStates = new Array<State> (KEY_MAX);
        for(let i = 0; i < this.keyStates.length; ++ i) {

            this.keyStates[i] = State.Up;
        }
    }


    // Key released event
    public keyPressed(key : number) {

        key |= 0;

        if(key < 0 || key >= this.keyStates.length 
            || this.keyStates[key] == State.Down)
            return;

        this.keyStates[key] = State.Pressed;
    }

    
    // Key released event
    public keyReleased(key : number) {

        key |= 0;

        if(key < 0 || key >= this.keyStates.length 
            || this.keyStates[key] == State.Up)
            return;

        this.keyStates[key] = State.Released;
    }


    // Update input manager
    public update() {

        // Update key states
        for(let i = 0; i < this.keyStates.length; ++ i) {

            if(this.keyStates[i] == State.Pressed) {

                this.keyStates[i] = State.Down;
            }
            else if(this.keyStates[i] == State.Released) {

                this.keyStates[i] = State.Up;
            }
        }
    }


    // Get a key state
    public getKey (key : number) {

        key |= 0;
        if(key < 0 || key >= this.keyStates.length)
            return State.Up;

        return this.keyStates[key];
    }
}
