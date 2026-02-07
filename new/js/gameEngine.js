// Game Engine Module - Core Game Logic

import { gameState } from './gameState.js';
import { setScene, renderChoices, renderInventory, updateStats, renderPresence, showDialogue, clearDialogue, createButton, getPsychologicalEffects, showMainMenu, showGame, ui } from './ui.js';
import { soundManager } from './soundManager.js';

export function switchRoom(roomId) {
  gameState.currentRoom = roomId;
  const ROOMS = window.ROOMS;
  const newRoom = ROOMS[roomId];
  
  if (!newRoom) {
    gameState.currentRoom = "entrance";
    switchRoom("entrance");
    return;
  }
  
  updatePresenceLevel();
  setScene(newRoom);
  renderChoices(newRoom);
  renderInventory();
  updateStats();
  
  soundManager.playEffect('door');
}

export function updatePresenceLevel() {
  const clueCount = Object.keys(gameState.flags).filter(f => gameState.flags[f]).length;
  const intensity = Math.min(clueCount / 10, 1.0);
  
  if (ui.presence) {
    ui.presence.style.opacity = intensity;
    ui.presence.style.fontSize = `${0.8 + intensity * 0.4}rem`;
    
    const messages = [
      "You feel watched...",
      "Something stirs in the shadows...",
      "The air grows heavy with malice...",
      "Ancient eyes track your movement...",
      "The building itself seems alive...",
      "Reality bends around your presence..."
    ];
    
    if (intensity > 0.2) {
      ui.presence.textContent = messages[Math.floor(intensity * messages.length)];
    } else {
      ui.presence.textContent = "";
    }
  }
}

export function handleChoice(action) {
  if (!action) return;
  
  const ROOMS = window.ROOMS;
  const NPCs = window.NPCs;
  const room = ROOMS[gameState.currentRoom];
  if (!room) return;
  
  let narration = null;
  let requestedEnding = false;
  
  ui.sceneText.classList.add('text-updating');
  
  const afterAction = () => {
    setTimeout(() => {
      if (narration) {
        ui.sceneText.textContent = narration;
        gameState.actions.lastNarration = narration;
        ui.sceneText.classList.remove('text-updating');
      }
      
      if (gameState.pendingEnding) {
        triggerEnding(gameState.actions.pendingEnding);
        return;
      }
      
      const nextRoom = ROOMS[gameState.currentRoom];
      if (gameState.currentRoom !== room.id) {
        setScene(nextRoom);
        renderChoices(nextRoom);
      } else {
        renderChoices(nextRoom);
        if (!narration) {
          ui.sceneText.classList.remove('text-updating');
        }
      }
      renderInventory();
      updateStats();
      setTimeout(() => gameState.save("autosave"), 500);
    }, narration ? 200 : 50);
  };

  // Handle all choice actions
  switch (action) {
    case "entrance_listen":
      gameState.flags.met_dwarf_and_troll = true;
      gameState.relationships.dwarf.met = true;
      gameState.relationships.troll.met = true;
      gameState.adjustTrust("dwarf", 10);
      gameState.adjustTrust("troll", 8);
      showDialogue("dwarf", NPCs.dwarf.dialogue.first_meet[0]);
      soundManager.playEffect("whisper");
      narration = "You let their words settle. The corridor seems to exhale, and for a moment the iron gates feel less certain.";
      break;
    case "entrance_ask":
      gameState.flags.met_dwarf_and_troll = true;
      gameState.relationships.dwarf.met = true;
      gameState.relationships.troll.met = true;
      gameState.adjustTrust("dwarf", 4);
      gameState.adjustTrust("troll", 4);
      showDialogue("troll", NPCs.troll.dialogue.first_meet[0]);
      narration = "They tell you their names. The building listens as if it remembers them.";
      break;
    case "entrance_demand":
      gameState.flags.met_dwarf_and_troll = true;
      gameState.relationships.dwarf.met = true;
      gameState.relationships.troll.met = true;
      gameState.adjustTrust("dwarf", -8);
      gameState.adjustTrust("troll", -5);
      showDialogue("dwarf", "The exit isn't a door anymore. It's a mood.");
      narration = "Your voice echoes, and the corridor answers with silence.";
      soundManager.playEffect("door");
      break;
    case "go_hallway":
      gameState.currentRoom = "hallway_main";
      break;
    case "talk_dwarf":
      showDialogue("dwarf", getDwarfDialogue());
      narration = gameState.actions.lastNarration;
      break;
    case "try_gates":
      narration = "The gates hold. Cold metal refuses your hands.";
      soundManager.playEffect("door");
      break;
    case "hall_examine":
      narration = "The doors are locked, but the wire mesh trembles like something brushed past from the inside.";
      soundManager.playEffect("scrape");
      break;
    case "go_office":
      gameState.currentRoom = "office";
      break;
    case "go_medical":
      gameState.currentRoom = "medical";
      break;
    case "hall_listen":
      narration = "The silence has texture. You hear breathing where there is no one.";
      gameState.flags.anaconda_weakening = true;
      soundManager.playEffect("breathing");
      break;
    case "talk_troll":
      showDialogue("troll", getTrollDialogue());
      narration = gameState.actions.lastNarration;
      break;
    case "office_search":
      narration = "The files crumble at the edges. Most are empty. One name repeats in torn ink: 47.";
      gameState.flags.records_found = true;
      gameState.flags.learned_truth = true;
      break;
    case "office_portrait":
      narration = "The director's portrait lists a birth year: 1947.";
      gameState.flags.examined_portrait = true;
      soundManager.playEffect("whisper");
      break;
    case "office_note":
      if (gameState.addItem("Handwritten Note")) {
        narration = "You take the note. The ink smells fresh despite its age.";
      } else {
        narration = "Your pack is full. The note waits.";
      }
      break;
    case "office_puzzle":
      createPuzzleInterface("first_door_code");
      return;
    case "office_drawer":
      narration = "The drawer remains open. The Subject 47 folder feels heavier each time you see it.";
      break;
    case "medical_cabinet":
      if (!gameState.flags.learned_truth) {
        narration = "The cabinet is locked by a simple keypad. Numbers are worn: 7, 3, 9.";
      } else if (!gameState.flags.cabinet_code_solved) {
        narration = "The cabinet keypad still waits for the correct code.";
        createPuzzleInterface("cabinet_code");
        return;
      } else {
        narration = "The cabinet stands open, its contents already claimed.";
      }
      break;
    case "medical_chart":
      narration = "FEAR. COMPLIANCE. ISOLATION. ACCEPTANCE. DISSOLUTION. The words feel like steps down a stairwell.";
      getPsychologicalEffects(ui).applyFlicker(ui.overlay);
      break;
    case "go_cell":
      if (!gameState.flags.cabinet_code_solved) {
        narration = "The secured ward door is sealed. You need to open the medical cabinet first.";
      } else {
        gameState.currentRoom = "cell";
      }
      break;
    case "cell_read":
      if (!gameState.flags.cell_puzzle_solved) {
        createPuzzleInterface("cell_puzzle");
        return;
      } else {
        narration = "The scratches have already revealed their secret. A hidden passage waits.";
      }
      break;
    case "cell_search":
      narration = "You press an ear to the wall. A slow scrape follows your breath.";
      gameState.flags.anaconda_weakening = true;
      soundManager.playEffect("scrape");
      break;
    case "cell_listen":
      narration = "Wet breathing answers you from the concrete.";
      soundManager.playEffect("breathing");
      break;
    case "basement_run":
      narration = "You run. The Troll stays to hold the weight of the door.";
      triggerTrollSacrifice();
      gameState.flags.anaconda_weakening = true;
      gameState.currentRoom = "hallway_main";
      break;
    case "basement_hide":
      narration = "You crouch behind pipes. The Dwarf flinches at your silence.";
      gameState.adjustTrust("dwarf", -10);
      gameState.adjustTrust("troll", -8);
      soundManager.playEffect("heartbeat");
      break;
    case "basement_ask":
      narration = "The Troll speaks without looking back: \"It remembers us. It is not angry. It is hungry.\"";
      gameState.adjustTrust("troll", 5);
      break;
    case "basement_hold":
      narration = "You stand your ground. The scraping shifts away, uncertain.";
      gameState.adjustTrust("troll", 8);
      gameState.adjustTrust("dwarf", 6);
      gameState.flags.anaconda_weakening = true;
      getPsychologicalEffects(ui).applyGlitch(ui.overlay);
      break;
    case "basement_escape":
      narration = "You move toward the exit, the gates trembling as if the building is deciding.";
      requestedEnding = true;
      break;
    case "basement_stay":
      narration = "You stop. The corridor hums with recognition. Some doors open by closing.";
      gameState.flags.chose_to_stay = true;
      requestedEnding = true;
      break;
    case "basement_move":
      narration = "You step carefully through mist and memory. The exit breathes somewhere ahead.";
      gameState.flags.anaconda_weakening = true;
      break;
    case "basement_weaker":
      narration = "The scraping grows thin, like it is being pulled away from the walls.";
      gameState.flags.anaconda_weakening = true;
      break;
    case "basement_dwarf":
      if (!gameState.relationships.troll.alive) {
        narration = "You call out softly. The Dwarf's voice responds from the mist: 'I'm here. We're going to be okay.'";
        gameState.adjustTrust("dwarf", 8);
        showDialogue("dwarf", "The Troll saved us both. We have to keep moving.");
      } else {
        narration = "The Dwarf is right beside you, as always.";
      }
      break;
    case "go_basement":
      if (gameState.flags.cell_puzzle_solved) {
        gameState.currentRoom = "basement";
        if (gameState.chapter < 3) {
          gameState.chapter = 3;
        }
      } else {
        narration = "The hidden passage remains sealed.";
      }
      break;
    default:
      narration = "Nothing happens. The building watches silently.";
      break;
  }

  const endingTriggered = checkEndings(requestedEnding);
  if (requestedEnding && !endingTriggered) {
    narration = "The door refuses. Something is missing.";
  }
  afterAction();
}

export function attemptPuzzle(id, answer) {
  const PUZZLES = window.PUZZLES;
  const puzzle = PUZZLES[id];
  let isCorrect = false;
  
  if (puzzle.type === 'sequence_items') {
    isCorrect = Array.isArray(answer) && 
               answer.length === puzzle.solution.length &&
               answer.every((item, index) => item === puzzle.solution[index]);
  } else {
    isCorrect = String(answer).toUpperCase() === String(puzzle.solution).toUpperCase();
  }
  
  if (isCorrect) {
    soundManager.playEffect("door");
    return puzzle.consequence(gameState);
  }
  soundManager.playEffect("scare");
  return "The attempt fails. Something resists your efforts.";
}

export function getDwarfDialogue() {
  const NPCs = window.NPCs;
  const trust = gameState.relationships.dwarf.trust;
  const dialogues = NPCs.dwarf.dialogue;
  
  if (gameState.flags.troll_sacrifice) {
    return getRandomDialogue(dialogues.troll_death);
  }
  if (gameState.flags.anaconda_weakening) {
    return getRandomDialogue(dialogues.wall_sounds);
  }
  
  const generalDialogue = getRandomDialogue(dialogues.general);
  const trustDialogue = trust > 40 ? dialogues.trust_check.high :
                       trust >= 0 ? dialogues.trust_check.mid :
                       dialogues.trust_check.low;
  
  return Math.random() > 0.6 ? generalDialogue : trustDialogue;
}

export function getTrollDialogue() {
  const NPCs = window.NPCs;
  const trust = gameState.relationships.troll.trust;
  const dialogues = NPCs.troll.dialogue;
  
  const generalDialogue = getRandomDialogue(dialogues.general);
  const trustDialogue = trust > 40 ? dialogues.trust_check.high :
                       trust >= 0 ? dialogues.trust_check.mid :
                       dialogues.trust_check.low;
  
  return Math.random() > 0.5 ? generalDialogue : trustDialogue;
}

export function createPuzzleInterface(puzzleId) {
  const PUZZLES = window.PUZZLES;
  const puzzle = PUZZLES[puzzleId];
  const modal = ui.puzzleModal;
  const title = document.getElementById('puzzle-title');
  const content = document.getElementById('puzzle-content');
  const hints = document.getElementById('puzzle-hints');
  const controls = document.getElementById('puzzle-controls');
  
  title.textContent = `${puzzle.type.toUpperCase()} PUZZLE`;
  
  if (puzzle.type === 'sequence' || puzzle.type === 'combination' || puzzle.type === 'word') {
    content.innerHTML = `
      <p style="margin-bottom: 16px; color: var(--parchment);">${puzzle.clue}</p>
      <input type="text" class="puzzle-input" id="puzzle-answer" 
             placeholder="Enter ${puzzle.type === 'word' ? 'word' : 'code'}..." maxlength="10">
    `;
  }
  
  hints.innerHTML = `
    <p style="margin-bottom: 8px; color: var(--neon-blue);">Need help?</p>
    ${puzzle.hints.map((hint, index) => `
      <button class="hint-btn" onclick="window.revealHintUI(${index}, '${puzzleId}')" id="hint-${index}">
        Hint ${index + 1}
      </button>
    `).join('')}
  `;
  
  controls.innerHTML = `
    <button class="choice-btn" style="margin: 16px 8px 0 0;" onclick="window.solvePuzzleUI('${puzzleId}')">Solve</button>
    <button class="choice-btn" style="margin: 16px 0 0 8px;" onclick="window.closePuzzleUI()">Close</button>
  `;
  
  modal.hidden = false;
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      window.closePuzzleUI();
    }
  };
  
  const input = document.getElementById('puzzle-answer');
  if (input) {
    setTimeout(() => {
      input.focus();
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          window.solvePuzzleUI(puzzleId);
        }
      };
    }, 100);
  }
}

export function triggerTrollSacrifice() {
  if (!gameState.relationships.troll.alive) return;
  gameState.relationships.troll.alive = false;
  gameState.flags.troll_sacrifice = true;
  gameState.adjustTrust("dwarf", 12);
  showDialogue("troll", NPCs.troll.dialogue.sacrifice[0]);
  getPsychologicalEffects(ui).applyBlood(ui.overlay);
}

export function checkEndings(requested) {
  const ENDINGS = window.ENDINGS;
  if (!requested) return false;
  for (const key of Object.keys(ENDINGS)) {
    const ending = ENDINGS[key];
    if (ending.condition(gameState)) {
      gameState.actions.pendingEnding = ending;
      return true;
    }
  }
  return false;
}

export function triggerEnding(ending) {
  gameState.currentRoom = "entrance";
  ui.sceneText.textContent = ending.text;
  ui.dialogue.hidden = true;
  ui.choices.innerHTML = "";
  ui.inventory.innerHTML = "";
  ui.choices.appendChild(createButton("Return to Menu", () => showMainMenu()));
}

export function startNewGame() {
  try {
    gameState.reset();
    gameState.chapter = 1;
    gameState.currentRoom = "entrance";
    gameState.actions = {
      lastNarration: "",
      lastDialogue: null,
      pendingEnding: null
    };
    showGame();
  } catch (e) {
    console.error("New Game Error:", e);
    alert("Failed to start new game: " + e.message);
  }
}

export function getRandomDialogue(dialogueArray) {
  return dialogueArray[Math.floor(Math.random() * dialogueArray.length)];
}
