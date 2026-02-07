// Game Configuration and Data

export const NPCs = {
  dwarf: {
    name: "Pip",
    description: "Small, nervous, intelligent.",
    dialogue: {
      first_meet: [
        "Please... you can hear us, right? The doors don't open anymore.",
        "I'm Pip. Don't trust the walls. They listen.",
        "We've been trapped here... how long now? Time moves differently in this place."
      ],
      agreed_to_help: [
        "Thank you. I know it's foolish to hope, but hope is a habit.",
        "Maybe together we can find what the shadows are hiding."
      ],
      wall_sounds: [
        "That scraping... it's learned our steps. It waits.",
        "Do you hear that? The walls are breathing again."
      ],
      troll_death: [
        "He stayed behind... he told me to go. I can't forget that.",
        "His last words were about the door... always about the door."
      ],
      general: [
        "This place feeds on fear. Try not to give it what it wants.",
        "The building remembers everyone who enters. But not everyone who leaves.",
        "Stay close to me. The shadows move when you're alone."
      ],
      trust_check: {
        high: "You're steady. I think we can do this together.",
        mid: "Stay close. The building changes when it likes you.",
        low: "I don't know who you are, but I know what this place does to people."
      }
    }
  },
  troll: {
    name: "The Troll",
    description: "Large, gentle, speaks in short truths.",
    dialogue: {
      first_meet: [
        "Welcome. I am here. We will leave. Together.",
        "The Dwarf is afraid. I am not afraid. But I am not brave.",
        "This place knows us. We know this place. Balance."
      ],
      comfort: [
        "Do you hurt? This place hurts. But we can leave.",
        "Pain is temporary. Fear is choice."
      ],
      sacrifice: [
        "I will be right behind you. Keep the Dwarf safe. Tell him... the door is open.",
        "Some doors need weight to hold them. I am weight."
      ],
      general: [
        "Building speaks. We listen. We understand.",
        "Small one worries. Big one protects. You... you choose.",
        "Stone remembers. Metal forgets. Choose wisely."
      ],
      trust_check: {
        high: "We walk with you. Path is clearer.",
        mid: "We walk. Step by step.",
        low: "Walking alone. Dangerous."
      }
    }
  }
};

export const PUZZLES = {
  first_door_code: {
    id: "first_door_code",
    solution: "1947",
    type: "sequence",
    clue: "The director's portrait lists the birth year 1947.",
    hints: [
      "Look for numbers in the director's portrait...",
      "Birth years are often significant...",
      "Four digits, starting with 19..."
    ],
    consequence(state) {
      state.flags.first_door_code_solved = true;
      state.addItem("Records Folder (Subject 47)");
      state.flags.records_found = true;
      state.flags.learned_truth = true;
      return "The drawer clicks open with a mechanical whir. Inside: a folder labeled SUBJECT 47, bound with dark red string. The pages feel warm to the touch.";
    }
  },
  cabinet_code: {
    id: "cabinet_code",
    solution: "739",
    type: "combination",
    clue: "Treatment chart numbers 7-3-9 are circled in fading ink.",
    hints: [
      "The treatment chart has specific numbers marked...",
      "Three digits, in sequence...",
      "Fear, Compliance, Isolation - count the letters?"
    ],
    consequence(state) {
      state.flags.cabinet_code_solved = true;
      state.addItem("Patient Journal");
      state.addItem("Medicine Vials (Red & Blue)");
      state.addItem("Strange Key (Basement)");
      return "The cabinet springs open with a hiss of stale air. Brittle journals crumble at your touch, and two vials - one blood-red, one ice-blue - roll forward. A strange key clatters to the floor.";
    }
  },
  cell_puzzle: {
    id: "cell_puzzle",
    solution: "CANNOT",
    type: "word",
    clue: "Scratches repeat: I AM HERE. I CANNOT LEAVE. IT CANNOT LEAVE. WE ARE THE SAME.",
    hints: [
      "The scratches form a pattern, a desperate message...",
      "What word appears most often in the scratches?",
      "Focus on what binds both the prisoner and the presence..."
    ],
    consequence(state) {
      state.flags.cell_puzzle_solved = true;
      state.chapter = 3;
      state.flags.white_skeleton_seen = true;
      return "The word CANNOT echoes in your mind. The scratches glow briefly, and a hidden door in the wall grinds open, revealing stairs descending into darkness. A white skeleton sits by the entrance, as if waiting.";
    }
  }
};

export const ROOMS = {
  entrance: {
    id: "entrance",
    name: "Entrance Corridor",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231a1a2e' width='400' height='200'/%3E%3Crect fill='%23333' x='50' y='80' width='300' height='100'/%3E%3Ctext x='200' y='130' text-anchor='middle' fill='%23666' font-size='14'%3EGates%3C/text%3E%3C/svg%3E",
    firstVisit: "Iron gates drip with cold rust. Dust floats through thin light, touching linoleum with the softness of ash. The corridor smells of old bleach and something damp beneath it.",
    revisit: "The entrance corridor waits with the same iron patience. The gates refuse every memory of a key.",
    npcPresence: ["dwarf", "troll"],
    choices(state) {
      if (!state.flags.met_dwarf_and_troll) {
        return [
          { text: "Listen to what they have to say", action: "entrance_listen" },
          { text: "Ask them who they are", action: "entrance_ask" },
          { text: "Demand to know where the exit is", action: "entrance_demand" }
        ];
      }
      return [
        { text: "Move forward", action: "go_hallway" },
        { text: "Talk to the Dwarf again", action: "talk_dwarf" },
        { text: "Try the gates", action: "try_gates" }
      ];
    }
  },
  hallway_main: {
    id: "hallway_main",
    name: "Hallway Main - Ward A",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231a1a2e' width='400' height='200'/%3E%3Cline x1='0' y1='100' x2='400' y2='100' stroke='%23666' stroke-width='2'/%3E%3Crect fill='%23333' x='80' y='60' width='40' height='80'/%3E%3Crect fill='%23333' x='280' y='60' width='40' height='80'/%3E%3C/svg%3E",
    firstVisit: "Flickering fluorescent tubes hum above. Behind wire mesh windows, doors are locked from both sides. The hallway stretches until it forgets itself.",
    revisit: "The lights stutter. The wire windows watch back.",
    npcPresence: ["dwarf", "troll"],
    choices(state) {
      return [
        { text: "Examine the doors", action: "hall_examine" },
        { text: "Head toward the administrative wing", action: "go_office" },
        { text: "Go to the medical ward", action: "go_medical" },
        { text: "Listen to the silence", action: "hall_listen" },
        state.relationships.troll.alive ? { text: "Ask the Troll a question", action: "talk_troll" } : null
      ].filter(Boolean);
    }
  },
  office: {
    id: "office",
    name: "Administrative Office",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231a1a2e' width='400' height='200'/%3E%3Crect fill='%23222' x='20' y='30' width='80' height='140'/%3E%3Crect fill='%23222' x='140' y='50' width='100' height='120'/%3E%3Ctext x='200' y='100' text-anchor='middle' fill='%23999' font-size='12'%3EPortrait%3C/text%3E%3C/svg%3E",
    firstVisit: "Desks hunch beneath brittle paperwork. The director's portrait watches the room, eyes flecked with varnish. Empty files speak in paper dust.",
    revisit: "The office smells of old ink and stale decisions.",
    npcPresence: ["dwarf"],
    choices(state) {
      return [
        { text: "Search the files more thoroughly", action: "office_search" },
        { text: "Examine the portrait more closely", action: "office_portrait" },
        { text: "Take the note", action: "office_note" },
        state.flags.examined_portrait && !state.flags.first_door_code_solved
          ? { text: "Try the locked desk drawer code...", action: "office_puzzle" }
          : null,
        state.flags.first_door_code_solved
          ? { text: "Examine the opened drawer contents", action: "office_drawer" }
          : null,
        { text: "Leave the office", action: "go_hallway" }
      ].filter(Boolean);
    }
  },
  medical: {
    id: "medical",
    name: "Medical Ward - Treatment Room",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231a1a2e' width='400' height='200'/%3E%3Crect fill='%23333' x='30' y='40' width='70' height='120'/%3E%3Crect fill='%23333' x='310' y='40' width='70' height='120'/%3E%3Crect fill='%23222' x='140' y='60' width='120' height='100'/%3E%3Ctext x='200' y='115' text-anchor='middle' fill='%23999' font-size='11'%3ECabinet%3C/text%3E%3C/svg%3E",
    firstVisit: "Beds with restraints line the walls. Unmarked bottles cling to a cabinet. A chart on the wall lists: FEAR, COMPLIANCE, ISOLATION, ACCEPTANCE, DISSOLUTION.",
    revisit: "The restraints rattle as the air moves. The chart is unchanged.",
    npcPresence: ["dwarf", "troll"],
    choices(state) {
      return [
        { text: "Examine the medicine cabinet", action: "medical_cabinet" },
        { text: "Study the treatment chart", action: "medical_chart" },
        { text: "Approach the secured ward door", action: "go_cell" },
        { text: "Leave the ward", action: "go_hallway" }
      ];
    }
  },
  cell: {
    id: "cell",
    name: "Secured Ward",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%230a0a0f' width='400' height='200'/%3E%3Crect fill='%23222' x='50' y='50' width='300' height='120' stroke='%23666' stroke-width='3'/%3E%3Ctext x='200' y='115' text-anchor='middle' fill='%23999' font-size='12'%3EI CANNOT LEAVE%3C/text%3E%3C/svg%3E",
    firstVisit: "A single concrete cell. Scratches carve desperate lines: I AM HERE. I CANNOT LEAVE. IT CANNOT LEAVE. WE ARE THE SAME. A stone platform squats in the center.",
    revisit: "The words claw into the wall each time you return.",
    npcPresence: ["dwarf"],
    choices(state) {
      return [
        { text: "Read the scratches more carefully", action: "cell_read" },
        { text: "Search for more clues in the cell", action: "cell_search" },
        { text: "Listen for sounds in the walls", action: "cell_listen" },
        state.flags.cell_puzzle_solved ? { text: "Step into the opened doorway", action: "go_basement" } : null,
        { text: "Leave immediately", action: "go_medical" }
      ].filter(Boolean);
    }
  },
  basement: {
    id: "basement",
    name: "Basement Corridor",
    background: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23050505' width='400' height='200'/%3E%3Crect fill='%23222' x='0' y='80' width='400' height='20'/%3E%3Cline x1='80' y1='50' x2='80' y2='150' stroke='%23666' stroke-width='3' opacity='0.4'/%3E%3Cline x1='320' y1='50' x2='320' y2='150' stroke='%23666' stroke-width='3' opacity='0.4'/%3E%3C/svg%3E",
    firstVisit: "Steam pipes sweat against the ceiling. Mist drags itself along the floor. A long, slow scraping repeats, patient as breathing.",
    revisit: "The scraping returns, closer, remembering you.",
    npcPresence: ["dwarf", "troll"],
    choices(state) {
      const exitChoices = state.flags.anaconda_weakening
        ? [
            { text: "Push toward the exit", action: "basement_escape" },
            { text: "Remain behind", action: "basement_stay" }
          ]
        : [];
      
      if (state.relationships.troll.alive) {
        return [
          { text: "Run forward", action: "basement_run" },
          { text: "Try to hide", action: "basement_hide" },
          { text: "Ask what it is", action: "basement_ask" },
          { text: "Hold your ground", action: "basement_hold" },
          ...exitChoices
        ];
      }
      return [
        { text: "Move through carefully", action: "basement_move" },
        { text: "The sound is different now. Weaker.", action: "basement_weaker" },
        { text: "Listen for the Dwarf", action: "basement_dwarf" },
        ...exitChoices
      ];
    }
  }
};

export const ENDINGS = {
  hope: {
    id: "hope",
    name: "HOPE",
    condition(state) {
      return state.flags.learned_truth &&
        state.relationships.dwarf.alive &&
        state.relationships.dwarf.trust > 20 &&
        (state.flags.anaconda_weakening || state.flags.cabinet_code_solved) &&
        !state.flags.troll_sacrifice;
    },
    text: "The gates open. You walk through them—all three of you.\nThe Dwarf, the Troll, and something like safety.\n\n\"We made it,\" the Dwarf whispers.\nThe Troll places a hand on his shoulder. \"We made it.\"\n\nThe building remains behind, hungry and unsatisfied.\nBut that's not your story anymore.\n\nENDING: HOPE"
  },
  truth: {
    id: "truth",
    name: "TRUTH",
    condition(state) {
      return state.flags.learned_truth &&
        state.flags.records_found &&
        (state.relationships.dwarf.alive || state.relationships.troll.alive) &&
        state.relationships.dwarf.trust > 30;
    },
    text: "You understand now. The building was never meant to cure.\nIt was meant to contain.\n\nThe missing person wasn't taken. They were added.\nSubject 47. Anomalous. No further details.\n\nOne will consume the other. You chose which one survived.\n\nENDING: TRUTH"
  },
  sacrifice: {
    id: "sacrifice",
    name: "SACRIFICE",
    condition(state) {
      return state.flags.troll_sacrifice &&
        !state.relationships.troll.alive &&
        state.relationships.dwarf.alive &&
        state.relationships.dwarf.trust > 30;
    },
    text: "The Troll held the door. The Troll kept his promise.\nThe door is open.\n\nYou and the Dwarf escape. But the weight of his sacrifice\nwill never leave you.\n\nIn your dreams, you hear his voice:\n\"I am still here.\"\n\nENDING: SACRIFICE"
  },
  acceptance: {
    id: "acceptance",
    name: "ACCEPTANCE",
    condition(state) {
      return state.flags.white_skeleton_seen &&
        state.flags.learned_truth &&
        state.flags.chose_to_stay &&
        state.relationships.dwarf.trust > 30 &&
        state.relationships.troll.trust > 30 &&
        state.flags.anaconda_weakening;
    },
    text: "You realize the truth: Some cannot leave.\nSome don't want to.\n\nThe building needs witnesses. Guardians.\nYou become one with the walls.\n\nThe Dwarf nods. \"I understand.\"\n\nThe gates close. You don't try them anymore.\n\nENDING: ACCEPTANCE"
  },
  alone: {
    id: "alone",
    name: "ALONE",
    condition(state) {
      return !state.relationships.dwarf.alive && !state.relationships.troll.alive;
    },
    text: "You escape. Alone.\n\nThe gates close behind you. You are free.\n\nBut in the silence, you hear scraping.\nAlways scraping.\n\nYou brought something with you.\nOr something brought you.\n\nENDING: ALONE"
  }
};

export const itemDescriptions = {
  "Handwritten Note": "It doesn't belong in the building. The building doesn't belong to it. One will consume the other. Hope for the second.",
  "Faded Photograph": "A smudged photo of three staff members. The director stands in the middle.",
  "Patient Journal": "Entries devolve from names to numbers. 47 repeats.",
  "Old Keycard (Red Clearance)": "Red clearance. The edge is warm.",
  "Medicine Vials (Red & Blue)": "Two vials. One cold, one warm.",
  "Records Folder (Subject 47)": "A folder bound with hospital string. Missing person: added, not taken.",
  "Lockpick Set": "Pip's lockpicks, made from wire and stubbornness.",
  "Strange Key (Basement)": "A key that feels wrong to hold. It vibrates slightly."
};
