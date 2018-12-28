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
    // Assets
    private ass : Assets;
    // Input manager
    private input : InputManager;
    // Virtual gamepad
    private vpad : Vpad;
    // Event manager
    private evMan : EventMan;
    // Audio player
    private audio : AudioPlayer;

    // Old time
    private oldTime : number;
    // Time sum
    private timeSum : number;

    // Scenes
    private scenes : Array<Scene>;
    // Current scene
    private activeScene : Scene;
    // Global scene
    private globalScene : Scene;

    // Has loaded
    private loaded : boolean;


    // Constructor
    constructor() { 

        // Initialize
        this.init();
    }


    // Initialize
    private init() {

        // Create components
        this.graph = new Graphics();
        this.scenes = new Array<Scene> ();
        this.input = new InputManager();
        this.evMan = new EventMan(this);
        this.audio = new AudioPlayer();

        // Set defaults
        this.oldTime = 0.0;
        this.timeSum = 0.0;
        this.activeScene = null;
        this.globalScene = null;
        this.loaded = false;

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

        // Update global scene
        if(this.globalScene != null &&
            this.globalScene.update != null) {

            this.globalScene.update(tm);
        }

        // Update frame
        if(this.activeScene != null &&
            this.activeScene.update != null) {

            this.activeScene.update(tm);
        }

        // Update virtual gamepad
        this.vpad.update();
        // Update input
        this.input.update();
    }


    // Draw
    private draw(g : Graphics) {

        // Draw current scene
        if(this.activeScene != null &&
            this.activeScene.draw != null) {

            this.activeScene.draw(g);
        }

        // Draw global scene
        if(this.globalScene != null &&
            this.globalScene.draw != null) {

            this.globalScene.draw(g);
        }
    }


    // Draw loading
    private drawLoading(g : Graphics) {

        const WIDTH = 64;
        const HEIGHT = 12;
    
        g.clearScreen(0, 0, 0);
  
        let t = this.ass.getPercentage();

        let csize = g.getCanvasSize();
        let x = csize[0]-WIDTH/2;
        let y = csize[1]-HEIGHT/2;
    
        // Draw outlines
        g.setColor(255, 255, 255);
        g.fillRect(x-2, y-2, WIDTH+4, HEIGHT+4);
        
        g.setColor(0, 0, 0);
        g.fillRect(x-1, y-1, WIDTH+2, HEIGHT+2);
    
        // Draw bar
        let w = (WIDTH*t) | 0;
        g.setColor(255, 255, 255);
        g.fillRect(x, y, w, HEIGHT);
    }


    // On loaded
    private onLoaded() {

        this.scenes.forEach(e => {
            
            if(typeof(e.onLoaded) == "function")
                e.onLoaded();
        });
    }    


    // Loop
    public loop(ts : number) {

        // With this we make sure the application
        // does not try to update a hundreds of frames
        // at the same time (e.g. if player has minified
        // the window)
        const MAX_UPDATES = 5;
        // Affects only the game logic, not the rendering.
        // No reason to set to 60 in a GBC-like game.
        const FRAME_RATE = 30.0;
    
        // Update time sum if assets are loaded
        let target = 1.0 / FRAME_RATE;
        let delta = ts - this.oldTime;
        if(this.ass.hasLoaded())
            this.timeSum += delta / 1000.0;

        let updateCount = 0;
    
        // If loading, draw loading & skip the rest
        if(!this.ass.hasLoaded()) {

            this.drawLoading(this.graph);
        }
        else {

            // Call "onLoad"
            if(!this.loaded) {

                this.onLoaded();
                this.loaded = true;
            }

            // If enough time has passed, update frame
            while(this.timeSum >= target) {
                
                // Update frame
                this.update(1.0/FRAME_RATE)

                // Update time sum
                this.timeSum -= target;

                // Check if update count does not go 
                // too big
                if(++ updateCount >= MAX_UPDATES) {
        
                    this.timeSum = 0.0;
                    break;
                }
            }
        
            // Draw the frame
            this.draw(this.graph)
        
            this.oldTime = ts;
        }
    
        // Request  the next frame
        window.requestAnimationFrame(function(ts) {
    
            _appRef.loop(ts);
        });
    }


    // Run
    public run() {

        // Initialize every scene
        this.scenes.forEach(e => {
            
            e.init(this.ass, this.vpad, this.evMan, this.audio);
        });

        // Start main loop
        window.requestAnimationFrame(function(ts) {

            _appRef.loop(ts);
        });
    }


    // Load assets
    public loadAssets(assetInfo : any) {

        this.ass = new Assets(assetInfo.bitmaps, assetInfo.bitmapPath,
            assetInfo.audio, assetInfo.audioPath,
            assetInfo.docs, assetInfo.docPath);
    }


    // Create a virtual gamepad
    public createVirtualGamepad(keys : Array<number>, names : Array<string>) {

        this.vpad = new Vpad(keys, names, this.input);
    }


    // Add a scene
    public addScene(scene : Scene, global=false, active=false) {

        this.scenes.push(scene);
    
        // Set to global if wanted
        if(global) {
    
            this.globalScene = scene;
        }
    
        // Set to active if wanted
        if(active || this.activeScene == null) {
    
            this.activeScene = scene;
        }
    }


    // Change scene
    public changeScene(target : string) {

        let s : Scene;

        // Find a corresponding scene
        for(let i = 0; i < this.scenes.length; ++ i) {

            if(this.scenes[i].getName() == target) {

                s = this.scenes[i];
                break;
            }
        }
        if(s == null) return;

        // If scene found, change to it
        this.activeScene = s;
        if(s.changeTo != null) {

            s.changeTo();
        }
    }


    // Resize event
    public eventResize() {

        this.graph.centerCanvas(window.innerWidth, window.innerHeight);
    }


    // Get global scene
    public getGlobalScene() : any {

        return this.globalScene;
    }
}
