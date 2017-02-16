namespace ChatGame {
  export class Game extends Phaser.Game {
      constructor(socket: SocketIOClient.Socket) {
        super(window.innerWidth, window.innerHeight, Phaser.AUTO);
        this.state.add("Boot", ChatGame.Boot);
        this.state.add("Main", ChatGame.Main.bind(this, socket));

        this.state.start("Boot");

        window.addEventListener("resize", (event) => {
          this.scale.setGameSize(window.innerWidth, window.innerHeight);
        });
      }
  }
}
