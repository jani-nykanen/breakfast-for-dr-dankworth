/**
 * Object manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Object manager class
class ObjectManager {

    // Constants
    private readonly ARROW_COUNT = 8;
    private readonly ITEM_COUNT = 16;

    // Player
    private player : Player;
    // Arrows
    private arrows : Array<Arrow>;
    // Enemies
    private enemies : Array<Enemy>;
    // Items
    private items : Array<Item>;
    // Teleporter
    private teleporter : Teleporter;
    // Final boss
    private fboss : Face;

    // Alternative player position
    private altPlayerPos : Vec2;
    // Alternative teleporter pos
    private altTelepPos : Vec2;


    // Constructor
    public constructor(ass : Assets) {

        // Create player
        this.player = new Player(96, 80, ass);

        // Create an array of arrows
        if(this.arrows == null)
            this.arrows = new Array<Arrow> (this.ARROW_COUNT);
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            this.arrows[i] = new Arrow();
        }
        // Create an array of items
        if(this.items == null)
            this.items = new Array<Item> (this.ITEM_COUNT);
        for(let i = 0; i < this.ITEM_COUNT; ++ i) {

            this.items[i] = new Item();
        }

        // Create an empty array for enemies
        this.enemies = new Array<Enemy> ();
    }


    // On loaded
    public onLoaded(stage : Stage) {

        this.player.setCrystalMax(stage.calculateCrystalShards());
    }

    
    // Move enemies
    private moveEnemies(cam : Camera) {

        let tr = cam.getLoopTransition();

        let e : Enemy;
        let p : Vec2;
        for(let i = 0; i < this.enemies.length; ++ i) {

            e = this.enemies[i];
            if(e.isInCamera()) {

                p = e.getPos();
                e.setPos(p.x + tr.x, p.y + tr.y);
            }
        }
    }


    // Create final boss
    private createFinalBoss(x : number, y : number) {

        this.fboss = new Face(x, y);
    }


    // Update
    public update(vpad : Vpad, cam : Camera, stage : Stage, 
        hud : HUD, dialogue: Dialogue, gameRef : Game, stageCollision : boolean,
        audio : AudioPlayer, ass : Assets,
        tm : number) {

        // Update player
        this.player.update(vpad, cam, gameRef, this.arrows, audio, tm);
        // Player collision
        if(stageCollision)
            stage.getCollision(this.player, this, dialogue,audio,ass, tm);
        // Pass data to HUD
        this.player.updateHUDData(hud);

        // If looping, move visible enemies to camera
        if(cam.isLooping()) {

            this.moveEnemies(cam);
        }

        // Do camera check for enemies
        for(let i = 0; i < this.enemies.length; ++ i) {

            this.enemies[i].cameraCheck(cam);
        }

        // Update final boss
        if(this.fboss != null) {

            this.fboss.update(cam, tm);
            this.fboss.onPlayerCollision(this.player, audio, ass, tm);

            // Enemy-to-arrow collisions
            for(let j = 0; j < this.ARROW_COUNT; ++ j) {

                this.fboss.arrowCollision(this.arrows[j], audio, ass);
            }

            // If dead
            if(this.fboss.isDying()) {

                gameRef.finalEvent1();
                return;
            }
        }

        if(!cam.isMoving()) {

            // Update enemies
            let e : Enemy;
            for(let i = 0; i < this.enemies.length; ++ i) {

                e = this.enemies[i];
                if(e.doesExist() == false || e.isInCamera() == false)
                    continue;

                e.update(cam, tm);
                e.onPlayerCollision(this.player, audio, ass, tm);

                if(stageCollision)
                    stage.getCollision(e, this, dialogue,audio,ass, tm);

                if(!e.isDying()) {

                    // Enemy-to-enemy collisions
                    for(let j = 0; j < this.enemies.length; ++ j) {

                        if(i == j) continue;

                        e.onEnemyCollision(this.enemies[j]);
                    }

                    // Enemy-to-arrow collisions
                    for(let j = 0; j < this.ARROW_COUNT; ++ j) {

                        e.arrowCollision(this.arrows[j], audio, ass);
                    }
                }
                // Create an item if needed
                else if(e.itemToBeCreated()) {

                    // Create item
                    let p = e.getPos();
                    this.createItem(p.x, p.y);
                }
            }
        }

        // Update teleporter
        if(this.teleporter != null) {

            this.teleporter.update(tm, cam);
            // Check collision with the player
            if(this.teleporter.onPlayerCollision(this.player, audio, ass)) {

                gameRef.spcEvent2();
            }
        }

        // Update items
        for(let i = 0; i < this.items.length; ++ i) {
            
            this.items[i].getPlayerCollision(this.player, audio);
            this.items[i].update(tm, cam);
        }

        // Update arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            stage.getCollision(this.arrows[i], this, dialogue, audio, ass, tm);
            this.arrows[i].update(cam, tm);
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw teleporter
        if(this.teleporter != null)
            this.teleporter.draw(g, ass);

        // Draw player shadow before other objects
        this.player.drawShadow(g, ass);

        // Draw items
        for(let i = 0; i < this.items.length; ++ i) {
            
            this.items[i].draw(g, ass);
        }

        // Draw enemies
        for(let i = 0; i < this.enemies.length; ++ i) {

            this.enemies[i].draw(g, ass);
        }

        // Draw final boss
        if(this.fboss != null) {

            this.fboss.draw(g, ass);
        }

        // Draw player
        this.player.draw(g, ass);

        // Draw arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            this.arrows[i].draw(g, ass);
        }
    }


    // Add an enemy
    public addEnemy(e : Enemy) {

        this.enemies.push(e);
    }


    // Add a teleporter
    public addTeleporter(x : number, y: number) {

        if(this.teleporter == null)
            this.teleporter = new Teleporter(x, y);

        else if(this.altTelepPos == null)
            this.altTelepPos = new Vec2(x, y);
    }


    // Set player location
    public setPlayerLocation(x : number, y : number, cam : Camera) {

        if(this.altPlayerPos == null)
            this.altPlayerPos = new Vec2(x, y);

        else {

            // Translate to the middle
            x -= 8;
            y -= 8;
        }

        // Set player position
        this.player.setPos(x, y);
        // Store checkpoint
        this.player.setCheckpoint(x, y);

        // Set camera position
        let gx = (x / cam.WIDTH) | 0;
        let gy = (y / cam.HEIGHT) | 0;

        cam.setPos(gx, gy);
    }


    // Handle map loop
    public handleMapLoop(cam: Camera, stage: Stage) {

        let jumpx = 0;
        let jumpy = 0;
        let px = cam.getTarget().x;
        let py = cam.getTarget().y;

        let jumpw = Math.ceil(stage.getMapSize().x*16 / cam.WIDTH);
        let jumph = Math.ceil(stage.getMapSize().y*16 / cam.HEIGHT);

        if(px < 0) jumpx = 1;
        else if(px >= jumpw) jumpx = -1;

        if(py < 0) jumpy = 1;
        else if(py >= jumph) jumpy = -1;

        if(jumpx == 0 && jumpy == 0)  return;

        // Update camera position
        cam.setTarget(jumpx*jumpw, jumpy*jumph, true);

        // Update player position
        let p = this.player.getPos();
        let jw = jumpx * jumpw * cam.WIDTH ;
        let jh = jumpy * jumph * cam.HEIGHT;
        this.player.setPos(p.x + jw, p.y + jh);
    }


    // Create an item
    public createItem(x : number, y : number) {

        const BASE_PROB = 0.50;
        if(Math.random() >= BASE_PROB)
            return;

        // Get the first item that does not
        // exist
        let item : Item;
        item = null;
        for(let i = 0; i < this.items.length; ++ i) {

            if(!this.items[i].doesExist()) {

                item = this.items[i];
                break;
            }
        }
        if(item == null) return;

        // ID probabilities
        let prob = [0.0, 0.75, 0.90, 1.0];

        // Determine ID
        let p = Math.random();
        let id = 0;
        for(let i = 0; i < prob.length -1; ++ i) {

            if(p >= prob[i] && p <= prob[i+1]) {

                id = i;
            }
        }

        // Create an item
        item.createSelf(x, y, id);
    }


    // Special event 1
    public spcEvent1(cam : Camera) {

        let x = this.player.getPos().x;
        let y = this.player.getPos().y;
        
        this.setPlayerLocation(x - (x%160) + 80, 
            y + cam.HEIGHT+16, 
            cam);

        // Replace enemies with flames
        let p : Vec2;
        for(let i = 0; i < this.enemies.length; ++ i) {

            p = this.enemies[i].getPos();
            this.enemies[i] = new Flame(p.x, p.y);
        }

        // Change teleport location
        this.teleporter.transform(this.altTelepPos.x, 
            this.altTelepPos.y+8);
    }


    // Special event 2
    public spcEvent2(cam : Camera, center = false) {

        let YPLUS = 40;

        // Change player location 
        if(center) {

            let px = (this.altPlayerPos.x / cam.WIDTH) | 0;
            let py = (this.altPlayerPos.y / cam.HEIGHT) | 0;

            px = px*cam.WIDTH + cam.WIDTH/2;
            py = py*cam.HEIGHT + cam.HEIGHT/2;

            this.setPlayerLocation(px, py+YPLUS, cam);
            this.player.setDir(1);

            // Create final boss
            this.createFinalBoss(px, py-YPLUS);
        }
        else {

            this.setPlayerLocation(this.altPlayerPos.x, 
                this.altPlayerPos.y, cam);    
        }
    }


    // Respawn
    public respawn(cam : Camera) {

        // Respawn player
        this.player.respawn(cam);

        // Respawn enemies
        for(let i = 0; i < this.enemies.length; ++ i) {

            this.enemies[i].respawnSelf();
            this.enemies[i].cameraCheck(cam);
        }

        // Respawn final boss
        if(this.fboss != null)
            this.fboss.respawnSelf();
    }
}
