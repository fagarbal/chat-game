namespace ChatGame {
  export class Main extends Phaser.State {
    hero: ChatGame.Hero;
    platform: Phaser.Sprite;
    mousePosition: any;
    animation: string;
    players: any;

    constructor(private socket: SocketIOClient.Socket) {
      super();
      this.socket = socket;
    }

    preload() {
      this.game.load.spritesheet("sprite", "img/animation.png", 64, 96, 72);
      this.game.load.image("platform", "img/hero.png");
    }

    create() {
      this.hero = new Hero(this.game, this.socket);

      this.platform = this.game.add.sprite(this.game.world.centerX + 100, this.game.world.centerY, "platform");
      this.platform.anchor.set(0.5, 0.5);

      this.game.physics.arcade.enable(this.platform);

      this.platform.body.enableBody = true;
      this.platform.body.immovable = true;

      this.game.input.mouse.capture = true;
      this.players = {};

      this.socket.on("createPlayers", (players: any) => {
        for (const playerId in players) {
          if (!this.players[playerId] && this.socket.id !== playerId) {
            this.players[playerId] = new Player(this.game, players[playerId].x , players[playerId].y);
            this.players[playerId].tint = players[playerId].color;
          }
        }
      });

      this.socket.on("deletePlayer", (player: any) => {
        if (this.players[player.id]) {
          this.players[player.id].destroy();
          delete this.players[player.id];
        }
      });

      this.socket.on("movePlayer", (player: any) => {
        this.players[player.id].moveToPosition = {
          x: player.x,
          y: player.y
        };
        const radius = this.game.physics.arcade.moveToXY(this.players[player.id],
          player.x, player.y, 100);

        this.players[player.id].animation = this.players[player.id].getAnimationByRadius(radius);
        this.players[player.id].animations.play(this.players[player.id].animation);
      });
    }

    update() {
      this.hero.update();

      this.game.physics.arcade.collide(this.hero, this.platform);
    }
  }
}
