import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const PhaserGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return; // Prevent double init on Fast Refresh

    class MainScene extends Phaser.Scene {
      constructor() {
        super("MainScene");
      }

      preload() {
        this.load.image("tiles", "/assets/tilesets/tiles.png");
        this.load.tilemapTiledJSON("map", "/assets/tilemaps/test-map.json");
        this.load.spritesheet("shane", "/assets/sprites/shane.png", {
          frameWidth: 32,
          frameHeight: 48,
        });
      }

      create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset-name-in-tiled", "tiles");
        const ground = map.createLayer("Ground", tileset);

        this.player = this.physics.add.sprite(100, 100, "shane");
        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
          key: "walk-down",
          frames: this.anims.generateFrameNumbers("shane", { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
        });

        // Add other directions similarly
      }

      update() {
        const speed = 100;
        const { left, right, up, down } = this.cursors;

        if (left.isDown) {
          this.player.setVelocity(-speed, 0);
        } else if (right.isDown) {
          this.player.setVelocity(speed, 0);
        } else if (up.isDown) {
          this.player.setVelocity(0, -speed);
        } else if (down.isDown) {
          this.player.setVelocity(0, speed);
          this.player.anims.play("walk-down", true);
        } else {
          this.player.setVelocity(0, 0);
          this.player.anims.stop();
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-container",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: MainScene,
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
    };
  }, []);

  return <div id="phaser-container" className="w-full h-screen" />;
};

export default PhaserGame;
