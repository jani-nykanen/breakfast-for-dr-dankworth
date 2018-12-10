/**
 * Main file
 * 
 * (c) 2018 Jani Nykänen
 */


// Assets
let assetInfo = {

    bitmapPath : "assets/bitmaps/",
    bitmaps: {

        font: "font.png",
    },

    audioPath: "assets/audio/",
    audio: {
        // ...
    },
};


// Main function
function main() {

    // Create application
    let app = new Application();

    // Add scenes
    app.addScene(new Global(), true, false);
    app.addScene(new Game(), false, true);

    // Set assets loading
    app.loadAssets(assetInfo);

    // Run
    app.run();
}
