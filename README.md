# Installation
## Dependencies
- [npm](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
- [neo4j](https://neo4j.com/)

## Configuring neo4j
After installing neo4j you must change the default password
```bash
neo4j-admin set-initial-password # possibly requiring root permissions
```

## Running the Server
```bash
# in the server folder:
# possibly requiring root permissions for neo4j start
neo4j start && node .
```

# Developer Documentation
## Database
Most databasing operations are asynchronous and return a promise, await them in order to wait for their execution and retrieve the result (i.e. multiple consecutive transactions should be awaited).

###
To get a property called `propName` from `node`:
```js
node.get('propName');
```


### Insertion
```js
let created_node = await this.db_instance.create('ModelName', {
    prop1: 'value1',
    prop2: 'value2',
    ...
});
```

### Reading
```js
let result = await this.db_instance.find(
    'ModelName', 'PrimaryKeyValue'
);
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
