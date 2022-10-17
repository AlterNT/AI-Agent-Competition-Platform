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
node . -t [agentToken] -u [url] -l java -g love-letter -c true
```
> No update to code base and need to run the agent
```bash
node . -t [agentToken] -u [url] -l java -g love-letter
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
### install dependencies:
```bash
npm i
# if using pip3:
pip3 install -r requirements.txt

# if using pip:
pip install -r requirements.txt
```

### Implementing Agent
The `agent.py` file can be found in src/agents/python/[game]/agent.py

`agent.py` is the only file that should be changed when implementing your agent.

### CLI-Mode
```bash
node . <options>

# options required for a game,
# change the -t flag to be different for each agent

node . -t [agentToken] -u [url] -l py -g [game]
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

# Miscellaneous Client Functions
## Changing Client Display Name
A POST request to the endpoint `/api/set-display-name` with the authentication token supplied as `userToken` and the desired name supplied as `displayName`.

cURL syntax for changing display name:
```bash
curl -X post 'http://<server-url>/api/set-display-name?userToken=<auth-token>&displayName=<desired-name>'
```
