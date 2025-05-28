import Phaser from "phaser";
import DialogueManager from "./DialogueManager";

export default class NPCManager {
  constructor(scene, objectLayer, dialogueManager) {
    this.scene = scene;
    this.objectLayer = objectLayer;
    this.npcs = [];
    this.loadNPCs();
    this.checkInteraction();
    this.handleInteraction();
    this.dialogueManager = dialogueManager;
  }

  loadNPCs() {
    const map = this.scene.make.tilemap({ key: "map" });
    const npcObjs = map.getObjectLayer("NPCs")?.objects.filter(o =>
      o.properties?.some(p => p.name === "type" && p.value === "NPC")
    ) || [];

    npcObjs.forEach(data => {
      let { x, y, name, height } = data;
      if (x == null || y == null || !name) return;
    
      // Calculate spawn position
      const sx = x;
      const sy = y - (height || 0);
    
      const key = data.properties.find(p => p.name === "spriteKey")?.value || name;
      if (!this.scene.textures.exists(key)) return;
      const npc = this.scene.physics.add.sprite(sx, sy, key)
        .setOrigin(0, 0)
        .setImmovable(true)
        .setDepth(10);
    
      const rawWidth = npc.width;
      const rawHeight = npc.height;
    
      npc.body.setSize(rawWidth, rawHeight / 4);
      npc.body.setOffset(0, (rawHeight * 3) / 4);
    
      npc.setScale(1.5);
    
      data.properties.forEach(p => npc[p.name] = p.value);
      this.scene.physics.add.collider(npc, this.objectLayer);
      this.npcs.push(npc);
    });
    
  }

  getClosest(x, y) {
    let min = Infinity, closest = null;
    this.npcs.forEach(npc => {
      const d = Phaser.Math.Distance.Between(x, y, npc.x, npc.y);
      if (d < min) { min = d; closest = npc; }
    });
    return { npc: closest, dist: min };
  }

  checkInteraction(player) {
    if (!player) {
      console.log('No player provided for interaction check');
      return;
    }
  
    const { npc, dist } = this.getClosest(player.x, player.y);
    console.log('Checking interaction:', { 
      npcName: npc?.npcName, 
      distance: dist,
      hasInteracted: npc?.hasInteracted 
    });
  
    if (npc && dist < 60 && !npc.hasInteracted) {
      console.log(`Starting interaction with ${npc.npcName} at distance ${dist}`);
      this.handleInteraction(npc, player);
      npc.hasInteracted = true;
  
      this.scene.time.delayedCall(1000, () => {
        npc.hasInteracted = false;
        console.log(`Reset interaction state for ${npc.npcName}`);
      });
    } else {
      console.log('No valid NPC found for interaction:', {
        hasNPC: !!npc,
        distance: dist,
        isInteracting: npc?.hasInteracted
      });
    }
  }
  
  handleInteraction(npc, player) {
    if (!npc || !player) {
      console.log('Invalid NPC or player in handleInteraction');
      return;
    }
  
    console.log(`Handling interaction with ${npc.npcName}`);
  
    // 1. Face NPC toward the player
    const dx = player.x - npc.x;
    const dy = player.y - npc.y;
    let npcFace = 'down';
    let frame = 0;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        npcFace = 'left';
        frame = 4;
        npc.setFlipX(false);
      } else {
        npcFace = 'right';
        frame = 8;
        npc.setFlipX(false);
      }
    } else {
      if (dy < 0) {
        npcFace = 'up';
        frame = 12;
      } else {
        npcFace = 'down';
        frame = 0;
      }
    }
  
    npc.facing = npcFace;
    npc.anims.stop();
    npc.setFrame(frame);
  
    // 2. Handle interaction types
    const type = npc.interactionType || 'talk';
    console.log(`Interaction type: ${type}`);
  
    switch (type) {
      case 'talk':
        const dialogue = npc.dialogue || "This NPC has nothing to say.";
        console.log(`Showing dialogue: ${dialogue}`);
        console.log("DialogueManager in NPCManager:", this.dialogueManager);
        this.dialogueManager.showDialogue(dialogue);
        break;
        
      case 'quest':
        console.log(`Starting quest interaction with ${npc.npcName}`);
        this.scene.pause();
        this.scene.launch('QuestScene', { playerName: this.playerName });
        break;
  
      default:
        console.warn(`Unknown interaction type: ${type}`);
    }
  } 
}
