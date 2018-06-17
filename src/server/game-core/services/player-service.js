const constants = require('./constants');

module.exports = service;

function service(PubSub) {
    const players = [];
    
    return {
        connect (socket) {
            const newPlayer = {
                socket
            };

            players.push(newPlayer);

            PubSub.publish(constants.PLAYER_CONNECTED_MESSAGE, newPlayer);
        },

        getPlayers () {
            return [...players];
        },

        getPlayerBySocket(socket) {
            const playerIndex = players.findIndex(player => player.socket === socket);

            if (playerIndex > -1) {
                return  players[playerIndex];
            }
            else {
                return null;
            }
        },
        
        disconnect (socket) {
            const playerIndex = players.findIndex(player => player.socket === socket);
            
            if (playerIndex > -1) {
                const player = players[playerIndex];

                players.splice(playerIndex, 1);

                PubSub.publish(constants.PLAYER_DISCONNECTED_MESSAGE, player);
            }
        },
    }
}


