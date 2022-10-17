# Game Implementation

To implement a new game on the server, you must first create a directory for it in the folder `/games` (this folder), then there must be at least 2 files created, `<game-name>.js` and `<agent>.js`.

Liberties can be taken with this, so long as the imports are correct.

## The Game File

This file must export a class that inherits from `IGame` in `i-game.js`.
As an example, let's create a file called `mygame.js`.

```js
class MyGame extends IGame { 
    ...
}

export default MyGame;
```

Following this, the following properties must be defined.

```js
import MyAgent from './myagent.js'
import MyBot from './mybot.js'
import MySmartBot from './mysmartbot.js'


class MyGame extends IGame { 
    static Agent = MyAgent
    static Bot = MyBot
    static SmartBot = MySmartBot // This one is optional.
}
```

These are used by the Lobbies to initialize the correct agents or bots for each game.

Next, the following methods must be implemented:

```js
import MyAgent from './myagent.js'
import MyBot from './mybot.js'
import MySmartBot from './mysmartbot.js'
    

class MyGame extends IGame { 
    static Agent = MyAgent
    static Bot = MyBot
    static SmartBot = MySmartBot // This one is optional.

    async playGame() {

        ...

        return results;
    }

    getState(token) {
        
        ...

        return state;
    }
}
```

`playGame()` is the method that is called at the start of the game.
This must always return an array, with the indices corresponding to the scores of each agent.

If this is a game without scores, return 0 for all, and 1 for the winner.

`getState(token)` is a method that should return relevant state information when called. This is used by the `/api/state` endpoint for clients.

`IGame` also contains a variety of properties that can be used, as listed below:

`agents` - An array of all agents playing.

`indexMap` - An object mapping tokens to their index in `agents`. `{<token>: <index>, ...}`

`events` - An array of event objects, purely for recording the events of a game to be stored and queried in the database. `{event: <eventname>, args: {<Object with relevant info>}}`

By default, this will record all methods called on the agents playing in the game. If you wish to disable this behavior and manually push event objects to this array, see the [Register in Config](#important-property) section for more details.

`turn` - the token corresponding to the current player's turn. **THIS MUST BE IMPLEMENTED** in `playGame()`.

`lastPlayedAction` - the last action played by an agent. This is used to return to the `/api/lastAction` endpoint. **THIS MUST BE IMPLEMENTED** so that it doesn't return a null pointer. Can set to `{}` if not in use.

## The Agent Class

This file must export a class inheriting from `IAgent` in `i-agent.js`.

```js
class MyAgent extends IAgent { 
    ...
}

export default MyGame;
```

Aside from this, feel free to implement whatever agent methods are necessary for this game.

**Note:** All arguments passed to any agent methods must be serializable to JSON, unless you disable `autoLogging` in the config. See [this](#important-property) for more details.

IAgent provides a method called `awaitEvent()`. This signals to the server that the agent is now awaiting an action and returns a promise to be resolved.

The next time the student calls the `/api/action` endpoint, the execution then continues.

An example of this in chess would be:

```js
async move() {
    // Waits for student to call /api/action
    const move = await this.awaitEvent();
    
    // Only continues here once the method has been called.
    ...
}
```

`IAgent` also provides `token` which corresponds to the player's token.

If this were instead a Bot, there would be no need to call `awaitEvent`, and the agent would then be implemented traditionally.

## Register in Config

Once you have your agent and game classes ready, you must then must register in `config.json5` as following.

```json5
{
    ... ,
    games: {
        
        ... ,

        'my-game': {
            path: 'my-game/my-game.js',
            settings: {
                maxPlayers: <MAX PLAYERS HERE>,
                minPlayers: <MIN PLAYERS HERE>,
                autoLogging: true,
                loggingEnabled: true,
                bot: 'bot',
            }
        }
    }
}
```

First create a new entry with the desired ID of the game as it's key. In this case this is `my-game`.

The `path` property is relative to the `game` folder and must point to the file that contains the IGame implementation.

The `maxPlayers` and `minPlayers` properties defines the limits of the numbers of players in a game.

### **IMPORTANT PROPERTY:**

`autoLogging` enables or disables the automatic logging solution which records all methods and their arguments that are called on clients.

As a result, all arguments passed to clients **MUST** be serializable to JSON format. This can cause crashes if they are not implemented correctly.
This means that circular dependencies must be avoided.

A way of avoiding this, is to implement the `toJSON()` method on the object being passed in the arguments.

This setting would also be disabled in the event that you wish to implement your own custom event logging solution by pushing to `events` in the game class.

`loggingEnabled` toggles whether or not logs are recorded at all for a game (regardless of autologging or custom solution). This is to potentially increase performance if storage/speed becomes an issue.

`'bot'` specifies the bot class to be used in the game. If this is set to `bot` it will use the `Bot` class assigned in the the game class. If this is set to `'smart-bot'` this will instead use the class assigned to the `SmartBot` property in the game class.