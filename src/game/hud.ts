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


    // Special int to str conversion
    // (adds 0 in the beginning if too short)
    private spcIntToStr(num : number, dec = 10) : string {

        let s = String(num);
        if(num < dec)
            s = "0" + s;

        return s;
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

        // Draw "integral" hearts
        let intg = Math.floor(this.life/2.0);
        for(let i = 0; i < Math.floor(this.maxLife/2.0); ++ i) {

            sx = i >= intg ? 16 : 0;
            g.drawBitmapRegion(b, sx, 16, 16, 16, 
                XPOS+ i*(16+XOFF), 144+YOFF);
        }
        
        // Draw half hearts, if any
        if(intg*2 < this.life) {

            g.drawBitmapRegion(b, 0, 16, 8, 16, 
                XPOS+ intg*(16+XOFF), 144+YOFF);
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
        g.drawText(f, "#" + this.spcIntToStr(this.arrows), 
            TEXT_X, TEXT_Y, XOFF, 0);
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
        g.drawText(f, "#" + this.spcIntToStr(this.gems), 
            TEXT_X, TEXT_Y, XOFF, 0);
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


    // Update data
    public updateData(life : number, maxLife : number, 
        arrows: number, gems: number) {

        this.life = life;
        this.maxLife = maxLife;
        this.arrows = arrows;
        this.gems = gems;
    }
}