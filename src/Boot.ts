namespace ChatGame {

    export class Boot extends Phaser.State {
        create() {
            // Disable multitouch
            this.input.maxPointers = 1;

            // Pause if browser tab loses focus
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                // Desktop settings
            } else {
                // Mobile settings
            }

            this.game.state.start("Main");
        }
    }
}
