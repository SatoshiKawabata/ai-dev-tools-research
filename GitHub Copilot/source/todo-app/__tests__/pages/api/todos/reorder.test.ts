import { createMocks } from 'node-mocks-http';
import handler from '../../../../../src/pages/api/todos/reorder';

describe('Reorder API', () => {
  it('returns 200 when todos are reordered successfully', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {
        todos: [
          { id: 1, order: 0 },
          { id: 2, order: 1 },
        ],
      },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });

  it('returns 405 for non-PUT requests', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
