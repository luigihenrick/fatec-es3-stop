const events = require('events');

module.exports = service;

const EVENT_NAME_PLAYER_CONNECTED = 'playerConnected';
const EVENT_NAME_PLAYER_DISCONNECTED = 'playerDiconnected';

function service() {
    const players = [];
    const eventEmitter = new events.EventEmitter();
    
    return {
        connect (player) {
            players.push(player);

            eventEmitter.emit(EVENT_NAME_PLAYER_CONNECTED, player);
        },
        
        getPlayers () {
            return [...players];
        },
        
        onPlayerConnected (listener) {
            eventEmitter.addListener(EVENT_NAME_PLAYER_CONNECTED, listener);
            
            return {
                clear () {
                    eventEmitter.removeListener(EVENT_NAME_PLAYER_CONNECTED, listener);
                }
            }
        },

        onPlayerDisconnected (listener) {
            eventEmitter.addListener(EVENT_NAME_PLAYER_DISCONNECTED, listener);

            return {
                clear () {
                    eventEmitter.removeListener(EVENT_NAME_PLAYER_DISCONNECTED, listener);
                }
            }
        },
        
        disconnect (player) {
            const index = players.indexOf(player);
            
            if (index > -1) {
                players.splice(index, 1);
                eventEmitter.emit(EVENT_NAME_PLAYER_DISCONNECTED, player);
            }
        },
    }
}