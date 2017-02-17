namespace ChatGame {
  export class Boot extends Phaser.State {
    create() {
      this.stage.disableVisibilityChange = true;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.refresh();
      this.game.state.start("Main");
    }
  }
}
