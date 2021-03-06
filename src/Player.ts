namespace ChatGame {
  export class Player extends Phaser.Sprite {
    animation: string;
    moveToPosition: any;
    maskPosition: any;
    messages: string[];
    textPlayer: Phaser.Text;
    textNickname: Phaser.Text;
    playerRectangle: Phaser.Sprite;
    chatPositionY: number;
    nickname: string;
    selectedSprite: string;
    playerSpeed: number;
    circleSprite: Phaser.Graphics;
    spriteWebcam: Phaser.Sprite;
    currentWebcam: string;

    constructor(game: Phaser.Game, posX: number, posY: number, color?: number) {
      super(game, posX, posY, "sprite");

      this.anchor.set(0.5, 0.5);
      this.loadPlayer();
      this.game.add.existing(this);

      this.game.physics.arcade.enable(this);

      this.body.collideWorldBounds = true;
      this.body.enableBody = true;
      this.body.setSize(this.body.width / 2, this.body.height / 4, this.body.width / 4, this.body.height - (this.body.height / 4));

      let finalColor: number;

      if (!color) {
        const colorR = Math.floor((Math.random() * 250) + 150);
        const colorG = Math.floor((Math.random() * 250) + 150);
        const colorB = Math.floor((Math.random() * 250) + 150);

        finalColor = colorR * colorG * colorB;
      }

      this.tint = finalColor || color;

      this.moveToPosition = {
        x: 0,
        y: 0
      };

      this.maskPosition = {
        x: 0,
        y: 0
      };

      this.messages = [];

      this.setMaskPosition("left-bottom");

      const bmd = game.add.bitmapData(140, 82);

      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, 140, 82);
      bmd.ctx.fillStyle = "#ffffff";
      bmd.ctx.fill();

      this.playerRectangle = game.add.sprite(0, 0, bmd);
      this.playerRectangle.position.x = -75;

      this.textPlayer = this.game.add.text(0, 0, "", {
        font: "11px Arial",
        fill: "#000000",
        align: "left"
      });

      this.textNickname = this.game.add.text(0, 60, "Anonymous", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
      });

      this.textNickname.anchor.set(0.5);

      this.textPlayer.lineSpacing = -5;

      this.playerRectangle.visible = false;
      this.chatPositionY = 0;
      this.addChild(this.textNickname);

      this.addChild(this.playerRectangle);

      // this.circleSprite = this.game.add.graphics(0, 0);
      // this.circleSprite.beginFill(0xFFFFFF);
      // this.circleSprite.drawCircle(0, -45, 48);

      // this.addChild(this.circleSprite);

      // if (color) {
      //   this.spriteWebcam = this.game.add.sprite(0, 0);
      //   this.spriteWebcam.anchor.set(0.5);
      //   this.spriteWebcam.position.y = -45;

      //   this.spriteWebcam.mask = this.circleSprite;
      //   this.addChild(this.spriteWebcam);
      // }
    }

    loadBike() {
      this.loadTexture("bike", 0);
      this.animations.add("left", [0, 1, 2, 3, 4, 5, 6, 7], 9, true, true);
      this.animations.add("left-top", [8, 9, 10, 11, 12, 13, 14, 15], 9, true, true);
      this.animations.add("top", [16, 17, 18, 19, 20, 21, 22, 23], 9, true, true);
      this.animations.add("right-top", [24, 25, 26, 27, 28, 29, 30, 31], 9, true, true);
      this.animations.add("right", [32, 33, 34, 35, 36, 37, 38, 39], 9, true, true);
      this.animations.add("right-bottom", [40, 41, 42, 43, 44, 45, 46, 47], 9, true, true);
      this.animations.add("bottom", [48, 49, 50, 51, 52, 53, 54, 55], 9, true, true);
      this.animations.add("left-bottom", [56, 57, 58, 59, 60, 61, 62, 63], 9, true, true);

      this.selectedSprite = "bike";

      this.playerSpeed = 200;
    }

    loadGirl() {
      this.loadTexture("girl", 0);
      this.animations.add("left", [3, 4, 5], 9, true, true);
      this.animations.add("left-top", [3, 4, 5], 9, true, true);
      this.animations.add("top", [9, 10, 11], 9, true, true);
      this.animations.add("right-top", [6, 7, 8], 9, true, true);
      this.animations.add("right", [6, 7, 8], 9, true, true);
      this.animations.add("right-bottom", [6, 7, 8], 9, true, true);
      this.animations.add("bottom", [0, 1, 2], 9, true, true);
      this.animations.add("left-bottom", [3, 4, 5], 9, true, true);

      this.selectedSprite = "girl";

      this.playerSpeed = 200;
    }

    loadPlayer() {
      this.loadTexture("sprite");
      this.animations.add("left-bottom", [0, 1, 2, 3, 4, 5, 6, 7, 8], 9, true, true);
      this.animations.add("bottom", [9, 10, 11, 12, 13, 14, 15, 16, 17], 9, true, true);
      this.animations.add("right-bottom", [18, 19, 20, 21, 22, 23, 24, 25, 26], 9, true, true);
      this.animations.add("left", [27, 28, 29, 30, 31, 32, 33, 34, 35], 9, true, true);
      this.animations.add("left-top", [36, 37, 38, 39, 40, 41, 42, 43, 44], 9, true, true);
      this.animations.add("right", [45, 46, 47, 48, 49, 50, 51, 52, 53], 9, true, true);
      this.animations.add("right-top", [54, 55, 56, 57, 58, 59, 60, 61, 62], 9, true, true);
      this.animations.add("top", [63, 64, 65, 66, 67, 68, 69, 70, 71], 9, true, true);

      this.selectedSprite = "player";

      this.playerSpeed = 100;
    }

    setMaskPosition(animation: string) {
      this.maskPosition.x = this.body.position.x + 32;
      this.maskPosition.y = this.body.position.y + 48;

      if (animation === "right") {
        this.maskPosition.x += 75;
      } else if (animation === "right-top") {
        this.maskPosition.x += 75;
        this.maskPosition.y += -75;
      } else if (animation === "top") {
        this.maskPosition.y += -100;
      } else if (animation === "left-top") {
        this.maskPosition.x += -75;
        this.maskPosition.y += -75;
      } else if (animation === "right-bottom") {
        this.maskPosition.x += 75;
        this.maskPosition.y += 75;
      } else if (animation === "bottom") {
        this.maskPosition.y += 100;
      } else if (animation === "left-bottom") {
        this.maskPosition.x += -75;
        this.maskPosition.y += 75;
      } else if (animation === "left") {
        this.maskPosition.x += -75;
      }
    }

    getAnimationByRadius(radius: number): string {
      const degrees = radius * (180 / Math.PI);

      let animation: string;

      if (degrees <= 22.5 && degrees >= -22.5) {
        animation = "right";
      } else if (degrees < -22.5 && degrees > -67.5) {
        animation = "right-top";
      } else if (degrees <= -67 && degrees >= -115.5) {
        animation = "top";
      } else if (degrees < -115.5 && degrees > -157.5) {
        animation = "left-top";
      } else if (degrees > 22.5 && degrees < 67.5) {
        animation = "right-bottom";
      } else if (degrees >= 67.5 && degrees <= 115.5) {
        animation = "bottom";
      } else if (degrees > 115.5 && degrees < 157.5) {
        animation = "left-bottom";
      } else {
        animation = "left";
      }

      return animation;
    }

    newMessage(message: string) {
      if (this.messages.length === 4) {
        this.messages.shift();
      }

      setTimeout(() => {
        this.messages.shift();
        this.textPlayer.setText(this.messages.join("\n"));

        this.playerRectangle.position.y = -70 - (8 + ((this.messages.length - 1) * 15));
        this.playerRectangle.height = 8 + (this.messages.length * 15);

        this.chatPositionY = 16 - (this.messages.length * 15);

        if (!this.messages.length) {
          this.playerRectangle.visible = false;
        }
      }, 15000);

      this.playerRectangle.position.y = -70 - (8 + (this.messages.length * 15));

      this.messages.push(message);

      this.textPlayer.setText(this.messages.join("\n"));

      this.playerRectangle.height = 8 + (this.messages.length * 15);

      this.chatPositionY = 16 - (this.messages.length * 15);

      this.playerRectangle.visible = true;
    }

    onCollide() {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.animations.stop();
    }

    update() {
      if (this.textPlayer.text) {
        this.textPlayer.x = this.x - 65;
        this.textPlayer.y = this.y + this.chatPositionY - 75;
      }

      if (Phaser.Math.distance(this.moveToPosition.x, this.moveToPosition.y,
        this.position.x, this.position.y) < 5) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.animations.stop();
      }

      // this.setMaskPosition(this.animation);
    }
  }
}