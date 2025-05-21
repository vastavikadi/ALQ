export default class DialogueManager {
    constructor(scene, mapWidth, onShow = () => {}, onHide = () => {}) {
      this.scene = scene;
      this.dialogueBox = null;
      this.dialogueText = null;
      this.isVisible = false;
      this.enterKey = null;
      this.mapWidth = mapWidth * 0.5;
      this.onShow = onShow; 
      this.onHide = onHide; 
    }
  
    showDialogue(text) {
      if (this.isVisible) return;
  
      const screenWidth = this.scene.cameras.main.width;
      const screenHeight = this.scene.cameras.main.height;
  
      const boxPadding = 20;
      const boxHeight = 100;
  
      const boxWidth = Math.min(this.mapWidth, screenWidth - boxPadding * 2);
  
      const boxX = (screenWidth - boxWidth) / 2;
      const boxY = screenHeight - boxHeight - boxPadding;
  
      // Create dialogue box
      this.dialogueBox = this.scene.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0x000000, 0.7)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(1000);
  
      // Create dialogue text
      this.dialogueText = this.scene.add.text(boxX + 15, boxY + 15, text, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        wordWrap: { width: boxWidth - 30 }
      }).setScrollFactor(0).setDepth(1001);
  
      // Listen for Enter key to close
      this.enterKey = this.scene.input.keyboard.addKey('ENTER');
      this.enterKey.once('down', () => this.hideDialogue());
  
      this.isVisible = true;
      this.onShow();
    }
  
    hideDialogue() {
      if (!this.isVisible) return;
  
      this.dialogueBox.destroy();
      this.dialogueText.destroy();
  
      this.isVisible = false;
      this.onHide();
    }
  
    isDialogueOpen() {
      return this.isVisible;
    }
  }
  