def getActivation(text):
    if text == "For each [rodent] in this bird's cost, you may pay 1 [card] from your hand instead. If you do, tuck the paid [card] behind this card.":
        return 'null, // todo ActivationsBank.reduceCost'
    if text == "Steal 1 [fish] from another player's supply and cache it on this bird. They gain 1 [die] from the birdfeeder.":
        return "null, // todo ActivationsBank.stealFood(FoodEnum.fish)"
    if text == "Steal 1 [invertebrate] from another player's supply and cache it on this bird. They gain 1 [die] from the birdfeeder.":
        return "null, // todo ActivationsBank.stealFood(FoodEnum.invertebrate)"
    if text == "Steal 1 [rodent] from another player's supply and cache it on this bird. They gain 1 [die] from the birdfeeder.":
        return "null, // todo ActivationsBank.stealFood(FoodEnum.rodent)"
    if text == "Steal 1 [seed] from another player's supply and cache it on this bird. They gain 1 [die] from the birdfeeder.":
        return "null, // todo ActivationsBank.stealFood(FoodEnum.seed)"
    if text == "Steal 1 [wild] from another player's supply and add it to your own supply. They gain 1 [die] from the birdfeeder.":
        return "null, // todo ActivationsBank.stealFood(FoodEnum.wild, true)"
    if text == "When another player's predator succeeds, gain 1 [die] from the birdfeeder.":
        return 'null, // todo ActivationsBank.predatorGainFood'
    if text == '':
        return 'ActivationsBank.activationNone'
    if text == 'All players draw 1 [card] from the deck.':
        return 'ActivationsBank.allDraw'
    if text == 'All players gain 1 [fish] from the supply.':
        return "ActivationsBank.everyoneGains(FoodEnum.fish)"
    if text == 'All players gain 1 [fruit] from the supply.':
        return "ActivationsBank.everyoneGains(FoodEnum.fruit)"
    if text == 'All players gain 1 [invertebrate] from the supply.':
        return "ActivationsBank.everyoneGains(FoodEnum.invertebrate)"
    if text == 'All players gain 1 [seed] from the supply.':
        return "ActivationsBank.everyoneGains(FoodEnum.seed)"
    if text == 'All players gain a [fruit] from the supply.':
        return "ActivationsBank.everyoneGains(FoodEnum.fruit)"
    if text == 'All players lay 1 [egg] on any 1 [bowl] bird. You may lay 1 [egg] on 1 additional [bowl] bird.':
        return "null, // todo ActivationsBank.allLay(NestEnum.bowl)"
    if text == 'All players lay 1 [egg] on any 1 [cavity] bird. You may lay 1 [egg] on 1 additional [cavity] bird.':
        return "null, // todo ActivationsBank.allLay(NestEnum.cavity)"
    if text == 'All players lay 1 [egg] on any 1 [ground] bird. You may lay 1 [egg] on 1 additional [ground] bird.':
        return "null, // todo ActivationsBank.allLay(NestEnum.ground)"
    if text == 'Choose 1 other player. For each action cube in their [grassland], cache 1 [wild] from the supply on any of your birds.':
        return "null, // todo ActivationsBank.cachePerGrassland"
    if text == 'Choose 1 other player. For each action cube on their [grassland], lay 1 [egg] on this bird.':
        return "null, // todo ActivationsBank.layPerGrassland"
    if text == 'Choose 1 other player. For each action cube on their [grassland], tuck 1 [card] from your hand behind this bird, then draw an equal number of [card].':
        return "null, // todo ActivationsBank.tuckPer(HabitatEnum.grassland)"
    if text == 'Choose 1 other player. For each action cube on their [wetland], tuck 1 [card] from your hand behind this bird, then draw an equal number of [card].':
        return "null, // todo ActivationsBank.tuckPer(HabitatEnum.wetland)"
    if text == 'Choose 1-3 birds in your [wetland]. Tuck 1 [card] from your hand behind each. If you tuck at least 1 card, draw 1 [card].':
        return "null, // todo ActivationsBank.tuckMultipleWetland"
    if text == 'Choose 1-5 birds in this habitat. Tuck 1 [card] from your hand behind each.':
        return "null, // todo ActivationsBank.tuckBehindHabitat"
    if text == 'Choose 1-5 birds in your [forest]. Cache 1 [seed] from your supply on each.':
        return "null, // todo ActivationsBank.cacheOnForest"
    if text == 'Choose a food type. All players gain 1 of that food from the supply.':
        return "null, // todo ActivationsBank.chooseFoodEveryoneGains"
    if text == 'Choose a habitat with no [egg]. Lay 1 [egg] on each bird in that habitat.':
        return "null, // todo ActivationsBank.layOnEmptyHabitat"
    if text == 'Choose any 1 player (including yourself). Cache 1 [rodent] from the supply on this bird for each [predator] that player has.':
        return "null, // todo ActivationsBank.cachePerPredator"
    if text == 'Discard 1 [card] from your hand. If you do, play another bird in your [forest]. Pay its normal food and egg cost.':
        return "null, // todo ActivationsBank.discardCardPlayForest"
    if text == 'Discard 1 [egg] from any bird. If you do, play another bird in your [forest]. Pay its normal food and egg cost.':
        return "null, // todo ActivationsBank.discardEggPlayForest"
    if text == 'Discard 1 [egg] from any of your other birds to gain 1 [wild] from the supply.':
        return "null, // todo ActivationsBank.discardEggGainWild(1)"
    if text == 'Discard 1 [egg] from any of your other birds to gain 2 [wild] from the supply.':
        return "null, // todo ActivationsBank.discardEggGainWild(2)"
    if text == 'Discard 1 [egg] to draw 2 [card].':
        return "null, // todo ActivationsBank.discardEggDraw2"
    if text == 'Discard 1 [seed] from your supply. If you do, lay 2 [egg] on this bird.':
        return "ActivationsBank.discardSeedLay2"
    if text == 'Discard 1 [seed] to tuck 2 [card] from the deck behind this bird.':
        return "ActivationsBank.discardTuck2(FoodEnum.seed)"
    if text == 'Discard 1 [wild] from your supply. If you do, play another bird in your [wetland]. Pay its normal food and egg cost.':
        return "null, // todo ActivationsBank.discardWildPlayWetland"
    if text == 'Discard [fish] to tuck 2 [card] from the deck behind this bird.':
        return "ActivationsBank.discardTuck2(FoodEnum.fish)"
    if text == 'Discard a [fish] to tuck 2 [card] from the deck behind this bird.':
        return "ActivationsBank.discardTuck2(FoodEnum.fish)"
    if text == 'Discard all remaining face-up [card] and refill the tray. If you do, draw 1 of the new face-up [card].':
        return "null, // todo ActivationsBank.trashTrayDraw1"
    if text == 'Discard up to 5 [invertebrate] from your supply. For each, tuck 1 [card] from the deck behind this bird.':
        return "null, // todo ActivationsBank.discardFoodTuck(FoodEnum.invertebrate)"
    if text == 'Discard up to 5 [seed] from your supply. For each, tuck 1 [card] from the deck behind this bird.':
        return "null, // todo ActivationsBank.discardFoodToTuck(FoodEnum.seed)"
    if text == 'Discard up to 5 [wild] from your supply. For each, tuck 1 [card] from the deck behind this bird.':
        return "null, // todo ActivationsBank.discardFoodToTuck(FoodEnum.wild)"
    if text == 'Draw 1 [card] for each empty card slot in this row. At the end of your turn, keep 1 and discard the rest.':
        return "null, // todo ActivationsBank.drawPerEmpty"
    if text == 'Draw 1 [card]. If you do, discard 1 [card] from your hand at the end of your turn.':
        return 'null, // todo ActivationsBank.drawDiscard(1)'
    if text == 'Draw 1 [card].':
        return "ActivationsBank.draw"
    if text == 'Draw 1 new bonus card. Then draw 3 [card] and keep 1 of them.':
        return "null, // todo ActivationsBank.drawBonusdraw3Keep1"
    if text == 'Draw 1 new bonus card. Then gain 1 [card] or lay 1 [egg] on any bird.':
        return "null, // todo ActivationsBank.drawBonusDrawOrLay"
    if text == 'Draw 1 new bonus card. Then gain 1 [die] from the birdfeeder, lay 1 [egg] on any bird, or draw 1 [card].':
        return "null, // todo ActivationsBank.drawBonusGainDieLayOrDraw"
    if text == 'Draw 1 new bonus card. Then gain 1 [die] from the birdfeeder.':
        return "null, // todo ActivationsBank.drawBonusGainDie"
    if text == 'Draw 2 [card] from the deck. Tuck 1 behind this bird and keep the other.':
        return "null, // todo ActivationsBank.draw2Tuck1"
    if text == 'Draw 2 [card]. All other players draw 1 [card] from the deck.':
        return "ActivationsBank.draw2OthersDraw"
    if text == 'Draw 2 [card]. If you do, discard 1 [card] from your hand at the end of your turn.':
        return 'null, // todo ActivationsBank.drawDiscard(2)'
    if text == 'Draw 2 [card].':
        return "ActivationsBank.draw2"
    if text == 'Draw 2 new bonus cards and keep 1.':
        return 'null, // todo ActivationsBank.drawBonus(2)'
    if text == 'Draw 3 new bonus cards and keep 1.':
        return 'null, // todo ActivationsBank.drawBonus(3)'
    if text == 'Draw [card] equal to the number of players +1. Starting with you and proceeding clockwise, each player selects 1 of those cards and places it in their hand. You keep the extra card.':
        return "null, // todo ActivationsBank.draftNPlusOne"
    if text == 'Draw the 3 face-up [card] in the bird tray.':
        return "ActivationsBank.drawAllFaceup"
    if text == 'Each player gains 1 [die] from the birdfeeder, starting with the player of your choice.':
        return "null, // todo ActivationsBank.everyoneGainsFromFeeder"
    if text == 'From the supply, gain 1 food of a type you already gained this turn.':
        return "null, // todo ActivationsBank.regainFood"
    if text == 'Gain 1 [die] from the birdfeeder.':
        return "null, // todo ActivationsBank.gainDie"
    if text == 'Gain 1 [fruit] from the supply.':
        return "ActivationsBank.gainFood(FoodEnum.fruit)"
    if text == 'Gain 1 [invertebrate] from the birdfeeder, if there is one.':
        return "null, // todo ActivationsBank.gainInvertebrateFromFeeder"
    if text == 'Gain 1 [invertebrate] from the supply.':
        return "ActivationsBank.gainFood(FoodEnum.invertebrate)"
    if text == 'Gain 1 [invertebrate] or [fruit] from the birdfeeder, if there is one.':
        return "null, // todo ActivationsBank.gainFromFeeder([FoodEnum.invertebrate, FoodEnum.fruit])"
    if text == 'Gain 1 [seed] from the birdfeeder (if available). You may cache it on this card.':
        return 'null, // todo ActivationsBank.gainFeederSeedOptionalCache'
    if text == 'Gain 1 [seed] from the supply and cache it on this card. At any time, you may spend [seed] cached on this card.':
        return 'ActivationsBank.cacheSeed'
    if text == 'Gain 1 [seed] from the supply and cache it on this card.':
        return 'ActivationsBank.cacheSeed'
    if text == 'Gain 1 [seed] from the supply.':
        return "ActivationsBank.gainFood(FoodEnum.seed)"
    if text == 'Gain 1 [seed] or [fruit] from the birdfeeder, if there is one.':
        return "null, // todo ActivationsBank.gainFromFeeder([FoodEnum.seed, FoodEnum.fruit])"
    if text == 'Gain 1 [wild] from the birdfeeder.':
        return "null, // todo ActivationsBank.gainWildFromFeeder"
    if text == 'Gain 1 face-up [card] that can live in [grassland].':
        return "null, // todo ActivationsBank.gainFaceup(HabitatEnum.grassland)"
    if text == 'Gain 1 face-up [card] that can live in [wetland].':
        return "null, // todo ActivationsBank.gainFaceup(HabitatEnum.wetland)"
    if text == 'Gain 3 [fish] from the supply.':
        return "ActivationsBank.gainFood(FoodEnum.fish, 3)"
    if text == 'Gain 3 [seed] from the supply.':
        return "ActivationsBank.gainFood(FoodEnum.seed, 3)"
    if text == 'Gain all [fish] that are in the birdfeeder.':
        return "ActivationsBank.gainAll(FoodEnum.fish)"
    if text == 'Gain all [invertebrate] that are in the birdfeeder.':
        return "ActivationsBank.gainAll(FoodEnum.invertebrate)"
    if text == 'If this bird is to the right of all other birds in its habitat, move it to another habitat.':
        return 'null, // todo ActivationsBank.migrate'
    if text == 'If you used all 4 types of actions this round, play another bird. Pay its normal food and egg cost.':
        return "null, // todo ActivationsBank.playAnotherIfUsed4"
    if text == 'Instead of paying any costs, you may play this bird on top of another bird on your player mat. Discard any eggs and food from that bird. It becomes a tucked card.':
        return 'null, // todo ActivationsBank.evolve'
    if text == 'Lay 1 [egg] on any bird.':
        return 'null, // todo ActivationsBank.layAny'
    if text == 'Lay 1 [egg] on each bird in this column, including this one.':
        return "ActivationsBank.layOnColumn"
    if text == 'Lay 1 [egg] on each of your birds with a [bowl] nest.':
        return "ActivationsBank.layOnAll(NestEnum.bowl)"
    if text == 'Lay 1 [egg] on each of your birds with a [cavity] nest.':
        return "ActivationsBank.layOnAll(NestEnum.cavity)"
    if text == 'Lay 1 [egg] on each of your birds with a [ground] nest.':
        return "ActivationsBank.layOnAll(NestEnum.ground)"
    if text == 'Lay 1 [egg] on each of your birds with a [platform] nest.':
        return "ActivationsBank.layOnAll(NestEnum.platform)"
    if text == 'Lay 1 [egg] on this bird for each other bird with a [cavity] nest that you have.':
        return "ActivationsBank.layForEachCavity"
    if text == 'Lay 1 [egg] on this bird.':
        return 'ActivationsBank.layThis'
    if text == 'Look at a [card] from the deck. If <100cm, tuck it behind this bird. If not, discard it.':
        return 'ActivationsBank.huntDraw(100)'
    if text == 'Look at a [card] from the deck. If <50cm, tuck it behind this bird. If not, discard it.':
        return 'ActivationsBank.huntDraw(50)'
    if text == 'Look at a [card] from the deck. If <75cm, tuck it behind this bird. If not, discard it.':
        return 'ActivationsBank.huntDraw(75)'
    if text == 'Look at a [card] from the deck. If <75cm, tuck it under this bird. If not, discard it.':
        return 'ActivationsBank.huntDraw(75)'
    if text == 'Place this bird sideways, so that it covers 2 [forest] spaces. Pay the lower egg cost.':
        return "null, // todo ActivationsBank.cover2(HabitatEnum.forest)"
    if text == 'Place this bird sideways, so that it covers 2 [grassland] spaces. Pay the lower egg cost.':
        return "null, // todo ActivationsBank.cover2(HabitatEnum.grassland)"
    if text == 'Place this bird sideways, so that it covers 2 [wetland] spaces. Pay the lower egg cost.':
        return "null, // todo ActivationsBank.cover2(HabitatEnum.wetland)"
    if text == 'Play a second bird in your [forest]. Pay its normal cost.':
        return 'null, // todo ActivationsBank.playSecond([HabitatEnum.forest])'
    if text == 'Play a second bird in your [grassland] or [forest]. Pay its normal cost.':
        return 'null, // todo ActivationsBank.playSecond([HabitatEnum.forest, HabitatEnum.grassland])'
    if text == 'Play a second bird in your [grassland]. Pay its normal cost.':
        return 'null, // todo ActivationsBank.playSecond([HabitatEnum.grassland])'
    if text == 'Play a second bird in your [wetland]. Pay its normal cost.':
        return 'null, // todo ActivationsBank.playSecond([HabitatEnum.wetland])'
    if text == 'Player(s) with fewest [forest] birds gain 1 [die] from birdfeeder.':
        return "null, // todo ActivationsBank.fewestForestGainDie"
    if text == 'Player(s) with the fewest [wetland] birds: draw 1 [card].':
        return "ActivationsBank.fewestWetlandDraw"
    if text == 'Remove any 1 [die] from the birdfeeder, then gain 1 [seed] from the supply.':
        return "null, // todo ActivationsBank.removeDieGainSeed"
    if text == 'Repeat 1 [predator] power in this habitat.':
        return "null, // todo ActivationsBank.repeatPredator"
    if text == 'Repeat a brown power on one other bird in this habitat.':
        return "null, // todo ActivationsBank.repeatBrown"
    if text == 'Reset the birdfeeder. If you do, gain 1 [die] from the birdfeeder after resetting.':
        return "null, // todo ActivationsBank.resetFeederGainWild"
    if text == 'Reset the birdfeeder. If you do, gain 1 [invertebrate] from the birdfeeder after resetting.':
        return "null, // todo ActivationsBank.resetFeederGainOr([FoodEnum.invertebrate])"
    if text == 'Reset the birdfeeder. If you do, gain 1 [seed] from the birdfeeder after resetting.':
        return "null, // todo ActivationsBank.resetFeederGainOr([FoodEnum.seed])"
    if text == 'Reset the birdfeeder. If you do, gain 1 [seed] or [fruit] from the birdfeeder after resetting.':
        return "null, // todo ActivationsBank.resetFeederGain([FoodEnum.seed, FoodEnum.fruit])"
    if text == 'Reset the birdfeeder. If you do, gain all [invertebrate] in the birdfeeder after resetting.':
        return "null, // todo ActivationsBank.resetFeederGainAll(FoodEnum.invertebrate)"
    if text == 'Roll all dice not in birdfeeder. If any are [fish], gain 1 [fish] and cache it on this card.':
        return 'ActivationsBank.huntRoll(FoodEnum.fish)'
    if text == 'Roll all dice not in birdfeeder. If any are [rodent], gain 1 [rodent] and cache it on this card.':
        return 'ActivationsBank.huntRoll(FoodEnum.rodent)'
    if text == 'Roll all dice not in birdfeeder. If any are a [fish], gain that many [fish] from the supply and cache them on this bird.':
        return 'ActivationsBank.huntRollAll(FoodEnum.fish)'
    if text == 'Roll all dice not in birdfeeder. If any are a [rodent], gain 1 [rodent] and cache it on this card.':
        return 'ActivationsBank.huntRoll(FoodEnum.rodent)'
    if text == 'Roll all dice not in the birdfeeder. If any are [rodent], place 1 [egg] on this card.':
        return "ActivationsBank.rerollRodentToLay"
    if text == 'This bird counts double toward the end-of-round goal, if it qualifies for the goal.':
        return 'ActivationsBank.countDouble'
    if text == 'Trade 1 [wild] for any [wild] from the supply.':
        return "null, // todo ActivationsBank.tradeFood"
    if text == 'Tuck a [card] from your hand behind this bird. If you do, also lay 1 [egg] on this bird.':
        return 'null, // todo ActivationsBank.tuckAndLay'
    if text == 'Tuck a [card] from your hand behind this bird. If you do, draw 1 [card].':
        return 'null, // todo ActivationsBank.tuckAndDraw'
    if text == 'Tuck a [card] from your hand behind this bird. If you do, gain 1 [fruit] from the supply.':
        return "null, // todo ActivationsBank.tuckAndGainFood([FoodEnum.fruit])"
    if text == 'Tuck a [card] from your hand behind this bird. If you do, gain 1 [invertebrate] from the supply.':
        return "null, // todo ActivationsBank.tuckAndGainFood([FoodEnum.invertebrate])"
    if text == 'Tuck a [card] from your hand behind this bird. If you do, gain 1 [invertebrate] or 1 [seed] from the supply.':
        return "null, // todo ActivationsBank.tuckAndGainFood([FoodEnum.invertebrate, FoodEnum.seed])"
    if text == 'Tuck a [card] from your hand behind this bird. If you do, gain 1 [seed] from the supply.':
        return "null, // todo ActivationsBank.tuckAndGainFood([FoodEnum.seed])"
    if text == 'Tuck a [card] from your hand behind this bird. If you do, lay 1 [egg] on any bird.':
        return "null, // todo ActivationsBank.tuckAndLayAnywhere"
    if text == 'Tuck up to 3 [card] from your hand behind this bird. Draw 1 [card] for each card you tucked.':
        return "null, // todo ActivationsBank.tuckUpTo3AndDraw"
    if text == 'When another player plays a [forest] bird, gain 1 [invertebrate] from the supply.':
        return "null, // todo ActivationsBank.gainInvertegrateOnForest"
    if text == 'When another player plays a [grassland] bird, tuck 1 [card] from your hand behind this bird.':
        return "null, // todo ActivationsBank.tuckOnGrassland"
    if text == 'When another player plays a [wetland] bird, gain 1 [fish] from the supply.':
        return "null, // todo ActivationsBank.playAndGain(HabitatEnum.wetland, FoodEnum.fish)"
    if text == 'When another player takes the "gain food" action, gain 1 [invertebrate] or [fruit] from the birdfeeder at the end of their turn.':
        return "null, // todo ActivationsBank.gainFromFeederAtEnd([FoodEnum.invertebrate, FoodEnum.fruit])"
    if text == 'When another player takes the "gain food" action, gain 1 [seed] from the birdfeeder at the end of their turn.':
        return "null, // todo ActivationsBank.gainFromFeederAtEnd([FoodEnum.seed])"
    if text == 'When another player takes the "gain food" action, if they gain any number of [rodent], also gain 1 [rodent] from the supply and cache it on this card.':
        return "null, // todo ActivationsBank.gainRodentOnGainRodent"
    if text == 'When another player takes the "lay eggs" action, this bird lays 1 [egg] on another bird with a [bowl] nest.':
        return 'null, // todo ActivationsBank.layEgg([FoodEnum.bowl])'
    if text == 'When another player takes the "lay eggs" action, this bird lays 1 [egg] on another bird with a [bowl] or [ground] nest.':
        return 'null, // todo ActivationsBank.layEgg([FoodEnum.ground, FoodEnum.bowl])'
    if text == 'When another player takes the "lay eggs" action, this bird lays 1 [egg] on another bird with a [cavity] nest.':
        return 'null, // todo ActivationsBank.layEgg([FoodEnum.cavity])'
    if text == 'When another player takes the "lay eggs" action, this bird lays 1 [egg] on another bird with a [ground] nest.':
        return 'null, // todo ActivationsBank.layEgg([FoodEnum.ground])'
    if text == 'When another player tucks a [card] for any reason, tuck 1 [card] from the deck behind this bird.':
        return "null, // todo ActivationsBank.tuckOnTuck"
    if text == 'When another player tucks a [card] for any reason, tuck 1 [card] from your hand behind this bird, then draw 1 [card] at the end of their turn.':
        return "null, // todo ActivationsBank.tuckAndDrawAtEnd"
