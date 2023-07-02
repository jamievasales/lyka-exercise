import express from 'express';
import supertest from 'supertest';
import { RobotRouter } from '../RobotRouter';

describe('RobotRouter tests', () => {
    let request: any;
    beforeEach(() => {
        const app = express();
        app.use('/api/robot', RobotRouter);
        request = supertest(app);
    });

    it('should get robot by id with valid id', async function () {
        const response = await request.post('/api/robot/1/E');

        expect(response.status).toBe(200);
    });

    it('should not get robot by id with invalid id', async function () {
        const response = await request.post('/api/robot/invalid/E');

        expect(response.status).toBe(400);
    });

    it('should not post robot by id with invalid direction', async function () {
        const response = await request.post('/api/robot/1/invalid');

        expect(response.status).toBe(400);
    });

    it('should not post robot by id with invalid id', async function () {
        const response = await request.post('/api/robot/invalid/E');

        expect(response.status).toBe(400);
    });

    it('should not post robot by id with valid id and invalid directions', async function () {
        const response = await request
            .post('/api/robot/1')
            .send({ directions: ['N', 'SOUTH'] });

        expect(response.status).toBe(400);
    });
});
