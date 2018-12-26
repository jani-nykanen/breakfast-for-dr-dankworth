/**
 * Audio routines
 * 
 * (c) 2018 Jani Nykänen
 */


// Audio player
class AudioPlayer {

    private enabled : boolean;

    // Volume
    private sampleVol : number;
    private musicVol : number;

    // Music ID
    private musicID : any;
    // Music sound
    private musicSound : any;
    // Volume "cache"
    private volCache : number;


    // Constructor
    public constructor() {

        // Set defaults
        this.enabled = true;
        this.sampleVol = 1.0;
        this.musicVol = 1.0;

        this.musicID = null;
        this.musicSound = null;
        this.volCache = 0.0;
    }


    // Toggle audio
    public toggle(state : boolean) {

        this.enabled = state;
        
        if(!state) {

            if(this.musicSound != null && this.musicID != null)
                this.musicSound.volume(0.0, this.musicID);
        }
        else {

            if(this.musicSound != null && this.musicID != null)
                this.musicSound.volume(this.volCache, this.musicID);
        }
    }


    // Fade in music
    public fadeInMusic(sound : any, vol : number, time : number) {

        if(this.musicID == null) {

            this.musicID = sound.play();
            this.musicSound = sound;
        }

        this.volCache = vol * this.musicVol;

        sound.volume(vol * this.musicVol, sound);
        sound.loop(true, this.musicID);
        if(!this.enabled) vol = 0.0;
        sound.fade(0.0, vol, time, this.musicID);
    }


    // Fade out music
    public fadeOutMusic(sound : any, vol : number, time: number) {

        if(sound == null)
            sound = this.musicSound;

        if(vol < 0.0) {

            vol = this.volCache;
        }

        if(this.musicID == null) {

            this.musicID = sound.play();
            this.musicSound = sound;
        }

        sound.volume(vol * this.musicVol, sound);
        sound.loop(true, this.musicID);
        if(!this.enabled) vol = 0.0;
        sound.fade(vol, 0.0, time, this.musicID);
    }


    // Pause music
    public stopMusic() {

        if(this.musicSound == null || this.musicID == null)
            return;

        this.musicSound.stop(this.musicID);
        this.musicID = null;
        this.musicSound = null;
    }


    // Pause music
    public pauseMusic () {

        if(this.musicSound == null || this.musicID == null)
            return;

        this.musicSound.pause(this.musicID);
    }


    // Resume music
    public resumeMusic () {

        this.musicSound.play(this.musicID);
    }


    // Play a sample
    public playSample (sound : any, vol : number) {

        if(!this.enabled) return;

        vol *= this.sampleVol;

        if(!sound.playID) {

            sound.playID = sound.play();

            sound.volume(vol, sound.playID );
            sound.loop(false, sound.playID );
        }
        else {

            sound.stop(sound.playID);
            sound.volume(vol, sound.playID );
            sound.loop(false, sound.playID );
            sound.play(sound.playID);
        }
    }
}
