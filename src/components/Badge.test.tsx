import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/Badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('bg-surface-100');
  });

  it('renders with success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const el = screen.getByText('Success');
    expect(el.className).toContain('bg-green-100');
  });

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const el = screen.getByText('Warning');
    expect(el.className).toContain('bg-yellow-100');
  });

  it('renders with error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    const el = screen.getByText('Error');
    expect(el.className).toContain('bg-red-100');
  });

  it('renders with info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    const el = screen.getByText('Info');
    expect(el.className).toContain('bg-blue-100');
  });
});
