import { ShipGroupsType } from "./Outcomes";

export function assignDamage(
  shooterFi: number,
  shipGroups: ShipGroupsType,
  rolls: { value: number; roll: number }[]
): ShipGroupsType {
  return shipGroups;
}
