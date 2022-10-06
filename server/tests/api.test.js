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
            const games = JSON.parse(response.text).games;
            expect(games.length).toBe(80);
        });
        it('/api/game', async () => {
            const games = JSON.parse((await request(API.app).get("/api/games").query({ page: 1 })).text).games;
            const response = await request(API.app)
               .get('/api/game')
               .query({ gameId: games[0].id });
            expect(JSON.parse(response.text).games[0].id).toEqual(games[0].id);
        });

        [
            "winrate",
            "improvement",
            "improvement-rate",
        ].forEach(endpoint => {
            it(`/api/${endpoint}`, async () => {
                const response = await request(API.app)
                   .get(`/api/${endpoint}`)
                   .query({ agentId: new Array(36).fill("A").join("") });
                   // a non existant agent returns the same as existant agents for most fields
                   // only requirement is that it is 36 letters long
                const responseBody = JSON.parse(response.text);
                const returnedKeys = Object.keys(responseBody);
                expect(returnedKeys.length).toBe(1);    
                const results = responseBody[returnedKeys[0]];
                expect(results).not.toBe(incorrectQueryParamsError);   
            });
        })
    });

    // TODO: Test it doesn't crash
    describe('Queries With Missing Arguments', () => {
        [
            "games",
            "game",
            "winrate",
            "improvement",
            "improvement-rate",
        ].forEach(route => {
            it(`/api/${route}`, async () => {
                const response = await request(API.app).get(`/api/${route}`);
                const responseBody = JSON.parse(response.text);
                const returnedKeys = Object.keys(responseBody);
                expect(returnedKeys.length).toBe(1);
    
                const returnedObject = responseBody[returnedKeys];
                expect(returnedObject).toEqual(incorrectQueryParamsError);
            });
        })
    });

    // TODO: Test it doesn't crash
    
    describe('Queries With Badly Typed Arguments', () => {
        Object.entries({
            "games": { page: 'page 1' },
            "game": { gameId: "stillnot36" },
            "winrate": { agentId: "not36again" },
            "improvement": { agentId: "not36" },
            "improvement-rate": { agentId: "" },
        }).forEach(([endpoint, query]) => {
            it(`/api/${endpoint}`, async () => {
                const response = await request(API.app)
                    .get(`/api/${endpoint}`)
                    .query(query);
                const responseBody = JSON.parse(response.text);
                const returnedKeys = Object.keys(responseBody);
                expect(returnedKeys.length).toBe(1);
                const returnedObject = responseBody[returnedKeys];
                expect(returnedObject).toEqual(incorrectQueryParamsError);
            });
        })
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
