namespace ChatGame {
  export class Main extends Phaser.State {
    hero: Phaser.Sprite;
    mousePosition: any;
    animation: string;

    preload() {
      this.game.load.spritesheet("sprite", "img/animation.png", 95, 158, 48);
    }

    create() {
      this.hero = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "sprite");
      this.hero.anchor.set(0.5, 0.5);

      this.hero.animations.add("bottom", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12, true, true);
      this.hero.animations.add("left", [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 12, true, true);
      this.hero.animations.add("right", [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 12, true, true);
      this.hero.animations.add("up", [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 12, true, true);

      this.game.physics.arcade.enable(this.hero);

      this.game.input.mouse.capture = true;

      this.mousePosition = {
        x: 0,
        y: 0
      };

      this.game.input.onDown.add(this.onMouseDown, this);
    }

    getAnimationByRadius(radius: number): string {
      const degrees = radius * (180 / Math.PI);

      let animation: string;

      if (degrees < 135 && degrees > 45) {
        animation = "bottom";
      } else if (degrees < -45 && degrees > -135) {
        animation = "up";
      } else if  (degrees <= 45 && degrees >= -45) {
        animation = "right";
      } else {
        animation = "left";
      }

      return animation;
    }

    onMouseDown() {
      if (Phaser.Math.distance(this.game.input.activePointer.x, this.game.input.activePointer.y,
          this.hero.position.x, this.hero.position.y) >= 5) {
        this.mousePosition = {
          x: this.game.input.activePointer.x,
          y: this.game.input.activePointer.y
        };

        const radius = this.game.physics.arcade.moveToXY(this.hero,
          this.game.input.activePointer.x, this.game.input.activePointer.y, 200);

        this.animation = this.getAnimationByRadius(radius);
        this.hero.animations.play(this.animation);
      }
    }

    update() {
      if (Phaser.Math.distance(this.mousePosition.x, this.mousePosition.y,
        this.hero.position.x, this.hero.position.y) < 5) {
        this.hero.body.velocity.x = 0;
        this.hero.body.velocity.y = 0;
        this.hero.animations.stop();
      }
    }
  }
}
