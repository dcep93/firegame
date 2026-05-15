import { type ReactNode, useState } from 'react';
import { TopBar } from './TopBar';
import '../../styles/responsive.css';

interface GameLayoutProps {
  board: ReactNode;
  sidebar?: ReactNode;
  bottom?: ReactNode;
}

export function GameLayout({ board, sidebar, bottom }: GameLayoutProps) {
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const layoutClasses = [
    'game-layout',
    bottomCollapsed ? 'game-layout--bottom-collapsed' : '',
    sidebarCollapsed ? 'game-layout--sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <TopBar />
      <div className="game-board">
        {board}
      </div>
      {sidebar && (
        <div className={`game-sidebar ${sidebarCollapsed ? 'game-sidebar--collapsed' : ''}`}>
          <button
            className="collapse-toggle collapse-toggle--sidebar"
            onClick={() => setSidebarCollapsed(c => !c)}
            title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          >
            {sidebarCollapsed ? '\u25C0' : '\u25B6'}
          </button>
          <div className="game-sidebar__content">
            {sidebar}
          </div>
        </div>
      )}
      {bottom && (
        <div className={`game-bottom ${bottomCollapsed ? 'game-bottom--collapsed' : ''}`}>
          <button
            className="collapse-toggle collapse-toggle--bottom"
            onClick={() => setBottomCollapsed(c => !c)}
            title={bottomCollapsed ? 'Show player board' : 'Hide player board'}
          >
            {bottomCollapsed ? '\u25B2' : '\u25BC'}
          </button>
          <div className="game-bottom__content">
            {bottom}
          </div>
        </div>
      )}
    </div>
  );
}
