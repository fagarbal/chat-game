namespace ChatGame {
  export class Game extends Phaser.Game {
      constructor(socket: SocketIOClient.Socket) {
        super(800, 600, Phaser.AUTO);

        this.state.add("Boot", ChatGame.Boot);
        this.state.add("Main", ChatGame.Main.bind(this, socket));

        this.state.start("Boot");
      }
  }
}
