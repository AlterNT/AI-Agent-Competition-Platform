import request from "supertest";
import API from "../api.js";
import Database from "../database.js"

beforeAll(async () => {
    await Database.init()
    await API.init()
});

describe('Testing API (api.js):', () => {
    test('Demo API Test', async () => {
        const response = await request(API.app).get('/api/available-games')
        expect(JSON.parse(response.text)).toBe(true);
    });
});