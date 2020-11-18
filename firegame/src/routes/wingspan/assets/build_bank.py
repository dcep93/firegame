#!/usr/local/bin/python3

import csv
import json
import os

import get_activation

cards_src = 'wingspan-card-lists-20200529.xlsx - Master.csv'
bonus_src = 'wingspan-card-lists-20200529.xlsx - Bonus cards.csv'

bank_dest = os.path.join('../', 'app', 'utils', 'bank.tsx')

bonuses_to_skip = ["Behaviorist", "Ethologist"]

def main():
    cards_text = getCardsText()
    bonuses_text = getBonusesText()

    bank_text = getBankText(cards_text, bonuses_text)
    writeBankText(bank_text)

    num_lines = len(bank_text.split('\n'))
    print(f"wrote {num_lines} lines")

def getCsv(path):
    with open(path) as fh:
        r = csv.reader(fh)
        raw = list(r)
    cols = raw[0]
    # print("\n".join(cols))
    # print()
    return [{cols[i]:row[i].strip() for i in range(len(row))} for row in raw[1:] if ''.join(row[:1])]

def getCardsText():
    name = 'cards: CardType[]'
    return getText(name, cards_src, getCardLines)

def getBonusesText():
    name = 'bonuses: BonusType[]'
    return getText(name, bonus_src, getBonusLines)

def getCardLines(card):
    expansion = ({"originalcore": "core", "european": "european", "swiftstart": "swiftstart", "chinesepromo": "chinesepromo"})[card[""]]
    habitats = "[" + ", ".join([f"HabitatEnum.{i.lower()}" for i in ["Forest", "Grassland", "Wetland"] if card[i]]) + "]"
    food = "{ " + ", ".join([f'[FoodEnum.{i.replace(" (food)", "").lower()}]: {int(card[i])}' for i in ["Invertebrate", "Seed", "Fruit", "Fish", "Rodent", "Wild (food)"] if card[i]]) + " }"
    bonuses = [i for i in ["Anatomist","Cartographer","Historian","Photographer","Backyard Birder","Bird Bander","Bird Counter","Bird Feeder","Citizen Scientist","Diet Specialist","Enclosure Builder","Falconer","Fishery Manager","Food Web Expert","Forester","Large Bird Specialist","Nest Box Builder","Omnivore Expert","Passerine Specialist","Platform Builder","Prairie Manager","Rodentologist","Viticulturalist","Wetland Scientist","Wildlife Gardener"] if card[i]]
    activation = get_activation.getActivation(card["Power text"])
    return [
        f'activation: {activation},',
        f'name: "{card["Common name"]}",',
        f'scientific_name: "{card["Scientific name"]}",',
        f'color: ColorEnum.{card["Color"].lower() if card["Color"] else "white"},',
        f'expansion: ExpansionEnum.{expansion},',
        f'text: {json.dumps(card["Power text"])},',
        f'predator: {json.dumps(bool(card["Predator"]))},',
        f'flocking: {json.dumps(bool(card["Flocking"]))},',
        f'bonus: {json.dumps(bool(card["Bonus card"]))},',
        f'points: {card["Victory points"]},',
        f'nest: NestEnum.{card["Nest type"].lower()},',
        f'capacity: {card["Egg capacity"]},',
        f'wingspan: {card["Wingspan"]},',
        f'habitats: {habitats},',
        f'food: {food},',
        f'food_slash: {json.dumps(bool(card["/ (food cost)"]))},',
        f'food_star: {json.dumps(bool(card["* (food cost)"]))},',
        f'bonuses: {bonuses},',
    ]

def getBonusLines(bonus):
    return [
        f'name: "{bonus["Name"]}",',
        f'to_skip: {"true, // todo" if bonus["Name"] in bonuses_to_skip else "false,"}',
        f'expansion: ExpansionEnum.{bonus["Expansion"]},',
        f'automa: {json.dumps(bool(bonus["Automa"]))},',
        f'automa_only: {json.dumps(bonus["VP"] == "-")},',
        f'condition: "{bonus["Condition"]}",',
        f'extra: "{bonus["Explanatory text"]}",',
        f'vp_text: "{bonus["VP"]}",',
        f'vp_f: {vpTextToF(bonus["VP"], bonus)},',
        f'percent: {"null" if bonus["%"] == "-" else bonus["%"].replace("*", "")},',
    ]

def vpTextToF(vp_text, raw):
    parts = [i.strip() for i in vp_text.split(';')]
    if len(parts) == 2:
        f = {int(part[0]): int(part[-1]) for part in parts}
        return "{ " + ', '.join([f'{i}: {f[i]}' for i in f]) + " }"
    if vp_text == "-":
        return 'null'
    return "{ 0: " + vp_text[0] + " }"

def getText(name, src, objToLines):
    data = getCsv(src)
    texts = [objToText(i, objToLines) for i in data]
    texts.sort()
    objText = '\n'.join([''] + texts).replace('\n', '\n  ')
    return f'const {name} = [{objText}\n];'

def objToText(obj, objToLines):
    lines = "\n".join([''] + objToLines(obj)).replace('\n', '\n  ')
    return "{" + lines + "\n},"

def getBankText(cards_text, bonuses_text):
    import_text = 'import { BonusType, CardType, ColorEnum, ExpansionEnum, FoodEnum, HabitatEnum, NestEnum } from "./types";\nimport ActivationsBank from "./activations_bank";'
    module_text = "const bank = { cards, bonuses };\n\nexport default bank;"
    return f"{import_text}\n\n{cards_text}\n\n{bonuses_text}\n\n{module_text}\n"

def writeBankText(bank_text):
    with open(bank_dest, 'w') as fh:
        fh.write(bank_text)

if __name__ == "__main__":
    main()
