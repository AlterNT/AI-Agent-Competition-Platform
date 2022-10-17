# Server Installation And Execution
## Dependencies
The only required dependency to run the server is [docker](https://docs.docker.com/engine/install/).
As everyone's environment is different there are no installation instructions that are guaranteed to work natively.

## Setup & Configuration
```bash
# under the /server directory copy the config example
cp config.json5.example config.json5
```

### Setting The Server Password
in `docker-compose.yml` replace `password` with your desired password in the following line:
`- NEO4J_AUTH=neo4j/password`

In `config.json5` change `database.password` to be the same password.

### Setting The Secret Key And Salt
Set the following 2 properties in `config.json5`, they determine how authentication tokens are generated from student number:
- config.database.aiPlatformSecretKey
- config.database.aiPlatformSalt

### Setting The Admin Token
Set the following property in `config.json5`, it determines what the admin password is by default:
- config.database.defaultAdminToken

Note that when the server is started an admin user is created when, but not deleted when the default admin token changes, and must be manually deleted through [neo4j browser](TODO-link-here).

### Setting The Game
Add a key/value pair to `config.games` in the format of the existing examples.

## Execution
## Running The Server
```bash
# under the project directory (not in server!)
docker compose build && docker compose up
```

You may wish to `docker compose up neo4j` and then run `docker compose up` once neo4j has started. The server is prone to crashing upon losing connection to the database.

The server runs on port `8080` with the website running at port `3000`. The two are not managed by the same program but their own separate containers.

## Running Tests
```bash
cd tests
docker compose build && docker compose up
```

The process for running tests is the same as that of running the server but done with the docker containers in the `/tests` directory.

Make sure that the server or the database are not running at the same time (as they use the same ports).

# Native Server Installation And Execution
This is heavily advised against and only applicable to development of the project.
The project is expected to be run in docker containers and not officially supported natively.

## Dependencies
`node.js`/`npm` and `python` (3) are the only required dependencies.

Installation tutorials:
- [node.js](https://enterflash.io/posts/how-to-install-nodejs-and-npm-on-windows-mac-or-linux)

### Versions
Recommended:
- node: >14

Requirements for Neo4j:
- java: openjdk version >11 (or equivalent)
- neo4j: >4.4
- apoc: >4.4

### Installation of Node Modules
```bash
cd server
npm ci
```

### Installation of Neo4j
This step is optional, please refer [here](#native-neo4j-installation-not-required).

### Starting the Server
```bash
# in the /server directory
node .
```

# Server
All command under this section are executed under the `/server` directory.
First change to the client directory and install dependencies:
```bash
cd server
npm i
cp config.json5.example config.json5
```

### Starting the Server
```bash
node . start
```

# Development and DevOps
## Server
### Generating Test Data
WARNING: running this will CLEAR your database, do NOT use it on the same machine as a running server

In case of an error on the delete operation: run the command again until it works.
```bash
node . load-test-data
```

### Token Generation
```bash
# in /server
node . tokens <path-to-token-file>
```

Token file looks as so:
```csv
StudentNumber1
StudentNumber2
StudentNumber3
...
```


### Connection to DB Instance With Neo4j Browser
1. Start Neo4j
2. In Neo4j Browser: Add --> Remote Connection
3. Fill in details from `.env` file on the 2 following steps
4. Connect to the Remote Connection and Open
5. If lacking any styling run `:style reset`
6. If server hangs indefinitely disconnect Neo4j browser, and reconnect to the db from the server

# Native Neo4j Installation (NOT REQUIRED)
## Dependencies
- [npm](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
- [neo4j](https://neo4j.com/)

## Neo4j Installation
[Download Neo4j Community edition](https://neo4j.com/download-center/#community)
TODO: install instructions

### Configuring Neo4j
After installing neo4j you must change the default password
```bash
neo4j-admin set-initial-password <insert-password-here> # possibly requiring root permissions
```

Go to the server dir and edit `config.json5`
Fill in the same username and password.

### Installing APOC (and Neo4j Libraries)
This section is only valid on *debian* based linux distros (ubuntu and ubuntu-derivatives count)

The development build of this project is using:
- neo4j 4.4.10
- APOC 4.4.0.8

1. Check neo4j version (`neo4j --version`)
2. Install a matching version of the APOC library (ends in `-all.jar`) from the [GH releases](https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases)
3. Check plugin directory [here](https://neo4j.com/docs/operations-manual/current/configuration/file-locations/), at the time of writing the plugin directory is located as follows:
   - Debian-based Linux: `/var/lib/neo4j/plugins`
   - MacOS/Linux: `<neo4j-home>/plugins`
   - Windows: `<neo4j-home>\plugins`

---

# Client Execution
## Java Client 
### install dependencies:
1. Download and install [Java 1.8](https://www.oracle.com/au/java/technologies/javase/javase8-archive-downloads.html).
2. Download and install [Apache Maven 3.8.6](https://maven.apache.org/install.html).
3. Set required environment variables for Java and Maven as outlined in the maven install link.
      - Make sure JAVA_HOME system variable points to the 1.8 version of JDK.
      - If you get an error for the java_home variable not beign set properly on mac based systems remove all other JDKs in the '/usr/libexec/java_home' folder except 1.8.
4. Make sure you can run maven commands by running the following:
```bash 
mvn -v
```
### Preform Maven Install and Complete First Compilation from CLI
```bash 
cd /agent/java/client 
mvn install 
mvn clean compile assembly:single
```
### Running the client via commands:
```bash
cd /agent/java/client 
mvn clean compile assembly:single
java -jar target/client-1.0-SNAPSHOT-jar-with-dependencies.jar [agentToken] [game]
```

### CLI-Mode
#### install dependencies:
```bash
npm i
```
> The agent file has been updated and requires recompilation of java project
```bash
node . -t [agentToken] -l java -g love-letter -c true
```
> No update to code base and need to run the agent
```bash
node . -t [agentToken] -l java -g love-letter
```

### CLI-Options
If you would like to change the options:
```bash
      --version   Show version number                                  [boolean]
  -t, --token     Agent authentication token                 [string] [required]
  -l, --language  Language of agent  [string] [required] [choices: "py", "java"]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -c, --compile   flag to recompile java client                        [boolean]
  -h, --help      Show help                                            [boolean]
```

## Python Client 
#### install dependencies:
```bash
npm i
# if using pip3:
pip3 install -r requirements.txt

# if using pip:
pip install -r requirements.txt
```

### CLI-Mode
```bash
node . <options>

# options required for a game,
# change the -t flag to be different for each agent

node . -t 1 -l py -g love-letter
```

- Run 4 agent processes as above with the `-t` flag being different in each case.
- Agent processes should all be run in their own terminal for readability.

Alternatively you can run them all as background processes **(not recommended)**:
```bash
node . -t 1 -l py -g love-letter &\
   node . -t 2 -l py -g love-letter &\
   node . -t 3 -l py -g love-letter &\
   node . -t 4 -l py -g love-letter
```

The client process quits if it detects the server is not running so cleanup of dangling processes is not an issue.

### CLI-Options
If you would like to change the options:
```bash
      --version   Show version number                                  [boolean]
  -t, --token     Agent authentication token                 [string] [required]
  -l, --language  Language of agent  [string] [required] [choices: "py", "java"]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -c, --compile   flag to recompile java client                        [boolean]
  -h, --help      Show help                                            [boolean]
```

---

# Old Client Setup
Test the following commands:
```bash
python3 --version
python --version
```

If `python3` isn't installed and `python` is version 2 then install python3.
If `python3` isn't installed and `python` is version 3 then change `python3` to `python` in `Client/main.py`

# Client Program WIP?
All command under this section are executed under the `/client` directory.
First change to the client directory and install dependencies:
```bash
cd client
npm ci

# if using python3:
pip3 install -r requirements.txt

# if using python:
pip install -r requirements.txt
```

### CLI-Mode
```bash
node . <options>

# options required for a game,
# change the -t flag to be different for each agent
node . -t 1 -l py -g love-letter
```

Run 4 agent processes as above with the `-t` flag being different in each case.
Agent processes should all be run in their own terminal for readability.

Alternatively you can run them all as background processes **(not recommended)**:
```bash
node . -t 1 -l py -g love-letter &\
   node . -t 2 -l py -g love-letter &\
   node . -t 3 -l py -g love-letter &\
   node . -t 4 -l py -g love-letter
```

The client process quits if it detects the server is not running so cleanup of dangling processes is not an issue.

### CLI-Options
If you would like to change the options:
```bash
      --version   Show version number                                  [boolean]
  -t, --token     Agent authentication token                 [string] [required]
  -l, --language  Language of agent  [string] [required] [choices: "py", "java"]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -h, --help      Show help                                            [boolean]
```

<!-- ## With Electron GUI
TODO -->

**INFORMATION BELOW THIS LINE ONLY APPLICABLE TO DEVELOPERS OR IF DEPLOYING**

## Running
Start the server:
```bash
node index.js # Server/API
```

Start the client:
```bash
python3 main.py # Client
```
