class Agent {
    constructor(agentToken) {
        this.token = agentToken
    }

    move() {
        process.stdin.on('data', function(chunk) {
            lines = chunk.split("\n");
        
            lines[0] = lingeringLine + lines[0];
            lingeringLine = lines.pop();
        
            lines.forEach(processLine);
        });
    }
}

export default Agent