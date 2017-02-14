namespace ChatGame {
  export class Hero extends ChatGame.Player {
    socket: SocketIOClient.Socket;
    idConnection: string;
    heroColor: number;

    constructor(game: Phaser.Game, socket: SocketIOClient.Socket) {
      super(game, 640, 480);
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
        color: this.heroColor,
        nickname: this.textNickname.text
      });
    }

    sendMove() {
      this.socket.emit("move", {
        id: this.socket.id,
        x: this.moveToPosition.x,
        y: this.moveToPosition.y,
        color: this.heroColor,
        nickname: this.textNickname.text
      });
    }

    onMouseDown() {
      document.getElementById("message").blur();
      document.getElementById("nickname").blur();

      if (Phaser.Math.distance(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY,
          this.position.x, this.position.y) >= 5) {
        this.moveToPosition = {
          x: this.game.input.activePointer.worldX,
          y: this.game.input.activePointer.worldY
        };

        this.sendMove();

        const radius = this.game.physics.arcade.moveToXY(this,
          this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 100);

        this.animation = this.getAnimationByRadius(radius);
        this.animations.play(this.animation);
        this.setMaskPosition(this.animation);
      }
    }
  }
}