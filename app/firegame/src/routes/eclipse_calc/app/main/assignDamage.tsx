import { ShipGroupsType } from "./Outcomes";

// basic algo
// one at a time, handle each die
// in order of (color, roll)
// dont plan ahead
// prefer not overkilling
// then killing
// then sooner turn
export function assignDamage(
  shooterFi: number,
  shipGroups: ShipGroupsType,
  rolls: { value: number; roll: number }[]
): ShipGroupsType {
  const targets = shipGroups
    .flatMap((sg) => sg || [])
    .filter((s) => s.fI !== shooterFi);
  rolls
    .sort((a, b) => b.roll - a.roll)
    .sort((a, b) => b.value - a.value)
    .map((r) => ({ r, t: targets.find((t) => t.ship) }));
  //   alert(JSON.stringify(targets));
  return shipGroups;
}
