import $ from 'jquery';

import PIXI from 'pixi.js';
import { Application, loader } from 'pixi.js';

export class Game {
    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.newGame();
    }

    getView() {
        return this.app.view;
    }

    newGame() {
        /** Create game */
        this.app = new Application({
            width: this.width,
            height: this.height
        });
    }
    
    loadSprites() {
    }
    
    startGame() {
        this.loadSprites();
        let stage = this.app.stage;
    }
}