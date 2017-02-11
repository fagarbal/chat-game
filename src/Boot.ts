namespace ChatGame {

    export class Boot extends Phaser.State {
        create() {
            this.stage.disableVisibilityChange = true;
            this.game.state.start("Main");
        }
    }
}
