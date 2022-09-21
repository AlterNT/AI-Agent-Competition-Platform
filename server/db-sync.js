import Database from "./database.js"

// TODO refactor this whole file so things musn't be constructed separately (constructed through a static function?)
class CachedQuery {
    /**
     * Takes a timeout and function of server
     * Updates its result with the function of every time timeoutDuration elapses
     * @param {Number} timeoutDuration
     * @param {Function} queryFunction
     */
    async run(timeoutDuration, queryFunction) {
        this.result = await queryFunction.bind(Database)();
        setInterval(async () => this.result = await queryFunction.bind(Database)(), timeoutDuration);
    }
}

// Class that is used to access game statistics efficiently
// Avoids re-querying the database on every request/computation
export default class DBSync {
    /**
     * Takes a list of methods of server and recomputed their result every so often
     * @param {Function[]} batchQueries each function must evaluate to a list and be async
     */
    async start(batchQueries, timeoutDuration) {
        // Maps query names to query results
        this.queryMap = new Map();
        for (let queryFunction of batchQueries) {
            const cachedQuery = new CachedQuery();
            await cachedQuery.run(timeoutDuration, queryFunction);
            this.queryMap.set(
                queryFunction.name,
                cachedQuery,
            );
        }
    }

    /**
     * Returns whatever has been cached for the result of the query
     * Searched for a key and expectation pair that exists in the filter to exist in the response
     * value does not have to be exactly equal to the expectation
     * it can be an array that includes the expectation or an object that maps from it
     *
     * @param {Function | String} query
     * @param {{ any }} filters (strict) equalities applied on the resulting object
     * @returns {any}
     */
    getQueryResult(query, filters) {
        const queryString = query?.name || query;
        const rawResult = this.queryMap.get(queryString).result;
        let result = rawResult;

        const filterValidation = (key, object, expectation) => {
            if (!(key in object)) {
                return false;
            }
            const value = object[key];
            const valueKeys = typeof(value) === 'object' ? Object.keys(value) : [];
            const valueArray = Array.isArray(value) ? value : [];
            const includesExpectation = valueKeys.includes(expectation) || valueArray.includes(expectation);
            return value === expectation || includesExpectation;
        }

        Object.keys(filters).forEach((key) => {
            const expectation = filters[key];
            result = result.filter((object) => filterValidation(key, object, expectation));
        });
        return result;
    }
};