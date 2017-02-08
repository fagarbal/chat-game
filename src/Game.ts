namespace ChatGame {

    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600, Phaser.AUTO);

            this.state.add("Boot", ChatGame.Boot);
            this.state.add("Main", ChatGame.Main);

            this.state.start("Boot");
        }
    }
}
