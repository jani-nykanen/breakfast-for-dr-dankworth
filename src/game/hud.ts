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
    // Arrows
    private arrows : number;
    // Gems
    private gems : number;


    // Constructor
    public constructor() {

        this.life = 2;
        this.maxLife = 3;
        this.arrows = 10;
        this.gems = 0;
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


    // Draw arrows
    private drawArrows(g: Graphics, b : any,  f : any) {

        const ICON_X = 64;
        const ICON_Y = 144-15;

        const TEXT_X = 76;
        const TEXT_Y = 144-13;
        const XOFF = -9;

        // Draw icon
        g.drawBitmapRegion(b, 32,16, 16, 16, ICON_X, ICON_Y);

        // Draw text
        g.drawText(f, "#" + String(this.arrows), TEXT_X, TEXT_Y, XOFF, 0);
    }


    // Draw gems
    // TODO: Merge with the above?
    private drawGems(g: Graphics, b : any,  f : any) {

        const ICON_X = 120;
        const ICON_Y = 144-15;

        const TEXT_X = 132;
        const TEXT_Y = 144-13;
        const XOFF = -9;

        // Draw icon
        g.drawBitmapRegion(b, 48,16, 16, 16, ICON_X, ICON_Y);

        // Draw text
        g.drawText(f, "#" + String(this.gems), TEXT_X, TEXT_Y, XOFF, 0);
    }


    // Draw
    public draw(g : Graphics, ass : Assets) {

        let b = ass.getBitmap("hud");
        let f = ass.getBitmap("font");

        // Draw bottom bar
        g.drawBitmapRegion(b, 0,0, 160, 16, 0, 144-16);

        // Draw hearts
        this.drawHearts(g, b);
        // Draw arrow
        this.drawArrows(g, b, f);
        // Draw gems
        this.drawGems(g, b, f);
    }
}