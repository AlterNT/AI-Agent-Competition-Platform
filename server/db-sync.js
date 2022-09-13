import Server from "./server.js";

// TODO refactor this whole file so things musn't be constructed separately (constructed through a static function?)
class CachedQuery {
    /**
     * Takes a timeout and function of server
     * Updates its result with the function of every time timeoutDuration elapses
     * @param {Number} timeoutDuration
     * @param {Function} queryFunction
     */
    async run(timeoutDuration, queryFunction) {
        this.result = await queryFunction.bind(Server.instance)();
        setInterval(async () => this.result = await queryFunction.bind(Server.instance)(), timeoutDuration);
    }
}

// Class that is used to access game statistics efficiently
// Avoids re-querying the database on every request/computation
export default class DBSync {
    /**
     * Takes a list of methods of server and recomputed their result every so often
     * @param {Function[]} batchQueries
     */
    async start(batchQueries) {
        // Hardcoded to every 2 seconds for now
        const timeoutDuration = 2000;

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
            return value === expectation || value?.includes(expectation);
        }

        Object.keys(filters).forEach((key) => {
            const expectation = filters[key];
            result = result.filter((object) => filterValidation(key, object, expectation));
        });
        return result;
    }
};
