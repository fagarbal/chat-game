namespace ChatGame {
  export class Main extends Phaser.State {
    hero: Phaser.Sprite;
    mousePosition: any;
    animation: string;

    preload() {
       this.game.load.image("sprite", "img/hero.png");
    }

    create() {
      this.hero = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "sprite");
      this.hero.anchor.set(0.5, 0.5);

      this.game.physics.arcade.enable(this.hero);

      this.game.input.mouse.capture = true;

      this.mousePosition = {
        x: 0,
        y: 0
      };

      this.game.input.activePointer.leftButton.onDown.add(this.onMouseDown.bind(this));
    }

    getAnimationByRadius(radius: number): string {
      const degrees = radius * (180 / Math.PI);

      let animation: string;

      if (degrees < 135 && degrees > 45) {
        animation = "down";
      } else if (degrees < -45 && degrees > -135) {
        animation = "top";
      } else if  (degrees <= 45 && degrees >= -45) {
        animation = "right";
      } else {
        animation = "left";
      }

      return animation;
    }

    onMouseDown() {
      if (Phaser.Math.distance(this.game.input.mousePointer.x, this.game.input.mousePointer.y,
          this.hero.position.x, this.hero.position.y) >= 5) {
        this.mousePosition = {
          x: this.game.input.mousePointer.x,
          y: this.game.input.mousePointer.y
        };

        const radius = this.game.physics.arcade.moveToXY(this.hero,
          this.game.input.mousePointer.x, this.game.input.mousePointer.y, 200);

        this.animation = this.getAnimationByRadius(radius);

        console.log(this.animation);
      }
    }

    update() {
      if (Phaser.Math.distance(this.mousePosition.x, this.mousePosition.y,
        this.hero.position.x, this.hero.position.y) < 5) {
        this.hero.body.velocity.x = 0;
        this.hero.body.velocity.y = 0;
      }
    }
  }
}
