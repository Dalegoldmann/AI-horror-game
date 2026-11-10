export interface StoryOption {
  key: number;
  label: string;
  nextNodeId: string;
  soundEffect?: 'click' | 'thump';
  tensionChange?: number; // e.g. +1, -1, 0
}

export interface StoryNode {
  id: string;
  breath: number;
  text: string;
  options: StoryOption[];
  isEnding?: boolean;
  isLoss?: boolean;
  lossCause?: string;
  lossAnalysis?: string;
  endingType?: 'survived' | 'transformed' | 'consumed' | 'escaped' | 'lost' | 'fatal';
  endingTitle?: string;
  relicDiscovered?: string;
}

export const INITIAL_NODE_ID = 'start';

export const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: 'start',
    breath: 1,
    text: "You awaken on cold wet flagstones. It is pitch black, but something warm and ragged is breathing against the base of your neck. It smells like damp soil and zinc.",
    options: [
      { key: 1, label: "Freeze. Do not inhale or move.", nextNodeId: "freeze_1", tensionChange: 0 },
      { key: 2, label: "Reach behind your head to feel what it is.", nextNodeId: "reach_1", tensionChange: 1 },
      { key: 3, label: "Scream and scramble forward on all fours.", nextNodeId: "scramble_1", tensionChange: 2 },
      { key: 4, label: "Ask into the dark: 'Who is there?'", nextNodeId: "ask_1", tensionChange: 1 },
    ],
  },

  // ================= BRANCH 1: FREEZE PATH (Stealth & Tension) =================
  freeze_1: {
    id: 'freeze_1',
    breath: 2,
    text: "Your muscles lock like iron. The entity's exhalation billows across your nape—humid, smelling of rot and copper. A long, segmented claw rests lightly against your collarbone, feather-light. It is listening for your pulse.",
    options: [
      { key: 1, label: "Slow your breathing by counting backwards from ten.", nextNodeId: "calm_2", tensionChange: -1 },
      { key: 2, label: "Slide your right hand across the wet flagstones for a stone.", nextNodeId: "search_stone_2", tensionChange: 1 },
      { key: 3, label: "Exhale in a slow, steady, controlled shudder.", nextNodeId: "exhale_2", tensionChange: 0 },
      { key: 4, label: "Inhale sharply and roll onto your side.", nextNodeId: "loss_freeze_panic", tensionChange: 3 },
    ],
  },

  loss_freeze_panic: {
    id: 'loss_freeze_panic',
    breath: 2,
    text: "Your lungs hitch as you draw in a sudden, sharp gasp of air and jerk sideways. The segmented claw on your collarbone contracts instantly. With hydraulic power, four hooked talons shear through your sternum and anchor into your ribcage. You are slammed back against the flagstones before your breath can even catch. The entity descends upon your pinned chest, its humid exhalation blotting out the blackness until silence claims the chamber.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // SUDDEN MOVEMENT TRIGGER",
    lossCause: "PREDATORY CLAW REFLEX & THORACIC CRUSH",
    lossAnalysis: "The organism's claw was resting on your carotid and collarbone to measure respiration. Drawing an audible gasp and shifting sudden mass triggered an involuntary predatory grip with zero reaction window.",
    options: [],
  },

  exhale_2: {
    id: 'exhale_2',
    breath: 3,
    text: "You release the air between parted lips in a soundless, microscopic stream. The warmth against your neck recedes by half an inch. The claw lifts from your bone, its joint clicking softly like porcelain. You hear the creature shift its immense bulk toward the far side of the chamber.",
    options: [
      { key: 1, label: "Crawl in the opposite direction toward the draft.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 2, label: "Check your pockets for tools while it turns away.", nextNodeId: "pockets_3", tensionChange: -1 },
      { key: 3, label: "Stay motionless for another two minutes.", nextNodeId: "ambush_wait_3", tensionChange: -1 },
      { key: 4, label: "Stand up quickly to test your footing.", nextNodeId: "stand_wall_3", tensionChange: 1 },
    ],
  },

  calm_2: {
    id: 'calm_2',
    breath: 3,
    text: "Ten. Nine. Eight. Your heart decelerates into a hollow, sluggish rhythm. The claw hovers, confused by the sudden stillness. It slowly retracts with a sound like dry reeds rubbing together. Ahead in the pitch black, you hear water dripping into a deep basin.",
    options: [
      { key: 1, label: "Roll onto your stomach and crawl toward the sound of dripping water.", nextNodeId: "water_basin_3", tensionChange: 0 },
      { key: 2, label: "Wait in silence until the entity moves completely away.", nextNodeId: "ambush_wait_3", tensionChange: -1 },
      { key: 3, label: "Stand up slowly using the cold wall for support.", nextNodeId: "stand_wall_3", tensionChange: 1 },
      { key: 4, label: "Check your pockets without making fabric rustle.", nextNodeId: "pockets_3", tensionChange: 0 },
    ],
  },

  ambush_wait_3: {
    id: 'ambush_wait_3',
    breath: 4,
    text: "You lie motionless on the cold stone. Minutes stretch into infinity. In the absence of your panic, your hearing sharpens: you detect the slow rhythm of the creature's exhalations moving into a distant alcove, and the faint whistling of outside air from a low channel.",
    options: [
      { key: 1, label: "Slip into the drainage channel following the whistle.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 2, label: "Search the coat pockets you haven't checked.", nextNodeId: "pockets_3", tensionChange: 0 },
      { key: 3, label: "Creep toward the sound of dripping water.", nextNodeId: "water_basin_3", tensionChange: 0 },
      { key: 4, label: "Whisper into the void to test if it has truly gone.", nextNodeId: "ask_1", tensionChange: 1 },
    ],
  },

  stand_wall_3: {
    id: 'stand_wall_3',
    breath: 4,
    text: "You press your palms against the slime-sheathed stone wall and rise inch by inch. Your knees tremble under your weight, but you manage to gain your feet without a sound. High above, you feel a faint subterranean draft circulating along the ceiling vault.",
    options: [
      { key: 1, label: "Feel along the masonry wall for an iron sconce or latch.", nextNodeId: "pipe_lock_5", tensionChange: 0 },
      { key: 2, label: "Reach into your pockets to inspect your inventory.", nextNodeId: "pockets_3", tensionChange: 0 },
      { key: 3, label: "Walk forward with hands outstretched.", nextNodeId: "loss_chasm_fall", tensionChange: 2 },
      { key: 4, label: "Drop back to all fours to stay low.", nextNodeId: "follow_draft_4", tensionChange: -1 },
    ],
  },

  search_stone_2: {
    id: 'search_stone_2',
    breath: 3,
    text: "Your fingers skim the wet flagstones. You grab a jagged flint cobble. The beast notices the scrape of stone and leans in closer, its wet muzzle inches from your temple.",
    options: [
      { key: 1, label: "Strike the flint against the flagstones to throw sparks.", nextNodeId: "loss_methane_ignition", tensionChange: 3 },
      { key: 2, label: "Drop the stone quietly into the water trough.", nextNodeId: "throw_pebble_3", tensionChange: -1 },
      { key: 3, label: "Hold the stone as a concealed fist weapon.", nextNodeId: "grab_shard_3", tensionChange: 1 },
      { key: 4, label: "Wait without moving a single tendon.", nextNodeId: "calm_2", tensionChange: -1 },
    ],
  },

  loss_methane_ignition: {
    id: 'loss_methane_ignition',
    breath: 3,
    text: "You scrape the flint against the slate. A shower of brilliant white sparks arcs through the black air. Instantly, the unseen atmosphere catches fire—a silent, violet shockwave that ignites decades of accumulated subterranean methane. The concussive blast detonates directly against your eardrums and shatters the vault ceiling above. Tons of medieval masonry collapse downward in an avalanche of limestone. You are crushed beneath three thousand pounds of rock before the fire can even scorch your clothes.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CONCUSSIVE METHANE DEFLAGRATION",
    lossCause: "ATMOSPHERIC DETONATION & VAULT COLLAPSE",
    lossAnalysis: "Subterranean crypts adjacent to stagnant water basins accumulate dense pockets of coal-bed methane. Striking an open spark ignited an unventilated atmospheric envelope, triggering catastrophic structural collapse.",
    options: [],
  },

  pockets_3: {
    id: 'pockets_3',
    breath: 4,
    text: "Your fingertips slide into your coat lining. You find three items: a damp sulphur match, an ornate brass clockwork key, and a jagged chunk of chalk. A faint draft of cold cellar air brushes past your ankles.",
    relicDiscovered: "Ornate Brass Clockwork Key",
    options: [
      { key: 1, label: "Keep the brass key gripped tight in your palm.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 2, label: "Strike the sulphur match against the flagstones.", nextNodeId: "loss_methane_ignition", tensionChange: 2 },
      { key: 3, label: "Follow the cold draft brushing against your ankles.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 4, label: "Crawl blindly toward the far wall.", nextNodeId: "loss_chasm_fall", tensionChange: 2 },
    ],
  },

  follow_draft_4: {
    id: 'follow_draft_4',
    breath: 5,
    text: "You crawl along the air current. The floor slopes steeply downward. The stones become slick with black algae. You reach a narrow drainage channel carved with Roman numerals. The air here tastes like distant rain.",
    options: [
      { key: 1, label: "Squeeze into the drainage pipe head-first.", nextNodeId: "pipe_crawl_5", tensionChange: 2 },
      { key: 2, label: "Feel along the pipe rim for a locking mechanism.", nextNodeId: "pipe_lock_5", tensionChange: 0 },
      { key: 3, label: "Turn around and return to the main hall.", nextNodeId: "loss_ambush_turn", tensionChange: 2 },
      { key: 4, label: "Listen down the pipe for voices or machinery.", nextNodeId: "pipe_lock_5", tensionChange: -1 },
    ],
  },

  loss_ambush_turn: {
    id: 'loss_ambush_turn',
    breath: 5,
    text: "You turn your back on the draft and begin crawling back toward the chamber. You make it ten feet before your hands slap against something warm and pulsing. You have crawled directly between the entity's four splayed legs. The creature does not hesitate; two massive forelimbs slam together like the doors of a bank vault, crushing your cranium between the flagstones. Your fifth breath ends in absolute darkness.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CRAWLED INTO THE JAWS",
    lossCause: "CRANIAL COMPRESSION & AMBUSH ENCOUNTER",
    lossAnalysis: "Backtracking into an unmapped apex predator's patrol radius while on hands and knees eliminated your field of retreat and placed you directly in its feeding stance.",
    options: [],
  },

  pipe_crawl_5: {
    id: 'pipe_crawl_5',
    breath: 6,
    text: "You squeeze into the narrow stone conduit. The wet walls constrict around your ribs until you can barely expand your lungs. Up ahead, iron grating blocks the exit, and stagnant water begins rising around your chin.",
    options: [
      { key: 1, label: "Examine the padlock on the iron grating with your hands.", nextNodeId: "pipe_lock_5", tensionChange: 0 },
      { key: 2, label: "Thrash backward to escape the flooding conduit.", nextNodeId: "loss_pipe_drown", tensionChange: 3 },
      { key: 3, label: "Inhale your sixth breath and feel for the keyhole.", nextNodeId: "pipe_lock_5", tensionChange: -1 },
      { key: 4, label: "Kick the grating with all your strength.", nextNodeId: "loss_grate_exhaustion", tensionChange: 2 },
    ],
  },

  loss_pipe_drown: {
    id: 'loss_pipe_drown',
    breath: 6,
    text: "Panic seizes you as the cold silt water rises past your lips. You attempt to wrench your shoulders backward, but the rough stone masonry hooks your coat fabric like teeth. Your heels kick frantically in the tight pipe, churning up suffocating mud. Water pours down your trachea. In the absolute, lightless crawlspace, your hands claw helplessly at the stone ceiling until your consciousness sinks into the black water.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // DROWNED IN DRAINAGE CONDUIT",
    lossCause: "ASPHYXIATION VIA SUBTERRANEAN SILT INUNDATION",
    lossAnalysis: "Thrashing violently inside an 18-inch conduit induced immediate fabric snagging. Panic accelerated oxygen consumption from 3 minutes to under 20 seconds.",
    options: [],
  },

  pipe_lock_5: {
    id: 'pipe_lock_5',
    breath: 6,
    text: "Your fingers trace a heavy iron grate padlocked with an ancient brass cylinder. It features a clover-shaped keyhole identical to the clockwork key in your pocket.",
    options: [
      { key: 1, label: "Coat the keyhole with stagnant algae and turn the key.", nextNodeId: "oil_key_6", tensionChange: -1 },
      { key: 2, label: "Insert the key and violently twist it without oiling.", nextNodeId: "loss_broken_key", tensionChange: 2 },
      { key: 3, label: "Force the grate open with your bare shoulders.", nextNodeId: "loss_grate_exhaustion", tensionChange: 2 },
      { key: 4, label: "Call down the shaft for help.", nextNodeId: "loss_call_shaft", tensionChange: 3 },
    ],
  },

  loss_broken_key: {
    id: 'loss_broken_key',
    breath: 6,
    text: "Frantic with terror, you jam the brass key into the rusted cylinder and wrench it sideways with all your strength. *SNAP.* The ornate clover head breaks off in your fingers, leaving the brass shaft jammed permanently inside the corroded tumbler. Behind you, the heavy dragging of wet hide across flagstones reaches the entrance of the pipe. You are cornered at a dead end with no tools, no key, and no exit.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // SHEARED ESCAPE KEY",
    lossCause: "CORRODED LOCK FAILURE & TRAPPED IN DEAD END",
    lossAnalysis: "Centuries of mineral crusting jammed the internal tumblers. Applying unlubricated torsional torque exceeded the shear strength of antique brass alloy.",
    options: [],
  },

  loss_grate_exhaustion: {
    id: 'loss_grate_exhaustion',
    breath: 6,
    text: "You slam your shoulder against the iron grate once, twice, three times. The padlock rattles, but the iron bars don't budge. The frantic metallic ringing reverberates down the drainage pipe like a dinner bell. From the pitch black behind you comes a heavy slithering sound. Before you can turn around, six segmented legs drive you flat against the bars. A jagged proboscis pierces the base of your skull. Your seventh breath is siphoned out, cold and still.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CORNERED AT THE IRON GRATE",
    lossCause: "ACOUSTIC ATTRACTION & CERVICAL PUNCTURE",
    lossAnalysis: "Striking iron against iron produced high-frequency acoustic waves that summoned the entity directly to your dead end.",
    options: [],
  },

  oil_key_6: {
    id: 'oil_key_6',
    breath: 7,
    text: "You lubricate the tumbler with slick biofilm. The key slides in without a murmur. A heavy *clunk* resonates deep within the stone jambs. The grate unlatches, swinging open into an ascending tunnel.",
    options: [
      { key: 1, label: "Climb through and latch the iron grate shut behind you.", nextNodeId: "latch_grate_7", tensionChange: -1 },
      { key: 2, label: "Leave the grate wide open and run up the stairs.", nextNodeId: "loss_open_grate_pursuit", tensionChange: 2 },
      { key: 3, label: "Call down the shaft one last time.", nextNodeId: "loss_call_shaft", tensionChange: 3 },
      { key: 4, label: "Inspect the threshold for tripwires or pressure plates.", nextNodeId: "latch_grate_7", tensionChange: 0 },
    ],
  },

  loss_call_shaft: {
    id: 'loss_call_shaft',
    breath: 7,
    text: "You cup your hands and shout into the dark shaft: 'Is anyone out there?' Your voice bounces down the stone corridors. In response, a subterranean roar erupts—not sound, but an ultrasonic shockwave that liquefies your balance. The entity arrives at blurring speed. Claws rip through the unlatched grate and drag you by the ankles back into the abyss. You feel every jagged stone as you are hauled down into the feeding pit.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // VOCAL ECHOLOCATION SUMMONS",
    lossCause: "ACOUSTIC HOMING & ABDUCTION INTO FEEDING PIT",
    lossAnalysis: "Vocalizing into a resonant vertical stone chimney focused sound waves directly into the creature's vestibular organs, triggering an immediate predatory charge.",
    options: [],
  },

  loss_open_grate_pursuit: {
    id: 'loss_open_grate_pursuit',
    breath: 7,
    text: "You sprint up the spiral stone stairs, leaving the heavy iron grate hanging wide open. Behind you, the entity does not pause; it bounds through the open doorway on all six limbs. It scales the spiral steps at three times human running speed. On the twenty-fourth step, an immense claw hooks your calf, snapping the tendon. You are dragged down the eighty steps face-first into the dark.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // UNLATCHED BULKHEAD PURSUIT",
    lossCause: "OVERTAKEN IN SPIRAL FLIGHT",
    lossAnalysis: "Failing to latch the security bulkhead allowed an entity capable of 35 mph subterranean locomotion to close a 50-foot gap in under two seconds.",
    options: [],
  },

  latch_grate_7: {
    id: 'latch_grate_7',
    breath: 8,
    text: "The heavy iron door thuds into place. A second later, something immense slams against the other side—a deafening impact that dents the bars. Guttural clicking vibrates through the iron. But you are on the safe side.",
    options: [
      { key: 1, label: "Scramble up the spiral stone steps as fast as you can.", nextNodeId: "spiral_steps_8", tensionChange: 1 },
      { key: 2, label: "Press your ear to the grate to hear its parting words.", nextNodeId: "loss_ear_grate", tensionChange: 2 },
      { key: 3, label: "Take your eighth breath and begin the ascent.", nextNodeId: "spiral_steps_8", tensionChange: -1 },
      { key: 4, label: "Search the corridor walls for a light source.", nextNodeId: "spiral_steps_8", tensionChange: 0 },
    ],
  },

  loss_ear_grate: {
    id: 'loss_ear_grate',
    breath: 8,
    text: "You press your ear against the cold iron bars to listen. On the other side, silence. Then, with terrifying velocity, a slender chitinous barb punches through the slit in the metal. It drives through your eardrum into your temporal lobe. Your vision detonates into blinding white static. You collapse against the stone riser, motionless, as your eighth breath rattles into silence.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // TEMPORAL LOBE PUNCTURE",
    lossCause: "PROJECTILE CHITINOUS STINGER PENETRATION",
    lossAnalysis: "The bars possessed 2-inch viewing gaps. Placing cranial tissue in direct contact with an uninspected aperture exposed the braincase to secondary projectile stingers.",
    options: [],
  },

  spiral_steps_8: {
    id: 'spiral_steps_8',
    breath: 9,
    text: "Eighty-four stairs spiral upward through crumbling bedrock. The air becomes intoxicatingly sweet—real oxygen, wet grass, night fog. A circular hatch above is silhouetted by silver moonlight leaking through slit openings.",
    options: [
      { key: 1, label: "Heave the heavy iron hatch upward with both arms.", nextNodeId: "escape_dawn_ending", tensionChange: 0 },
      { key: 2, label: "Drop the brass key down the shaft so nothing follows.", nextNodeId: "loss_key_clatter", tensionChange: 2 },
      { key: 3, label: "Hesitate and sit down on the top step to rest.", nextNodeId: "loss_stair_fatigue", tensionChange: 1 },
      { key: 4, label: "Inhale your ninth breath and shoulder the hatch open.", nextNodeId: "escape_dawn_ending", tensionChange: -1 },
    ],
  },

  loss_key_clatter: {
    id: 'loss_key_clatter',
    breath: 9,
    text: "You toss the heavy brass clockwork key over the spiraling banister. It clatters down the stone steps—*clink, clink, clatter*—echoing down hundreds of feet. The clatter doesn't deter the entity; it enrages it. In the dark below, something titanic launches itself vertically up the open stairwell core. In less than two seconds, a massive winged shadow bursts up from the center void, tearing through the balustrade. Claws rake across your torso, tossing you backward into the abyss you just climbed. You fall for six seconds before hitting the flagstones where your journey began.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // VERTICAL AMBUSH FROM CORE VOID",
    lossCause: "ACOUSTIC BEACON SUMMONS & THREE-HUNDRED-FOOT FALL",
    lossAnalysis: "Dropping a metal acoustic beacon down an echo chamber revealed your exact elevation along the open central stairwell.",
    options: [],
  },

  loss_stair_fatigue: {
    id: 'loss_stair_fatigue',
    breath: 9,
    text: "Exhaustion overtakes you. You slump onto the stone step right beneath the hatch to rest your burning thighs. You close your eyes for what feels like five seconds. But the air here contains high traces of subterranean carbon dioxide that has pooled at the upper bottleneck. Your eyelids grow heavy; you slip into unconscious hypercapnic narcosis. The dawn breaks above through the grating, but your lungs never take the tenth breath.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CARBON DIOXIDE NARCOSIS",
    lossCause: "HYPERCAPNIC ASPHYXIATION AT UPPER BOTTLENECK",
    lossAnalysis: "Dense gases pool beneath unvented exit hatches. Sitting motionless within a carbon dioxide inversion layer caused loss of consciousness within 90 seconds.",
    options: [],
  },

  escape_dawn_ending: {
    id: 'escape_dawn_ending',
    breath: 10,
    text: "With a grinding groan of rusted iron, the hatch gives way. You tumble out onto wet clover under a violet dawn sky. Crisp November wind rushes into your lungs, expelling the foul zinc stench forever. Behind you in the subterranean abyss, the grating clicks locked. You survived all ten breaths.",
    isEnding: true,
    endingType: 'survived',
    endingTitle: "ENDING I: THE LIGHT OF DAWN",
    options: [
      { key: 1, label: "Stand in the sunlight and begin a new breath.", nextNodeId: "start" },
    ],
  },

  // ================= BRANCH 2: REACH PATH (Intimate Horror & Symbiosis) =================
  reach_1: {
    id: 'reach_1',
    breath: 2,
    text: "Your trembling fingers brush against coarse, damp bristles, then something warm, wet, and convulsing. It feels like a human cheekbone sewn into coarse hide. It doesn't flinch. Instead, two cold, needle-thin lips part and press against your palm.",
    options: [
      { key: 1, label: "Yank your hand back and curl into a fetal position.", nextNodeId: "loss_yank_fetal", tensionChange: 2 },
      { key: 2, label: "Keep your palm flat against its face and don't pull away.", nextNodeId: "communion_2", tensionChange: -1 },
      { key: 3, label: "Curl your fingers into a claw and strike its eye socket.", nextNodeId: "loss_strike_socket", tensionChange: 3 },
      { key: 4, label: "Whisper: 'What did they do to you?'", nextNodeId: "communion_2", tensionChange: 0 },
    ],
  },

  loss_yank_fetal: {
    id: 'loss_yank_fetal',
    breath: 2,
    text: "Panic shatters your resolve. You violently rip your hand away and curl into a tight ball on the wet stone, clutching your knees. The withdrawal is treated as flight. A sound like scythes dragging across slate accelerates behind you. A massive weight lands square on your spine, driving the breath from your chest in an agonizing gasp. Cold, segmented appendages pin your shoulders to the flagstones. Needle-fine teeth sink into the nape of your neck, drinking the warmth from your carotid. As the numbness creeps down your limbs, you realize you will never rise from these stones.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // PREDATORY COMPRESSION",
    lossCause: "CERVICAL PIN & CAROTID SEVERANCE",
    lossAnalysis: "Fetal posture exposed your cervical vertebrae. Sudden jerky movements trigger pursuit predation in cavern organisms.",
    options: [],
  },

  loss_strike_socket: {
    id: 'loss_strike_socket',
    breath: 2,
    text: "Your fingers drive into what should be an ocular cavity. There is no eyeball—only a hollow cavity lined with inward-curving keratin barbs that snare your fingers like a bear trap. The creature doesn't cry out; it merely contracts the muscles in its skull. Your fingers snap like dry matchsticks. It drags your arm into its chest with mechanical force, pulling you face-first into a churning maw of grinding plates. The last sound you ever hear is the wet crunch of your own ribs collapsing inward.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // BARBED SENSORY TRAP",
    lossCause: "KERATIN BARB SNAPPING & CRANIAL CONSUMPTION",
    lossAnalysis: "The creature was blind; its 'eye sockets' were vestigial sensory traps lined with inward barbs designed to capture grasping prey.",
    options: [],
  },

  communion_2: {
    id: 'communion_2',
    breath: 3,
    text: "You remain motionless. The creature shudders, a deep chest rattling that vibrates into your wrist. It doesn't bite. It rubs the side of its malformed skull against your hand like a domesticated beast that hasn't known kindness in centuries.",
    options: [
      { key: 1, label: "Gently stroke the ridge of its brow.", nextNodeId: "find_chain_3", tensionChange: -1 },
      { key: 2, label: "Reach for its neck to find a collar or chain.", nextNodeId: "find_chain_3", tensionChange: 1 },
      { key: 3, label: "Suddenly try to strangle it with your bare hands.", nextNodeId: "loss_strangle_attempt", tensionChange: 3 },
      { key: 4, label: "Whisper into its ear: 'Lead me out.'", nextNodeId: "find_chain_3", tensionChange: 0 },
    ],
  },

  loss_strangle_attempt: {
    id: 'loss_strangle_attempt',
    breath: 3,
    text: "You betray the momentary trust, wrapping both hands around its thick neck and squeezing with desperate fury. Your fingers cannot even dent the subcutaneous cartilage armor. The beast does not panic—it merely twitches its shoulder blades. Two massive forelegs snap your forearms like kindling. A bone-splintering strike from its horned snout caves in your chest. You die on the cold stone, another broken relic in its underground pen.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // FAILED ASPHYXIATION OF AN ARMORED TITAN",
    lossCause: "BILATERAL FOREARM FRACTURE & BLUNT CHEST TRAUMA",
    lossAnalysis: "Subterranean troglobites possess thick cartilaginous neck collars to protect against rockfalls. Human hand strength is 1/40th of what is required to compress its trachea.",
    options: [],
  },

  find_chain_3: {
    id: 'find_chain_3',
    breath: 4,
    text: "Beneath the damp fur, your fingers find links of cold iron. A heavy collar binds it to an anchor ring driven into the bedrock. It has been chained down here for an eternity.",
    relicDiscovered: "Ancient Iron Collar Link",
    options: [
      { key: 1, label: "Whisper: 'I will set you free if you carry me up.'", nextNodeId: "pact_free_4", tensionChange: -1 },
      { key: 2, label: "Search the stone altar behind it for a key or tool.", nextNodeId: "altar_hollow_5", tensionChange: 0 },
      { key: 3, label: "Try to pry the collar open with a sharp stone.", nextNodeId: "loss_pry_collar", tensionChange: 2 },
      { key: 4, label: "Leave the beast chained and walk away into the dark.", nextNodeId: "loss_chasm_fall", tensionChange: 1 },
    ],
  },

  loss_pry_collar: {
    id: 'loss_pry_collar',
    breath: 4,
    text: "You jam a stone fragment between the collar and the beast's throat, levering it with frantic aggression. The jagged edge slips and cuts deep into its jugular furrow. Hot, acidic black bile gushes onto your forearms, burning through your flesh like molten lead. The beast shrieks in agony and lashes out blindly, crushing your skull against the anchor ring.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // ACIDIC HEMOLYMPH CAUSTIC BURNS",
    lossCause: "CAUSTIC BILE CORROSION & SKULL FRACTURE",
    lossAnalysis: "Subterranean troglobite blood contains concentrated sulfuric compounds. Puncturing its vascular system caused extreme chemical burns and fatal defensive rage.",
    options: [],
  },

  pact_free_4: {
    id: 'pact_free_4',
    breath: 5,
    text: "The creature tilts its head. A low, rhythmic whine rises from its gullet—an assent. In the dark, it nudges your shoulder toward a hollow carved into the stone altar behind it.",
    options: [
      { key: 1, label: "Reach deep into the altar hollow.", nextNodeId: "altar_hollow_5", tensionChange: 0 },
      { key: 2, label: "Climb onto its chained back immediately.", nextNodeId: "loss_chained_mount", tensionChange: 2 },
      { key: 3, label: "Examine the carvings on the stone altar.", nextNodeId: "altar_hollow_5", tensionChange: -1 },
      { key: 4, label: "Sit with the beast and share a silent breath.", nextNodeId: "altar_hollow_5", tensionChange: -1 },
    ],
  },

  loss_chained_mount: {
    id: 'loss_chained_mount',
    breath: 5,
    text: "You leap onto the creature's back while its collar is still bolted to the bedrock. Excited by the prospect of freedom, it lunges forward into the dark with colossal horsepower. The heavy iron chain reaches maximum extension and jerks violently taut. The whiplash snaps your cervical spine instantly. You fall limply from its shoulders as the chain clanks against the stone.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // TAUT CHAIN WHIPLASH",
    lossCause: "CERVICAL HYPEREXTENSION UNDER KINETIC RECOIL",
    lossAnalysis: "Attempting to ride a captive animal while its anchor rigging remains fastened resulted in violent kinetic recoil when the chain ran out of slack.",
    options: [],
  },

  altar_hollow_5: {
    id: 'altar_hollow_5',
    breath: 6,
    text: "Inside the stone recess, your hands clasp cold forged steel: a pair of rusted blacksmith's bolt cutters and a jar of bioluminescent cave lichen that glows with ghostly emerald light.",
    relicDiscovered: "Bioluminescent Lichen Jar",
    options: [
      { key: 1, label: "Cut the chain holding the creature's collar.", nextNodeId: "cut_chain_6", tensionChange: 0 },
      { key: 2, label: "Smash the glowing lichen jar over the beast's eyes.", nextNodeId: "loss_lichen_flash", tensionChange: 3 },
      { key: 3, label: "Inspect the altar maps in the green glow.", nextNodeId: "cut_chain_6", tensionChange: -1 },
      { key: 4, label: "Keep the jar sealed and cut the chain.", nextNodeId: "cut_chain_6", tensionChange: 0 },
    ],
  },

  loss_lichen_flash: {
    id: 'loss_lichen_flash',
    breath: 6,
    text: "You shatter the jar against the creature's brow. Intense, blinding chemical phosphorescence floods its light-starved optic nerves. The creature goes utterly mad with pain. It thrashes like a harpooned whale in the confined chamber, its massive spiked tail sweeping across the floor. You are struck in the torso and propelled forty feet into the masonry wall, shattering every vital organ.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // PHOTOPHOBIC BLIND RAGE",
    lossCause: "BLUNT MASS ACCELERATION & INTERNAL HEMORRHAGE",
    lossAnalysis: "Troglobitic organisms with deep-adapted optic nerves suffer acute neurological trauma when exposed to sudden chemical luminescence.",
    options: [],
  },

  cut_chain_6: {
    id: 'cut_chain_6',
    breath: 7,
    text: "You position the jaws of the shears over the corroded link. With all your weight, you bear down. A sharp *CRACK* rings out like a gunshot. The link snaps in two. The beast lets out a shuddering gasp of unchained air.",
    options: [
      { key: 1, label: "Mount the beast's shoulders as it rises.", nextNodeId: "mount_beast_7", tensionChange: 1 },
      { key: 2, label: "Offer your hand for it to sniff before climbing.", nextNodeId: "mount_beast_7", tensionChange: -1 },
      { key: 3, label: "Step in front of its mouth and try to push it back.", nextNodeId: "loss_trampled", tensionChange: 2 },
      { key: 4, label: "Point toward the dark ascending corridor.", nextNodeId: "mount_beast_7", tensionChange: 0 },
    ],
  },

  loss_trampled: {
    id: 'loss_trampled',
    breath: 7,
    text: "You stand directly in front of an eight-foot, four-ton unchained subterranean predator and try to hold it back with outstretched hands. It does not even perceive you as an obstacle. It takes one thunderous forward bound. Its plate-covered knuckles crush your chest into the flagstones. You are trampled under five thousand pounds of muscle and momentum.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CRUSHED IN UNCHAINED SURGE",
    lossCause: "BLUNT TRAMPLE TRAUMA",
    lossAnalysis: "Attempting to halt a 4-ton unchained organism by standing in its linear vector of acceleration resulted in immediate fatal crush.",
    options: [],
  },

  mount_beast_7: {
    id: 'mount_beast_7',
    breath: 8,
    text: "It rises to a towering eight feet on four sinewy, knuckle-walking limbs. You grasp its thick bristle mane. With terrifying grace, it launches itself upward, leaping between stone outcroppings in absolute pitch darkness.",
    options: [
      { key: 1, label: "Match your breathing to its thunderous lung cycles.", nextNodeId: "sync_breath_8", tensionChange: -1 },
      { key: 2, label: "Panic and let go of its bristle mane mid-leap.", nextNodeId: "loss_leap_fall", tensionChange: 3 },
      { key: 3, label: "Hold on for dear life and bury your face in its mane.", nextNodeId: "sync_breath_8", tensionChange: 0 },
      { key: 4, label: "Try to steer it by pulling its ears violently.", nextNodeId: "loss_steer_ears", tensionChange: 2 },
    ],
  },

  loss_leap_fall: {
    id: 'loss_leap_fall',
    breath: 8,
    text: "Midway across an eight-hundred-foot underground chasm, vertigo overwhelms you. You release your grip on its mane. The beast sails gracefully to the opposite ledge, but you do not. You fall into the black void, spinning helplessly in the updraft until you strike the spiked stalagmites on the floor below.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // MID-LEAP DETACHMENT",
    lossCause: "EIGHT-HUNDRED-FOOT ABYSSAL FREEFALL",
    lossAnalysis: "Letting go of a dynamic riding mount while suspended over an unbridged subterranean chasm carries a 100% fatal impact coefficient.",
    options: [],
  },

  loss_steer_ears: {
    id: 'loss_steer_ears',
    breath: 8,
    text: "You yank painfully on the creature's sensitive acoustic flaps. In mid-air, it twists its torso in agony. The trajectory misses the receiving stone arch by three feet. Both you and the titan crash into the sheer granite face, plummeting into the chasm below in a tangle of limbs and stone.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // TRAJECTORY DEFLECTION CRASH",
    lossCause: "MID-AIR STABILITY COMPROMISE",
    lossAnalysis: "Interfering with the vestibular steering mechanisms of a leaping predator caused mid-air aerodynamic failure.",
    options: [],
  },

  sync_breath_8: {
    id: 'sync_breath_8',
    breath: 9,
    text: "Inhale. Exhale. Inhale. Your lung capacity expands in perfect synchronization with the beast. The dark is no longer black; your eyes adjust, revealing the subterranean cathedrals, ancient basalt arches, and the vertical fissure leading to the open mountains.",
    options: [
      { key: 1, label: "Leap through the summit fissure together into the night.", nextNodeId: "symbiosis_ending", tensionChange: 0 },
      { key: 2, label: "Dismount at the threshold and bid the beast farewell.", nextNodeId: "part_ways_ending", tensionChange: 0 },
      { key: 3, label: "Take your final breath as one unified consciousness.", nextNodeId: "symbiosis_ending", tensionChange: -1 },
      { key: 4, label: "Draw your knife and try to slaughter it at the exit.", nextNodeId: "loss_betrayal_exit", tensionChange: 3 },
    ],
  },

  loss_betrayal_exit: {
    id: 'loss_betrayal_exit',
    breath: 9,
    text: "At the very threshold of freedom, you plunge your flint shard into the creature's neck. The titan turns its massive head, looks into your eyes with profound ancient sorrow, and clamps its jaws around your torso. It snaps your body in two, leaving your remains on the threshold as it steps alone into the starlight.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // BETRAYAL AT THE THRESHOLD",
    lossCause: "TORSO BISECTION AT SURFACE EXIT",
    lossAnalysis: "Betraying an apex symbiont upon which your survival depended resulted in immediate retaliatory termination.",
    options: [],
  },

  symbiosis_ending: {
    id: 'symbiosis_ending',
    breath: 10,
    text: "The tenth breath is taken simultaneously. As the beast bursts through the crags into the starlit alpine night, you realize your skin has hardened, your senses have expanded across miles of mountain ridges, and the terror of darkness has dissolved into supreme dominion. You are the beast's rider, and the night belongs to you both.",
    isEnding: true,
    endingType: 'transformed',
    endingTitle: "ENDING II: THE TENTH INHALATION",
    options: [
      { key: 1, label: "Howl at the stars and awaken again.", nextNodeId: "start" },
    ],
  },

  part_ways_ending: {
    id: 'part_ways_ending',
    breath: 10,
    text: "You slip from its shoulders onto the high mountain ledge. The creature nudges your chest once, a silent testament to the compact between captive souls, before disappearing like a phantom into the foggy pine forest. The cool dawn wind fills your tenth breath with pure, untainted life.",
    isEnding: true,
    endingType: 'survived',
    endingTitle: "ENDING III: THE ANCIENT COMPACT",
    options: [
      { key: 1, label: "Descend the mountain toward home.", nextNodeId: "start" },
    ],
  },

  // ================= BRANCH 3: SCRAMBLE / PANIC PATH (Raw Action & Survival) =================
  scramble_1: {
    id: 'scramble_1',
    breath: 2,
    text: "The shriek tears from your lungs, echoing like shattering crystal across an impossibly colossal vault. You thrash forward on hands and knees. Wet flagstones give way to pooled water and shattered ribs of stone. Behind you, a sound like heavy leather wings unfurling rushes toward you.",
    options: [
      { key: 1, label: "Dive sideways behind a broken stone pillar.", nextNodeId: "dive_pillar_2", tensionChange: 1 },
      { key: 2, label: "Turn and swing wildly with both fists.", nextNodeId: "loss_swing_fists", tensionChange: 3 },
      { key: 3, label: "Plunge your face into the stagnant puddle to mask your scent.", nextNodeId: "dive_pillar_2", tensionChange: 0 },
      { key: 4, label: "Sprint blindly toward the distant echo of wind.", nextNodeId: "loss_chasm_fall", tensionChange: 2 },
    ],
  },

  loss_swing_fists: {
    id: 'loss_swing_fists',
    breath: 2,
    text: "Your knuckles strike dense, petrified bone and coarse bristles. The impact rattles up your forearm, but whatever stands in the dark does not even yield an inch. A heavy, hot exhalation floods your face. Before your hands can retract, a pair of articulated jaws snap shut across your collarbone. You hear the wet splinter of your own clavicle. You are lifted six feet off the flagstones, thrashed violently against the ceiling vault, and cast down into the black water. Your vision bleeds red, then obsidian, as your lungs empty for the last time.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // BARE-FIST RETALIATION FAILURE",
    lossCause: "CRANIAL TRAUMA & ARTICULATED JAW CRUSH",
    lossAnalysis: "Blind subterranean fauna possess extreme tactile acoustic reception. Striking a 500-pound apex predator in total darkness surrendered your exact coordinates and provoked an immediate lethal predatory reflex.",
    options: [],
  },

  loss_chasm_fall: {
    id: 'loss_chasm_fall',
    breath: 2,
    text: "You sprint in frantic terror, hands outstretched in the pitch black. The echo of wind grows louder, cooler, intoxicating. You take three lunging strides—and your right boot finds nothing. No stones. No floor. You pitch forward into a bottomless vertical ventilation shaft. The wind roars past your ears at terminal velocity. You scream, but your voice is snatched away into the rushing abyss. For four agonizing seconds you freefall in the dark, until the granite bottom arrives with absolute, instantaneous finality.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // BOTTOMLESS SHAFT PLUNGE",
    lossCause: "VERTICAL SHAFT IMPACT AT TERMINAL VELOCITY",
    lossAnalysis: "Navigating unmapped subterranean infrastructure at a full sprint in zero visibility carries a 94% mortality probability from unmarked vertical mine shafts.",
    options: [],
  },

  dive_pillar_2: {
    id: 'dive_pillar_2',
    breath: 3,
    text: "You tuck and roll behind a fluted marble column. A massive weight crashes where you were standing a fraction of a second ago, pulverizing stone flags into powder. Shrapnel stings your cheek. The creature sweeps the air above you with a leathery tail.",
    options: [
      { key: 1, label: "Hurl a loose pebble in the opposite direction.", nextNodeId: "throw_pebble_3", tensionChange: -1 },
      { key: 2, label: "Hold your breath until your lungs burn like embers.", nextNodeId: "burn_lungs_3", tensionChange: 0 },
      { key: 3, label: "Sprint directly into the open chamber.", nextNodeId: "loss_chasm_fall", tensionChange: 2 },
      { key: 4, label: "Grab a sharp chunk of shattered marble from the ground.", nextNodeId: "grab_shard_3", tensionChange: 1 },
    ],
  },

  throw_pebble_3: {
    id: 'throw_pebble_3',
    breath: 4,
    text: "You toss the pebble across the chamber. *Clink... clink-clink.* The beast pivots violently, tearing across the hall with an explosive roar that rattles your dental work. The path behind it is momentarily clear.",
    options: [
      { key: 1, label: "Run toward the iron gate at the far end of the hall.", nextNodeId: "run_gate_4", tensionChange: 1 },
      { key: 2, label: "Search for an emergency counterweight release lever.", nextNodeId: "release_lever_5", tensionChange: -1 },
      { key: 3, label: "Shout to draw it back toward you.", nextNodeId: "loss_swing_fists", tensionChange: 3 },
      { key: 4, label: "Drop into the circular drainage hole in the floor.", nextNodeId: "pipe_crawl_5", tensionChange: 1 },
    ],
  },

  run_gate_4: {
    id: 'run_gate_4',
    breath: 5,
    text: "Your boots pound across the flagstones. The iron gate looms out of the darkness—massive, spiked, and barred with a heavy bronze wheel. A wheel that takes immense effort to rotate.",
    options: [
      { key: 1, label: "Look for an emergency counterweight release lever.", nextNodeId: "release_lever_5", tensionChange: -1 },
      { key: 2, label: "Try to turn the heavy bronze wheel by hand.", nextNodeId: "loss_wheel_fatigue", tensionChange: 2 },
      { key: 3, label: "Climb up the iron bars of the gate.", nextNodeId: "loss_gate_climb", tensionChange: 2 },
      { key: 4, label: "Hide beneath the gear mechanism.", nextNodeId: "release_lever_5", tensionChange: 0 },
    ],
  },

  loss_wheel_fatigue: {
    id: 'loss_wheel_fatigue',
    breath: 5,
    text: "You grip the bronze wheel with both hands, straining until blood vessels burst in your eyes. The corroded gears screech, moving only three inches. The noise echoes through the cavern like a siren. Before you can complete half a turn, the beast crashes into you from behind, driving your sternum directly into the bronze spokes. The wheel spins backward under the impact, crushing your ribcage.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CORRODED GEAR WHEEL TRAP",
    lossCause: "THORACIC COMPRESSION ON BRONZE SPOKES",
    lossAnalysis: "Attempting to manually rotate an unlubricated 500-lb bronze gear while being hunted produced excessive acoustic exposure with zero defensive cover.",
    options: [],
  },

  loss_gate_climb: {
    id: 'loss_gate_climb',
    breath: 5,
    text: "You pull yourself up the iron bars of the portcullis. When you reach twelve feet, the gate shakes. The entity leaps, its massive claws locking onto your legs. It wrenches you from the bars and slams you against the flagstones from a height of twenty feet. Your spine shatters on impact.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // PULLED FROM PORTCULLIS",
    lossCause: "SPINAL FRACTURE & HIGH IMPACT DECELERATION",
    lossAnalysis: "Climbing a vertical grid without an overhead egress route turned you into a stationary silhouette with zero evasive capability.",
    options: [],
  },

  release_lever_5: {
    id: 'release_lever_5',
    breath: 6,
    text: "Your frantic fingers find a rusted iron chain pinned by a cotter pin. You yank it free. Above you, a thousand-pound counterweight drops into an oil pit, violently wrenching the gate upward three feet.",
    options: [
      { key: 1, label: "Slide under the rising iron teeth on your back.", nextNodeId: "slide_under_6", tensionChange: 2 },
      { key: 2, label: "Wait until the gate raises to chest height.", nextNodeId: "loss_gate_crush", tensionChange: 3 },
      { key: 3, label: "Dive head-first into the gap.", nextNodeId: "slide_under_6", tensionChange: 1 },
      { key: 4, label: "Try to wedge a stone under the falling counterweight.", nextNodeId: "loss_counterweight_pinch", tensionChange: 3 },
    ],
  },

  loss_gate_crush: {
    id: 'loss_gate_crush',
    breath: 6,
    text: "You hesitate, waiting for the jagged iron teeth of the portcullis to climb higher. Above, the ancient iron chain groans under the three-ton counterweight. A single rusted link shears with the deafening crack of a rifle shot. The four-ton cast-iron gate drops like a guillotine. The spikes drive through your back and pin you through the flagstones into the stone bedrock below. You are conscious for only three seconds—long enough to feel the cold iron teeth locking into the stone floor, extinguishing your sixth breath forever.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // PORTCULLIS GUILLOTINE DROP",
    lossCause: "COUNTERWEIGHT SHEAR & MECHANICAL SKEWERING",
    lossAnalysis: "Centuries of subterranean oxidation rendered the tension rigging brittle. Hesitating directly beneath an unlatched counterweighted gate resulted in catastrophic mechanical crush trauma.",
    options: [],
  },

  loss_counterweight_pinch: {
    id: 'loss_counterweight_pinch',
    breath: 6,
    text: "You attempt to jam a stone block beneath the descending counterweight. The thousand-pound iron block shears through the stone like dry chalk, trapping your right arm in the guide channel. The immense weight severs the limb instantly. In agonizing shock, you collapse beside the mechanism as the beast arrives at your back.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // INDUSTRIAL COUNTERWEIGHT SEVERANCE",
    lossCause: "TRAUMATIC AMPUTATION & EXSANGUINATION",
    lossAnalysis: "Interfering directly with active multi-ton counterweight channels led to catastrophic kinetic pinch failure.",
    options: [],
  },

  slide_under_6: {
    id: 'slide_under_6',
    breath: 7,
    text: "You throw yourself flat onto the slick stones, kicking furiously. The iron spikes of the gate brush your sternum, tearing cloth. You slide through just as a claw sweeps down, screeching against the iron bars. You are on the other side.",
    options: [
      { key: 1, label: "Run down the steep minecart tunnel.", nextNodeId: "minecart_tunnel_7", tensionChange: 1 },
      { key: 2, label: "Catch your seventh breath against the barricade.", nextNodeId: "minecart_tunnel_7", tensionChange: -1 },
      { key: 3, label: "Taunt the creature through the iron bars.", nextNodeId: "loss_ear_grate", tensionChange: 2 },
      { key: 4, label: "Inspect the ore rails for an electric hazard.", nextNodeId: "minecart_tunnel_7", tensionChange: 0 },
    ],
  },

  minecart_tunnel_7: {
    id: 'minecart_tunnel_7',
    breath: 8,
    text: "The tunnel plunges downward along rusted ore tracks. In the darkness, you stumble into a wooden ore cart with functional iron handbrakes. Beyond the tracks, you hear the unmistakable roar of an underground river rushing toward daylight.",
    options: [
      { key: 1, label: "Release the cart brake and ride the rails down.", nextNodeId: "cart_ride_8", tensionChange: 2 },
      { key: 2, label: "Walk slowly along the rails to avoid derailment.", nextNodeId: "loss_rail_ambush", tensionChange: 1 },
      { key: 3, label: "Tie yourself into the cart and release the brake.", nextNodeId: "cart_ride_8", tensionChange: 1 },
      { key: 4, label: "Follow the side ledge above the water channel.", nextNodeId: "cart_ride_8", tensionChange: 0 },
    ],
  },

  loss_rail_ambush: {
    id: 'loss_rail_ambush',
    breath: 8,
    text: "You decide against using the cart and walk slowly along the rotting ties in the dark. Your foot slips through an unballasted gap between the ties, wedging your ankle firmly beneath a rusted iron fishplate. Behind you, the roar of the entity breaking through the upper masonry echoes down the tunnel. You claw frantically at your trapped boot, but the iron does not budge. The predator barrels down the incline like a locomotive.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // WEDGED IN ORE RAIL TIES",
    lossCause: "IMMOBILIZATION & KINETIC PREDATION",
    lossAnalysis: "Traveling on foot across unmaintained rail ties in zero visibility resulted in limb trapping with zero evasive escape vector.",
    options: [],
  },

  cart_ride_8: {
    id: 'cart_ride_8',
    breath: 9,
    text: "The brake clatters open! The cart surges down the incline, sparks screaming off the rails into the pitch black. Wind howls in your ears, whipping tears from your eyes. Up ahead, a pinprick of moonlight explodes into an arching gorge opening over the canyon river!",
    options: [
      { key: 1, label: "Jump from the cart into the deep river pool below!", nextNodeId: "river_leap_ending", tensionChange: 1 },
      { key: 2, label: "Brace inside the cart for impact.", nextNodeId: "loss_cart_smash", tensionChange: 3 },
      { key: 3, label: "Pull the emergency brake to stop right at the cliff edge.", nextNodeId: "loss_brake_shear", tensionChange: 2 },
      { key: 4, label: "Take your ninth breath and embrace the freefall plunge.", nextNodeId: "river_leap_ending", tensionChange: -1 },
    ],
  },

  loss_cart_smash: {
    id: 'loss_cart_smash',
    breath: 9,
    text: "You pull your limbs into the iron-reinforced ore cart and curl against the floorboards, bracing with all your might. The cart rockets off the sheared rail end at seventy miles per hour, hurtling into the open canyon void. It does not land in the river. It slams squarely into the basalt cliff face opposite the gorge. The oak frame and iron rivets disintegrate on impact, pulverized into splintered fragments. Your body is crushed instantly by the kinetic force, folding into the shattered ore.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // HIGH-VELOCITY BASALT IMPACT",
    lossCause: "SEVENTY-MPH KINETIC OBLITERATION",
    lossAnalysis: "The ore tracks terminated twenty yards short of the deep river pool. Staying within an unguided ballistic projectile ensured collision with the canyon wall.",
    options: [],
  },

  loss_brake_shear: {
    id: 'loss_brake_shear',
    breath: 9,
    text: "You yank the iron brake handle as the cart reaches the edge of the precipice. The rusted brake shoes grip the screaming wheels for a microsecond before shearing off in a cloud of orange sparks. The cart flips end-over-end off the edge, catapulting you against the jagged river rocks far below.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CATAPULTED FROM PRECIPICE",
    lossCause: "BRAKE SHOE SHEAR & CATAPULT TRAUMA",
    lossAnalysis: "Attempting to decelerate a 1,200-lb rolling cart in the final five feet of track exceeded mechanical tolerances, inducing violent rotational pitch.",
    options: [],
  },

  river_leap_ending: {
    id: 'river_leap_ending',
    breath: 10,
    text: "You leap into the open night air. For two endless seconds, you hang suspended beneath the stars before plunging into the frigid, crystal water of the mountain torrent. The current sweeps you out into the wide moonlit valley, alive, breathing clean alpine air on your tenth breath.",
    isEnding: true,
    endingType: 'escaped',
    endingTitle: "ENDING IV: THE MOONLIT TORRENT",
    options: [
      { key: 1, label: "Crawl onto the riverbank and start anew.", nextNodeId: "start" },
    ],
  },

  // ================= BRANCH 4: ASK PATH (Psychological / Cosmic Horror) =================
  ask_1: {
    id: 'ask_1',
    breath: 2,
    text: "Your question vibrates into the blackness: 'Who is there?' For three agonizing seconds, absolute silence. Then, a voice answers directly against the bone behind your ear—slow, wet, and unmistakable: It is your own voice.",
    options: [
      { key: 1, label: "'How do you know my voice?'", nextNodeId: "voice_reply_2", tensionChange: 1 },
      { key: 2, label: "'You are a hallucination born of carbon monoxide.'", nextNodeId: "hallucination_3", tensionChange: -1 },
      { key: 3, label: "Scream at your own voice to shut up.", nextNodeId: "loss_voice_frenzy", tensionChange: 3 },
      { key: 4, label: "Whisper: 'Are you the one who died down here?'", nextNodeId: "voice_reply_2", tensionChange: 0 },
    ],
  },

  loss_voice_frenzy: {
    id: 'loss_voice_frenzy',
    breath: 2,
    text: "You scream into the dark, cursing your own voice. The sound does not die away; the voice amplifies tenfold, echoing from every corner of the black vault in harmonic resonance. The sound pressure ruptures your eardrums, flooding your ear canals with warm blood. Disoriented and bleeding, you stumble sideways into the open cistern shaft. You fall in absolute silence, unable to hear your own final exhalation.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // ACOUSTIC VESTIBULAR RUPTURE",
    lossCause: "BILATERAL TYMPANIC RUPTURE & SHAFT PLUNGE",
    lossAnalysis: "Resonance geometry in circular basalt chambers amplifies vocal shockwaves. Screaming produced 140dB harmonic feedback that destroyed equilibrium.",
    options: [],
  },

  voice_reply_2: {
    id: 'voice_reply_2',
    breath: 3,
    text: "'Because you spoke to us in your sleep,' the voice purrs in your exact timbre. 'You spoke for thirty days before your body fell through the grate. Every word you ever loved, we digested.'",
    options: [
      { key: 1, label: "'You are a hallucination born of carbon monoxide.'", nextNodeId: "hallucination_3", tensionChange: -1 },
      { key: 2, label: "Strike a damp sulphur match to illuminate the speaker.", nextNodeId: "loss_methane_ignition", tensionChange: 2 },
      { key: 3, label: "'Then tell me how I get back to the surface.'", nextNodeId: "remember_collapse_4", tensionChange: 0 },
      { key: 4, label: "Demand: 'Where is the exit?'", nextNodeId: "hallucination_3", tensionChange: 1 },
    ],
  },

  hallucination_3: {
    id: 'hallucination_3',
    breath: 4,
    text: "'A comforting fiction,' the voice chuckles through your own vocal chords. 'Touch your forehead. Feel the indentation where the mining drill pierced the cranium three years ago.' Your hand instinctively rises—and your fingertips find a smooth, cold nickel-silver plate bolted into your skull.",
    relicDiscovered: "Cranial Survey Plate",
    options: [
      { key: 1, label: "'I remember the collapse now. I remember the siren.'", nextNodeId: "remember_collapse_4", tensionChange: -1 },
      { key: 2, label: "Tear yourself away from the voice and run.", nextNodeId: "loss_vault_chasm", tensionChange: 2 },
      { key: 3, label: "Trace the cold screws of the plate with trembling fingers.", nextNodeId: "remember_collapse_4", tensionChange: 1 },
      { key: 4, label: "Try to pry the cranial plate loose with your fingernails.", nextNodeId: "loss_pry_plate", tensionChange: 3 },
    ],
  },

  loss_vault_chasm: {
    id: 'loss_vault_chasm',
    breath: 4,
    text: "You clamp your hands over your ears and bolt blindly down the corridor, desperate to escape your own mocking voice. The voice does not follow—it doesn't need to. In your panic, you miss the warning grooves cut into the floor. You plunge headlong through an open coal chute, tumbling down a sixty-degree incline studded with rusted steel augers. When your body finally comes to rest in the sludge pit at the bottom of Sector 9, your neck is broken and the silence returns, absolute and permanent.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // TUMBLE DOWN COAL AUGER CHUTE",
    lossCause: "CERVICAL DISLOCATION & BLUNT MECHANICAL TRAUMA",
    lossAnalysis: "Panic-induced locomotion in industrial mining sectors with open conveyor machinery resulted in fatal trauma.",
    options: [],
  },

  loss_pry_plate: {
    id: 'loss_pry_plate',
    breath: 4,
    text: "Hysteria consumes you. You jam your fingernails beneath the edge of the cranial plate and pull with feverish delusion. The surgical screws tear free from your parietal bone. A surge of cerebrospinal fluid and arterial blood pours down your temples. You collapse onto your knees as motor control dissolves. The voice whispers one final time: 'Sleep now.'",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // INTRA-CRANIAL HEMORRHAGE",
    lossCause: "SELF-INDUCED PARIETAL PLATE DISLODGEMENT",
    lossAnalysis: "Acute psychological break triggered catastrophic self-harm involving surgical cranial implants.",
    options: [],
  },

  remember_collapse_4: {
    id: 'remember_collapse_4',
    breath: 5,
    text: "The memories flood back like black oil: the 400-meter shift, the seismic tremor, the bulkheads sealing to preserve the upper shafts. You were not abandoned by an accident; you were sealed inside the containment zone.",
    options: [
      { key: 1, label: "Walk toward the primary ventilation control room.", nextNodeId: "control_room_5", tensionChange: 0 },
      { key: 2, label: "Search the emergency locker for survival gear.", nextNodeId: "control_room_5", tensionChange: 0 },
      { key: 3, label: "Give up and wait for the air to run out.", nextNodeId: "loss_surrender_hypoxia", tensionChange: -1 },
      { key: 4, label: "Inhale your fifth breath of stale miner's air.", nextNodeId: "control_room_5", tensionChange: 0 },
    ],
  },

  loss_surrender_hypoxia: {
    id: 'loss_surrender_hypoxia',
    breath: 5,
    text: "You sit with your back against the sealed bulkhead and close your eyes, refusing to fight any longer. The air in Sector 7 steadily depletes of oxygen. Within twenty minutes, your breathing slows into Cheyne-Stokes respiration. As the carbon monoxide gently numbs your cortex, the darkness becomes total, and your chest never rises again.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // HYPOXIC COLLAPSE",
    lossCause: "ANOXIC RESPIRATORY ARREST",
    lossAnalysis: "Cessation of evasive action inside a sealed containment compartment led to terminal atmospheric oxygen depletion.",
    options: [],
  },

  control_room_5: {
    id: 'control_room_5',
    breath: 6,
    text: "Guided by long-buried muscle memory, you navigate the corridor to the blast doors of Sector 7. The backup emergency power cell still hums with a solitary amber LED: AUXILIARY PURGE: READY.",
    options: [
      { key: 1, label: "Engage the auxiliary purge turbine to blast fresh air down the shaft.", nextNodeId: "purge_turbine_6", tensionChange: 0 },
      { key: 2, label: "Turn to see the entity illuminated by the amber LED.", nextNodeId: "loss_behold_abomination", tensionChange: 3 },
      { key: 3, label: "Check the chamber pressure gauge.", nextNodeId: "purge_turbine_6", tensionChange: -1 },
      { key: 4, label: "Broadcast an SOS on standard emergency band.", nextNodeId: "purge_turbine_6", tensionChange: 1 },
    ],
  },

  loss_behold_abomination: {
    id: 'loss_behold_abomination',
    breath: 6,
    text: "You pivot toward the darkness as the amber auxiliary LED blinks to life. For a single heartbeat, you behold what has been stalking you: a ten-foot mass of stitched human faces, chitinous joints, and seven milk-white compound eyes reflecting the amber glare. The sight burns into your consciousness, paralyzing your nervous system in absolute catatonic terror. The creature screams—an ear-splitting ultrasonic wave that pops both of your eardrums. It descends upon you with ravenous hunger, tearing away the flesh before your mind can even process the pain.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // CATATONIC VISUAL SHOCK",
    lossCause: "NEUROLOGICAL PARALYSIS & RAPID CONSUMPTION",
    lossAnalysis: "Direct visual encounter with the Sector 7 apex entity caused severe psychological paralysis, eliminating all defensive reflexes.",
    options: [],
  },

  purge_turbine_6: {
    id: 'purge_turbine_6',
    breath: 7,
    text: "You depress the dual purge levers. With a groaning shudder that shakes the bedrock, massive pneumatic fans roar to life 200 feet above. Stagnant centuries of poison are sucked upward, replaced by a torrent of roaring clean air that blows your hair back.",
    options: [
      { key: 1, label: "Climb the service ladder inside the active ventilation tube.", nextNodeId: "vent_ladder_7", tensionChange: 1 },
      { key: 2, label: "Fasten a safety harness and pull yourself up the cable.", nextNodeId: "vent_ladder_7", tensionChange: 0 },
      { key: 3, label: "Jump into the spinning turbine blades to end it quickly.", nextNodeId: "loss_turbine_blades", tensionChange: 3 },
      { key: 4, label: "Take your seventh breath of pressurized mountain air.", nextNodeId: "vent_ladder_7", tensionChange: -1 },
    ],
  },

  loss_turbine_blades: {
    id: 'loss_turbine_blades',
    breath: 7,
    text: "You leap directly toward the spinning pneumatic intake. The six-foot titanium blades, spinning at eighteen hundred RPM, produce an instant vortex. You are sucked into the housing and shredded in less than one-tenth of a second, leaving only fine crimson mist blown out into the canyon sky.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // INDUSTRIAL TURBINE INTAKE",
    lossCause: "HIGH-RPM BLADE ROTOR PULVERIZATION",
    lossAnalysis: "Direct ingress into an unshielded 1,800-RPM pneumatic turbine intake resulted in instant structural dismemberment.",
    options: [],
  },

  vent_ladder_7: {
    id: 'vent_ladder_7',
    breath: 8,
    text: "You scale the iron rungs inside the hurricane of rising air. The wind supports half your body weight, pulling you skyward. Through the steel grate at the surface, you can see the searchlights of the rescue team sweeping the quarry.",
    options: [
      { key: 1, label: "Fire the flare gun through the grate into the sky.", nextNodeId: "flare_sky_8", tensionChange: 2 },
      { key: 2, label: "Hammer on the iron exhaust grate with your wrench.", nextNodeId: "flare_sky_8", tensionChange: 1 },
      { key: 3, label: "Shout with every decibel in your chest: 'SURVIVOR BELOW!'", nextNodeId: "flare_sky_8", tensionChange: 1 },
      { key: 4, label: "Rest on the eighth rung and let go of the ladder.", nextNodeId: "loss_ladder_release", tensionChange: 3 },
    ],
  },

  loss_ladder_release: {
    id: 'loss_ladder_release',
    breath: 8,
    text: "You let your fingers slip from the iron rung, hoping the pneumatic updraft will float you to the surface. It does not. The upward draft merely delays your descent for two heartbeats before gravity takes hold. You plunge two hundred feet straight down the shaft into the spinning lower turbine.",
    isEnding: true,
    isLoss: true,
    endingType: 'fatal',
    endingTitle: "BREATH EXTINGUISHED // VERTICAL TUBE PLUNGE",
    lossCause: "TWO-HUNDRED-FOOT VERTICAL DECELERATION",
    lossAnalysis: "Pneumatic ventilation airflow is insufficient to counteract human body mass without mechanical tethering.",
    options: [],
  },

  flare_sky_8: {
    id: 'flare_sky_8',
    breath: 9,
    text: "A brilliant crimson flare rockets between the iron bars, exploding into a dazzling sunburst against the midnight clouds. Shouts erupt from above. Hydraulic cutters bite into the grate. Heavy gloved hands reach through the sheared iron toward your outstretched fingers.",
    options: [
      { key: 1, label: "Grasp the rescuer's hand with your final ounce of strength.", nextNodeId: "rescue_ending", tensionChange: 0 },
      { key: 2, label: "Pull away and drop back down into the abyss.", nextNodeId: "loss_ladder_release", tensionChange: 3 },
      { key: 3, label: "Take your ninth breath as they pull you through the iron.", nextNodeId: "rescue_ending", tensionChange: -1 },
      { key: 4, label: "Whisper your name so they know who you are.", nextNodeId: "rescue_ending", tensionChange: -1 },
    ],
  },

  rescue_ending: {
    id: 'rescue_ending',
    breath: 10,
    text: "They drag you through the opening into the freezing quarry air. Thermal blankets wrap your shoulders; paramedics shield your eyes from the blinding spotlights. As the siren wails and you take your tenth breath, the doctor whispers in disbelief: 'Core telemetry was flatlined for three weeks. How did you keep breathing?' You close your eyes, knowing the answer.",
    isEnding: true,
    endingType: 'survived',
    endingTitle: "ENDING V: THE MIRACLE AT SECTOR 7",
    options: [
      { key: 1, label: "Rest in the ambulance and begin again.", nextNodeId: "start" },
    ],
  },

  grab_shard_3: {
    id: 'grab_shard_3',
    breath: 4,
    text: "The shard of flint fits your grip like a knife. You hold it ready, your breathing controlled and steady. The dark feels less like a tomb and more like an arena.",
    options: [
      { key: 1, label: "Advance toward the sound of dripping water.", nextNodeId: "water_basin_3", tensionChange: 0 },
      { key: 2, label: "Listen for the entity's breathing pattern.", nextNodeId: "burn_lungs_3", tensionChange: -1 },
      { key: 3, label: "Make a decisive break for the far archway.", nextNodeId: "run_gate_4", tensionChange: 1 },
      { key: 4, label: "Inspect the coat pocket you haven't checked.", nextNodeId: "pockets_3", tensionChange: 0 },
    ],
  },

  water_basin_3: {
    id: 'water_basin_3',
    breath: 4,
    text: "You reach the water basin. It is carved from a single slab of black granite. The water is ice-cold and mineral-rich. Drinking it sends a shockwave of clarity through your weary mind.",
    options: [
      { key: 1, label: "Follow the overflow drainage channel.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 2, label: "Check your coat pockets for items.", nextNodeId: "pockets_3", tensionChange: 0 },
      { key: 3, label: "Submerge yourself completely in the basin to hide.", nextNodeId: "burn_lungs_3", tensionChange: 1 },
      { key: 4, label: "Listen to the resonance of the dripping water.", nextNodeId: "burn_lungs_3", tensionChange: -1 },
    ],
  },

  burn_lungs_3: {
    id: 'burn_lungs_3',
    breath: 4,
    text: "You hold your breath. One second. Ten seconds. Thirty. Your lungs scream for oxygen, but you do not allow a single gasp to escape. The creature sniffs the air directly above your face, confused by the absence of biological respiration. It slowly slithers back into the cistern.",
    options: [
      { key: 1, label: "Take a quiet, deep, restorative fourth breath.", nextNodeId: "pockets_3", tensionChange: -1 },
      { key: 2, label: "Crawl forward while the entity is in the cistern.", nextNodeId: "follow_draft_4", tensionChange: 0 },
      { key: 3, label: "Inspect your surroundings with your hands.", nextNodeId: "altar_hollow_5", tensionChange: 0 },
      { key: 4, label: "Follow the faint current of cellar air.", nextNodeId: "follow_draft_4", tensionChange: 0 },
    ],
  },
};
