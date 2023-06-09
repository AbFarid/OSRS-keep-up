export type QuestStatus = 0 | 1 | 2

export const AllQuests = [
  "A Kingdom Divided",
  "A Night at the Theatre",
  "A Porcine of Interest",
  "A Soul's Bane",
  "A Tail of Two Cats",
  "A Taste of Hope",
  "Alfred Grimhand's Barcrawl",
  "Animal Magnetism",
  "Another Slice of H.A.M.",
  "Architectural Alliance",
  "Bear Your Soul",
  "Below Ice Mountain",
  "Beneath Cursed Sands",
  "Between a Rock...",
  "Bone Voyage",
  "Client of Kourend",
  "Cold War",
  "Contact!",
  "Creature of Fenkenstrain",
  "Curse of the Empty Lord",
  "Daddy's Home",
  "Darkness of Hallowvale",
  "Death to the Dorgeshuun",
  "Demon Slayer",
  "Desert Treasure I",
  "Devious Minds",
  "Dragon Slayer II",
  "Dream Mentor",
  "Eagles' Peak",
  "Elemental Workshop I",
  "Elemental Workshop II",
  "Enakhra's Lament",
  "Enlightened Journey",
  "Fairytale I - Growing Pains",
  "Fairytale II - Cure a Queen",
  "Family Pest",
  "Forgettable Tale...",
  "Garden of Tranquillity",
  "Getting Ahead",
  "Ghosts Ahoy",
  "Goblin Diplomacy",
  "Grim Tales",
  "Hopespear's Will",
  "Horror from the Deep",
  "Icthlarin's Little Helper",
  "In Aid of the Myreque",
  "In Search of Knowledge",
  "Into the Tombs",
  "King's Ransom",
  "Lair of Tarn Razorlor",
  "Land of the Goblins",
  "Lunar Diplomacy",
  "Mage Arena II",
  "Making Friends with My Arm",
  "Making History",
  "Misthalin Mystery",
  "Monkey Madness II",
  "Mountain Daughter",
  "Mourning's End Part II",
  "My Arm's Big Adventure",
  "Olaf's Quest",
  "Ratcatchers",
  "Recipe for Disaster",
  "Recipe for Disaster - Another Cook's Quest",
  "Recipe for Disaster - Culinaromancer",
  "Recipe for Disaster - Evil Dave",
  "Recipe for Disaster - King Awowogei",
  "Recipe for Disaster - Lumbridge Guide",
  "Recipe for Disaster - Mountain Dwarf",
  "Recipe for Disaster - Pirate Pete",
  "Recipe for Disaster - Sir Amik Varze",
  "Recipe for Disaster - Skrach Uglogwee",
  "Recipe for Disaster - Wartface & Bentnoze",
  "Recruitment Drive",
  "Royal Trouble",
  "Secrets of the North",
  "Shadow of the Storm",
  "Shield of Arrav",
  "Sins of the Father",
  "Skippy and the Mogres",
  "Sleeping Giants",
  "Song of the Elves",
  "Spirits of the Elid",
  "Swan Song",
  "Tale of the Righteous",
  "Tears of Guthix",
  "Temple of the Eye",
  "The Ascent of Arceuus",
  "The Corsair Curse",
  "The Depths of Despair",
  "The Enchanted Key",
  "The Eyes of Glouphrie",
  "The Feud",
  "The Forsaken Tower",
  "The Fremennik Exiles",
  "The Fremennik Isles",
  "The Frozen Door",
  "The Garden of Death",
  "The General's Shadow",
  "The Giant Dwarf",
  "The Golem",
  "The Hand in the Sand",
  "The Lost Tribe",
  "The Queen of Thieves",
  "The Slug Menace",
  "Tower of Life",
  "Wanted!",
  "What Lies Below",
  "X Marks the Spot",
  "Zogre Flesh Eaters",
  "Big Chompy Bird Hunting",
  "Biohazard",
  "Black Knights' Fortress",
  "Cabin Fever",
  "Clock Tower",
  "Cook's Assistant",
  "Death Plateau",
  "Doric's Quest",
  "Dragon Slayer I",
  "Druidic Ritual",
  "Dwarf Cannon",
  "Eadgar's Ruse",
  "Enter the Abyss",
  "Ernest the Chicken",
  "Family Crest",
  "Fight Arena",
  "Fishing Contest",
  "Gertrude's Cat",
  "Haunted Mine",
  "Hazeel Cult",
  "Heroes' Quest",
  "Holy Grail",
  "Imp Catcher",
  "In Search of the Myreque",
  "Jungle Potion",
  "Legends' Quest",
  "Lost City",
  "Mage Arena I",
  "Merlin's Crystal",
  "Monk's Friend",
  "Monkey Madness I",
  "Mourning's End Part I",
  "Murder Mystery",
  "Nature Spirit",
  "Observatory Quest",
  "One Small Favour",
  "Pirate's Treasure",
  "Plague City",
  "Priest in Peril",
  "Prince Ali Rescue",
  "Rag and Bone Man I",
  "Rag and Bone Man II",
  "Regicide",
  "Romeo & Juliet",
  "Roving Elves",
  "Rum Deal",
  "Rune Mysteries",
  "Scorpion Catcher",
  "Sea Slug",
  "Shades of Mort'ton",
  "Sheep Herder",
  "Sheep Shearer",
  "Shilo Village",
  "Tai Bwo Wannai Trio",
  "Temple of Ikov",
  "The Dig Site",
  "The Fremennik Trials",
  "The Grand Tree",
  "The Great Brain Robbery",
  "The Knight's Sword",
  "The Restless Ghost",
  "The Tourist Trap",
  "Throne of Miscellania",
  "Tree Gnome Village",
  "Tribal Totem",
  "Troll Romance",
  "Troll Stronghold",
  "Underground Pass",
  "Vampyre Slayer",
  "Watchtower",
  "Waterfall Quest",
  "Witch's House",
  "Witch's Potion"
] as const

export type Quests = {
  [K in typeof AllQuests[number]]?: QuestStatus
}


export type AchievementTask = boolean
export type AchievementDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Elite'

export interface AchievementStatus {
  complete: boolean;
  tasks: AchievementTask[]
}

export type AchievementDiary = {
  [K in AchievementDifficulty]?: AchievementStatus
}

export type AchievementDiaries = {
  [city: string]: AchievementDiary
}

export const AllSkills = [
  "Agility",
  "Attack",
  "Construction",
  "Cooking",
  "Crafting",
  "Defence",
  "Farming",
  "Firemaking",
  "Fishing",
  "Fletching",
  "Herblore",
  "Hitpoints",
  "Hunter",
  "Magic",
  "Mining",
  "Prayer",
  "Ranged",
  "Runecraft",
  "Slayer",
  "Smithing",
  "Strength",
  "Thieving",
  "Woodcutting",
] as const

export type SkillNames = typeof AllSkills[number]
export type Levels = {
  [K in SkillNames]?: number
} & {
  Overall?: number
}

// Combat Achievements
export const tiers = [
  'Easy',
  'Medium',
  'Hard',
  'Elite',
  'Master',
  'Grandmaster',
] as const
export type Tier = (typeof tiers)[number]
export interface CombatAchievement {
  id: number
  name: string
  description: string
  type:
    | 'Kill Count'
    | 'Mechanical'
    | 'Perfection'
    | 'Restriction'
    | 'Speed'
    | 'Stamina'
  tier: Tier
  monster: string
}
