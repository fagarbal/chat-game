namespace ChatGame {
  export class Game extends Phaser.Game {
      constructor(socket: SocketIOClient.Socket) {
        super(window.screen.availWidth * window.devicePixelRatio, window.screen.availHeight * window.devicePixelRatio, Phaser.CANVAS);
        this.state.add("Boot", ChatGame.Boot);
        this.state.add("Main", ChatGame.Main.bind(this, socket));

        this.state.start("Boot");

        window.addEventListener("resize", (event) => {
          this.scale.setGameSize(window.screen.availWidth * window.devicePixelRatio, window.screen.availHeight * window.devicePixelRatio);
        });
      }
  }
}
