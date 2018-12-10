/**
 * Assets loading & managing
 * 
 * (c) 2018 Jani Nykänen
 */

// Reference to assets
let _assRef : Assets;

// String-indexed stuff
interface StringIndexed {

    [index: string] : any
}

// Assets class
class Assets {

    // How many files loaded
    private loaded : number;
    // File total
    private total : number;
    // Bitmaps
    private bitmaps = {} as StringIndexed;
    // Audio
    private samples = {} as StringIndexed;


    // Constructor
    public constructor(bmpList : Array<any>, bmpPath : Array<string>,
            sampleList : Array<any>, samplePath : Array<string>) {

        // Set reference to self
        _assRef = this;

        // Set defaults
        this.loaded = 0;
        this.total = 0;

        // Set bitmaps to be loaded
        for(let k in bmpList) {

            this.loadBitmap(k, bmpPath + "/" + bmpList[k]);
        }

        // Set samples to be loaded
        for(let k in sampleList) {

            this.loadSample(k, samplePath + "/" + sampleList[k]);
        }
    }


    // Load a bitmap
    private loadBitmap (name : string, url : string) {

        ++ this.total;

        let image = new Image();
        image.onload = function() {

            _assRef.increaseLoaded();
        }
        image.src = url;
        this.bitmaps[name] = image;
    }


    // Load a sample (Current dummy)
    private loadSample(name : string, url: string) {

        ++ this.total;

        // "Load" sample
        this.increaseLoaded();
        this.samples[name] = null;
    }


    // Increase loaded count
    public increaseLoaded() {

        ++ this.loaded;
    }


    // Has loaded
    public hasLoaded() : boolean {

        return this.total == 0 || this.loaded >= this.total;
    }


    // Get the amount of loaded assets in "percentage" 
    // (actually in range [0,1])
    public getPercentage() : number {

        if(this.total == 0) return 0.0;
        return this.loaded / this.total;
    }


    // Get bitmap
    public getBitmap(name : string) : any {

        return this.bitmaps[name];
    }
}
