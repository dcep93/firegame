import { useGameState } from '../../hooks/useGameState';
import { TechSupplyBoard } from '../tech/TechSupplyBoard';
import type { ResearchFlowResult } from '../../hooks/useResearchFlow';

interface ResearchPanelProps {
  queue: ResearchFlowResult['queue'];
  maxActivations: number;
  scienceAvailable: number;
  availableTechs: ResearchFlowResult['availableTechs'];
  onSelectTech: (techId: string) => void;
  onRemoveFromQueue: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  pendingRareTech: ResearchFlowResult['pendingRareTech'];
  selectTrackForRare: ResearchFlowResult['selectTrackForRare'];
  cancelRarePicker: ResearchFlowResult['cancelRarePicker'];
  rareTrackOptions: ResearchFlowResult['rareTrackOptions'];
}

export function ResearchPanel({
  queue,
  maxActivations,
  scienceAvailable,
  availableTechs,
  onSelectTech,
  onRemoveFromQueue,
  onConfirm,
  onCancel,
  pendingRareTech,
  selectTrackForRare,
  cancelRarePicker,
  rareTrackOptions,
}: ResearchPanelProps) {
  const { filteredState } = useGameState();
  const queueFull = queue.length >= maxActivations;

  if (!filteredState) return null;

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      background: 'var(--bg-secondary)',
      height: '100%',
      borderLeft: '1px solid var(--border-color)',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      textAlign: 'center',
      gap: 'var(--spacing-sm)',
    }}>
      <span style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'var(--resource-science)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Research
      </span>
      <span style={{ fontSize: '11px' }}>
        Pick from the board overlay
      </span>

      {/* Full supply board overlay with research mode */}
      <TechSupplyBoard
        techTray={filteredState.techTray}
        onClose={onCancel}
        researchMode={{
          availableTechs,
          scienceAvailable,
          queueFull,
          queue,
          maxActivations,
          onSelectTech,
          onRemoveFromQueue,
          onConfirm,
          onCancel,
          pendingRareTech,
          selectTrackForRare,
          cancelRarePicker,
          rareTrackOptions,
        }}
      />
    </div>
  );
}
