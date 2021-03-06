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
    bmp: Phaser.BitmapData;
    layer: Phaser.TilemapLayer;
    upLayer: Phaser.TilemapLayer;
    collisionLayer: Phaser.TilemapLayer;

    constructor(private socket: SocketIOClient.Socket) {
      super();
      this.socket = socket;
    }

    preload() {
      this.game.load.spritesheet("sprite", "img/player.png", 64, 96, 72);
      this.game.load.spritesheet("bike", "img/bicycle.png", 64, 64, 64);
      this.game.load.spritesheet("girl", "img/girl.png", 64, 96, 12);

      this.game.load.tilemap("map", "maps/map.json", null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image("tiles", "img/terrain_atlas.png");
    }

    create() {
      const map = this.game.add.tilemap("map");
      map.addTilesetImage("tiles", "tiles");

      this.layer = map.createLayer("Terrain");
      this.upLayer = map.createLayer("TerrainUp");
      this.collisionLayer = map.createLayer("Collision");
      this.collisionLayer.visible = false;
      // this.objects = map.createLayer("Objects");
      this.layer.resizeWorld();
      this.upLayer.resizeWorld();
      this.collisionLayer.resizeWorld();

      map.setCollision(267, true, this.collisionLayer);
      map.setPreventRecalculate(true);

      this.hero = new Hero(this.game, this.socket);

      this.game.input.mouse.capture = true;
      this.players = {};

      // this.maskCircle = this.game.add.graphics(0, 0);

      // this.background.mask = this.maskCircle;
      this.addInputs();
      this.setEvents();
      this.game.camera.follow(this.hero);

      this.textConnected = this.game.add.text(20, 60, "Conected: 1", {
        font: "13px Arial",
        fill: "#000000",
        align: "left"
      });

      this.textConnected.fixedToCamera = true;

      // this.webcam = this.game.plugins.add(Phaser.Plugin.Webcam);
      // this.bmp = this.game.make.bitmapData(640, 480);
      // this.bmp.width = 64;
      // this.bmp.height = 48;

      // this.webcam.start(640, 480, this.bmp.context);

      // this.camAllowed();
    }

    updateCam() {
      let a: any;
      if (this.bmp.baseTexture.width === 640) {
        a = this.game.add.bitmapData(64, 48);
        a.draw(this.bmp, 0, 0, 64, 48);
        a.width = 64;
        a.height = 48;
      } else {
        this.bmp.width = 48;
        this.bmp.height = 64;
        a = this.game.add.bitmapData(48, 64);
        a.draw(this.bmp, 0, 0, 48, 64);
        a.width = 48;
        a.height = 64;
      }

      const i = new Image();
      i.src = a.texture.baseTexture.source.toDataURL();
      const bt = new PIXI.BaseTexture(i, PIXI.scaleModes.DEFAULT);
      const t = new PIXI.Texture(bt);
      this.spriteVideo.setTexture(t);
      this.spriteVideo.width = 64;
      this.spriteVideo.height = 48;
      a.destroy();
    }

    camAllowed() {
      this.spriteVideo = this.bmp.addToWorld();
      this.spriteVideo.anchor.set(0.5);
      this.spriteVideo.width = 640;
      this.spriteVideo.height = 480;
      this.spriteVideo.position.y = -45;

      this.spriteVideo.mask = this.hero.circleSprite;
      this.hero.addChild(this.spriteVideo);

      setInterval(() => {
        let a: any;
        if (this.bmp.baseTexture.width === 640) {
          a = this.game.add.bitmapData(64, 48);
          a.draw(this.bmp, 0, 0, 64, 48);
          a.width = 64;
          a.height = 48;
        } else {
          this.bmp.width = 48;
          this.bmp.height = 64;
          a = this.game.add.bitmapData(48, 64);
          a.draw(this.bmp, 0, 0, 48, 64);
          a.width = 48;
          a.height = 64;
        }
        this.sendWebcam(a.texture.baseTexture.source.toDataURL());
        a.destroy();
      }, 333);
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
      const canvas: any = document.getElementsByTagName("canvas")[0];

      canvas.tabIndex = 1;

      form.addEventListener("submit", (event: any) => {
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

          if (inputMessage.value === ":girl") {
            this.change("girl", this.hero, true);
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
      });

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

            if (inputMessage.value === ":girl") {
              this.change("girl", this.hero, true);
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
      if (sprite === "girl")
        player.loadGirl();

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
      let lastTexture: any = {};
      this.socket.on("playerWebcam", (player: any) => {
        if (this.players[player.id]) {
          const a = new Image();
          a.src = player.webcam;
          const p: ChatGame.Player = this.players[player.id];
          const bt = new PIXI.BaseTexture(a, PIXI.scaleModes.DEFAULT);
          const t: PIXI.Texture = new PIXI.Texture(bt);
          p.spriteWebcam.setTexture(t);
          if (p.spriteWebcam.width !== 64)
            p.spriteWebcam.position.x = 7;

          if (lastTexture[player.id]) lastTexture[player.id].destroy();

          lastTexture[player.id] = t;
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
        if (message.message === ":bike" || message.message === ":player" || message.message === ":girl")
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
        if (this.players[player.id]) {
          this.players[player.id].moveToPosition = {
            x: player.x,
            y: player.y
          };
          const radius = this.game.physics.arcade.moveToXY(this.players[player.id],
            player.x, player.y, this.players[player.id].playerSpeed);

          this.players[player.id].animation = this.players[player.id].getAnimationByRadius(radius);
          this.players[player.id].animations.play(this.players[player.id].animation);

          this.players[player.id].setMaskPosition(this.players[player.id].animation);
        }
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
      // this.game.debug.body(this.hero);

      // this.updateCam();
      this.hero.update();

      for (let playerId in this.players) {
        this.players[playerId].update();
      }
      // this.maskCircle.clear();

      // this.maskCircle.beginFill(0xffffff);
      // this.maskCircle.drawCircle(this.hero.maskPosition.x, this.hero.maskPosition.y, 100);

      for (let playerId in this.players) {
        this.game.physics.arcade.collide(this.players[playerId], this.collisionLayer, this.players[playerId].onCollide.bind(this.players[playerId]));
        this.players[playerId].update();
        // this.maskCircle.drawCircle(this.players[playerId].maskPosition.x, this.players[playerId].maskPosition.y, 100);
      }
      // this.maskCircle.endFill();
      this.game.physics.arcade.collide(this.hero, this.collisionLayer, this.hero.onCollide.bind(this.hero));
    }
  }
}
