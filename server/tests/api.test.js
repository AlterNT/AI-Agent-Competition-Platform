import request from "supertest";
import API from "../api.js";
import Database from "../database.js"

const databaseDisabledError = { error: 'Database not implemented' };
const incorrectQueryParamsError = { error: 'Incorrect query parameters' };
console.assert(process.env.NODE_ENV == "test", "This test suite should only be run in the test environment");

beforeAll(async () => {
    // process.env.DATABASE_ENABLED = true;
    await API.init();
    await Database.init();

    // would be good to do before each test
    // but it's so slow and none of the tests are mutating anyway
    // it would be good to make this not random, but Math.random has no seed function
    await Database.loadTestData();
});

beforeEach(async () => {
})

describe('API', () => {
    describe('Queries Not Needing Arguments', () => {
        Object.entries({
            'agents': 10,
            'bots': 1,
            'most-improved': 9,
            'most-improving': 9,
            'top-winrate': 9, // TODO should this be 10?
        }).forEach(([endpoint, length]) => {
            it(`/api/${endpoint}`, async () => {
                const response = await request(API.app).get(`/api/${endpoint}`);
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);
                const results = responseBody[returnedKeys[0]];     
                expect(results.length).toBe(length);
            });
        });

        it(`/api/count-game-pages`, async () => {
            const response = await request(API.app).get(`/api/count-game-pages`);
            const responseBody = JSON.parse(response.text);
            const returnedKeys = Object.keys(responseBody);
            expect(returnedKeys.length).toBe(1);    
            const results = responseBody[returnedKeys[0]];     
            expect(results).toBe(80);
        });
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
