import { afterAll, beforeAll, describe } from 'vitest';
import { reset } from '$/tests/helpers/reset';

export function scope(name: string, define: () => void): void {
  describe(name, () => {
    beforeAll(reset);
    define();
    afterAll(reset);
  });
}
