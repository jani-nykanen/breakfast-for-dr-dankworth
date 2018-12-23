/**
 * An event manager, passed to the scenes
 * 
 * (c) 2018 Jani Nykänen
 */

// Event manager class
class EventMan {

    // Reference to the application
    private appRef : Application;


    // Constructor
    public constructor(appRef : Application) {

        this.appRef = appRef;
    }


    // Get global scene
    public getGlobalScene() : any {

        return this.appRef.getGlobalScene();
    }

}
