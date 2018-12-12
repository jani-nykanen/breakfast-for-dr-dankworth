/**
 * Animated sprite
 * 
 * (c) 2018 Jani Nykänen
 */

// Sprite class
class Sprite {

    // Size
    private width : number;
    private height : number;

    // Animation properties
    private frame : number;
    private row : number;
    private count : number;

    
    // Constructor
    public constructor(w : number, h : number) {

        // Dimensions
        this.width = w;
        this.height = h;
    
        this.frame = 0;
        this.row = 0;
        this.count = 0.0;
    }


    // Animate
    public animate(row: number, start: number, end: number, speed: number, tm: number) {

        // Nothing to animate
        if (start == end) {
    
            this.count = 0;
            this.frame = start;
            this.row = row;
            return;
        }
    
        // Swap row
        if (this.row != row) {
    
            this.count = 0;
            this.frame = end > start ? start : end;
            this.row = row;
        }
    
        // If outside the animation interval
        if (start < end && this.frame < start) {
    
            this.frame = start;
        }
        else if (end < start && this.frame < end) {
    
            this.frame = end;
        }
    
        // Animate
        this.count += 1.0 * tm;
        if (this.count > speed) {
    
            if (start < end) {
    
                if (++this.frame > end) {
    
                    this.frame = start;
                }
            }
            else {
    
                if (--this.frame < end) {
    
                    this.frame = start;
                }
            }
    
            this.count -= speed;
        }
    }


    // Draw
    public draw(g : Graphics, bmp : any, dx : number, dy : number, flip = Flip.None) {

        g.drawBitmapRegion(bmp, this.width * this.frame,
            this.height * this.row, this.width, this.height, dx, dy, flip);
    }


    // Get frame
    public getFrame() : number {

        return this.frame;
    }
}
