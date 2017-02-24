namespace ChatGame {
  export class Boot extends Phaser.State {
    create() {
      this.stage.disableVisibilityChange = false;
      this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.game.scale.refresh();
      this.game.state.start("Main");
    }
  }
}
