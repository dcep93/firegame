import types, { BonusType, CardType } from "./types";

const cards: CardType[] = [
  {
    name: "Acorn Woodpecker",
  },
  {
    name: "American Avocet",
  },
  {
    name: "American Bittern",
  },
  {
    name: "American Coot",
  },
  {
    name: "American Crow",
  },
  {
    name: "American Goldfinch",
  },
  {
    name: "American Kestrel",
  },
  {
    name: "American Oystercatcher",
  },
  {
    name: "American Redstart",
  },
  {
    name: "American Robin",
  },
  {
    name: "American White Pelican",
  },
  {
    name: "American Woodcock",
  },
  {
    name: "Anhinga",
  },
  {
    name: "Anna's Hummingbird",
  },
  {
    name: "Ash-Throated Flycatcher",
  },
  {
    name: "Atlantic Puffin",
  },
  {
    name: "Audouin's Gull",
  },
  {
    name: "Baird's Sparrow",
  },
  {
    name: "Bald Eagle",
  },
  {
    name: "Baltimore Oriole",
  },
  {
    name: "Barn Owl",
  },
  {
    name: "Barn Swallow",
  },
  {
    name: "Barred Owl",
  },
  {
    name: "Barrow's Goldeneye",
  },
  {
    name: "Bell's Vireo",
  },
  {
    name: "Belted Kingfisher",
  },
  {
    name: "Bewick's Wren",
  },
  {
    name: "Black Redstart",
  },
  {
    name: "Black Skimmer",
  },
  {
    name: "Black Tern",
  },
  {
    name: "Black Vulture",
  },
  {
    name: "Black Woodpecker",
  },
  {
    name: "Black-Bellied Whistling Duck",
  },
  {
    name: "Black-Billed Magpie",
  },
  {
    name: "Black-Chinned Hummingbird",
  },
  {
    name: "Black-Crowned Night-Heron",
  },
  {
    name: "Black-Headed Gull",
  },
  {
    name: "Black-Necked Stilt",
  },
  {
    name: "Black-Tailed Godwit",
  },
  {
    name: "Black-Throated Diver",
  },
  {
    name: "Blue Grosbeak",
  },
  {
    name: "Blue Jay",
  },
  {
    name: "Blue-Gray Gnatcatcher",
  },
  {
    name: "Blue-Winged Warbler",
  },
  {
    name: "Bluethroat",
  },
  {
    name: "Bobolink",
  },
  {
    name: "Bonelli's Eagle",
  },
  {
    name: "Brant",
  },
  {
    name: "Brewer's Blackbird",
  },
  {
    name: "Broad-Winged Hawk",
  },
  {
    name: "Bronzed Cowbird",
  },
  {
    name: "Brown Pelican",
  },
  {
    name: "Brown-Headed Cowbird",
  },
  {
    name: "Bullfinch",
  },
  {
    name: "Burrowing Owl",
  },
  {
    name: "Bushtit",
  },
  {
    name: "California Condor",
  },
  {
    name: "California Quail",
  },
  {
    name: "Canada Goose",
  },
  {
    name: "Canvasback",
  },
  {
    name: "Carolina Chickadee",
  },
  {
    name: "Carolina Wren",
  },
  {
    name: "Carrion Crow",
  },
  {
    name: "Cassin's Finch",
  },
  {
    name: "Cassin's Sparrow",
  },
  {
    name: "Cedar Waxwing",
  },
  {
    name: "Cerulean Warbler",
  },
  {
    name: "Cetti's Warbler",
  },
  {
    name: "Chestnut-Collared Longspur",
  },
  {
    name: "Chihuahuan Raven",
  },
  {
    name: "Chimney Swift",
  },
  {
    name: "Chipping Sparrow",
  },
  {
    name: "Clark's Grebe",
  },
  {
    name: "Clark's Nutcracker",
  },
  {
    name: "Coal Tit",
  },
  {
    name: "Common Blackbird",
  },
  {
    name: "Common Buzzard",
  },
  {
    name: "Common Chaffinch",
  },
  {
    name: "Common Chiffchaff",
  },
  {
    name: "Common Cuckoo",
  },
  {
    name: "Common Goldeneye",
  },
  {
    name: "Common Grackle",
  },
  {
    name: "Common Kingfisher",
  },
  {
    name: "Common Little Bittern",
  },
  {
    name: "Common Loon",
  },
  {
    name: "Common Merganser",
  },
  {
    name: "Common Moorhen",
  },
  {
    name: "Common Nighthawk",
  },
  {
    name: "Common Nightingale",
  },
  {
    name: "Common Raven",
  },
  {
    name: "Common Starling",
  },
  {
    name: "Common Swift",
  },
  {
    name: "Common Yellowthroat",
  },
  {
    name: "Cooper's Hawk",
  },
  {
    name: "Corsican Nuthatch",
  },
  {
    name: "Dark-Eyed Junco",
  },
  {
    name: "Dickcissel",
  },
  {
    name: "Double-Crested Cormorant",
  },
  {
    name: "Downy Woodpecker",
  },
  {
    name: "Dunnock",
  },
  {
    name: "Eastern Bluebird",
  },
  {
    name: "Eastern Imperial Eagle",
  },
  {
    name: "Eastern Kingbird",
  },
  {
    name: "Eastern Phoebe",
  },
  {
    name: "Eastern Screech Owl",
  },
  {
    name: "Eleonora's Falcon",
  },
  {
    name: "Eurasian Collared-Dove",
  },
  {
    name: "Eurasian Golden Oriole",
  },
  {
    name: "Eurasian Green Woodpecker",
  },
  {
    name: "Eurasian Hobby",
  },
  {
    name: "Eurasian Jay",
  },
  {
    name: "Eurasian Magpie",
  },
  {
    name: "Eurasian Nutcracker",
  },
  {
    name: "Eurasian Nuthatch",
  },
  {
    name: "Eurasian Sparrowhawk",
  },
  {
    name: "Eurasian Tree Sparrow",
  },
  {
    name: "European Bee-Eater",
  },
  {
    name: "European Goldfinch",
  },
  {
    name: "European Honey Buzzard",
  },
  {
    name: "European Robin",
  },
  {
    name: "European Roller",
  },
  {
    name: "European Turtle Dove",
  },
  {
    name: "Ferruginous Hawk",
  },
  {
    name: "Fish Crow",
  },
  {
    name: "Forster's Tern",
  },
  {
    name: "Franklin's Gull",
  },
  {
    name: "Goldcrest",
  },
  {
    name: "Golden Eagle",
  },
  {
    name: "Grasshopper Sparrow",
  },
  {
    name: "Gray Catbird",
  },
  {
    name: "Great Blue Heron",
  },
  {
    name: "Great Crested Flycatcher",
  },
  {
    name: "Great Crested Grebe",
  },
  {
    name: "Great Egret",
  },
  {
    name: "Great Horned Owl",
  },
  {
    name: "Great Tit",
  },
  {
    name: "Greater Flamingo",
  },
  {
    name: "Greater Prairie Chicken",
  },
  {
    name: "Greater Roadrunner",
  },
  {
    name: "Green Heron",
  },
  {
    name: "Grey Heron",
  },
  {
    name: "Greylag Goose",
  },
  {
    name: "Griffon Vulture",
  },
  {
    name: "Hawfinch",
  },
  {
    name: "Hermit Thrush",
  },
  {
    name: "Hooded Crow",
  },
  {
    name: "Hooded Merganser",
  },
  {
    name: "Hooded Warbler",
  },
  {
    name: "Horned Lark",
  },
  {
    name: "House Finch",
  },
  {
    name: "House Sparrow",
  },
  {
    name: "House Wren",
  },
  {
    name: "Inca Dove",
  },
  {
    name: "Indigo Bunting",
  },
  {
    name: "Juniper Titmouse",
  },
  {
    name: "Killdeer",
  },
  {
    name: "King Rail",
  },
  {
    name: "Lazuli Bunting",
  },
  {
    name: "Lesser Whitethroat",
  },
  {
    name: "Lincoln's Sparrow",
  },
  {
    name: "Little Bustard",
  },
  {
    name: "Little Owl",
  },
  {
    name: "Loggerhead Shrike",
  },
  {
    name: "Long-Tailed Tit",
  },
  {
    name: "Mallard",
  },
  {
    name: "Mississippi Kite",
  },
  {
    name: "Moltoni's Warbler",
  },
  {
    name: "Montagu's Harrier",
  },
  {
    name: "Mountain Bluebird",
  },
  {
    name: "Mountain Chickadee",
  },
  {
    name: "Mourning Dove",
  },
  {
    name: "Mute Swan",
  },
  {
    name: "Northern Bobwhite",
  },
  {
    name: "Northern Cardinal",
  },
  {
    name: "Northern Flicker",
  },
  {
    name: "Northern Gannet",
  },
  {
    name: "Northern Goshawk",
  },
  {
    name: "Northern Harrier",
  },
  {
    name: "Northern Mockingbird",
  },
  {
    name: "Northern Shoveler",
  },
  {
    name: "Osprey",
  },
  {
    name: "Painted Bunting",
  },
  {
    name: "Painted Whitestart",
  },
  {
    name: "Parrot Crossbill",
  },
  {
    name: "Peregrine Falcon",
  },
  {
    name: "Pied-Billed Grebe",
  },
  {
    name: "Pileated Woodpecker",
  },
  {
    name: "Pine Siskin",
  },
  {
    name: "Prothonotary Warbler",
  },
  {
    name: "Purple Gallinule",
  },
  {
    name: "Purple Martin",
  },
  {
    name: "Pygmy Nuthatch",
  },
  {
    name: "Red Crossbill",
  },
  {
    name: "Red Kite",
  },
  {
    name: "Red Knot",
  },
  {
    name: "Red-Backed Shrike",
  },
  {
    name: "Red-Bellied Woodpecker",
  },
  {
    name: "Red-Breasted Merganser",
  },
  {
    name: "Red-Breasted Nuthatch",
  },
  {
    name: "Red-Cockaded Woodpecker",
  },
  {
    name: "Red-Crowned Crane",
  },
  {
    name: "Red-Eyed Vireo",
  },
  {
    name: "Red-Headed Woodpecker",
  },
  {
    name: "Red-Legged Partridge",
  },
  {
    name: "Red-Shouldered Hawk",
  },
  {
    name: "Red-Tailed Hawk",
  },
  {
    name: "Red-Winged Blackbird",
  },
  {
    name: "Ring-Billed Gull",
  },
  {
    name: "Rose-Breasted Grosbeak",
  },
  {
    name: "Roseate Spoonbill",
  },
  {
    name: "Ruby-Crowned Kinglet",
  },
  {
    name: "Ruby-Throated Hummingbird",
  },
  {
    name: "Ruddy Duck",
  },
  {
    name: "Ruff",
  },
  {
    name: "Sandhill Crane",
  },
  {
    name: "Savannah Sparrow",
  },
  {
    name: "Savi's Warbler",
  },
  {
    name: "Say's Phoebe",
  },
  {
    name: "Scaled Quail",
  },
  {
    name: "Scissor-Tailed Flycatcher",
  },
  {
    name: "Short-Toed Treecreeper",
  },
  {
    name: "Snow Bunting",
  },
  {
    name: "Snowy Egret",
  },
  {
    name: "Snowy Owl",
  },
  {
    name: "Song Sparrow",
  },
  {
    name: "Spotted Owl",
  },
  {
    name: "Spotted Sandpiper",
  },
  {
    name: "Spotted Towhee",
  },
  {
    name: "Sprague's Pipit",
  },
  {
    name: "Squacco Heron",
  },
  {
    name: "Steller's Jay",
  },
  {
    name: "Swainson's Hawk",
  },
  {
    name: "Thekla's Lark",
  },
  {
    name: "Tree Swallow",
  },
  {
    name: "Trumpeter Swan",
  },
  {
    name: "Tufted Titmouse",
  },
  {
    name: "Turkey Vulture",
  },
  {
    name: "Vaux's Swift",
  },
  {
    name: "Violet-Green Swallow",
  },
  {
    name: "Western Meadowlark",
  },
  {
    name: "Western Tanager",
  },
  {
    name: "White Stork",
  },
  {
    name: "White Wagtail",
  },
  {
    name: "White-Backed Woodpecker",
  },
  {
    name: "White-Breasted Nuthatch",
  },
  {
    name: "White-Crowned Sparrow",
  },
  {
    name: "White-Faced Ibis",
  },
  {
    name: "White-Throated Dipper",
  },
  {
    name: "White-Throated Swift",
  },
  {
    name: "Whooping Crane",
  },
  {
    name: "Wild Turkey",
  },
  {
    name: "Willet",
  },
  {
    name: "Wilson's Snipe",
  },
  {
    name: "Wilson's Storm Petrel",
  },
  {
    name: "Wood Duck",
  },
  {
    name: "Wood Stork",
  },
  {
    name: "Yellow-Bellied Sapsucker",
  },
  {
    name: "Yellow-Billed Cuckoo",
  },
  {
    name: "Yellow-Breasted Chat",
  },
  {
    name: "Yellow-Headed Blackbird",
  },
  {
    name: "Yellow-Rumped Warbler",
  },
  {
    name: "Yellowhammer",
  },
];

const bonuses: BonusType[] = [
  {
    name: "Anatomist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with body parts in their names",
    extra:
      "Body parts include back, beak, belly, bill, breast, cap, chin, collar, crest, crown, eye, face, head, leg, neck, rump, shoulder, tail, throat, toe, wing",
    vp_text: "2 to 3 birds: 3; 4+ birds: 7",
    vp_f: { 2: 3, 4: 7 },
    percent: "22",
  },
  {
    name: "Backyard Birder",
    expansion: types.expansions.core,
    automa: false,
    automa_only: false,
    condition: "Birds worth less than 4 points",
    extra: "",
    vp_text: "5 to 6 birds: 3; 6+ birds: 6",
    vp_f: { 5: 3, 6: 6 },
    percent: "42",
  },
  {
    name: "Behaviorist",
    expansion: types.expansions.european,
    automa: false,
    automa_only: false,
    condition:
      "For each column that contains birds with 3 different power colors:",
    extra: "Birds with no power count as white.",
    vp_text: "3 per column",
    vp_f: {},
    percent: "-",
  },
  {
    name: "Bird Bander",
    expansion: types.expansions.european,
    automa: true,
    automa_only: false,
    condition: "Birds that can live in multiple habitats",
    extra: "",
    vp_text: "4 to 5 birds: 4; 6+ birds: 7",
    vp_f: { 4: 4, 6: 7 },
    percent: "31",
  },
  {
    name: "Bird Counter",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with a [flocking] power",
    extra: "",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "15",
  },
  {
    name: "Bird Feeder",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat [seed]",
    extra: "",
    vp_text: "5 to 7 birds: 3; 8+ birds: 7",
    vp_f: { 5: 3, 8: 7 },
    percent: "44",
  },
  {
    name: "Breeding Manager",
    expansion: types.expansions.core,
    automa: false,
    automa_only: false,
    condition: "Birds that have at least 4 eggs laid on them",
    extra: "",
    vp_text: "1 per bird",
    vp_f: {},
    percent: "28*",
  },
  {
    name: "Cartographer",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with geography terms in their name",
    extra:
      "Terms include American, Atlantic, Baltimore, California, Canada, Carolina, Chihuahua, Corsican, Eastern, Eurasian, European, Inca, Mississippi, Moor, Mountain, Northern, Prairie, Sandhill, Savannah, Western",
    vp_text: "2 to 3 birds: 3; 4+ birds: 7",
    vp_f: { 2: 3, 4: 7 },
    percent: "21",
  },
  {
    name: "Citizen Scientist",
    expansion: types.expansions.european,
    automa: true,
    automa_only: false,
    condition: "Birds with tucked cards",
    extra: "",
    vp_text: "4 to 6 birds: 3; 7+ birds: 6",
    vp_f: { 4: 3, 7: 6 },
    percent: "21*",
  },
  {
    name: "Diet Specialist",
    expansion: types.expansions.european,
    automa: true,
    automa_only: false,
    condition: "Birds with a food cost of 3 food",
    extra: "",
    vp_text: "2 to 3 birds: 3; 4+ birds: 6",
    vp_f: { 2: 3, 4: 6 },
    percent: "29",
  },
  {
    name: "Ecologist",
    expansion: types.expansions.core,
    automa: false,
    automa_only: false,
    condition: "Birds in your habitat with the fewest birds.",
    extra: "Ties count.",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "-",
  },
  {
    name: "Enclosure Builder",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with [ground] nests",
    extra: "Birds must have a [ground] or [star] nest symbol.",
    vp_text: "4 to 5 birds: 4; 6+ birds: 7",
    vp_f: { 4: 4, 6: 7 },
    percent: "31",
  },
  {
    name: "Ethologist",
    expansion: types.expansions.european,
    automa: false,
    automa_only: false,
    condition: "In any one habitat:",
    extra: "Birds with no power count as white.",
    vp_text: "2 per power color",
    vp_f: {},
    percent: "-",
  },
  {
    name: "Falconer",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with a [predator] power",
    extra: "",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "13",
  },
  {
    name: "Fishery Manager",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat [fish]",
    extra: "",
    vp_text: "2 to 3 birds: 3; 4+ birds: 8",
    vp_f: { 2: 3, 4: 8 },
    percent: "18",
  },
  {
    name: "Food Web Expert",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat only [invertebrate]",
    extra: "",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "9",
  },
  {
    name: "Forester",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that can only live in [forest]",
    extra: "",
    vp_text: "3 to 4 birds: 4; 5 birds: 5",
    vp_f: { 3: 4, 5: 5 },
    percent: "24",
  },
  {
    name: "Historian",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds named after a person",
    extra: "Any bird with an 's in its name.",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "11",
  },
  {
    name: "Large Bird Specialist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with wingspans over 65 cm",
    extra: "",
    vp_text: "4 to 5 birds: 3; 6+ birds: 6",
    vp_f: { 4: 3, 6: 6 },
    percent: "35",
  },
  {
    name: "Nest Box Builder",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with [cavity] nests",
    extra: "Birds must have a [cavity] or [star] nest symbol.",
    vp_text: "4 to 5 birds: 4; 6+ birds: 7",
    vp_f: { 4: 4, 6: 7 },
    percent: "31",
  },
  {
    name: "Omnivore Specialist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat [wild]",
    extra:
      "Any bird that specifically has a [wild] symbol as part of its food cost.",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "16",
  },
  {
    name: "Oologist",
    expansion: types.expansions.core,
    automa: false,
    automa_only: false,
    condition: "Birds that have at least 1 egg laid on them",
    extra: "",
    vp_text: "7 to 8 birds: 3; 9+ birds: 6",
    vp_f: { 7: 3, 9: 6 },
    percent: "-",
  },
  {
    name: "Passerine Specialist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with wingspans 30 cm or less",
    extra: "",
    vp_text: "4 to 5 birds: 3; 6+ birds: 6",
    vp_f: { 4: 3, 6: 6 },
    percent: "35",
  },
  {
    name: "Photographer",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with colors in their names",
    extra:
      "Colors include ash, black, blue, bronze, brown, cerulean, chestnut, coal, ferruginous, gold, gray, grey, green, honey, indigo, lazuli, purple, red, rose, roseate, ruby, ruddy, rufous, snowy, violet, white, yellow",
    vp_text: "4 to 5 brids: 3; 6+ birds: 7",
    vp_f: { 4: 3, 6: 7 },
    percent: "34",
  },
  {
    name: "Platform Builder",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with [platform] nests",
    extra: "Birds must have a [platform] or [star] nest symbol.",
    vp_text: "4 to 5 birds: 4; 6+ birds: 7",
    vp_f: { 4: 4, 6: 7 },
    percent: "31",
  },
  {
    name: "Prairie Manager",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that can only live in [grassland]",
    extra: "",
    vp_text: "2 to 3 birds: 3; 4+ birds: 8",
    vp_f: { 2: 3, 4: 8 },
    percent: "19",
  },
  {
    name: "Rodentologist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat [rodent]",
    extra: "",
    vp_text: "2 per bird",
    vp_f: {},
    percent: "15",
  },
  {
    name: "Visionary Leader",
    expansion: types.expansions.core,
    automa: false,
    automa_only: false,
    condition: "Bird cards in hand at end of game",
    extra: "",
    vp_text: "5 to 7 birds: 4; 8+ birds: 7",
    vp_f: { 5: 4, 8: 7 },
    percent: "-",
  },
  {
    name: "Viticulturalist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that eat [fruit]",
    extra: "",
    vp_text: "2 to 3 birds: 3; 4+ birds: 7",
    vp_f: { 2: 3, 4: 7 },
    percent: "22",
  },
  {
    name: "Wetland Scientist",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds that can only live in [wetland]",
    extra: "",
    vp_text: "3 to 4 birds: 3; 5 birds: 7",
    vp_f: { 3: 3, 5: 7 },
    percent: "26",
  },
  {
    name: "Wildlife Gardener",
    expansion: types.expansions.core,
    automa: true,
    automa_only: false,
    condition: "Birds with [bowl] nests",
    extra: "Birds must have a [bowl] or [star] nest symbol.",
    vp_text: "4 to 5 birds: 4; 6+ birds: 7",
    vp_f: { 4: 4, 6: 7 },
    percent: "31",
  },
  {
    name: "[automa] Autwitcher",
    expansion: types.expansions.european,
    automa: true,
    automa_only: true,
    condition: "Birds that are worth 3 or 4 points",
    extra: "The automa keeps up to 2 of them (higher value first).",
    vp_text: "-",
    vp_f: {},
    percent: "44",
  },
  {
    name: "[automa] RASPB Life Fellow",
    expansion: types.expansions.european,
    automa: true,
    automa_only: true,
    condition: "Birds that are worth 5, 6, or 7 points",
    extra: "The automa keeps the highest valued one.",
    vp_text: "-",
    vp_f: {},
    percent: "28",
  },
];

const bank = { cards, bonuses };

export default bank;
