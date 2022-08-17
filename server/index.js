import neo4j from 'neo4j-driver';
import 'process';

class Server {
    constructor() {
        const uri = "bolt://localhost:7687";
        const username = "neo4j";
        const password = "placeholder";

        const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
        const session = driver.session();

        this.db_session = session;
    }

    async handle_close() {
        await this.db_session.close();
    }

    async run() {
        const personName = 'Alice';

        for (let i = 0; i < 5; i++) {
            try {
                const result = await this.db_session.run(
                    'CREATE (a:Person {name: $name}) RETURN a',
                    { name: personName }
                );
    
                for (let record of result.records) {
                    const node = record.get(0);
                    console.log(`Added person with name ${node.properties.name}`);
                }
            } catch {
                await this.handle_close();
                return;
            }
        }

        try {
            const result = await this.db_session.run(
                'MATCH (a:Person {name: $name}) RETURN a',
                { name: personName }
            );

            const num_records = result.records.length;
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);

            console.log(`Found ${num_records} people called ${node.properties.name}`);
        } catch {
            await this.handle_close();
            return;
        }

        try {
            const result = await this.db_session.run(
                'MATCH (a:Person {name: $name}) DELETE a',
                { name: personName }
            );

            console.log(result.records);
            const num_deleted = result.summary.counters.updates().nodesDeleted;
            console.log(`deleted ${num_deleted} node(s)`)
        } catch {
            await this.handle_close();
            return;
        }

        await this.handle_close();
    }
}

const server = new Server();
await server.run();
process.exit(0);
