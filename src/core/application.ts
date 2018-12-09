/**
 * Base application
 * (c) 2018 Jani Nykänen
 */

// Reference to self
let _appRef : Application;


// Application class
class Application {

    // Graphics manager
    private graph : Graphics;

    // Old time
    private oldTime : number;
    // Time sum
    private timeSum : number;


    // Constructor
    constructor() { /* ... */}


    // Initialize
    private init() {

        // Create components
        this.graph = new Graphics();

        // Set defaults
        this.oldTime = 0.0;
        this.timeSum = 0.0;

        // Set event listeners
        _appRef = this;
        window.addEventListener("resize", function() {
            _appRef.eventResize();
        })

        // Call resize event immediately
        this.eventResize();
    } 


    // Update
    private update(delta : number) {

        const COMPARED_FRAMERATE = 60;

        // Calculate time multiplier
        let tm = delta / (1.0/COMPARED_FRAMERATE)
    }


    // Draw
    private draw(g : Graphics) {

        // Clear screen
        g.clearScreen(170, 170, 170);
    }


    // Loop
    public loop(ts : number) {

        // With this we make sure the application
        // does not try to update a hundreds of frames
        // at the same time (e.g. if player has minified
        // the window)
        const MAX_UPDATES = 5;
        // We want things to run 60 frames per second, even
        // if the refresh count was lower
        const FRAME_RATE = 60.0;
    
        // Update time sum
        // TODO: Do not update time sum
        // if assets are being loaded
        let target = 1.0 / FRAME_RATE;
        let delta = ts - this.oldTime;
        this.timeSum += delta / 1000.0;

        let redraw = false;
        let updateCount = 0;
    
        // If enough time has passed, update frame
        while(this.timeSum >= target) {
            
            // Update frame
            this.update(1.0/FRAME_RATE)

            // Update time sum
            this.timeSum -= target;
            redraw = true;

            // Check if update count does not go 
            // too big
            if(++ updateCount >= MAX_UPDATES) {
    
                this.timeSum = 0.0;
                break;
            }
        }
    
        // Draw the frame
        // TODO: We might have to call this every frame?
        if(redraw) {
    
            redraw = false;

            // Draw scene
            this.draw(this.graph)
        }
    
        this.oldTime = ts;
    
        // Request  the next frame
        window.requestAnimationFrame(function(ts) {
    
            _appRef.loop(ts);
        });
    }


    // Run
    public run() {

        // Initialize
        this.init();

        // Start main loop
        window.requestAnimationFrame(function(ts) {

            _appRef.loop(ts);
        });
    }


    // Resize event
    public eventResize() {

        this.graph.centerCanvas(window.innerWidth, window.innerHeight);
    }
}
