import { ShipGroupsType } from "./Outcomes";

// basic algo
// one at a time, handle each die
// in order of (color, roll)
// dont plan ahead
// prefer...
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
    .map((r) =>
      ((t) => t && (t.damage += r.value))(
        targets
          .filter((t) => r.roll - t.ship.values.shield >= 6)
          // prefer order
          .map((t) => [
            // not overkilling
            t.damage + r.value <= t.ship.values.hull + 1 ? 0 : 1,
            // killing
            t.damage + r.value >= t.ship.values.hull + 1 ? 0 : 1,
            // shield
            -t.ship.values.shield,
            t,
          ])
          .sort()
          .map((o) => o.reverse()[0])[0] as { damage: number } | null
      )
    );
  return shipGroups;
}
