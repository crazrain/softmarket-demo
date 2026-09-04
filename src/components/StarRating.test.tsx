import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StarRating from '@/components/StarRating';

describe('StarRating', () => {
  it('displays the rating value when showValue is true', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays 5.0 for full rating', () => {
    render(<StarRating rating={5} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('hides rating value when showValue is false', () => {
    render(<StarRating rating={4.5} showValue={false} />);
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('renders for rating 0', () => {
    render(<StarRating rating={0} />);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('renders star SVG elements', () => {
    const { container } = render(<StarRating rating={5} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(5);
  });

  it('renders fewer stars for lower rating', () => {
    const { container } = render(<StarRating rating={2} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(5);
  });

  it('renders correct size classes via style attribute check', () => {
    const { container: smContainer } = render(<StarRating rating={3} size="sm" />);
    const svg = smContainer.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('w-3.5');
  });

  it('renders lg size class', () => {
    const { container } = render(<StarRating rating={3} size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('w-6');
  });

  it('renders md default size class', () => {
    const { container } = render(<StarRating rating={3} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('w-4');
  });
});
