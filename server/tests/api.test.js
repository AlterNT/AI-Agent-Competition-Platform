import request from "supertest";
import API from "../api.js";
import Database from "../database.js"

beforeAll(async () => {
    process.env.DATABASE_ENABLED = true;
    await API.init();
});

beforeEach(async () => {
    await Database.init();
})

describe('API', () => {
    it('Persistent Endpoints Disabled', async () => {
        const persistentEndpoints = [
            '/api/agents',
            '/api/bots',
            '/api/count-game-pages',
            '/api/agent-games',
            '/api/top-winrate',
            '/api/most-improved',
            '/api/most-improving',
        ];

        for (const endpoint of persistentEndpoints) {
            const response = await request(API.app).get(endpoint);
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);

            const returnedObject = responseBody[returnedKeys];
            expect(returnedObject).toEqual({ error: 'Database not implemented' });
        }
    });

    // @TODO: fill out these tests
    xdescribe('Endpoints With Arguments', () => {
        it('/api/games', async () => {
        });
        it('/api/game', async () => {
        });
        it('/api/winrate', async () => {
        });
        it('/api/improvement', async () => {
        });
        it('/api/improvement-rate', async () => {
        });
    });

    describe('Static Returns', () => {
        it('Available Games', async () => {
            const response = await request(API.app).get('/api/available-games');
            const responseBody = JSON.parse(response.text);

            const gameIDs = ['love-letter', 'paper-scissors-rock'];
            expect(responseBody.gameIDs).toEqual(gameIDs);
        });
    });
});
