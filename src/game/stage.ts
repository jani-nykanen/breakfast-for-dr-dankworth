/**
 * Stage
 * 
 * (c) 2018 Jani Nykänen
 */

// Stage
class Stage {

    // Map
    private baseMap : any;
    // Map data
    private mapData : Array<number>;

    // Water position
    private waterPos : number;


    // Constructor
    public constructor() {

        // Set defaults
        this.waterPos = 0.0;
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


    // Set map
    public setMap(ass : Assets) {

        // Get base map
        this.baseMap = ass.getDocument("map");
        // Store layer 0 data to another array
        this.mapData = this.baseMap.layers[0].data.slice();
    }


    // Update
    public update(tm : number) {

        const WATER_SPEED = 0.1;

        this.waterPos += WATER_SPEED * tm;
        this.waterPos %= 16;
    }


    // Draw
    public draw(g: Graphics, ass : Assets, cam : Camera) {

        const WATER_DIV = 2;

        let bmpTiles = ass.getBitmap("tileset");
        let bmpWater = ass.getBitmap("water");

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
        for(let y = starty; y <= ey; ++ y) {

            for(let x = startx; x <= ex; ++ x) {

                tile = this.getTile(x, y);
                if(tile <= 0) continue;

                // If water
                if(tile == 26) {

                    g.drawBitmapRegion(bmpWater, wp, wp, 16, 16, x*16, y*16);
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
}
