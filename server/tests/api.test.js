import request from "supertest";
import API from "../api.js";
import Database from "../database.js"

const databaseDisabledError = { error: 'Database not implemented' };
const incorrectQueryParamsError = { error: 'Incorrect query parameters' };

beforeAll(async () => {
    process.env.DATABASE_ENABLED = true;
    await API.init();
});

beforeEach(async () => {
    await Database.init();
})

describe('API', () => {
    it('Queries Not Needing Arguments', async () => {
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
            expect(returnedObject).toEqual(databaseDisabledError);
        }
    });

    // @TODO: fill out the rest of these tests
    describe('Queries With Correct Arguments', () => {
        it('/api/games', async () => {
            const response = await request(API.app)
                .get('/api/games')
                .query({ page: 1 });
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);

            const returnedObject = responseBody[returnedKeys];
            expect(returnedObject).toEqual(databaseDisabledError);
        });
        xit('/api/game', async () => {
        });
        xit('/api/winrate', async () => {
        });
        xit('/api/improvement', async () => {
        });
        xit('/api/improvement-rate', async () => {
        });
    });

    // TODO: Test it doesn't crash
    describe('Queries With Missing Arguments', () => {
        it('/api/games', async () => {
            const response = await request(API.app).get('/api/games');
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);

            const returnedObject = responseBody[returnedKeys];
            expect(returnedObject).toEqual(incorrectQueryParamsError);
        });
        xit('/api/game', async () => {
        });
        xit('/api/winrate', async () => {
        });
        xit('/api/improvement', async () => {
        });
        xit('/api/improvement-rate', async () => {
        });
    });

    // TODO: Test it doesn't crash
    describe('Queries With Badly Typed Arguments', () => {
        it('/api/games', async () => {
            const response = await request(API.app)
                .get('/api/games')
                .query({ page: 'page 1' });
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);

            const returnedObject = responseBody[returnedKeys];
            expect(returnedObject).toEqual(incorrectQueryParamsError);
        });
        xit('/api/game', async () => {
        });
        xit('/api/winrate', async () => {
        });
        xit('/api/improvement', async () => {
        });
        xit('/api/improvement-rate', async () => {
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
