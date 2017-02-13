namespace ChatGame {
  export class Main extends Phaser.State {
    hero: ChatGame.Hero;
    background: Phaser.Sprite;
    players: any;
    maskGroup: Phaser.Group;
    maskCircle: Phaser.Graphics;
    webcam: Phaser.Plugin.Webcam;
    spriteCam: Phaser.Image;
    textConnected: Phaser.Text;
    bmd: any;

    constructor(private socket: SocketIOClient.Socket) {
      super();
      this.socket = socket;
    }

    preload() {
      this.game.load.spritesheet("sprite", "img/player.png", 64, 96, 72);
      this.game.load.image("background", "img/background.jpg");
    }

    create() {
      this.background = this.game.add.sprite(0, 0, "background");
      this.background.scale.set(2);

      this.hero = new Hero(this.game, this.socket);

      this.game.input.mouse.capture = true;
      this.players = {};

      this.world.setBounds(0, 0, 1854 * 2, 966 * 2);

      // this.maskCircle = this.game.add.graphics(0, 0);

      // this.background.mask = this.maskCircle;
      this.addInputs();
      this.setEvents();
      this.game.camera.follow(this.hero);

      this.webcam = this.game.plugins.add(Phaser.Plugin.Webcam);

      this.bmd = this.game.make.bitmapData(800, 600);
      this.spriteCam = this.bmd.addToWorld();
      this.bmd.height = 60;
      this.bmd.width = 80;

      this.webcam.start(80, 60, this.bmd.context);
      this.spriteCam.crop(new Phaser.Rectangle(200, 0, 400, 600));
      this.spriteCam.scale.set(0.08, 0.08);
      this.spriteCam.anchor.set(0.5);
      this.spriteCam.y = -35;

      const circle = this.game.add.graphics(0, 0);
      circle.beginFill(0xFFFFFF);
      circle.drawCircle(0, -35, 30);

      this.hero.addChild(this.spriteCam);
      this.spriteCam.mask = circle;

      this.textConnected = this.game.add.text(this.game.camera.x, this.game.camera.y, "Conected: 1", {
        font: "13px Arial",
        fill: "#000000",
        align: "left"
      });


      this.hero.addChild(circle);
    }

    addInputs() {
      const form: any = document.getElementById("form");
      const inputMessage: any = document.getElementById("message");
      const inputNick: any = document.getElementById("nickname");
      const canvas = document.getElementsByTagName("canvas")[0];
      canvas.tabIndex = 1;
      document.getElementsByTagName("canvas")[0].addEventListener("click", (event) => {
        canvas.focus();
        inputMessage.blur();
        inputNick.blur();
      });

      const eventEnter = (event: any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
          if (inputMessage.value) {
            this.sendMessage(inputMessage.value);
          }

          if (inputNick.value !== this.hero.textNickname.text) {
            this.sendNick(inputNick.value);
            this.hero.textNickname.text = inputNick.value;
            this.updateNicknames();
          }

          inputMessage.value = "";
        }
      };

      inputMessage.addEventListener("keyup", eventEnter);
      inputNick.addEventListener("keyup", eventEnter);
    }

    sendNick(nickname: string) {
      this.socket.emit("sendNickname", {
        id: this.socket.id,
        nickname: nickname
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
            this.players[playerId].textNickname.text = players[playerId].nickname || "Anonymous";
          }
        }
        this.updateNicknames();
      });

      this.socket.on("deletePlayer", (player: any) => {
        if (this.players[player.id]) {
          this.players[player.id].destroy();
          delete this.players[player.id];
        }
        this.updateNicknames();
      });

      this.socket.on("messagePlayer", (message: any) => {
        this.players[message.id].newMessage(message.message);
      });

      this.socket.on("changeNickname", (message: any) => {
        this.players[message.id].textNickname.text = message.nickname;
        this.updateNicknames();
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

    updateNicknames() {
      let nicknames = this.hero.textNickname.text + "\n";

      let count = 1;

      for (let playerId in this.players) {
        count++;
        nicknames += this.players[playerId].textNickname.text + "\n";
      }

      this.textConnected.text = "Conected : " + count + "\n" + nicknames;
    }

    update() {
      this.textConnected.position.set(this.game.camera.x + 20, this.game.camera.y + 60);
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
