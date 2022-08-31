class CachedQuery {
    constructor(timeoutDuration, queryFunction) {
        this.result = queryFunction();
        setInterval(() => this.result = queryFunction(), timeoutDuration);
    }
}

export default class GameStatistics {
    constructor() {
        const queryFunction = () => (new Date());
        const example = new CachedQuery(2000, queryFunction);
    }
};