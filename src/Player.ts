namespace ChatGame {
  export class Player extends Phaser.Sprite {
    animation: string;
    moveToPosition: any;
    maskPosition: any;

    constructor(game: Phaser.Game, posX: number, posY: number, color?: number) {
      super(game, posX, posY, "sprite");

      this.anchor.set(0.5, 0.5);

      this.game.add.existing(this);

      this.animations.add("left-bottom", [0, 1, 2, 3, 4, 5, 6, 7, 8], 9, true, true);
      this.animations.add("bottom", [9, 10, 11, 12, 13, 14, 15, 16, 17], 9, true, true);
      this.animations.add("right-bottom", [18, 19, 20, 21, 22, 23, 24, 25, 26], 9, true, true);
      this.animations.add("left", [27, 28, 29, 30, 31, 32, 33, 34, 35], 9, true, true);
      this.animations.add("left-top", [36, 37, 38, 39, 40, 41, 42, 43, 44], 9, true, true);
      this.animations.add("right", [45, 46, 47, 48, 49, 50, 51, 52, 53], 9, true, true);
      this.animations.add("right-top", [54, 55, 56, 57, 58, 59, 60, 61, 62], 9, true, true);
      this.animations.add("top", [63, 64, 65, 66, 67, 68, 69, 70, 71], 9, true, true);

      this.game.physics.arcade.enable(this);

      this.body.collideWorldBounds = true;
      this.body.enableBody = true;

      this.body.onCollide = new Phaser.Signal();
      this.body.onWorldBounds = new Phaser.Signal();
      this.body.onCollide.add(this.onCollide, this);
      this.body.onWorldBounds.add(this.onCollide, this);

      if (!color) {
        const colorR = Math.floor((Math.random() * 250) + 150);
        const colorG = Math.floor((Math.random() * 250) + 150);
        const colorB = Math.floor((Math.random() * 250) + 150);

        color = colorR * colorG * colorB;
      }

      this.tint = color;

      this.moveToPosition = {
        x: 0,
        y: 0
      };

      this.maskPosition = {
        x: 0,
        y: 0
      };

      this.setMaskPosition("left-bottom");
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

    onCollide() {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.animations.stop();
    }

    update() {
      if (Phaser.Math.distance(this.moveToPosition.x, this.moveToPosition.y,
        this.position.x, this.position.y) < 5) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.animations.stop();
      }

      this.setMaskPosition(this.animation);
    }
  }
}