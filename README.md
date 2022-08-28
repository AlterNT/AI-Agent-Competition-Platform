# Usage

## Client
### CLI Mode
TODO

### With Electron GUI
TODO

## Server
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

## Configuring neo4j
After installing neo4j you must change the default password
```bash
neo4j-admin set-initial-password <insert-password-here> # possibly requiring root permissions
```

Go to the server dir and make a dotenv file
```bash
cd server && cp .env_example .env
```

Fille in the correct details into the dotenv file

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
