/**
 * A graphics manager
 * 
 * (c) 2018 Jani Nykänen
 */

// Graphics class
class Graphics {

    // Canvas & context
    private canvas : any;
    private ctx : any;


    // Constructor
    constructor() {

        // Get canvas & context
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }


    // Get color string
    private getColorString(r :  number, g :  number, b :  number, a = 1.0) {

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
}
