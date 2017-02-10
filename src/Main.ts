namespace ChatGame {
  export class Main extends Phaser.State {
    hero: ChatGame.Hero;
    platform: Phaser.Sprite;
    mousePosition: any;
    animation: string;

    preload() {
      this.game.load.spritesheet("sprite", "img/animation.png", 64, 96, 72);
      this.game.load.image("platform", "img/hero.png");
    }

    create() {
      this.hero = new Hero(this.game);

      this.platform = this.game.add.sprite(this.game.world.centerX + 100, this.game.world.centerY, "platform");
      this.platform.anchor.set(0.5, 0.5);

      this.game.physics.arcade.enable(this.platform);

      this.platform.body.enableBody = true;
      this.platform.body.immovable = true;

      this.game.input.mouse.capture = true;
    }

    update() {
      this.hero.update();

      this.game.physics.arcade.collide(this.hero, this.platform);
    }
  }
}
