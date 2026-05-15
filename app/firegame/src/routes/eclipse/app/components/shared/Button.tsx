import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'background: var(--accent-blue); color: #fff; border: none;',
  secondary: 'background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color);',
  danger: 'background: var(--accent-red); color: #fff; border: none;',
  ghost: 'background: transparent; color: var(--text-secondary); border: 1px solid transparent;',
};

const sizeStyles: Record<string, string> = {
  sm: 'padding: 4px 10px; font-size: 12px;',
  md: 'padding: 8px 16px; font-size: 14px;',
  lg: 'padding: 12px 24px; font-size: 16px;',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const baseStyle = `
    border-radius: var(--border-radius);
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    opacity: ${disabled ? '0.5' : '1'};
    font-family: var(--font-body);
    transition: filter var(--transition-fast);
    ${variantStyles[variant] ?? ''}
    ${sizeStyles[size] ?? ''}
  `;

  return (
    <button
      style={{ ...parseInlineStyle(baseStyle), ...style }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

function parseInlineStyle(css: string): Record<string, string> {
  const style: Record<string, string> = {};
  for (const rule of css.split(';')) {
    const [prop, val] = rule.split(':').map(s => s.trim());
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      style[camelProp] = val;
    }
  }
  return style;
}
