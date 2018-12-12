/**
 * A graphics manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Flipping flags
enum Flip {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Both = 3
};

// Graphics class
class Graphics {

    // Canvas & context
    private canvas : any;
    private ctx : any;

    // Color for certain stuff, like
    // filling rectangles
    private color = {r: 255, g: 255, b: 255, a: 1.0};

    // Translation
    private tr : Vec2;


    // Constructor
    constructor() {

        // Get canvas & context
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        // Set defaults
        this.tr = new Vec2(0, 0);
    }


    // Get color string
    private getColorString(r :  number, g :  number, b :  number, a = 1.0) : string {

        if (a == null) a = 1.0;
    
        return "rgba("
            + String(r | 0) + ","
            + String(g | 0) + ","
            + String(b | 0) + ","
            + String(a) + ")";
    }


    // Clear screen
    public clearScreen(r : number, g : number, b : number) {

        let c = this.ctx;
    
        c.fillStyle = this.getColorString(r, g, b);
        c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


    // Set color
    public setColor(r : number, g : number, b : number, a = 0.0) {

        r |= 0;
        g |= 0;
        b |= 0;

        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        this.color.a = a;

        // Determine color string
        this.ctx.fillStyle = this.getColorString(r, g, b, a);
    }


    // Draw a filled rectangle
    public fillRect(x : number, y : number, w : number, h : number) {

        x |= 0;
        y |= 0;
        w |= 0;
        h |= 0;

        // Draw a filled rectangle
        let c = this.ctx;
        c.fillRect(x, y, w, h);
    }


    // Draw a bitmap
    public drawBitmap (bmp : any, x : number, y : number, flip = Flip.None) {

        this.drawBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, x, y, flip);
    }


    // Draw a scaled bitmap
    public drawScaledBitmap (bmp : any, 
        dx : number, dy : number, dw : number, dh : number,  flip = Flip.None) {

        this.drawScaledBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, dx, dy, dw, dh, flip);
    }


    // Draw a bitmap region
    public drawBitmapRegion (bmp : any, sx : number, sy: number, sw: number, sh: number, 
            dx: number, dy: number, flip = Flip.None) {

        this.drawScaledBitmapRegion(bmp, sx, sy, sw, sh, dx, dy, sw, sh, flip);
    }

    // Draw a scaled bitmap region
    public drawScaledBitmapRegion (bmp : any, sx : number, sy: number, sw: number, sh: number, 
        dx: number, dy: number, dw: number, dh: number, flip = Flip.None) {

        if(dw <= 0 || dh <= 0 || sw <= 0 || sh <= 0) return;

        sw = sw | 0;
        sh = sh | 0;

        dw = dw | 0;
        dh = dh | 0;

        flip = flip | Flip.None;
        let c = this.ctx;

        // Translate
        dx += this.tr.x;
        dy += this.tr.y;

        // If flipping, save the current transformations
        // state
        if (flip != Flip.None) {
            c.save();
        }

        // Flip horizontally
        if ((flip & Flip.Horizontal) != 0) {

            c.translate(dw, 0);
            c.scale(-1, 1);
            dx *= -1;
        }
        // Flip vertically
        if ((flip & Flip.Vertical) != 0) {

            c.translate(0, dh);
            c.scale(1, -1);
            dy *= -1;
        }

        c.drawImage(bmp, sx | 0, sy | 0, sw, sh, dx | 0, dy | 0, dw | 0, dh | 0);

        // ... and restore the old
        if (flip != Flip.None) {

            c.restore();
        }
    }


    // Get canvas size
    public getCanvasSize() : [number, number] {

        return [this.canvas.width, this.canvas.height];
    }


    // Draw text
    public drawText(bmp : any, text : string, dx : number, dy : number,
         xoff: number, yoff: number, center = false) {

        let cw = bmp.width / 16;
        let ch = cw;
        let len = text.length;
        let x = dx;
        let y = dy;
        let c = 0;

        let sx = 0;
        let sy = 0;

        // Center the text
        if (center) {

            dx -= ((len) / 2.0 * (cw + xoff));
            x = dx;
        }

        // Draw every character
        for (let i = 0; i < len; ++i) {

            c = text.charCodeAt(i);
            // Newline
            if (c == "\n".charCodeAt(0)) {

                x = dx;
                y += yoff + ch;
                continue;
            }

            sx = c % 16;
            sy = (c / 16) | 0;

            this.drawBitmapRegion(bmp, sx * cw, sy * ch, cw, ch,
                x, y,
                Flip.None);

            x += cw + xoff;
        }
    }


    // Center canvas
    public centerCanvas(w : number, h : number) {

        let ratio = this.canvas.width / this.canvas.height;
        let winRatio = w / h;
    
        // If horizontal
        let width, height, x, y;
        if (winRatio >= ratio) {
    
            width = h * ratio;
            height = h;
    
            x = w / 2 - width / 2;
            y = 0;
        }
        // If vertical
        else {
    
            height = w / ratio;
            width = w;
    
            x = 0;
            y = h / 2 - height / 2;
        }
    
        this.canvas.style.height = String(height | 0) + "px";
        this.canvas.style.width = String(width | 0) + "px";
        this.canvas.style.top = String(y | 0) + "px";
        this.canvas.style.left = String(x | 0) + "px";
    }


    // Translate
    public translate(x = 0, y = 0) {

        this.tr.x = x;
        this.tr.y = y;
    }
}
