import Phaser from "phaser";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "player", 0)
      .setCollideWorldBounds(true)
      .setScale(1.5);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height, true);

    // Get original dimensions of the frame
    const originalWidth = this.sprite.width;
    const originalHeight = this.sprite.height;

    // Shrink the body height to bottom 1/4th (just feet)
    this.sprite.body.setSize(originalWidth, originalHeight / 4);

    // Reposition the body to bottom of the sprite
    this.sprite.body.setOffset(0, (originalHeight * 3) / 4);

    // Movement controls
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.enabled = true;
    this.createAnimations();
  }

  createAnimations() {
    const anims = this.scene.anims;
    // walk/down/left/right and idle animations
    anims.create({ key: "walk-down", frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-left", frames: anims.generateFrameNumbers("player", { start: 4, end: 7 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-right", frames: anims.generateFrameNumbers("player", { start: 8, end: 11 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-up", frames: anims.generateFrameNumbers("player", { start: 12, end: 15 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "idle-down", frames: [{ key: "player", frame: 0 }], frameRate: 1 });
    anims.create({ key: "idle-left", frames: [{ key: "player", frame: 4 }], frameRate: 1 });
    anims.create({ key: "idle-right", frames: [{ key: "player", frame: 8 }], frameRate: 1 });
    anims.create({ key: "idle-up", frames: [{ key: "player", frame: 12 }], frameRate: 1 });
  }

  update(speed = 200) {
    if (!this.enabled) {
      this.sprite.setVelocity(0);
      return;
    }

    const { cursors, wasd, sprite } = this;
    sprite.setVelocity(0);

    let moving = false;
    let dir = null;
    if (cursors.left.isDown || wasd.left.isDown)      { sprite.setVelocityX(-speed); dir = "left";  moving = true; }
    else if (cursors.right.isDown || wasd.right.isDown){ sprite.setVelocityX(speed);  dir = "right"; moving = true; }
    if (cursors.up.isDown || wasd.up.isDown)          { sprite.setVelocityY(-speed); dir = "up";    moving = true; }
    else if (cursors.down.isDown || wasd.down.isDown) { sprite.setVelocityY(speed);  dir = "down";  moving = true; }

    // Normalize diagonal
    if (sprite.body.velocity.length()) sprite.body.velocity.normalize().scale(speed);

    if (moving) sprite.anims.play(`walk-${dir}`, true);
    else {
      // keep last idle frame
      const key = sprite.anims.currentAnim?.key || "idle-down";
      if (key.includes("left"))  sprite.anims.play("idle-left", true);
      else if (key.includes("right")) sprite.anims.play("idle-right", true);
      else if (key.includes("up"))    sprite.anims.play("idle-up", true);
      else                               sprite.anims.play("idle-down", true);
    }
  }
}
