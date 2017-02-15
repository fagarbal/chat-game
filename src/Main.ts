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
    spriteVideo: Phaser.Image;
    grab: Phaser.Image;

    constructor(private socket: SocketIOClient.Socket) {
      super();
      this.socket = socket;
    }

    preload() {
      this.game.load.spritesheet("sprite", "img/player.png", 64, 96, 72);
      this.game.load.spritesheet("bike", "img/bicycle.png", 64, 64, 64);
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

      this.textConnected = this.game.add.text(this.game.camera.x, this.game.camera.y, "Conected: 1", {
        font: "13px Arial",
        fill: "#000000",
        align: "left"
      });

      const video = this.game.add.video();

      //  If access to the camera is allowed
      video.onAccess.add(this.camAllowed, this);

      //  Start the stream
      video.startMediaStream();
    }

    camAllowed(video: Phaser.Video) {
      this.spriteVideo = video.addToWorld();
      setTimeout(() => video.play(), 5000);
      this.spriteVideo.anchor.set(0.5);
      this.spriteVideo.width = 32;
      this.spriteVideo.height = 24;
      this.spriteVideo.position.y = -30;

      this.spriteVideo.mask = this.hero.circleSprite;
      this.hero.addChild(this.spriteVideo);

      setInterval(() => {
        video.grab();
        const a: any = this.game.add.bitmapData(32, 24);
        video.snapshot.width = 32;
        video.snapshot.height = 24;
        a.draw(video.snapshot, 0, 0, 32, 24);
        a.width = 32;
        a.height = 24;
        this.sendWebcam(a.texture.baseTexture.source.toDataURL());
        a.destroy();
      }, 1500);
    }

    sendWebcam(base64: string) {
      this.socket.emit("sendWebcam", {
        id: this.socket.id,
        webcam: base64
      });
    }

    addInputs() {
      const form: any = document.getElementById("form");
      const inputMessage: any = document.getElementById("message");
      const inputNick: any = document.getElementById("nickname");

      const eventEnter = (event: any) => {
        if (event.keyCode === 13 || event.which === 13 || event.key === "Enter") {
          event.preventDefault();
          if (inputMessage.value) {
            if (inputMessage.value === ":bike") {
              this.change("bike", this.hero, true);
              inputMessage.value = "";
              return;
            }
            if (inputMessage.value === ":player") {
              this.change("player", this.hero, true);
              inputMessage.value = "";
              return;
            }
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

      inputMessage.addEventListener("keydown", eventEnter);
      inputNick.addEventListener("keydown", eventEnter);
    }

    change(sprite: string, player: ChatGame.Player, send?: boolean) {
      if (sprite === "bike")
        player.loadBike();
      if (sprite === "player")
        player.loadPlayer();

      if (send) {
        this.socket.emit("sendSprite", {
          id: this.socket.id,
          sprite: sprite
        });
      }
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
      let count = 0;

      this.socket.on("playerWebcam", (player: any) => {
        if (this.players[player.id]) {
          this.game.load.image(count + "webcam:" + player.id, player.webcam);

          const loadImage = (cnt: number) => {
            const sprite = this.game.add.sprite(0, 0, cnt + "webcam:" + player.id);
            sprite.anchor.set(0.5);
            sprite.position.y = -30;

            sprite.mask = this.players[player.id].circleSprite;

            this.game.load.onLoadComplete.dispose();
            this.players[player.id].addChild(sprite);
          };

          this.game.load.onLoadComplete.addOnce(loadImage.bind(this, count));
          this.game.load.start();
          count++;
        }
      });

      this.socket.on("createPlayers", (players: any) => {
        for (const playerId in players) {
          if (!this.players[playerId] && this.socket.id !== playerId) {
            this.players[playerId] = new Player(this.game, players[playerId].x, players[playerId].y, players[playerId].color);
            this.players[playerId].textNickname.text = players[playerId].nickname || "Anonymous";
            this.change(players[playerId].sprite, this.players[playerId]);
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
        if (message.message === ":bike" || message.message === ":player")
          return;
        this.players[message.id].newMessage(message.message);
      });

      this.socket.on("changeNickname", (message: any) => {
        this.players[message.id].textNickname.text = message.nickname;
        this.updateNicknames();
      });

      this.socket.on("changeSprite", (message: any) => {
        this.change(message.sprite, this.players[message.id]);
      });

      this.socket.on("movePlayer", (player: any) => {
        this.players[player.id].moveToPosition = {
          x: player.x,
          y: player.y
        };
        const radius = this.game.physics.arcade.moveToXY(this.players[player.id],
          player.x, player.y, this.players[player.id].playerSpeed);

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
