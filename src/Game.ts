namespace ChatGame {
  export class Game extends Phaser.Game {
      constructor(socket: SocketIOClient.Socket) {
        super(768, 1024, Phaser.AUTO);
        this.resolution = window.devicePixelRatio;
        this.state.add("Boot", ChatGame.Boot);
        this.state.add("Main", ChatGame.Main.bind(this, socket));

        this.state.start("Boot");

        window.addEventListener("resize", (event) => {
          this.scale.setGameSize(768, 1024);
        });
      }
  }
}
