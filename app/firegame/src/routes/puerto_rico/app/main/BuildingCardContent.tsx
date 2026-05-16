import React from "react";
import css from "../index.module.css";
import { theme } from "../theme/base";
import { BuildingId } from "../utils/rules";
import utils from "../utils/utils";

function BuildingCardContent(props: { buildingId: BuildingId; footer: React.ReactNode }) {
  const rule = utils.building(props.buildingId);
  return (
    <>
      <div className={css.buildingHeader}>
        <div className={`${css.tileTitle} ${css.buildingNameBubble}`}>
          {theme.buildings[props.buildingId]}
        </div>
        <span className={css.vpBadge}>{rule.victoryPoints} VP</span>
      </div>
      <div className={css.buildingFooter}>{props.footer}</div>
      <div className={css.buildingTextBubble}>
        <div>{theme.buildingDescriptions[props.buildingId]}</div>
        {rule.kind !== "production" && !utils.hasImplementedPower(props.buildingId) && (
          <div>{theme.disabledPower}</div>
        )}
      </div>
    </>
  );
}

export default BuildingCardContent;
