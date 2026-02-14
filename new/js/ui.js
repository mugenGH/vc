// UI Management Module

import { gameState } from './gameState.js';
import { itemDescriptions } from './config.js';

export const ui = {
  menu: document.getElementById("menu"),
  scene: document.getElementById("scene"),
  dialogue: document.getElementById("dialogue"),
  choices: document.getElementById("choices"),
  inventory: document.getElementById("inventory"),
  inventoryGrid: document.getElementById("inventory-grid"),
  roomName: document.getElementById("room-name"),
  chapterInfo: document.getElementById("chapter-info"),
  clueInfo: document.getElementById("clue-info"),
  fearInfo: document.getElementById("fear-info"),
  backgroundImg: document.getElementById("background-img"),
  sceneText: document.getElementById("scene-text"),
  presence: document.getElementById("presence"),
  dialogueName: document.getElementById("dialogue-name"),
  dialogueText: document.getElementById("dialogue-text"),
  newGame: document.getElementById("new-game"),
  continueGame: document.getElementById("continue-game"),
  toggleAudio: document.getElementById("toggle-audio"),
  saveSlots: document.getElementById("save-slots"),
  overlay: document.getElementById("overlay"),
  puzzleModal: document.getElementById("puzzle-modal"),
  npcStatus: document.getElementById("npc-status")
};

export function setScene(room) {
  ui.roomName.textContent = room.name;
  ui.chapterInfo.textContent = "Chapter " + gameState.chapter;
  ui.clueInfo.textContent = "Clues: " + countClues();
  
  try {
    ui.backgroundImg.src = room.background;
  } catch (e) {
    console.warn("Background loading error:", e);
  }
  
  const visited = gameState.visitedRooms.has(room.id);
  const text = visited ? room.revisit : room.firstVisit;
  
  ui.sceneText.classList.add('text-updating');
  setTimeout(() => {
    ui.sceneText.textContent = text;
    gameState.actions.lastNarration = text;
    ui.sceneText.classList.remove('text-updating');
  }, 150);
  
  gameState.visitedRooms.add(room.id);
  renderPresence(room);
}

export function renderPresence(room) {
  ui.presence.innerHTML = "";
  const NPCs = window.NPCs;
  room.npcPresence.forEach((npcKey) => {
    const npc = gameState.relationships[npcKey];
    if (!npc || !npc.alive) return;
    const tag = document.createElement("span");
    tag.className = "presence-tag";
    tag.textContent = NPCs[npcKey].name;
    ui.presence.appendChild(tag);
  });
  
  if (!gameState.relationships.troll.alive) {
    const isolationTag = document.createElement("span");
    isolationTag.className = "presence-tag";
    isolationTag.style.cssText = "background: rgba(139,0,0,0.8); color: var(--parchment);";
    isolationTag.textContent = "Alone";
    ui.presence.appendChild(isolationTag);
  }
}

export function showDialogue(npcKey, text) {
  const NPCs = window.NPCs;
  const npc = NPCs[npcKey];
  
  ui.dialogue.hidden = true;
  setTimeout(() => {
    ui.dialogueName.textContent = npc.name;
    ui.dialogueText.textContent = text;
    ui.dialogue.hidden = false;
    gameState.actions.lastDialogue = { npcKey, text };
  }, 100);
}

export function clearDialogue() {
  ui.dialogue.hidden = true;
}

export function renderChoices(room) {
  ui.choices.innerHTML = "";
  const choices = room.choices(gameState);
  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.style.animationDelay = (index * 0.08) + "s";
    button.textContent = "→ " + choice.text;
    button.addEventListener("click", () => {
      window.triggerChoice(choice.action);
    });
    ui.choices.appendChild(button);
  });
}

export function renderInventory() {
  if (!ui.inventoryGrid) return;
  
  ui.inventoryGrid.innerHTML = "";
  gameState.inventory.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
      <div class="item-icon">📜</div>
      <span class="item-name">${item}</span>
    `;
    itemDiv.title = itemDescriptions[item] || item;
    ui.inventoryGrid.appendChild(itemDiv);
  });
  
  ui.inventory.hidden = gameState.inventory.length === 0;
}

export function updateStats() {
  const ROOMS = window.ROOMS;
  ui.roomName.textContent = ROOMS[gameState.currentRoom]?.name || "Unknown Room";
  ui.chapterInfo.textContent = `Chapter ${gameState.chapter}`;
  ui.clueInfo.textContent = `Clues: ${countClues()}`;
  ui.fearInfo.textContent = `Fear: ${gameState.chapter || 0}`;
}

export function countClues() {
  let count = 0;
  if (gameState.flags.examined_portrait) count++;
  if (gameState.flags.records_found) count++;
  if (gameState.flags.learned_truth) count++;
  if (gameState.flags.white_skeleton_seen) count++;
  if (gameState.flags.anaconda_weakening) count++;
  if (gameState.flags.cabinet_code_solved) count++;
  if (gameState.flags.cell_puzzle_solved) count++;
  if (gameState.flags.first_door_code_solved) count++;
  return count;
}

export function hideAllScreens() {
  ui.menu.hidden = true;
  ui.scene.hidden = true;
  ui.dialogue.hidden = true;
  ui.choices.hidden = true;
  ui.inventory.hidden = true;
  if (ui.puzzleModal) ui.puzzleModal.hidden = true;
}

export function showMainMenu() {
  hideAllScreens();
  ui.menu.hidden = false;
  ui.roomName.textContent = "Main Menu";
  ui.chapterInfo.textContent = "Chapter 0";
  ui.clueInfo.textContent = "Clues: 0";
  ui.fearInfo.textContent = "Fear: 0";
  renderSaveSlots();
}

export function showGame() {
  try {
    ui.menu.hidden = true;
    ui.scene.hidden = false;
    ui.choices.hidden = false;
    ui.inventory.hidden = false;
    
    const ROOMS = window.ROOMS;
    const room = ROOMS[gameState.currentRoom];
    if (!room) {
      gameState.currentRoom = "entrance";
    }
    
    const currRoom = ROOMS[gameState.currentRoom];
    setScene(currRoom);
    renderChoices(currRoom);
    renderInventory();
    updateStats();
    
    if (gameState.actions.lastDialogue) {
      const { npcKey, text } = gameState.actions.lastDialogue;
      showDialogue(npcKey, text);
    } else {
      clearDialogue();
    }
  } catch (error) {
    console.error("Error in showGame:", error);
    alert("Error starting game: " + error.message);
  }
}

export function renderSaveSlots() {
  ui.saveSlots.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const slotKey = "manualSave" + i;
    const raw = localStorage.getItem(slotKey);
    const data = raw ? JSON.parse(raw) : null;
    const slot = document.createElement("div");
    slot.className = "save-slot";
    
    const label = document.createElement("div");
    label.innerHTML = data
      ? "Slot " + i + ": Chapter " + data.chapter + " • Clues " + countCluesFromData(data) + " • " + new Date(data.timestamp).toLocaleString()
      : "Slot " + i + ": Empty";
    
    const actions = document.createElement("div");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      if (confirm("Overwrite this save slot?")) {
        gameState.save(slotKey);
        renderSaveSlots();
      }
    });
    
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.disabled = !data;
    loadBtn.addEventListener("click", () => {
      if (gameState.load(slotKey)) {
        showGame();
      }
    });
    
    actions.append(saveBtn, loadBtn);
    slot.append(label, actions);
    ui.saveSlots.appendChild(slot);
  }
}

export function countCluesFromData(data) {
  let count = 0;
  if (data.flags?.examined_portrait) count++;
  if (data.flags?.records_found) count++;
  if (data.flags?.white_skeleton_seen) count++;
  if (data.flags?.anaconda_weakening) count++;
  if (data.flags?.cabinet_code_solved) count++;
  if (data.flags?.cell_puzzle_solved) count++;
  if (data.flags?.first_door_code_solved) count++;
  if (data.flags?.learned_truth) count++;
  return count;
}

export function createButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "choice-btn";
  button.textContent = "→ " + label;
  button.addEventListener("click", onClick);
  return button;
}

export function getPsychologicalEffects(ui) {
  return {
    applyFlicker(element) {
      element.classList.add('flicker');
      setTimeout(() => element.classList.remove('flicker'), 800);
    },
    applyGlitch(element) {
      element.classList.add('glitch');
      setTimeout(() => element.classList.remove('glitch'), 600);
    },
    applyBlood(element) {
      element.classList.add('blood');
      setTimeout(() => element.classList.remove('blood'), 1400);
    }
  };
}
