import { ShipGroupsType } from "./Outcomes";

export function assignDamage(
  shooterFi: number,
  shipGroups: ShipGroupsType,
  rolls: { value: number; roll: number }[]
): ShipGroupsType {
  const targets = shipGroups.filter((sg) => sg[0].fI !== shooterFi);
  return shipGroups;
}
