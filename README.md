# Client
## CLI Mode
### Usage
```sh
node . <options>
```

### Options
```bs
      --version   Show version number                                  [boolean]
  -t, --token     Agent authentication token                 [string] [required]
  -l, --language  Language of agent  [string] [required] [choices: "py", "java"]
  -g, --game      Game to be played
             [string] [required] [choices: "paper-scissors-rock", "love-letter"]
  -h, --help      Show help                                            [boolean]
```

## With Electron GUI
TODO

# Server
All command under this section are executed under the `/server` directory.

### Starting the Server
```zsh
node . start
```

### Token Generation
```zsh
node . tokens <path-to-token-file>
```

Token file looks as so:
```csv
StudentNumber1
StudentNumber2
StudentNumber3
...
```

# Development
## Server
### Generating Test Data
WARNING: running this will CLEAR your database, do NOT use it on the same machine as a running server

In case of an error on the delete operation: run the command again until it works.
```zsh
node . load-test-data
```

### Connection to DB Instance With Neo4j Browser
1. Start Neo4j
2. In Neo4j Browser: Add --> Remote Connection
3. Fill in details from `.env` file on the 2 following steps
4. Connect to the Remote Connection and Open
5. If lacking any styling run `:style reset`
6. If server hangs indefinitely disconnect Neo4j browser, and reconnect to the db from the server

# Installation
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

Go to the server dir and make a dotenv file
```bash
cd server && cp .env_example .env
```

Fill in the correct details into the dotenv file

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

## Running the Server
```bash
# in the server folder:
# possibly requiring root permissions for neo4j start
neo4j start && sleep 60 && node .
```

---

# Old instructions (for example code)
# Installation
## Install Dependencies (if not already)
- [python3](https://www.python.org/downloads/)
- [npm](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

## Installing Python Packages
Go to `example/Client` and install the python dependencies:
```bash
# you can use a venv if you'd like (and preferably so)
# but if needed we'll get to that later
pip3 install -r requirements.txt
```

## Installing Node Packages
Go to `example/Server/API` and install the node dependencies:
```bash
npm install
```

# Setup
Test the following commands:
```bash
python3 --version
python --version
```

If `python3` isn't installed and `python` is version 2 then install python3.
If `python3` isn't installed and `python` is version 3 then change `python3` to `python` in `Client/main.py`

# Running
Start the server:
```bash
node index.js # Server/API
```

Start the client:
```bash
python3 main.py # Client
```
