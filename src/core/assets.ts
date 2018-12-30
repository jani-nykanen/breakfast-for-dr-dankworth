/**
 * Assets loading & managing
 * 
 * (c) 2018 Jani Nykänen
 */

declare var Howl : any;

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
    // JSON documents
    private docs = {} as StringIndexed;
    // Audio
    private samples = {} as StringIndexed;


    // Constructor
    public constructor(bmpList : Array<any>, bmpPath : Array<string>,
            sampleList : Array<any>, samplePath : Array<string>,
            docList : Array<any>, docPath: Array<String>) {

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

        // Set documents to be loaded
        for(let k in docList) {

            this.loadJSON(k, docPath + "/" + docList[k]);
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
        this.samples[name] = new Howl({
            src: [url],
            onload: function() {

                _assRef.increaseLoaded();
            }
        });
    }


    // Load a JSON document
    private loadJSON(name : string, url: string) {

        ++ this.total;

        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", url, true);

        // When loaded
        xobj.onreadystatechange = function () {

            if (xobj.readyState == 4 ) {

                if(String(xobj.status) == "200") {
                
                    _assRef.addDocument(name, xobj.responseText);
                }
                _assRef.increaseLoaded();
            }
            
        };
        xobj.send(null);  
    }


    // Push a document
    public addDocument(name : string, text : string) {

        this.docs[name] = JSON.parse(text);
    }

    // Increase loaded count
    public increaseLoaded() {

        ++ this.loaded;
    }


    // Has loaded
    public hasLoaded() : boolean {

        return this.loaded >= this.total;
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


    // Get sample
    public getSample(name : string) : any {

        return this.samples[name];
    }


    // Get document
    public getDocument(name : string) : any {

        return this.docs[name];
    }
}
