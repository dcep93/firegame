import { ShipGroupsType } from "./Outcomes";

export function assignDamage(
  shooterFi: number,
  shipGroups: ShipGroupsType,
  rolls: { value: number; roll: number }[]
): ShipGroupsType {
  const targets = shipGroups
    .flatMap((sg) => sg || [])
    .filter((s) => s.fI !== shooterFi);
  return shipGroups;
}
