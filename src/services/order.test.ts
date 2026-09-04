import { describe, it, expect } from 'vitest';
import { orderService } from '@/services';

describe('orderService', () => {
  it('purchase returns success with tax calculation', async () => {
    const result = await orderService.purchase('p1', 'FileScope', 29);
    expect(result.success).toBe(true);
    expect(result.tax).toBe(2.9); // 10% of 29
    expect(result.total).toBe(31.9); // 29 + 2.9
    expect(result.id).toContain('ord-');
  });

  it('purchase calculates correct tax for $0 price', async () => {
    const result = await orderService.purchase('p1', 'Free Tool', 0);
    expect(result.success).toBe(true);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
  });

  it('purchase calculates correct tax for $99 price', async () => {
    const result = await orderService.purchase('p1', 'Expensive Tool', 99);
    expect(result.tax).toBe(9.9);
    expect(result.total).toBe(108.9);
  });

  it('purchase generates unique order IDs', async () => {
    const r1 = await orderService.purchase('p1', 'Tool 1', 10);
    const r2 = await orderService.purchase('p2', 'Tool 2', 20);
    expect(r1.id).not.toBe(r2.id);
  });
});
