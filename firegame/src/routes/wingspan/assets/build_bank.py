#!/usr/local/bin/python3

import csv
import json
import os

cards_src = 'wingspan-card-lists-20200529.xlsx - Master.csv'
bonus_src = 'wingspan-card-lists-20200529.xlsx - Bonus cards.csv'

bank_dest = os.path.join('../', 'app', 'utils', 'bank.tsx')

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
    print("\n".join(cols))
    print()
    return [{cols[i]:row[i].strip() for i in range(len(row))} for row in raw[1:] if ''.join(row[:1])]

def getCardsText():
    name = 'cards: CardType[]'
    return getText(name, cards_src, getCardLines)

def getBonusesText():
    name = 'bonuses: BonusType[]'
    return getText(name, bonus_src, getBonusLines)

def getCardLines(card):
    return [
        f'name: "{card["Common name"]}",',
    ]

def getBonusLines(bonus):
    return [
        f'name: "{bonus["Name"]}",',
        f'expansion: types.expansions.{bonus["Expansion"]},',
        f'automa: {"true" if bonus["Automa"] else "false"},',
        f'automa_only: {"true" if bonus["VP"] == "-" else "false"},',
        f'condition: "{bonus["Condition"]}",',
        f'extra: "{bonus["Explanatory text"]}",',
        f'vp_text: "{bonus["VP"]}",',
        f'vp_f: {vpTextToF(bonus["VP"], bonus)},',
        f'percent: "{bonus["%"]}",',
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
    objText = '\n'.join([''] + [objToText(i, objToLines) for i in data]).replace('\n', '\n  ')
    return f'const {name} = [{objText}\n];'

def objToText(obj, objToLines):
    lines = "\n".join([''] + objToLines(obj)).replace('\n', '\n  ')
    return "{" + lines + "\n},"

def getBankText(cards_text, bonuses_text):
    import_text = 'import types, { BonusType, CardType } from "./types";'
    module_text = "const bank = { cards, bonuses };\n\nexport default bank;"
    return f"{import_text}\n\n{cards_text}\n\n{bonuses_text}\n\n{module_text}\n"

def writeBankText(bank_text):
    with open(bank_dest, 'w') as fh:
        fh.write(bank_text)

if __name__ == "__main__":
    main()
