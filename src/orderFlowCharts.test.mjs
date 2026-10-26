import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRangeBars, layoutRenkoBricks } from './orderFlowCharts.ts';

test('range bars complete only when their full high-low range is reached', () => {
  const bars = buildRangeBars([
    { time: 1, open: 100, high: 100, low: 100, close: 100 },
    { time: 2, open: 100, high: 101, low: 99, close: 100 },
  ], { brickPips: 1, pipSize: 1 });

  assert.equal(bars.length, 2);
  for (const bar of bars) {
    assert.equal(bar.high - bar.low, 1);
    assert.ok(bar.close === bar.high || bar.close === bar.low);
  }
});

test('synthetic bricks occupy consecutive equal-width columns rather than source-time gaps', () => {
  const entries = [
    { brick: { time: 10, open: 1, high: 2, low: 1, close: 2 }, logical: 5 },
    { brick: { time: 10, open: 2, high: 3, low: 2, close: 3 }, logical: 5 },
  ];
  const narrow = layoutRenkoBricks(entries, { from: 0, to: 10 }, 12);
  assert.equal(narrow[1].logical - narrow[0].logical, 1);
  assert.equal(narrow[0].width, narrow[1].width);
});
