import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishlistProvider, useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/mockData';

function TestChild() {
  const { wishlist, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const productId = products[0].id;

  return (
    <div>
      <span data-testid="count">{wishlist.length}</span>
      <span data-testid="in-wishlist">{isInWishlist(productId) ? 'yes' : 'no'}</span>
      <button onClick={() => addToWishlist(productId)} data-testid="add-btn">Add</button>
      <button onClick={() => removeFromWishlist(productId)} data-testid="remove-btn">Remove</button>
    </div>
  );
}

describe('WishlistContext', () => {
  it('starts with empty wishlist', () => {
    render(<TestChild />, { wrapper: WishlistProvider });
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('in-wishlist')).toHaveTextContent('no');
  });

  it('adds product to wishlist', () => {
    render(<TestChild />, { wrapper: WishlistProvider });
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('in-wishlist')).toHaveTextContent('yes');
  });

  it('removes product from wishlist', () => {
    render(<TestChild />, { wrapper: WishlistProvider });
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('remove-btn'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('useWishlist throws outside provider', () => {
    expect(() => render(<TestChild />)).toThrow('useWishlist must be used within WishlistProvider');
  });
});
