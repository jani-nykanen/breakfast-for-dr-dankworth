/**
 * Audio routines
 * 
 * (c) 2018 Jani Nykänen
 */


// Audio player
class AudioPlayer {

    // Is enabled
    private enabled : boolean;
    // Volume
    private sampleVol : number;
    // Looping sample
    private loopingSample : any;


    // Constructor
    public constructor() {

        // Set defaults
        this.enabled = true;
        this.sampleVol = 1.0;
        this.loopingSample = null;
    }


    // Toggle audio
    public toggle(state : boolean) {

        this.enabled = state;
    }


    // Play a sample
    public playSample (sound : any, vol : number, loop = false) {

        if(!this.enabled) return;

        vol *= this.sampleVol;

        if(!sound.playID) {

            sound.playID = sound.play();

            sound.volume(vol, sound.playID );
            sound.loop(loop, sound.playID );
        }
        else {

            sound.stop(sound.playID);
            sound.volume(vol, sound.playID );
            sound.loop(loop, sound.playID );
            sound.play(sound.playID);
        }

        if(loop)
            this.loopingSample = sound;
    }


    // Stop a sample
    public stopSample(sound?: any) {

        if(sound == null) {

            if(this.loopingSample == null)
                return;

            sound = this.loopingSample;
        }
        
        // Remove reference to the looped sample
        if(sound == null || this.loopingSample == sound) {

            this.loopingSample = null;
        }

        if(!sound.playID) return;
        sound.stop(sound.playID);
    }


    // Pause looped sample
    public pauseLoopedSample() {

        if(this.loopingSample != null)
            this.loopingSample.pause(this.loopingSample.playID);
    }


    // Resume looped sample
    public resumeLoopedSample() {

        if(this.loopingSample != null)
            this.loopingSample.play(this.loopingSample.playID);
    }

}
