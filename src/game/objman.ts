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


    // Constructor
    public constructor() {

        // Create player
        this.player = new Player(96, 80);

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


    // Update
    public update(vpad : Vpad, cam : Camera, stage : Stage, 
        hud : HUD, dialogue: Dialogue, tm : number) {

        // Update player
        this.player.update(vpad, cam, this.arrows, tm);
        // Player collision
        stage.getCollision(this.player, this, dialogue, tm);
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

        if(!cam.isMoving()) {

            // Update enemies
            let e : Enemy;
            for(let i = 0; i < this.enemies.length; ++ i) {

                e = this.enemies[i];
                if(e.doesExist() == false || e.isInCamera() == false)
                    continue;

                e.update(cam, tm);
                e.onPlayerCollision(this.player, tm);
                stage.getCollision(e, this, dialogue, tm);

                if(!e.isDying()) {

                    // Enemy-to-enemy collisions
                    for(let j = 0; j < this.enemies.length; ++ j) {

                        if(i == j) continue;

                        e.onEnemyCollision(this.enemies[j]);
                    }

                    // Enemy-to-arrow collisions
                    for(let j = 0; j < this.ARROW_COUNT; ++ j) {

                        e.arrowCollision(this.arrows[j]);
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

        // Update items
        for(let i = 0; i < this.items.length; ++ i) {
            
            this.items[i].getPlayerCollision(this.player);
            this.items[i].update(tm, cam);
        }

        // Update arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            stage.getCollision(this.arrows[i], this, dialogue, tm);
            this.arrows[i].update(cam, tm);
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

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


    // Set player location
    public setPlayerLocation(x : number, y : number, cam : Camera) {

        // Set player position
        this.player.setPos(x, y);

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

        const BASE_PROB = 0.5;
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
        let prob = [0.0, 0.5, 0.7, 1.0];

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
}
