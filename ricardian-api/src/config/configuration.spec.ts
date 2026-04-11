import configuration from './configuration';

describe('configuration', () => {
  const originalCorsOrigin = process.env.CORS_ORIGIN;

  afterEach(() => {
    if (originalCorsOrigin === undefined) {
      delete process.env.CORS_ORIGIN;
    } else {
      process.env.CORS_ORIGIN = originalCorsOrigin;
    }
  });

  it('defaults CORS to localhost for local development', () => {
    delete process.env.CORS_ORIGIN;

    expect(configuration().cors.origin).toEqual(['http://localhost:8080']);
  });

  it('supports comma-separated production origins', () => {
    process.env.CORS_ORIGIN =
      'https://www.ricardianbase.com, https://ricardianbase.com';

    expect(configuration().cors.origin).toEqual([
      'https://www.ricardianbase.com',
      'https://ricardianbase.com',
    ]);
  });
});
