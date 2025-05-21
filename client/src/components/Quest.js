export default class Quest extends Phaser.Scene {
    constructor() {
      super('QuestScene');
    }
  
    init(data) {
      this.playerName = data.playerName || 'Adventurer';
      this.stage = 0;
    }
  
    create() {
        this.createQuestWindow();
        this.displayNextStage();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.challengeActive = false;
    }

    update() {
        if (!this.challengeActive && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.displayNextStage();
        }
      
        if (this.challengeActive) {
            if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                // Handle both binary search and sorting challenges
                if (this.guessInput) {
                    this.checkBinaryGuess();
                } else if (this.pos1Input && this.pos2Input) {
                    this.checkSwapInput();
                }
            }
        }
    }

    createQuestWindow() {
      const { width, height } = this.cameras.main;
  
      // Background Panel
      this.panel = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.6, 0xf8f8f8)
        .setStrokeStyle(4, 0x000000)
        .setDepth(10);

      //Name Tag
      this.nameTag = this.add.text(this.panel.x - (this.panel.width / 2) + 10, this.panel.y - (this.panel.height / 2) + 10, "👨‍🦲 Master Monk", {
        fontSize: '22px',
        fontFamily: 'Georgia',
        color: '#8B0000',
        fontStyle: 'bold'
      }).setDepth(11);


      // Text Display
      this.textBox = this.add.text(width / 2 - (width * 0.35), height / 2 - (height * 0.25), '', {
        fontSize: '20px',
        fontFamily: 'Georgia',
        color: '#000',
        wordWrap: { width: width * 0.7 }
      }).setDepth(11);
  
      // Next Button
      this.nextBtn = this.add.text(width - 120, height - 60, 'Next ▶', {
        fontSize: '20px',
        backgroundColor: '#000',
        color: '#fff',
        padding: 10
      }).setInteractive().setDepth(12);
  
      this.nextBtn.on('pointerdown', () => this.displayNextStage());
    }
  
    displayNextStage() {
        const dialogues = [
            // 1. Warm welcome that honors their journey
            `🌅 "Brave ${this.playerName}, you stand at dawn's edge of a new path—one paved in code and curiosity. Your quest begins now."`,
            // 2. A call to arms about mastering one's mind
            `🧠 "In this realm, the fiercest battles are waged within your own mind. Sharpen your wits, for only the keenest intellect will survive."`,     
            // 3. Concept flash: tease Binary Search
            `🔍 **Binary Search** – "A method of precision, it divides your world in two each strike, narrowing in on truth with surgical speed."`,
            // 4. Immediate challenge prompt
            `⚔️ **Challenge:** "A hidden shrine among a thousand holds your Sacred Scroll. Each query reveals 'higher' or 'lower.' Find it in as few strikes as possible."`,
             // 5. Deep dive & praise after victory
            `🧠 Well done, ${this.playerName}. What you just used is known as **Binary Search**.`,
            `It's one of the most powerful tools a coder can use when working with **sorted data**.`,
            `Instead of checking each value one by one, you cleverly cut the problem in half each time.`,
            `This is how real programmers think: **minimizing effort, maximizing efficiency**.`,
            `From searching names in a phonebook to lookup tables in games – Binary Search is everywhere.`,
            `Let this lesson guide your future — a coder must always seek the optimal path.`,
             // 11. Concept flash: tease Bubble Sort
            `🌀 **Bubble Sort** – "A humble yet powerful ritual, it bubbles disorder upward until harmony reigns across your array."`,
             // 12. Immediate challenge prompt
            `🔄 **Bubble Sort Challenge:** "Swap two portraits at a time to arrange them from lowest to highest Code Points."`,             // 8. Final praise & send-off
            `🎉 "You have proven yourself an Algorithm Adept. Carry these skills forward—new trials await, and only those forged in code will prevail."`
          ];
          
  
      if (this.stage < dialogues.length) {
        if(this.stage === 4) {
            this.createBinarySearchChallenge();
            this.stage++;
            return;
        }
        
        if(this.stage === 11) {  // Index 6 is the 7th dialogue
            this.typeText(dialogues[this.stage]);
            this.createSortingChallenge();
            this.stage++;
            return;
        }

        this.typeText(dialogues[this.stage]);
        this.stage++;
      } else {
        // End of quest
        this.scene.stop(); // Stop Quest scene
        this.scene.get('MainScene').scene.resume(); // Resume main game
      }
    }

    typeText(fullText) {
        if(this.typingEvent) this.typingEvent.remove();
        this.textBox.setText('');

        let i = 0;
        this.typingEvent = this.time.addEvent({
            delay: 20,
            repeat: fullText.length - 1,
            callback: () => {
                this.textBox.text += fullText[i];
                i++;
                if(i === fullText.length) this.typingEvent.remove();
            }
        });
    }

    createBinarySearchChallenge() {
        this.challengeActive = true;
        this.tries = 0;
      
        // large sorted array
        this.binaryArray = Array.from({ length: 50 }, (_, i) => (i + 1));
        this.targetShrine = Phaser.Utils.Array.GetRandom(this.binaryArray);
        this.maxTries = Math.ceil(Math.log2(this.binaryArray.length));
        
        // Development helper: Log the target number
        console.log('🎯 Target Shrine Number:', this.targetShrine);
        console.log('📊 Max Tries Allowed:', this.maxTries);
      
        // Display scrolls
        this.scrollText = this.add.text(
          this.panel.x, this.panel.y - 100,
          this.binaryArray.join('  '),
          { font: "20px serif", fill: "#000" }
        )
        .setOrigin(0.5)
        .setDepth(11)
        .setScale(0.8);

        // Instruction Text
        this.inputInstruction = this.add.text(
          this.panel.x, 
          this.panel.y - 20,
          'Enter number & press Enter or Submit',
          {
            font: "16px serif",
            fill: "#000",
            backgroundColor: "#fff",
            padding: { x: 10, y: 5 }
          }
        )
        .setOrigin(0.5)
        .setDepth(12);

        // Create input using Phaser's DOM element system
        this.guessInput = this.add.dom(
            this.panel.x,
            this.panel.y + 10,
            'input',
            {
                type: 'number',
                fontSize: '18px',
                width: '150px',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #444',
                outline: 'none',
                position: 'absolute',
                zIndex: '1000'
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        if (this.guessInput && this.guessInput.node) {
            this.guessInput.node.style.pointerEvents = 'auto';
            this.guessInput.node.style.position = 'absolute';
            this.guessInput.node.style.zIndex = '1000';

            this.guessInput.node.addEventListener('input', (e) => {
                console.log('Input event:', e.target.value);
            });

            this.guessInput.node.addEventListener('keypress', (e) => {
                console.log('Keypress event:', e.key);
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.checkBinaryGuess();
                }
            });

            // Focus the input
            this.time.delayedCall(100, () => {
                this.guessInput.node.focus();
                console.log('Input focused');
            });
        }

        // Submit button
        this.submitBtn = this.add.text(
          this.panel.x,
          this.panel.y + 60,
          'Submit',
          {
            font: "18px serif",
            backgroundColor: "#444",
            color: "#fff",
            padding: { x: 10, y: 5 }
          }
        )
        .setOrigin(0.5)
        .setInteractive()
        .setDepth(12)
        .on('pointerdown', () => {
            console.log('Submit button clicked');
            this.checkBinaryGuess();
        });
      
        // Feedback text
        this.feedbackText = this.add.text(
          this.panel.x,
          this.panel.y + 100,
          '',
          {
            font: "18px serif",
            fill: "#800",
            backgroundColor: "#fff",
            padding: { x: 10, y: 5 }
          }
        )
        .setOrigin(0.5)
        .setDepth(12);
    }

    restartBinaryChallenge() {
        this.tries = 0;
        this.targetShrine = Phaser.Utils.Array.GetRandom(this.binaryArray);
        this.feedbackText.setText('');
        if (this.guessInput && this.guessInput.node) {
            this.guessInput.node.style.display = 'block';
            this.guessInput.node.value = '';
            this.guessInput.node.focus();
        }
        this.submitBtn.setVisible(true);
        this.challengeActive = true;
    }

    checkBinaryGuess() {
        console.log('Checking binary guess');
        if (!this.guessInput || !this.guessInput.node) {
            console.error('Input element not found');
            return;
        }

        const guess = parseInt(this.guessInput.node.value);
        console.log('Current guess:', guess);
        
        // Check for empty or invalid input
        if (isNaN(guess)) {
            console.log('Invalid input detected');
            this.feedbackText.setText('⚠️ Please enter a valid number!');
            this.guessInput.node.focus();
            return;
        }

        this.tries++;
        console.log('Tries:', this.tries);
      
        if (guess < this.targetShrine) {
            this.feedbackText.setText(`🔺 Seek higher than ${guess}...`);
        } else if (guess > this.targetShrine) {
            this.feedbackText.setText(`🔻 Too far. Try lower than ${guess}...`);
        } else {
            this.feedbackText.setText(`🎯 You found the hidden shrine in ${this.tries} tries!`);
            this.challengeActive = false;
      
            this.time.delayedCall(2500, () => {
                // Clean up all binary search challenge elements
                if (this.scrollText) {
                    this.scrollText.destroy();
                }
                if (this.inputInstruction) {
                    this.inputInstruction.destroy();
                }
                if (this.guessInput) {
                    this.guessInput.destroy();
                }
                if (this.submitBtn) {
                    this.submitBtn.destroy();
                }
                if (this.feedbackText) {
                    this.feedbackText.destroy();
                }
                
                // Reset challenge-related properties
                this.binaryArray = null;
                this.targetShrine = null;
                this.tries = 0;
                this.maxTries = 0;
                
                // Display next stage
                this.displayNextStage();
            });
            return;
        }
      
        if (this.tries >= this.maxTries) {
            this.feedbackText.setText(`❌ The shrine remains hidden... You must try again using your logic.`);
      
            this.time.delayedCall(2500, () => {
                this.restartBinaryChallenge();
            });
        }
      
        if (this.guessInput && this.guessInput.node) {
            this.guessInput.node.value = '';
        }
    }

    createSortingChallenge() {
        this.challengeActive = true;
        
        // Helper function to check if array is sorted
        const isSorted = (arr) => arr.every((_, idx) => idx === 0 || arr[idx][1] >= arr[idx - 1][1]);
        
        // Helper function to shuffle array
        const shuffleArray = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // Initial sorted array
        const initialArray = [ ['Ada', 40], ['Grace', 20], ['Linus', 80], ['Ken', 60], ['Tim', 10] ];
        
        // Shuffle until we get an unsorted array
        do {
            this.sortArray = [...initialArray];
            shuffleArray(this.sortArray);
        } while (isSorted(this.sortArray));

        this.swapCount = 0;
        // Maximum swaps = n*(n-1)/2 in worst Bubble Sort
        this.maxSwaps = (this.sortArray.length * (this.sortArray.length - 1)) / 2;

        // Development helper: Log the target order and initial state
        console.log('🎯 Target Order (by points):', initialArray.sort((a, b) => a[1] - b[1]));
        console.log('📊 Initial Unsorted Array:', this.sortArray);
        console.log('📊 Max Swaps Allowed:', this.maxSwaps);

        // Display the array as text sprites with values in front of names
        const displayText = this.sortArray.map(p => `[${p[1]}] ${p[0]}`).join('  |  ');
        
        this.sortText = this.add.text(
            this.panel.x,
            this.panel.y - 80,
            displayText,
            { 
                font: '20px serif',
                fill: '#000',
                backgroundColor: '#fff',
                padding: { x: 10, y: 5 },
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        // Add instruction text
        this.sortInstruction = this.add.text(
            this.panel.x,
            this.panel.y - 120,
            'Sort by Code Points (numbers in brackets)',
            {
                font: '16px serif',
                fill: '#000',
                backgroundColor: '#fff',
                padding: { x: 10, y: 5 }
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        // Two inputs for positions
        this.pos1Input = this.add.dom(
            this.panel.x - 100,
            this.panel.y,
            'input',
            {
                type: 'number',
                min: '1',
                max: `${this.sortArray.length}`,
                placeholder: 'Position 1',
                width: '80px',
                padding: '8px',
                fontSize: '18px',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #444',
                borderRadius: '8px'
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        this.pos2Input = this.add.dom(
            this.panel.x + 100,
            this.panel.y,
            'input',
            {
                type: 'number',
                min: '1',
                max: `${this.sortArray.length}`,
                placeholder: 'Position 2',
                width: '80px',
                padding: '8px',
                fontSize: '18px',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #444',
                borderRadius: '8px'
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        // Add event listeners for ENTER key
        if (this.pos1Input && this.pos1Input.node) {
            this.pos1Input.node.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.checkSwapInput();
                }
            });
        }
        if (this.pos2Input && this.pos2Input.node) {
            this.pos2Input.node.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.checkSwapInput();
                }
            });
        }

        // Swap button
        this.swapBtn = this.add.text(
            this.panel.x,
            this.panel.y + 50,
            'SWAP',
            {
                font: '20px serif',
                backgroundColor: '#444',
                color: '#fff',
                padding: { x: 10, y: 5 }
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .setDepth(12)
        .on('pointerdown', () => this.checkSwapInput());

        // Feedback text
        this.swapFeedback = this.add.text(
            this.panel.x,
            this.panel.y + 100,
            '',
            {
                font: '18px serif',
                fill: '#800',
                backgroundColor: '#fff',
                padding: { x: 10, y: 5 }
            }
        )
        .setOrigin(0.5)
        .setDepth(12);

        // Focus first input
        this.time.delayedCall(100, () => {
            if (this.pos1Input && this.pos1Input.node) {
                this.pos1Input.node.focus();
            }
        });
    }

    checkSwapInput() {
        if (!this.pos1Input || !this.pos2Input || !this.pos1Input.node || !this.pos2Input.node) {
            console.error('Input elements not found');
            return;
        }

        const pos1 = parseInt(this.pos1Input.node.value, 10);
        const pos2 = parseInt(this.pos2Input.node.value, 10);

        // Convert positions to indices (subtract 1)
        const i1 = pos1 - 1;
        const i2 = pos2 - 1;

        // Validate
        if (isNaN(pos1) || isNaN(pos2)) {
            this.swapFeedback.setText('⚠️ Please enter both positions!');
            return;
        }
        if (pos1 < 1 || pos1 > this.sortArray.length || pos2 < 1 || pos2 > this.sortArray.length) {
            this.swapFeedback.setText('⚠️ Positions must be between 1 and ' + this.sortArray.length);
            return;
        }
        if (pos1 === pos2) {
            this.swapFeedback.setText('⚠️ Choose two different positions!');
            return;
        }

        // Perform swap
        [this.sortArray[i1], this.sortArray[i2]] = [this.sortArray[i2], this.sortArray[i1]];

        this.swapCount++;
        // Update display with values in front of names
        const displayText = this.sortArray.map(p => `[${p[1]}] ${p[0]}`).join('  |  ');
        this.sortText.setText(displayText);
        this.swapFeedback.setText(`Swapped! (${this.swapCount}/${this.maxSwaps})`);

        // Check for sorted
        const isSorted = this.sortArray.every((_, idx, arr) =>
            idx === 0 || arr[idx][1] >= arr[idx - 1][1]
        );

        if (isSorted) {
            this.swapFeedback.setText(`✅ Sorted in ${this.swapCount} swaps!`);
            this.time.delayedCall(1500, () => this.onSortingSuccess());
        }
        else if (this.swapCount >= this.maxSwaps) {
            this.swapFeedback.setText('❌ Too many swaps! Restarting...');
            this.time.delayedCall(1500, () => this.restartSortingChallenge());
        }

        // Clear inputs
        this.pos1Input.node.value = '';
        this.pos2Input.node.value = '';
        // Focus first input
        this.pos1Input.node.focus();
    }

    restartSortingChallenge() {
        // Reset counter
        this.swapCount = 0;
        
        // Helper function to check if array is sorted
        const isSorted = (arr) => arr.every((_, idx) => idx === 0 || arr[idx][1] >= arr[idx - 1][1]);
        
        // Helper function to shuffle array
        const shuffleArray = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        // Initial sorted array
        const initialArray = [ ['Ada', 40], ['Grace', 20], ['Linus', 80], ['Ken', 60], ['Tim', 10] ];
        
        // Shuffle until we get an unsorted array
        do {
            this.sortArray = [...initialArray];
            shuffleArray(this.sortArray);
        } while (isSorted(this.sortArray));

        // Update UI with values in front of names
        const displayText = this.sortArray.map(p => `[${p[1]}] ${p[0]}`).join('  |  ');
        this.sortText.setText(displayText);
        this.swapFeedback.setText('');
        
        // Clear inputs
        if (this.pos1Input && this.pos1Input.node) {
            this.pos1Input.node.value = '';
            this.pos1Input.node.focus();
        }
        if (this.pos2Input && this.pos2Input.node) {
            this.pos2Input.node.value = '';
        }
    }

    onSortingSuccess() {
        // Clean up challenge UI
        if (this.sortText) this.sortText.destroy();
        if (this.sortInstruction) this.sortInstruction.destroy();
        if (this.pos1Input) this.pos1Input.destroy();
        if (this.pos2Input) this.pos2Input.destroy();
        if (this.swapBtn) this.swapBtn.destroy();
        if (this.swapFeedback) this.swapFeedback.destroy();

        // Reset challenge-related properties
        this.sortArray = null;
        this.swapCount = 0;
        this.maxSwaps = 0;

        // Advance to next dialogue stage
        this.challengeActive = false;
        this.displayNextStage();
    }
} 