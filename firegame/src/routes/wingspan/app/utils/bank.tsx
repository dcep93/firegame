import { BonusType, CardType } from "./types";

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
  },
  {
    name: "Backyard Birder",
  },
  {
    name: "Behaviorist",
  },
  {
    name: "Bird Bander",
  },
  {
    name: "Bird Counter",
  },
  {
    name: "Bird Feeder",
  },
  {
    name: "Breeding Manager",
  },
  {
    name: "Cartographer",
  },
  {
    name: "Citizen Scientist",
  },
  {
    name: "Diet Specialist",
  },
  {
    name: "Ecologist",
  },
  {
    name: "Enclosure Builder",
  },
  {
    name: "Ethologist",
  },
  {
    name: "Falconer",
  },
  {
    name: "Fishery Manager",
  },
  {
    name: "Food Web Expert",
  },
  {
    name: "Forester",
  },
  {
    name: "Historian",
  },
  {
    name: "Large Bird Specialist",
  },
  {
    name: "Nest Box Builder",
  },
  {
    name: "Omnivore Specialist",
  },
  {
    name: "Oologist",
  },
  {
    name: "Passerine Specialist",
  },
  {
    name: "Photographer",
  },
  {
    name: "Platform Builder",
  },
  {
    name: "Prairie Manager",
  },
  {
    name: "Rodentologist",
  },
  {
    name: "Visionary Leader",
  },
  {
    name: "Viticulturalist",
  },
  {
    name: "Wetland Scientist",
  },
  {
    name: "Wildlife Gardener",
  },
  {
    name: "[automa] Autwitcher",
  },
  {
    name: "[automa] RASPB Life Fellow",
  },
];

const bank = { cards, bonuses };

export default bank;
