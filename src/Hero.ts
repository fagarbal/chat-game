namespace ChatGame {
  export class Hero extends ChatGame.Player {
    socket: SocketIOClient.Socket;
    idConnection: string;
    heroColor: number;

    constructor(game: Phaser.Game, socket: SocketIOClient.Socket) {
      super(game, game.world.centerX, game.world.centerY);
      this.socket = socket;

      this.game.input.onDown.add(this.onMouseDown, this);

      this.heroColor = this.tint;

      this.setConnection();
    }

    setConnection() {
      this.socket.emit("newPlayer", {
        id: this.socket.id,
        x: this.body.position.x,
        y: this.body.position.y,
        color: this.heroColor
      });
    }

    sendMove() {
      this.socket.emit("move", {
        id: this.socket.id,
        x: this.moveToPosition.x,
        y: this.moveToPosition.y,
        color: this.heroColor
      });
    }

    onMouseDown() {
      if (Phaser.Math.distance(this.game.input.activePointer.x, this.game.input.activePointer.y,
          this.position.x, this.position.y) >= 5) {
        this.moveToPosition = {
          x: this.game.input.activePointer.x,
          y: this.game.input.activePointer.y
        };

        this.sendMove();

        const radius = this.game.physics.arcade.moveToXY(this,
          this.game.input.activePointer.x, this.game.input.activePointer.y, 100);

        this.animation = this.getAnimationByRadius(radius);
        this.animations.play(this.animation);
        this.setMaskPosition(this.animation);
      }
    }
  }
}