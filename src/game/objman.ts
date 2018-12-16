/**
 * Object manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Object manager class
class ObjectManager {

    // Constants
    private readonly ARROW_COUNT = 8;

    // Player
    private player : Player;
    // Arrows
    private arrows : Array<Arrow>;
    // Enemies
    private enemies : Array<Enemy>;


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

        // Create an empty array for enemies
        this.enemies = new Array<Enemy> ();
    }


    // Update
    public update(vpad : Vpad, cam : Camera, stage : Stage, hud : HUD, tm : number) {

        // Update player
        this.player.update(vpad, cam, this.arrows, tm);
        // Player collision
        stage.getCollision(this.player, tm);
        // Pass data to HUD
        this.player.updateHUDData(hud);


        // Do camera check for enemies
        for(let i = 0; i < this.enemies.length; ++ i) {

            this.enemies[i].cameraCheck(cam);
        }

        if(!cam.isMoving()) {

            // Update enemies
            for(let i = 0; i < this.enemies.length; ++ i) {

                this.enemies[i].update(cam, tm);
                this.enemies[i].onPlayerCollision(this.player, tm);
                stage.getCollision(this.enemies[i], tm);

                // Enemy-to-enemy collisions
                for(let j = 0; j < this.enemies.length; ++ j) {

                    if(i == j) continue;

                    this.enemies[i].onEnemyCollision(this.enemies[j]);
                }
            }
        }

        // Update arrows
        for(let i = 0; i < this.ARROW_COUNT; ++ i) {

            stage.getCollision(this.arrows[i], tm);
            this.arrows[i].update(cam, tm);
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        // Draw player shadow before other objects
        this.player.drawShadow(g, ass);

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
    public setPlayerLocation(x : number, y : number) {

        this.player.setPos(x, y);
    }
}
