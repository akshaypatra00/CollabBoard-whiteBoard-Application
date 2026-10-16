import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { RectangleElement } from '@whiteboard/shared';

describe('Board Express REST API', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('GET /api/health returns 200 ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
  });

  let createdBoardId = '';

  it('POST /api/boards creates a board with unpredictable ID', async () => {
    const res = await request(app)
      .post('/api/boards')
      .send({ title: 'Sprint Retrospective' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title).toBe('Sprint Retrospective');
    expect(res.body.data.elements).toEqual([]);

    createdBoardId = res.body.data.id;
  });

  it('GET /api/boards/:id retrieves existing board', async () => {
    const res = await request(app).get(`/api/boards/${createdBoardId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdBoardId);
    expect(res.body.data.title).toBe('Sprint Retrospective');
  });

  it('PATCH /api/boards/:id updates board title', async () => {
    const res = await request(app)
      .patch(`/api/boards/${createdBoardId}`)
      .send({ title: 'Q4 Product Roadmap' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Q4 Product Roadmap');
  });

  it('PUT /api/boards/:id/elements persists elements to MongoDB', async () => {
    const rect: RectangleElement = {
      id: 'rect-api-1',
      type: 'rectangle',
      x: 50,
      y: 50,
      width: 100,
      height: 80,
      strokeColor: '#1e1e1e',
      fillColor: '#a5d8ff',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const res = await request(app)
      .put(`/api/boards/${createdBoardId}/elements`)
      .send({ elements: [rect] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.elementCount).toBe(1);

    const checkRes = await request(app).get(`/api/boards/${createdBoardId}`);
    expect(checkRes.body.data.elements.length).toBe(1);
    expect(checkRes.body.data.elements[0].id).toBe('rect-api-1');
  });

  it('GET /api/boards/:id/export exports board JSON', async () => {
    const res = await request(app).get(`/api/boards/${createdBoardId}/export`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('application/json');
    expect(res.body.id).toBe(createdBoardId);
    expect(res.body.elements.length).toBe(1);
  });

  it('GET /api/boards/:id returns 404 for non-existent board', async () => {
    const res = await request(app).get('/api/boards/nonExistentBoard123');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/boards/:id returns 400 for empty or invalid title', async () => {
    const res = await request(app)
      .patch(`/api/boards/${createdBoardId}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
