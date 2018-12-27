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
        player: "player.png",
        sword: "sword.png",
        hud: "hud.png",
        bow: "bow.png",
        tileset: "tileset.png",
        tilesetDark: "tileset_dark.png",
        water: "water.png",
        envdeath: "envdeath.png",
        enemies: "enemies.png",
        items: "items.png",
        teleporter: "teleporter.png",
        death: "death.png",
        face: "face.png",
    },

    audioPath: "assets/audio/",
    audio: {
        theme1: "theme1.ogg",
        theme2: "theme2.ogg",
        hit: "hit.wav",
        hurt: "hurt.wav",
        sword: "sword.wav",
        death: "death.wav",
        sword2: "sword2.wav",
        arrow: "arrow.wav",
        gem: "gem.wav",
        health: "health.wav",
        arrowPick: "arrow_pick.wav",
        break: "break.wav",
        item: "item.wav",
        teleport: "teleport.wav",
        unlock: "unlock.wav",
        pause: "pause.wav",
    },

    docPath: "assets/",
    docs: {
        map: "tilemaps/map.json",
        solid: "tilemaps/solid.json",
        itemInfo: "iteminfo.json",
    }
};


// Gamepad
let gamePad = {

    keys: [
        90,
        88,
        13,
        16,
        27,
        112,
    ],
    names: [
        "fire1",
        "fire2",
        "start",
        "select",
        "cancel",
        "debug1",
    ]

}


// Main function
function main() {

    // Create application
    let app = new Application();

    // Add scenes
    app.addScene(new Global(), true, false);
    app.addScene(new Game(), false, true);

    // Create gamepad
    app.createVirtualGamepad(gamePad.keys, gamePad.names);
    // Set assets loading
    app.loadAssets(assetInfo);

    // Run
    app.run();
}
