import React, { useEffect, useRef } from 'react';
import Phaser from "phaser";
import Player from "./Player";
import NPCManager from "./NPCManager";
import DialogueManager from "./DialogueManager";
class PhaserGameScene extends Phaser.Scene {
  constructor() {
    super("PhaserGameSecond");
    this.player = null;
    this.npcManager = null;
    this.cursors = null;
    this.wasd = null;
    this.groundLayer = null;
    this.objectLayer = null;
    this.npcs = [];
  }

  preload() {
    // Load Tilesets
    this.load.image("tileset3", "/assets/level1/tilesets/tileset3.png");
    this.load.image("tileset4", "/assets/level1/tilesets/tileset4.png");
    this.load.image("tileset5", "/assets/level1/tilesets/tileset5.png");
    this.load.image("tileset6", "/assets/level1/tilesets/tileset6.png");

    // Load Tilemap JSON
    this.load.tilemapTiledJSON("map", "/assets/level1/tilemaps/map2.json");

    // Load Spritesheets and NPCs from correct path
    this.load.spritesheet("player", "/assets/level1/sprites/shane.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    //NPCs 
    this.load.spritesheet("monk", "/assets/level1/sprites/monk.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("student", "/assets/level1/sprites/student.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("professor", "/assets/level1/sprites/professor.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("villager_A", "/assets/level1/sprites/villager_A.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("villager_B", "/assets/level1/sprites/villager_B.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("villager_C", "/assets/level1/sprites/villager_C.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // Create tilemap and attach tilesets
    const map = this.make.tilemap({ key: "map" });
    const tileset3 = map.addTilesetImage("tileset3", "tileset3");
    const tileset4 = map.addTilesetImage("tileset4", "tileset4");
    const tileset5 = map.addTilesetImage("tileset5", "tileset5");
    const tileset6 = map.addTilesetImage("tileset6", "tileset6");

    if (!tileset3 || !tileset4 || !tileset5 || !tileset6) {
      console.error("Failed to load tilesets");
      return;
    }

    // Add debug text
    this.debugText = this.add.text(10, 10, '', { 
      fontSize: '16px', 
      fill: '#fff',
      backgroundColor: '#00000080',
      padding: { x: 5, y: 5 }
    });
    this.debugText.setScrollFactor(0);
    this.debugText.setDepth(1000);

    const allTilesets = [tileset3, tileset4, tileset5, tileset6];
    
    // Create tilemap layers
    const groundLayer = map.createLayer("Ground", allTilesets);
    const boundaryLayer = map.createLayer("Boundaries", allTilesets);
    const objectLayer = map.createLayer("Objects", allTilesets);

    if (!groundLayer || !boundaryLayer || !objectLayer) {
      console.error("Failed to create map layers");
      return;
    }

    // Enable collisions
    boundaryLayer.setCollisionByProperty({ collides: true });
    objectLayer.setCollisionByProperty({ collides: true });

    // Initialize player
    const spawnPoint = map.findObject("Spawn", (obj) => obj.name === "PlayerSpawn");
    if (!spawnPoint) {
      console.error("PlayerSpawn object not found in Spawn layer");
    }

    // Read all properties from the spawn point object
    const spawnProperties = {};
    if (spawnPoint.properties) {
      spawnPoint.properties.forEach(prop => {
        spawnProperties[prop.name] = prop.value;
      });
    }
    this.player = new Player(this,spawnPoint.x,spawnPoint.y);
    
    // Set up physics colliders for player
    if (this.player && this.player.sprite) {
      this.physics.add.collider(this.player.sprite, boundaryLayer);
      this.physics.add.collider(this.player.sprite, objectLayer);
    }

    this.dialogueManager = new DialogueManager(this);
    // Initialize NPC manager
    this.npcManager = new NPCManager(this,this.objectLayer,this.dialogueManager);
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Debug: Log when E key is pressed
    this.input.keyboard.on('keydown-E', () => {
      console.log('E key pressed');
      this.debugText.setText('E key pressed - Checking for NPC interaction');
    });

    // Set up physics colliders for NPCs
    if (this.player && this.player.sprite && this.npcManager) {
      this.npcManager.npcs.forEach(npc => {
        this.physics.add.collider(this.player.sprite, npc);
      });
    }

    // Camera settings
    if (this.player && this.player.sprite) {
      // Set initial camera position to player spawn
      this.cameras.main.centerOn(spawnPoint.x, spawnPoint.y);

      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      
      // Configure camera to follow player
      this.cameras.main.startFollow(this.player.sprite, true);
      this.cameras.main.setFollowOffset(0, 0);
      this.cameras.main.setZoom(1);
    }
  }

  update() {
    if (this.player) {
      this.player.update();
    }

    // Update debug text with player position and nearby NPCs
    if (this.player && this.player.sprite) {
      const playerPos = this.player.sprite;
      const nearbyNPCs = this.npcManager?.getClosest(playerPos.x, playerPos.y);
      
      this.debugText.setText([
        `Player Position: (${Math.round(playerPos.x)}, ${Math.round(playerPos.y)})`,
        `Nearest NPC: ${nearbyNPCs?.npc?.npcName || 'None'}`,
        `Distance: ${nearbyNPCs?.dist ? Math.round(nearbyNPCs.dist) : 'N/A'}`,
        `Press E to interact`
      ].join('\n'));
    }

    // Check for interaction
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      console.log('Checking NPC interaction...');
      this.npcManager?.checkInteraction(this.player?.sprite);
    }
  }
}

const PhaserGameSecond = () => {
  const gameRef = useRef(null);
  const phaserContainerRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: phaserContainerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
        },
      },
      scene: PhaserGameScene,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={phaserContainerRef} id="phaser-container" className="w-screen h-screen" />;
};

export default PhaserGameSecond;
