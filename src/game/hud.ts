/**
 * HUD
 * 
 * (c) 2018 Jani Nykänen
 */

// HUD
class HUD {

    // Life
    private life : number;
    // Max life
    private maxLife : number;


    // Constructor
    public constructor() {

        this.life = 2;
        this.maxLife = 3;
    }


    // Update
    public update(tm : number) {

        // ...
    }


    // Draw hearts
    private drawHearts(g : Graphics, b : any) {

        const XPOS = 4;
        const XOFF = -2;
        const YOFF = -15;

        let sx = 0;
        for(let i = 0; i < this.maxLife; ++ i) {

            sx = i >= this.life ? 16 : 0;
            g.drawBitmapRegion(b, sx, 16, 16, 16, 
                XPOS+ i*(16+XOFF), 144+YOFF);
        }
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        let b = ass.getBitmap("hud");

        // Draw bottom bar
        g.drawBitmapRegion(b, 0,0, 160, 16, 0, 144-16);

        // Draw hearts
        this.drawHearts(g, b);
    }
}