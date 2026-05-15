import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { FilteredPlacedSector } from '@eclipse/shared';
import { useGameState } from '../hooks/useGameState';
import { useActionFlow } from '../hooks/useActionFlow';
import { useExploreFlow } from '../hooks/useExploreFlow';
import { useResearchFlow } from '../hooks/useResearchFlow';
import { useUpgradeFlow } from '../hooks/useUpgradeFlow';
import { useBuildFlow } from '../hooks/useBuildFlow';
import { useMoveFlow } from '../hooks/useMoveFlow';
import { useInfluenceFlow } from '../hooks/useInfluenceFlow';
import { useColonyShipFlow } from '../hooks/useColonyShipFlow';
import { useInfluenceSectorChoiceFlow } from '../hooks/useInfluenceSectorChoiceFlow';
import { useBombardmentChoiceFlow } from '../hooks/useBombardmentChoiceFlow';
import { useWarpPortalChoiceFlow } from '../hooks/useWarpPortalChoiceFlow';
import { useArtifactResourceChoiceFlow } from '../hooks/useArtifactResourceChoiceFlow';
import { useExploreTileChoiceFlow } from '../hooks/useExploreTileChoiceFlow';
import { useBankruptcyFlow } from '../hooks/useBankruptcyFlow';
import { useRetreatDecisionFlow } from '../hooks/useRetreatDecisionFlow';
import { useDamageAssignmentFlow } from '../hooks/useDamageAssignmentFlow';
import { usePopulationGraveyardChoiceFlow } from '../hooks/usePopulationGraveyardChoiceFlow';
import { useReputationSelectionFlow } from '../hooks/useReputationSelectionFlow';
import { useTradeFlow } from '../hooks/useTradeFlow';
import { useCombatReplay } from '../hooks/useCombatReplay';
import { useCombatFlow } from '../hooks/useCombatFlow';
import { useBattlefield } from '../hooks/useBattlefield';
import { useGame } from '../context/GameContext';
import { GameLayout } from '../components/layout/GameLayout';
import { HexBoard } from '../components/board/HexBoard';
import { PlayerBoard } from '../components/player-board/PlayerBoard';
import { ActionBar } from '../components/actions/ActionBar';
import { ExplorePanel } from '../components/actions/ExplorePanel';
import { ResearchPanel } from '../components/actions/ResearchPanel';
import { UpgradePanel } from '../components/actions/UpgradePanel';
import { BuildPanel } from '../components/actions/BuildPanel';
import { MovePanel } from '../components/actions/MovePanel';
import { InfluencePanel } from '../components/actions/InfluencePanel';
import { ColonyShipPanel } from '../components/actions/ColonyShipPanel';
import { TradePanel } from '../components/actions/TradePanel';
import { Sidebar } from '../components/layout/Sidebar';
import { BattlePanel } from '../components/combat/BattlePanel';
import { ClaimSectorsPanel } from '../components/actions/ClaimSectorsPanel';
import { BombardmentChoicePanel } from '../components/actions/BombardmentChoicePanel';
import { BankruptcyPanel } from '../components/actions/BankruptcyPanel';
import { WarpPortalChoicePanel } from '../components/actions/WarpPortalChoicePanel';
import { ArtifactResourceChoicePanel } from '../components/actions/ArtifactResourceChoicePanel';
import { ExploreTileChoicePanel } from '../components/actions/ExploreTileChoicePanel';
import { PopulationGraveyardChoicePanel } from '../components/actions/PopulationGraveyardChoicePanel';
import { ReputationSelectionPanel } from '../components/actions/ReputationSelectionPanel';
import { DiscoveryDecision } from '../components/overlays/DiscoveryDecision';
import { ScoringOverlay } from '../components/overlays/ScoringOverlay';
import { DebugOverlay } from '../components/overlays/DebugOverlay';
import { SectorInspectModal } from '../components/board/SectorInspectModal';
import { ShipInspectModal, getNpcVariant } from '../components/board/ShipInspectModal';

export function GamePage() {
  const { filteredState, error, players, scores, winner, roomStatus } = useGameState();
  const { sendAction } = useGame();
  const { step, startAction, advanceStep, submitAction, cancelAction, reactionMode } = useActionFlow();
  const combat = useCombatReplay();
  const combatFlow = useCombatFlow();
  const explore = useExploreFlow(step, advanceStep, submitAction, cancelAction);
  const research = useResearchFlow(step, submitAction, cancelAction);
  const upgrade = useUpgradeFlow(step, submitAction, cancelAction, reactionMode);
  const build = useBuildFlow(step, advanceStep, submitAction, cancelAction, reactionMode);
  const move = useMoveFlow(step, advanceStep, submitAction, cancelAction, reactionMode);
  const influence = useInfluenceFlow(step, advanceStep, submitAction, cancelAction);
  const colonyShip = useColonyShipFlow(sendAction);
  const claimSectors = useInfluenceSectorChoiceFlow(sendAction);
  const bombardment = useBombardmentChoiceFlow(sendAction);
  const warpPortalChoice = useWarpPortalChoiceFlow(sendAction);
  const artifactResourceChoice = useArtifactResourceChoiceFlow(sendAction);
  const exploreTileChoice = useExploreTileChoiceFlow(sendAction);
  const bankruptcy = useBankruptcyFlow(sendAction);
  const retreatDecision = useRetreatDecisionFlow(sendAction);
  const damageAssignment = useDamageAssignmentFlow(sendAction);
  const populationGraveyardChoice = usePopulationGraveyardChoiceFlow(sendAction);
  const reputationSelection = useReputationSelectionFlow(sendAction);
  const trade = useTradeFlow(sendAction);
  const [inspectedSector, setInspectedSector] = useState<FilteredPlacedSector | null>(null);
  const [inspectedShip, setInspectedShip] = useState<{ ship: import('@eclipse/shared').ShipOnBoard; count: number } | null>(null);

  const isExploring = step.type === 'EXPLORE_PICK_HEX' || step.type === 'EXPLORE_REVIEW_TILE' || step.type === 'EXPLORE_PICK_ROTATION';
  const isResearching = step.type === 'RESEARCH_PICK_TECH';
  const isUpgrading = step.type === 'UPGRADE_PICK_SHIP' || step.type === 'UPGRADE_PICK_PART';
  const isBuilding = step.type === 'BUILD_PICK_TYPE' || step.type === 'BUILD_PICK_SECTOR';
  const isMoving = step.type === 'MOVE_PICK_SHIP' || step.type === 'MOVE_PICK_PATH' || move.canFinishMove;
  const isInfluencing = step.type === 'INFLUENCE_PICK_SOURCE' || step.type === 'INFLUENCE_PICK_DESTINATION';
  const isTrading = trade.active;
  const isColonyShipping = colonyShip.active;
  const isClaimingSectors = claimSectors.active;
  const isBombarding = bombardment.active;
  const isPlacingWarpPortal = warpPortalChoice.active;
  const isChoosingArtifactResources = artifactResourceChoice.active;
  const isChoosingExploreTile = exploreTileChoice.active;

  // Build player color/name maps for combat overlay
  const playerColors = useMemo(() => {
    if (!filteredState) return {};
    const map: Record<string, string> = {};
    map[filteredState.you.id] = `var(--player-${filteredState.you.color})`;
    for (const [id, opp] of Object.entries(filteredState.opponents)) {
      map[id] = `var(--player-${opp.color})`;
    }
    // NPC colors — muted purple, distinct from all 6 player colors
    map['ancient'] = '#9b7db8';
    map['guardian'] = '#8b6daa';
    map['gcds'] = '#7a5d9e';
    return map;
  }, [filteredState]);

  const playerNames = useMemo(() => {
    if (!filteredState) return {};
    const map: Record<string, string> = {};
    // Use nickname from room players list
    for (const p of players) {
      map[p.playerId] = p.nickname;
    }
    // NPC names
    map['ancient'] = 'Ancient';
    map['guardian'] = 'Guardian';
    map['gcds'] = 'GCDS';
    return map;
  }, [filteredState, players]);

  const battlefield = useBattlefield(filteredState ?? null, playerColors, playerNames);

  // ── Victory hold: keep BattlePanel visible after killing blow before reputation selection ──
  // When a killing blow triggers REPUTATION_SELECTION in the same action, the BattlePanel
  // would be immediately hidden. Instead, hold it visible so the user sees dice + victory.
  const [victoryHold, setVictoryHold] = useState(false);
  const victoryShownRef = useRef(false);
  const isRepSelection = filteredState?.subPhase?.type === 'REPUTATION_SELECTION';

  useEffect(() => {
    if (combatFlow.active && isRepSelection && !victoryShownRef.current) {
      setVictoryHold(true);
      victoryShownRef.current = true;
    }
    if (!isRepSelection) {
      victoryShownRef.current = false;
    }
  }, [combatFlow.active, isRepSelection]);

  const dismissVictory = useCallback(() => {
    setVictoryHold(false);
  }, []);

  if (!filteredState) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--text-muted)',
      }}>
        Loading game state...
      </div>
    );
  }

  const sidebar = isChoosingExploreTile ? (
    <ExploreTileChoicePanel
      tiles={exploreTileChoice.tiles}
      selectedTileIndex={exploreTileChoice.selectedTileIndex}
      selectedDef={exploreTileChoice.selectedDef}
      rotation={exploreTileChoice.rotation}
      takeInfluence={exploreTileChoice.takeInfluence}
      validRotations={exploreTileChoice.validRotations}
      isDraco={filteredState?.you.speciesId === 'descendants_of_draco'}
      onSelectTile={exploreTileChoice.setSelectedTileIndex}
      onSetRotation={exploreTileChoice.setRotation}
      onSetTakeInfluence={exploreTileChoice.setTakeInfluence}
      onConfirmPlace={exploreTileChoice.confirmPlace}
      onConfirmDiscard={exploreTileChoice.confirmDiscard}
      onTileInspect={setInspectedSector}
    />
  ) : isExploring ? (
    <ExplorePanel
      step={step.type === 'EXPLORE_REVIEW_TILE' || step.type === 'EXPLORE_PICK_ROTATION' ? 'review_tile' : 'pick_hex'}
      sectorDef={explore.sectorDef}
      rotation={explore.rotation}
      takeInfluence={explore.takeInfluence}
      validRotations={explore.validRotations}
      currentActivation={explore.currentActivation}
      maxActivations={explore.maxActivations}
      isPeeking={explore.isPeeking}
      isDraco={filteredState?.you.speciesId === 'descendants_of_draco'}
      onSetRotation={explore.setRotation}
      onSetTakeInfluence={explore.setTakeInfluence}
      onConfirmPlace={explore.confirmPlace}
      onConfirmDiscard={explore.confirmDiscard}
      onCancel={explore.cancel}
      onTileInspect={setInspectedSector}
    />
  ) : isResearching ? (
    <ResearchPanel
      queue={research.queue}
      maxActivations={research.maxActivations}
      scienceAvailable={research.scienceAvailable}
      availableTechs={research.availableTechs}
      onSelectTech={research.selectTech}
      onRemoveFromQueue={research.removeFromQueue}
      onConfirm={research.confirm}
      onCancel={research.cancel}
      pendingRareTech={research.pendingRareTech}
      selectTrackForRare={research.selectTrackForRare}
      cancelRarePicker={research.cancelRarePicker}
      rareTrackOptions={research.rareTrackOptions}
    />
  ) : isUpgrading ? (
    <UpgradePanel
      queue={upgrade.queue}
      maxActivations={upgrade.maxActivations}
      placementCount={upgrade.placementCount}
      selectedShip={upgrade.selectedShip}
      selectedSlot={upgrade.selectedSlot}
      previewBlueprints={upgrade.previewBlueprints}
      availableShipTypes={upgrade.availableShipTypes}
      availableSlots={upgrade.availableSlots}
      availableParts={upgrade.availableParts}
      previewStats={upgrade.previewStats}
      canConfirm={upgrade.canConfirm}
      onSelectShip={upgrade.selectShip}
      onSelectSlot={upgrade.selectSlot}
      onSelectPart={upgrade.selectPart}
      onRemoveFromQueue={upgrade.removeFromQueue}
      onConfirm={upgrade.confirm}
      onCancel={upgrade.cancel}
    />
  ) : isBuilding ? (
    <BuildPanel
      step={step.type === 'BUILD_PICK_SECTOR' ? 'pick_sector' : 'pick_type'}
      queue={build.queue}
      maxActivations={build.maxActivations}
      materialsAvailable={build.materialsAvailable}
      selectedBuildType={build.selectedBuildType}
      availableBuildTypes={build.availableBuildTypes}
      onSelectBuildType={build.selectBuildType}
      onRemoveFromQueue={build.removeFromQueue}
      onConfirm={build.confirm}
      onCancel={build.cancel}
    />
  ) : isMoving ? (
    <MovePanel
      step={step.type === 'MOVE_PICK_PATH' ? 'pick_destination' : 'pick_ship'}
      maxActivations={move.maxActivations}
      activationsUsed={move.activationsUsed}
      isContinuation={move.isContinuation}
      selectedShipId={move.selectedShipId}
      movableShips={move.movableShips}
      pendingAggressionMove={move.pendingAggressionMove}
      onSelectShip={move.selectShip}
      onFinishMove={move.finishMove}
      onCancel={move.cancel}
      onConfirmAggression={move.confirmAggression}
      onCancelAggression={move.cancelAggression}
    />
  ) : isInfluencing ? (
    <InfluencePanel
      step={step.type === 'INFLUENCE_PICK_DESTINATION' ? 'pick_destination' : 'pick_source'}
      queue={influence.queue}
      maxActivations={influence.maxActivations}
      discsOnTrack={influence.discsOnTrack}
      colonyShipFlips={influence.colonyShipFlips}
      facedownColonyShips={influence.facedownColonyShips}
      placeableSectors={influence.placeableSectors}
      removableSectors={influence.removableSectors}
      pendingTrackChoice={influence.pendingTrackChoice}
      onSelectPlace={influence.selectPlace}
      onSelectRemove={influence.selectRemove}
      onSetColonyShipFlips={influence.setColonyShipFlips}
      onRemoveFromQueue={influence.removeFromQueue}
      onUpdateTrackChoice={influence.updateTrackChoice}
      onConfirmTrackChoice={influence.confirmTrackChoice}
      onCancelTrackChoice={influence.cancelTrackChoice}
      onConfirm={influence.confirm}
      onCancel={influence.cancel}
    />
  ) : isTrading ? (
    <TradePanel
      selectedFromResource={trade.selectedFromResource}
      selectedToResource={trade.selectedToResource}
      amount={trade.amount}
      maxAmount={trade.maxAmount}
      tradeRate={trade.tradeRate}
      gained={trade.gained}
      availableFromResources={trade.availableFromResources}
      availableToResources={trade.availableToResources}
      onSelectFromResource={trade.selectFromResource}
      onSelectToResource={trade.selectToResource}
      onSetAmount={trade.setAmount}
      onConfirm={trade.confirm}
      onCancel={trade.cancelFlow}
    />
  ) : isColonyShipping ? (
    <ColonyShipPanel
      queue={colonyShip.queue}
      wildSlotPending={colonyShip.wildSlotPending}
      remainingShips={colonyShip.remainingShips}
      availableCubes={colonyShip.availableCubes}
      sectorGroups={colonyShip.sectorGroups}
      onSelectSlot={colonyShip.selectSlot}
      onConfirmWildTrack={colonyShip.confirmWildTrack}
      onCancelWildPick={colonyShip.cancelWildPick}
      onRemoveFromQueue={colonyShip.removeFromQueue}
      onConfirm={colonyShip.confirm}
      onCancel={colonyShip.cancelFlow}
    />
  ) : isBombarding ? (
    <BombardmentChoicePanel
      totalDamage={bombardment.totalDamage}
      populations={bombardment.populations}
      rolls={bombardment.rolls}
      selectedIndices={bombardment.selectedIndices}
      requiredCount={bombardment.requiredCount}
      canConfirm={bombardment.canConfirm}
      onToggleCube={bombardment.toggleCube}
      onConfirm={bombardment.confirm}
      hasOrbitalPop={bombardment.hasOrbitalPop}
      orbitalTrack={bombardment.orbitalTrack}
      destroyOrbital={bombardment.destroyOrbital}
      onToggleOrbital={bombardment.toggleOrbital}
    />
  ) : (reputationSelection.active && !victoryHold) ? (
    <ReputationSelectionPanel
      drawn={reputationSelection.drawn}
      currentTrack={reputationSelection.currentTrack}
      eligibleSlotIndices={reputationSelection.eligibleSlotIndices}
      selectedDrawnIndex={reputationSelection.selectedDrawnIndex}
      selectedSlotIndex={reputationSelection.selectedSlotIndex}
      bestDrawnIndex={reputationSelection.bestDrawnIndex}
      onSelectDrawn={reputationSelection.selectDrawn}
      onSelectSlot={reputationSelection.selectSlot}
      onConfirm={reputationSelection.confirm}
      onDecline={reputationSelection.decline}
      canConfirm={reputationSelection.canConfirm}
    />
  ) : populationGraveyardChoice.active ? (
    <PopulationGraveyardChoicePanel
      choices={populationGraveyardChoice.choices}
      assignments={populationGraveyardChoice.assignments}
      onSetAssignment={populationGraveyardChoice.setAssignment}
      canConfirm={populationGraveyardChoice.canConfirm}
      onConfirm={populationGraveyardChoice.confirm}
    />
  ) : isChoosingArtifactResources ? (
    <ArtifactResourceChoicePanel
      totalResources={artifactResourceChoice.totalResources}
      increment={artifactResourceChoice.increment}
      money={artifactResourceChoice.money}
      materials={artifactResourceChoice.materials}
      science={artifactResourceChoice.science}
      remaining={artifactResourceChoice.remaining}
      canConfirm={artifactResourceChoice.canConfirm}
      onSetResource={artifactResourceChoice.setResource}
      onConfirm={artifactResourceChoice.confirm}
    />
  ) : isPlacingWarpPortal ? (
    <WarpPortalChoicePanel
      eligibleSectors={warpPortalChoice.eligibleSectors}
      selectedKey={warpPortalChoice.selectedKey}
      onSelectSector={warpPortalChoice.selectSector}
      onConfirm={warpPortalChoice.confirm}
    />
  ) : isClaimingSectors ? (
    <ClaimSectorsPanel
      eligibleSectors={claimSectors.eligibleSectors}
      selectedKeys={claimSectors.selectedKeys}
      onToggleSector={claimSectors.toggleSector}
      onSelectAll={claimSectors.selectAll}
      onDeselectAll={claimSectors.deselectAll}
      onConfirm={claimSectors.confirm}
      onDecline={claimSectors.decline}
    />
  ) : bankruptcy.active ? (
    <BankruptcyPanel
      deficit={bankruptcy.deficit}
      controlledSectors={bankruptcy.controlledSectors}
      selectedKeys={bankruptcy.selectedKeys}
      sectorTrackChoices={bankruptcy.sectorTrackChoices}
      onToggleSector={bankruptcy.toggleSector}
      onUpdateTrackChoice={bankruptcy.updateTrackChoice}
      onConfirm={bankruptcy.confirm}
      trades={bankruptcy.trades}
      onSetTrade={bankruptcy.setTrade}
      tradeRate={bankruptcy.tradeRate}
      moneyFromTrades={bankruptcy.moneyFromTrades}
      availableResources={bankruptcy.availableResources}
      upkeepSavings={bankruptcy.upkeepSavings}
      productionLoss={bankruptcy.productionLoss}
      trackCapacity={bankruptcy.trackCapacity}
      disabledSectorKeys={bankruptcy.disabledSectorKeys}
      projectedBalance={bankruptcy.projectedBalance}
      isResolutionValid={bankruptcy.isResolutionValid}
    />
  ) : (
    <Sidebar />
  );

  return (
    <>
      <GameLayout
        board={
          <HexBoard
            exploreHighlights={isExploring && step.type === 'EXPLORE_PICK_HEX' ? explore.explorePositions : undefined}
            exploreGhost={isChoosingExploreTile ? exploreTileChoice.ghostTile : explore.ghostTile}
            completedGhostTiles={explore.completedGhostTiles}
            colonyShipHighlights={isColonyShipping ? colonyShip.highlightedSectors : undefined}
            buildHighlights={isBuilding && step.type === 'BUILD_PICK_SECTOR' ? build.validSectorPositions : undefined}
            moveHighlights={isMoving && step.type === 'MOVE_PICK_PATH' ? move.validDestinations : undefined}
            influenceHighlights={isInfluencing && step.type === 'INFLUENCE_PICK_DESTINATION' ? influence.validDestinations : undefined}
            claimHighlights={isClaimingSectors ? claimSectors.highlightedSectors : isPlacingWarpPortal ? warpPortalChoice.highlightedSectors : undefined}
            claimSelectedKeys={isClaimingSectors ? claimSectors.selectedKeys : isPlacingWarpPortal && warpPortalChoice.selectedKey ? new Set([warpPortalChoice.selectedKey]) : undefined}
            onHexClick={
              isPlacingWarpPortal
                ? (pos) => warpPortalChoice.selectSector(`${pos.q},${pos.r}`)
                : isClaimingSectors
                ? (pos) => claimSectors.toggleSector(`${pos.q},${pos.r}`)
                : isMoving && step.type === 'MOVE_PICK_PATH'
                  ? move.selectDestination
                  : isBuilding && step.type === 'BUILD_PICK_SECTOR'
                    ? build.selectSector
                    : isInfluencing && step.type === 'INFLUENCE_PICK_DESTINATION'
                      ? influence.selectDestination
                      : isExploring && step.type === 'EXPLORE_PICK_HEX'
                        ? explore.selectHex
                        : undefined
            }
            onSectorInspect={setInspectedSector}
            onShipInspect={(ship, count) => setInspectedShip({ ship, count })}
          />
        }
        sidebar={sidebar}
        bottom={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ActionBar
              isExploring={isExploring}
              isResearching={isResearching}
              isUpgrading={isUpgrading}
              isBuilding={isBuilding}
              isMoving={isMoving}
              isInfluencing={isInfluencing}
              isTrading={isTrading}
              isColonyShipping={isColonyShipping}
              onStartAction={startAction}
              onCancelAction={isMoving ? move.cancel : isBuilding ? build.cancel : isInfluencing ? influence.cancel : isUpgrading ? upgrade.cancel : isResearching ? research.cancel : explore.cancel}
              onStartTrade={trade.startFlow}
              onCancelTrade={trade.cancelFlow}
              onStartColonyShip={colonyShip.startFlow}
              onCancelColonyShip={colonyShip.cancelFlow}
            />
            <PlayerBoard />
            {error && (
              <div style={{
                padding: 'var(--spacing-xs) var(--spacing-md)',
                color: 'var(--accent-red)',
                fontSize: '12px',
                background: 'rgba(255, 74, 106, 0.1)',
              }}>
                {error}
              </div>
            )}
          </div>
        }
      />
      {combatFlow.active && filteredState?.subPhase?.type !== 'DISCOVERY_DECISION' && filteredState?.subPhase?.type !== 'INFLUENCE_SECTOR_CHOICE' && filteredState?.subPhase?.type !== 'BOMBARDMENT_CHOICE' && filteredState?.subPhase?.type !== 'POPULATION_GRAVEYARD_CHOICE' && (filteredState?.subPhase?.type !== 'REPUTATION_SELECTION' || victoryHold) && (
        <BattlePanel
          mode="interactive"
          combatFlow={combatFlow}
          battlefield={battlefield}
          playerColors={playerColors}
          playerNames={playerNames}
          retreatDecision={retreatDecision}
          damageAssignment={damageAssignment}
          onVictoryDismiss={victoryHold ? dismissVictory : undefined}
        />
      )}
      <DiscoveryDecision />
      {!combatFlow.active && combat.active && (
        <BattlePanel
          mode="replay"
          battles={combat.battles}
          battleIndex={combat.battleIndex}
          stepIndex={combat.stepIndex}
          currentStep={combat.currentStep}
          phaseLabel={combat.currentPhaseLabel}
          autoAdvance={combat.autoAdvance}
          isComplete={combat.isComplete}
          totalSteps={combat.totalSteps}
          onNext={combat.nextStep}
          onPrev={combat.prevStep}
          onSkipBattle={combat.skipBattle}
          onSkipAll={combat.skipAll}
          onToggleAuto={combat.toggleAutoAdvance}
          onDismiss={combat.dismiss}
          playerColors={playerColors}
          playerNames={playerNames}
        />
      )}
      {roomStatus === 'FINISHED' && scores && winner && (
        <ScoringOverlay
          isOpen
          onClose={() => {}}
          scores={scores}
          winner={winner}
        />
      )}
      <SectorInspectModal
        sector={inspectedSector}
        onClose={() => setInspectedSector(null)}
        playerColors={playerColors}
        playerNames={playerNames}
      />
      {(() => {
        if (!inspectedShip || !filteredState) return null;
        const { ship: iShip, count: iCount } = inspectedShip;
        const isNpc = ['ancient', 'guardian', 'gcds'].includes(iShip.owner as string);
        if (isNpc) {
          const npcVariant = getNpcVariant(iShip.owner as string, filteredState.config);
          return (
            <ShipInspectModal
              ship={iShip}
              blueprint={null}
              npcVariant={npcVariant}
              ownerName={playerNames[iShip.owner as string] ?? iShip.owner as string}
              ownerColor={playerColors[iShip.owner as string] ?? 'var(--text-muted)'}
              onClose={() => setInspectedShip(null)}
              count={iCount}
            />
          );
        }
        const playerId = iShip.owner as string;
        const player = playerId === filteredState.you.id
          ? filteredState.you
          : filteredState.opponents[playerId];
        const blueprint = player?.blueprints[iShip.type as keyof typeof player.blueprints] ?? null;
        return (
          <ShipInspectModal
            ship={iShip}
            blueprint={blueprint}
            npcVariant={null}
            ownerName={playerNames[playerId] ?? playerId}
            ownerColor={playerColors[playerId] ?? 'var(--text-muted)'}
            onClose={() => setInspectedShip(null)}
            count={iCount}
          />
        );
      })()}
      <DebugOverlay />
    </>
  );
}
