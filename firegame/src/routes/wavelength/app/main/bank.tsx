import { Difficulty, Card } from "../utils/NewGame";

const bankStringEasy = `
bad TV show, good TV show
dirty, clean
bad actor, good actor
dangerous job, safe job
casual, formal
dry, wet
forbidden, encouraged
hard to remember, easy to remember
unhealthy, healthy
historically important, historically irrelevant
inflexible, flexible
introvert, extrovert
bad movie, good movie
happens slowly, happens suddenly
loved, hated
fragile, durable
good, evil
bad habit, good habit
guilty pleasure, openly love
dark, light
hard to find, easy to find
bad pizza topping, good pizza topping
mature person, immature person
mean person, nice person
mental activity, physical activity
need, want
normal thing to own, weird thing to own
bad person, good person
ethical to eat, unethical to eat
optional, mandatory
ordinary, extraordinary
low quality, high quality
plain, fancy
poorly made, well made
quiet place, loud place
dangerous, safe
replaceable, irreplaceable
hot, cold
colorless, colorful
feels bad, feels good
cheap, expensive
rare, common
easy subject, hard subject
difficult to use, easy to use
role model, bad influence
rough, smooth
peaceful, warlike
round, pointy
sad movie, happy movie
scary animal, nice animal
short lived, long lived
useless body part, useful body part
weak, strong
useless invention, useful invention
unpopular, popular
boring, exciting
villain, hero
useless in an emergency, useful in an emergency
wise, intelligent
worthless, priceless
unstable, stable
easy to kill, hard to kill
divided, whole
underrated musician, overrated musician
easy to spell, hard to spell
movie that godzilla would ruin, movie that godzilla would improve
bad music, good music
gryffindor, slytherin
unforgiveable, forgiveable
freedom fighter, terrorist
boring hobby, interesting hobby
messy food, clean food
uncool, cool
sport, game
looks like a person, doesn't look like a person
unbelievable, believable
bad superpower, good superpower
artisinal, mass produced
better hot, better cold
sustenance, haute cuisine
snack, meal
smells bad, smells good
mildly addictive, highly addictive
bad man, good man
hairless, hairy
normal pet, exotic pet
book was better, movie was better
ugly, beautiful
job, career
the light side of the force, the dark side of the force
geek, dork
worst day of the year, best day of the year
cat person, dog person
untalented, talented
underrated actor, overrated actor
ugly man, beautiful man
dystopia, utopia
underrated thing to own, overrated thing to own
action movie, adventure movie
uncontroversial topic, controversial topic
dry food, wet food
straight, curvy
80s, 90s
movie, film
underrated letter of the alphabet, overrated letter of the alphabet
hard to pronounce, easy to pronounce
unsexy animal, sexy animal
has a bad reputation, has a good reputation
fantasy, sci-fi
underpaid, overpaid
underrated skill, overrated skill
sad song, happy song
lowbrow, highbrow
traditionally masculine, traditionally feminine
requires luck, requires skill
basic, hipster
not a sandwich, a sandwich
comedy, drama
culturally significant, culturally insignificant
worst athlete of all time, greatest athlete of all time
normal, weird
low calorie, high calorie
inessential, essential
underrated weapon, overrated weapon
unsexy emoji, sexy emoji
unknown, famous
tired, wired
useless major, useful major
underrated movie, overrated movie
bad for you, good for you
proof that God exists, proof that God doesn't exist
waste of time, good use of time
mainstream, niche
nobody does it, everybody does it
fad, classic
disgusting cereal, delicious cereal
liberal, conservative
friend, enemy
smelly in a bad way, smelly in a good way
underrated thing to do, overrated thing to do
for kids, for adults
hard to do, easy to do
nature, nurture
round animal, pointy animal
unreliable, reliable
unpopular activity, popular activity
vice, virtue
unimportant, important
useless, useful
unhygienic, hygienic
harmless, harmful
failure, masterpiece
unfashionable, fashionable
unethical, ethical
underrated, overrated
worst living person, greatest living person
tastes bad, tastes good
temporary, permanent
trashy, classy
ineffective, effective
stupid, brilliant
square, round
soft, hard
least evil company, most evil company
star wars, star trek
bad, good
`;

const bankStringHard = `
tick, tock
one hit wonder, pop icon
bad dog (breed), good dog (breed)
heterogeneous, homogeneous
unsceneted, scented
not enough, too much
gossip, news
limp, firm
science, pseudoscience
vapes, doesn't vape
benefits you, benefits everyone
etiquette, manners
genuine person, phony person
small, tiny
old fashioned, avant garde
small number, large number
worst era to time travel, best era to time travel
local issue, global issue
little known fact, well known fact
worst year in history, best year in history
too small, too big
unsexy pokemon, sexy pokemon
out of control, in control
illegal, prohibited
religious, sacrilegious
small talk, heavy topic
casual event, formal event
non-partisan, partisan
normal greeting, weird greeting
illegal, legal
bad school, good school
never on time, always on time
similar, identical
bad president, good president
least powerful god, most powerful god
underrated book, overrated book
worst chore, best chore
blue, green
thrilling, terrifying
expected, unexpected
underrated game, overrated game
bad advice, good advice
art, commerce
inclusive, exclusive
not huggable, huggable
horizontal, vertical
hard to sit on, easy to sit on
guilty pleasure, actually just bad
funny topic, serious topic
fruit, vegetable
powerless, powerful
unsexy color, sexy color
derivative, original
unnatural, natural
ugly word, beautiful word
true, false
the worst, the best
talent, skill
stationary, mobile
socialist, capitalist
short, long
secret, public knowledge
quiet, loud
popular, elitist
not art, art
mild, spicy
bad investment, good investment
limited, infinite
dog name, cat name
dicatatorship, democracy
bad mouthfeel, good mouthfeel
deep thought, shallow thought
won't live to 100, will live to 100
bad disney character, good disney character
weird, strange
famous, infamous
boring person, fun person
conventional wisdom, fringe belief
endangered species, overpopulated species
person you could beat up, person who'd beat you up
nerd, jock
unreasonable phobia, reasonable phobia
`;

function stringToCard(s: string): Card[] {
	return s
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			const parts = line.split(",");
			return { a: parts[0].toUpperCase(), b: parts[1].toUpperCase() };
		});
}

const bank = {
	[Difficulty.easy]: stringToCard(bankStringEasy),
	[Difficulty.hard]: stringToCard(bankStringHard),
};

export default bank;
