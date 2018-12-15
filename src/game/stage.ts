/**
 * Stage
 * 
 * (c) 2018 Jani Nykänen
 */

// Stage
class Stage {

    // Constants
    private readonly ENV_COUNT = 16;

    // Map
    private baseMap : any;
    // Map data
    private mapData : Array<number>;
    // Solid data
    private solidData : Array<number>;

    // Water position
    private waterPos : number;

    // Env.death animations
    private envAnim : Array<EnvDeath>;


    // Constructor
    public constructor() {

        // Set defaults
        this.waterPos = 0.0;

        // Create env.death animation objects
        this.envAnim = new Array<EnvDeath> (this.ENV_COUNT);
        for(let i = 0; i < this.ENV_COUNT; ++ i) {

            this.envAnim[i] = new EnvDeath();
        }
    }


    // Create env.death object
    private createEnvDeath(x : number, y : number, id : number) {

        // Get the first non-existent object
        for(let i = 0; i < this.envAnim.length; ++ i) {

            if(this.envAnim[i].doesExist() == false) {

                this.envAnim[i].createSelf(x, y, id);
                break;
            }
        }
    }


    // Get tile
    public getTile(x : number, y : number) {
        
        x |= 0;
        y |= 0;

        // Check if inside the map
        if(x < 0 || y < 0 
            || x >= this.baseMap.width || y >= this.baseMap.height) {

            return 0;
        }
        
        // Get tile
        return this.mapData[y*this.baseMap.width+x];
    }


    // Get solid data
    public getSolidData(x : number, y : number, o? : GameObject) : number {

        let t = this.getTile(x, y);
        if(t <= 0) return 0;

        // Get solid info
        let s = this.solidData[t -1];
        // If water and cannot swim, consider solid
        if( (s == 2 || s == 3) && o != null && 
            o.getSwimmingSkill() < s-1) 
            s = 1;

        return s;
    }


    // Set map
    public setMap(ass : Assets) {

        // Get base map
        this.baseMap = ass.getDocument("map");
        // Store layer 0 data to another array
        this.mapData = this.baseMap.layers[0].data.slice();
        
        // Get solid data
        this.solidData = ass.getDocument("solid").layers[0].data.slice();
    }


    // Update
    public update(tm : number) {

        const WATER_SPEED = 0.1;

        // Update water
        this.waterPos += WATER_SPEED * tm;
        this.waterPos %= 16;

        // Update environmental deaths
        for(let i = 0; i < this.envAnim.length; ++ i) {

            this.envAnim[i].update(tm);
        }
    }


    // Game object collision
    public getCollision(o : GameObject, tm : number) {

        const MARGIN = 2;
        const WATER_MARGIN = 4;
        const LEDGE_MARGIN = 8;

        if(!o.doesExist()) return;

        // Get position in grid
        let p = o.getPos();
        let sx = ((p.x / 16) | 0) - MARGIN;
        let sy = ((p.y / 16) | 0) - MARGIN;
        let ex = sx + MARGIN*2 +1;
        let ey = sy + MARGIN*2 +1;

        // Get hitbox if exist
        let hbox = null;
        if(o.getHitbox != null)
            hbox = o.getHitbox();

        // Check collisions
        let s = 0;
        for(let y = sy; y <= ey; ++ y) {

            for(let x = sx; x <= ex; ++ x) {

                s = this.getSolidData(x, y, o);
                
                if(s <= 0) continue;

                // Check plant collision
                // TODO: Own method for this?
                if(s == 6 && hbox != null && hbox.doesExist()) {

                    // If hitbox collides with the plant, destroy
                    if(hbox.doesOverlay(x*16,y*16, 16, 16)) {

                        let tile = this.getTile(x, y);
                        // Set underlying tile
                        this.mapData[y*this.baseMap.width+x] = (tile == 18 ? 1 : 49);
                        // Create death animation
                        this.createEnvDeath(x*16, y*16, tile == 18 ? 0 : 1);
                    }
                }


                // Check if solid (or plant)
                if(s == 1 || s == 6) {

                    // If the upper tile not solid
                    if(this.getSolidData(x, y-1, o) != 1) {

                        o.getWallCollision(x*16, y*16, 16, 0, tm);
                    }
                    // If the bottom tile not solid
                    if(this.getSolidData(x, y+1, o) != 1) {

                        o.getWallCollision(x*16, y*16+16, 16, 1, tm);
                    }
                    // If the left-most tile not solid
                    if(this.getSolidData(x-1, y, o) != 1) {

                        o.getWallCollision(x*16, y*16, 16, 2, tm);
                    }
                    // If the right-most tile not solid
                    if(this.getSolidData(x+1, y, o) != 1) {

                        o.getWallCollision(x*16+16, y*16, 16, 3, tm);
                    }
                }
                // Check if water or stairs
                else if(s == 2 || s == 3 || s == 4) {

                    if(o.getSlowingCollision != null) {
                        
                        o.getSlowingCollision(x*16 + WATER_MARGIN, y*16 + WATER_MARGIN, 
                            16-WATER_MARGIN*2, 16-WATER_MARGIN*2, s == 4);
                    }
                }
                // Check jump collision (=ledge)
                else if(s == 5) {

                    if(o.getJumpCollision != null) {

                        o.getJumpCollision(x*16, y*16+LEDGE_MARGIN, 16, 16-LEDGE_MARGIN);
                    }
                }
            }
        }
    }


    // Draw the map
    public drawMap(g: Graphics, ass : Assets, cam : Camera) {

        const WATER_DIV = 2;

        let bmpTiles = ass.getBitmap("tileset");
        let bmpWater = ass.getBitmap("water");

        // Get dimensions
        let w = this.baseMap.width;
        let h = this.baseMap.height;

        // TODO: To a sub-method
        // Get starting & ending position
        let cp = cam.getVirtualPos();
        let startx = ((cp.x/16) | 0) -1;
        let starty = ((cp.y/16) | 0) -1;
        let ex = startx + cam.WIDTH / 16 + 2;
        let ey = starty + cam.HEIGHT / 16 + 2;

        // Compute water pos
        let wp = (this.waterPos/WATER_DIV) | 0;
        wp *= WATER_DIV;
        wp = 16 - wp;

        // Draw tiles
        let tile = 0;
        let sx = 0;
        let sy = 0;
        let s = 0;
        for(let y = starty; y <= ey; ++ y) {

            for(let x = startx; x <= ex; ++ x) {

                tile = this.getTile(x, y);
                if(tile <= 0) continue;

                s = this.solidData[tile-1];
                // If water
                if(s == 2 || s == 3) {

                    g.drawBitmapRegion(bmpWater, wp + (s == 2 ? 0 : 32), wp, 
                        16, 16, x*16, y*16);
                }
                else {

                    // Draw tile
                    -- tile;
                    sx = tile % 16;
                    sy = (tile / 16) | 0;
                    g.drawBitmapRegion(bmpTiles, sx*16, sy*16, 16, 16, x*16, y*16);
                }
            }
        }
    } 


    // Draw
    public draw(g: Graphics, ass : Assets, cam : Camera) {

        // Draw map
        this.drawMap(g, ass, cam);

        // Draw environmental deaths
        for(let i = 0; i < this.envAnim.length; ++ i) {

            this.envAnim[i].draw(g, ass);
        }
    }
}
