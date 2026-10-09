import { test } from '@playwright/test';
import { reset } from '$/tests/helpers/reset';

export function scope(name: string, define: () => void): void {
  test.describe(name, () => {
    test.beforeAll(reset);
    define();
    test.afterAll(reset);
  });
}
