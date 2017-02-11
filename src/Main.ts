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
      this.game.load.spritesheet("sprite", "img/player.png", 64, 96, 72);
    }

    create() {
      this.hero = new Hero(this.game, this.socket);

      this.game.input.mouse.capture = true;
      this.players = {};

      this.setEvents();
    }

    setEvents() {
      this.socket.on("createPlayers", (players: any) => {
        for (const playerId in players) {
          if (!this.players[playerId] && this.socket.id !== playerId) {
            this.players[playerId] = new Player(this.game, players[playerId].x, players[playerId].y, players[playerId].color);
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

      for (let playerId in this.players) {
        this.players[playerId].update();
      }
    }
  }
}
