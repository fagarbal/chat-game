namespace ChatGame {
  export class Main extends Phaser.State {
    hero: ChatGame.Hero;
    background: Phaser.Sprite;
    players: any;
    maskGroup: Phaser.Group;
    maskCircle: Phaser.Graphics;
    webcam: Phaser.Plugin.Webcam;
    spriteCam: Phaser.Image;

    constructor(private socket: SocketIOClient.Socket) {
      super();
      this.socket = socket;
    }

    preload() {
      this.game.load.spritesheet("sprite", "img/player.png", 64, 96, 72);
      this.game.load.image("background", "img/background.png");
    }

    create() {
      this.background = this.game.add.sprite(0, 0, "background");
      this.background.scale.set(2);

      this.hero = new Hero(this.game, this.socket);

      this.game.input.mouse.capture = true;
      this.players = {};

      this.world.setBounds(0, 0, 1280, 960);

      // this.maskCircle = this.game.add.graphics(0, 0);

      // this.background.mask = this.maskCircle;
      this.addInputs();
      this.setEvents();
      this.game.camera.follow(this.hero);

      this.webcam = this.game.plugins.add(Phaser.Plugin.Webcam);

      const bmd = this.game.make.bitmapData(800, 600);
      this.spriteCam = bmd.addToWorld();

      this.webcam.start(800, 600, bmd.context);
      this.spriteCam.crop(new Phaser.Rectangle(200, 0, 400, 600));
      this.spriteCam.scale.set(0.08, 0.08);
      this.spriteCam.anchor.set(0.5);
      this.spriteCam.y = -35;

      const circle = this.game.add.graphics(0, 0);
      circle.beginFill(0xFFFFFF);
      circle.drawCircle(0, -35, 30);

      this.hero.addChild(this.spriteCam);
      this.spriteCam.mask = circle;
      this.hero.addChild(circle);
    }

    addInputs() {
      const form = document.getElementById("form");
      const inputMessage: any = document.getElementById("message");

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (inputMessage.value) {
          this.sendMessage(inputMessage.value);
        }

        inputMessage.value = "";
        inputMessage.blur();
      });
    }

    sendMessage(message: string) {
      const numMessages = Math.ceil(message.length / 16);

      for (let i = 0; i < numMessages; i++) {
        const messageSend = message.substring(i * 16, (i + 1) * 16);

        this.socket.emit("sendMessage", {
          id: this.socket.id,
          message: messageSend
        });

        this.hero.newMessage(messageSend);
      }
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

      this.socket.on("messagePlayer", (message: any) => {
        this.players[message.id].newMessage(message.message);
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

        this.players[player.id].setMaskPosition(this.players[player.id].animation);
      });
    }

    update() {
      this.hero.update();

      for (let playerId in this.players) {
        this.players[playerId].update();
      }
      // this.maskCircle.clear();

      // this.maskCircle.beginFill(0xffffff);
      // this.maskCircle.drawCircle(this.hero.maskPosition.x, this.hero.maskPosition.y, 100);

      for (let playerId in this.players) {
        this.players[playerId].update();
        // this.maskCircle.drawCircle(this.players[playerId].maskPosition.x, this.players[playerId].maskPosition.y, 100);
      }
      // this.maskCircle.endFill();
    }
  }
}
