import request from "supertest";
import API from "../api.js";
import Database from "../database.js"

const databaseDisabledError = { error: 'Database not implemented' };
const incorrectQueryParamsError = { error: 'Incorrect query parameters' };
console.assert(process.env.NODE_ENV == "test", "This test suite should only be run in the test environment");
if (process.env.NODE_ENV != "test") process.exit(0);

beforeAll(async () => {
    await Database.init();
});

beforeEach(async () => {
    await Database.loadTestData();
    await API.init();
});

afterEach(async () => {
    await Database.deleteAll();
    API.server.close();
});

afterAll(async () => {
})

describe('API', () => {
    describe('Queries Not Needing Arguments', () => {
        Object.entries({
            'agents': 8,
            'bots': 1,
            'most-improved': 7,
            'most-improving': 7,
            'top-winrate': 7, // TODO should this be 10?
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
            expect(results).toBe(2);
        });
    });

    describe('Queries With Correct Arguments', () => {
        it('/api/games', async () => {
            const response = await request(API.app)
                .get('/api/games')
                .query({ page: 1 });
            const games = JSON.parse(response.text).games;
            expect(games.length).toBe(100);
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
                   .query({ agentId: "fakedisplayname" });
                   // a non existant agent returns the same as existant agents for most fields
                const responseBody = JSON.parse(response.text);
                const returnedKeys = Object.keys(responseBody);
                expect(returnedKeys.length).toBe(1);
                const results = responseBody[returnedKeys[0]];
                expect(results).not.toBe(incorrectQueryParamsError);
            });
        })
    });

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

    describe('Queries With Badly Typed Arguments', () => {
        Object.entries({
            "games": { page: 'page 1' },

            // Below tests commented out because currently all strings are valid
            // "game": { gameId: "stillnot36" },
            // "winrate": { agentId: "not36again" },
            // "improvement": { agentId: "not36" },
            // "improvement-rate": { agentId: "" },
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
