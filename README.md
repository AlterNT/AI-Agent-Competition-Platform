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
