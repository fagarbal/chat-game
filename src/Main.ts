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

      this.socket.on("createPlayers", (data: any) => {
        const players = data.players;
        this.hero.idConnection = data.id;

        for (const playerId in players) {
          if (!this.players[playerId] && this.hero.idConnection && (playerId !== this.hero.idConnection)) {
            this.players[playerId] = new Player(this.game, players[playerId].x , players[playerId].y);
          }
        }
      });

      this.socket.on("movePlayers", (players: any) => {
        for (const playerId in players) {
          if (this.players[playerId] && this.hero.idConnection && (playerId !== this.hero.idConnection)) {
            this.players[playerId].moveToPosition = {
              x: players[playerId].x,
              y: players[playerId].y
            };
            const radius = this.game.physics.arcade.moveToXY(this.players[playerId],
              players[playerId].x, players[playerId].y, 100);

            this.players[playerId].animation = this.players[playerId].getAnimationByRadius(radius);
            this.players[playerId].animations.play(this.players[playerId].animation);
          }
        }
      });
    }

    update() {
      this.hero.update();

      this.game.physics.arcade.collide(this.hero, this.platform);
    }
  }
}
