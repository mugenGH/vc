// Game State Management

export class GameState {
  constructor() {
    this.chapter = 0;
    this.currentRoom = "entrance";
    this.inventory = [];
    this.maxInventorySize = 8;
    this.audioOn = true;
    
    this.relationships = {
      dwarf: { trust: 0, alive: true, met: false },
      troll: { trust: 0, alive: true, met: false }
    };
    
    this.flags = {
      met_dwarf_and_troll: false,
      first_door_code_solved: false,
      cabinet_code_solved: false,
      cell_puzzle_solved: false,
      examined_portrait: false,
      records_found: false,
      learned_truth: false,
      white_skeleton_seen: false,
      anaconda_weakening: false,
      troll_sacrifice: false,
      chose_to_stay: false
    };
    
    this.visitedRooms = new Set();
    this.actions = {
      lastNarration: "",
      lastDialogue: null,
      pendingEnding: null
    };
  }

  addItem(item) {
    if (this.inventory.length < this.maxInventorySize) {
      this.inventory.push(item);
      return true;
    }
    return false;
  }

  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  hasItem(item) {
    return this.inventory.includes(item);
  }

  adjustTrust(npc, amount) {
    if (this.relationships[npc]) {
      this.relationships[npc].trust = Math.max(0, this.relationships[npc].trust + amount);
    }
  }

  getTrust(npc) {
    return this.relationships[npc]?.trust || 0;
  }

  setNPCAlive(npc, alive) {
    if (this.relationships[npc]) {
      this.relationships[npc].alive = alive;
    }
  }

  isNPCAlive(npc) {
    return this.relationships[npc]?.alive || false;
  }

  serialize() {
    return {
      chapter: this.chapter,
      currentRoom: this.currentRoom,
      inventory: [...this.inventory],
      relationships: JSON.parse(JSON.stringify(this.relationships)),
      flags: JSON.parse(JSON.stringify(this.flags)),
      visitedRooms: Array.from(this.visitedRooms)
    };
  }

  apply(data) {
    if (data.chapter !== undefined) this.chapter = data.chapter;
    if (data.currentRoom) this.currentRoom = data.currentRoom;
    if (data.inventory) this.inventory = [...data.inventory];
    if (data.relationships) this.relationships = JSON.parse(JSON.stringify(data.relationships));
    if (data.flags) this.flags = JSON.parse(JSON.stringify(data.flags));
    if (data.visitedRooms) this.visitedRooms = new Set(data.visitedRooms);
  }

  save(slotName = "autosave") {
    try {
      localStorage.setItem(`asylum_save_${slotName}`, JSON.stringify(this.serialize()));
      return true;
    } catch (e) {
      console.warn("Could not save game:", e);
      return false;
    }
  }

  load(slotName = "autosave") {
    try {
      const saveData = localStorage.getItem(`asylum_save_${slotName}`);
      if (saveData) {
        this.apply(JSON.parse(saveData));
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Could not load game:", e);
      return false;
    }
  }

  hasSave(slotName = "autosave") {
    return localStorage.getItem(`asylum_save_${slotName}`) !== null;
  }

  deleteSave(slotName) {
    try {
      localStorage.removeItem(`asylum_save_${slotName}`);
      return true;
    } catch (e) {
      return false;
    }
  }

  reset() {
    this.chapter = 0;
    this.currentRoom = "entrance";
    this.inventory = [];
    this.relationships = {
      dwarf: { trust: 0, alive: true, met: false },
      troll: { trust: 0, alive: true, met: false }
    };
    this.flags = {
      met_dwarf_and_troll: false,
      first_door_code_solved: false,
      cabinet_code_solved: false,
      cell_puzzle_solved: false,
      examined_portrait: false,
      records_found: false,
      learned_truth: false,
      white_skeleton_seen: false,
      anaconda_weakening: false,
      troll_sacrifice: false,
      chose_to_stay: false
    };
    this.visitedRooms.clear();
    this.actions = {
      lastNarration: "",
      lastDialogue: null,
      pendingEnding: null
    };
  }
}

export const gameState = new GameState();
