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
     * @returns {any}
     */
    getQueryResult(query) {
        const queryString = query?.name || query;
        return this.queryMap.get(queryString).result;
    }
};
