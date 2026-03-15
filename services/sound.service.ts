import { AudioPlayer, createAudioPlayer } from "expo-audio";

class SoundService {
    private player: AudioPlayer | null = null;

    async playMessageSound() {
        try {
            if (this.player) {
                this.player.seekTo(0);
                this.player.play();
                return;
            }

            this.player = createAudioPlayer(
                require("../assets/sounds/message.mp3")
            );
            this.player.play();
        } catch (err) {
            console.error("Sound error:", err);
        }
    }

    release() {
        if (this.player) {
            this.player.remove();
            this.player = null;
        }
    }
}

export default new SoundService();