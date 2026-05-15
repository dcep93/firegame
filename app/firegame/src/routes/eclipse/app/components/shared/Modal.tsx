import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
          padding: 'var(--spacing-lg)',
          minWidth: '320px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        className="fade-in"
      >
        {title && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}>
            <h2 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
