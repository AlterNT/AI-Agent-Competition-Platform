# Implementing Agnet
## Java
Base Class is located at `./agents/java/client/src/main/java/javaclient/agents/gameAgent.java`
Override methods in order to implement own agent.

## Python
The `agent.py` file can be found in `src/agents/python/[game]/agent.py`

`agent.py` is the only file that should be changed when implementing your agent.

# Client Execution
> All command under this section are executed in the `/client` directory. 
```bash 
cd /client 
```

## Java Client
## Running the Client
### install dependencies
1. Download and install [Java 1.8](https://www.oracle.com/au/java/technologies/javase/javase8-archive-downloads.html).
2. Download and install [Apache Maven 3.8.6](https://maven.apache.org/install.html).
3. Set required environment variables for Java and Maven as outlined in the maven install link.
      - Make sure JAVA_HOME system variable points to the 1.8 version of JDK.
> Check JAVA_HOME on Windows systems
```cmd
echo $JAVA_HOME$
```
> Check JAVA_HOME on Unix-based systems
```bash
echo $JAVA_HOME
```
4. Make sure you can run maven commands by running the following:
```bash 
mvn -v
```
### Preform Maven Install and Complete First Compilation from CLI
> The first time you run maven install or compile a project maven will download the required dependencies which leads to a prolonged compile time on first use. Completing this step will mean all compilations that follow should be no longer than 15 seconds. (This could vary depending on your machines specs)
```bash 
cd /agent/java/client 
mvn install 
mvn clean compile assembly:single
```
### Running the client via commands
```bash
cd /agent/java/client 
mvn clean compile assembly:single
java -jar target/client-1.0-SNAPSHOT-jar-with-dependencies.jar [agentToken] [game]
```
### CLI-Mode
#### install dependencies
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
  -c, --compile   flag to recompile java client                        [boolean]
  -l, --language  Language of agent  
                                     [string] [required] [choices: "py", "java"]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -h, --help      Show help                                            [boolean]
```
## CLI-Project Compilation Timeout 
By default the function that runs the compilation process will only wait 10 seconds before trying to run the output locaiton of the produced .jar file. If this fails due to local machine taking longer to compile than default, you will need to edit the following function in the `/client/index.js` file to adequatley meet system requirements.
> Note you can perform this in reverse and lower the compilation wait time if your machine has a lower time to build.
```JavaScript
// If statement found at line 119 of index.js
            if(compile === true){
                try {
                    let compile = await compileMaven()
                    console.log("compiling java client")
                    await sleep(10000);
                } catch (error) {
                    console.log(error)
                }
            }
```
## Python Client
#### install dependencies
```bash
npm i
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
  -c, --compile   flag to recompile java client                        [boolean]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -u, --url       The url and port of the host server 
                                [string] [required] [Format: http://{ip}:{port}] 
  -h, --help      Show help                                            [boolean]
```

# Miscellaneous Client Functions
## Changing Client Display Name
A POST request to the endpoint `/api/set-display-name` with the authentication token supplied as `userToken` and the desired name supplied as `displayName`.

cURL syntax for changing display name:
```bash
curl -X post 'http://<server-url>/api/set-display-name?userToken=<auth-token>&displayName=<desired-name>'
```
