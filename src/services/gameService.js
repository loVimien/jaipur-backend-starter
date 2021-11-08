/* eslint-disable prettier/prettier */
import * as databaseService from "./databaseService"
import { shuffle } from "lodash"

// Return a shuffled starting deck except 3 camels
export function initDeck() {
    const amounts = {
        diamants: 6,
        or: 6,
        argent: 6,
        tissus: 8,
        épices: 8,
        cuir: 10,
        chameau: 8,
    }
    const deck = []
    for (const [key, value] of Object.entries(amounts)) {
        for (let i = 0; i < value; i++) {
            deck.push(key)
        }
    }
    return shuffle(deck)
}

// Draw {count} cards of a deck
export function drawCards(deck, count = 1) {
    const cards = []
    for (let i = 0; i < count && deck.length !== 0; i++) {
        cards.push(deck.shift())
    }
    return cards
}

// Transfer camels from players hand (_players[i].hand) to their herd (_players[i].camelsCount)
export function putCamelsFromHandToHerd(game) {
    for (let i = 0; i < 2; i++) {
        let amount = 0
        game._players[i].hand = game._players[i].hand.filter((item) => {
            if (item === "camel") {
                amount++
                return false
            } else {
                return true
            }
        })
        game._players[i].camelsCount += amount
    }
}

export function getFirstPossibleId() {
    let i = 0;
    databaseService.getGames().some(val => {
        if (val.id === i) {
            i++;
            return false;
        } else {
            return true;
        }
    })
    return i;
}

// Create a game object
export function createGame(name) {
    const deck = initDeck()
    const handP1 = drawCards(deck, 5)
    const handP2 = drawCards(deck, 5)
    let market = ["camel", "camel", "camel"]
    market = market.concat(drawCards(deck, 2))
    const game = {
        id: getFirstPossibleId(),
        name: name,
        _deck: deck,
        market: market,
        currentPlayerIndex: Math.floor(Math.random() * 2),
        _players: [{
                hand: handP1,
                tokens: [],
                camelsCount: 0,
                score: 0,
            },
            {
                hand: handP2,
                tokens: [],
                camelsCount: 0,
                score: 0,
            },
        ],
        tokens: {
            diamonds: [7, 7, 5, 5, 5],
            gold: [6, 6, 5, 5, 5],
            silver: [5, 5, 5, 5, 5],
            cloth: [5, 3, 3, 2, 2, 1, 1],
            spice: [5, 3, 3, 2, 2, 1, 1],
            leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
        },
        // ne pas oublier de les mélanger au début de la partie
        _bonusTokens: {
            3: shuffle([2, 1, 2, 3, 1, 2, 3]),
            4: shuffle([4, 6, 6, 4, 5, 5]),
            5: shuffle([8, 10, 9, 8, 10]),
        },
        // est-ce que la partie est terminée?
        isDone: false,
    }
    putCamelsFromHandToHerd(game)
    databaseService.saveGame(game)
    return game
}

export function removePrivateDataFromGame(game) {
    for (const key of Object.keys(game)) {
        if (key.charAt(0) === '_') {
            delete game[key];
        }
    }
    return game
}

export function listGames() {
    const list = databaseService.getGames()
    return list.map(removePrivateDataFromGame);
}

export function gameInfo(id) {
    const result = databaseService.getGames().filter(elem => elem.id === id);
    console.log(result)
    if (result.length === 0) {
        throw new Error('Value not found');
    }
    return removePrivateDataFromGame(result[0]);
}

export function deleteGame(id) {
    deleteGame(id);
}

export function takeGood(game, playerId, good) {
    const idGood = game.market.findIndex((card) => card === good)
    game._players[playerId].hand.push(game.market[idGood])
    game.market.splice(idGood, 1)
    if (game._deck.length > 0) {
        game.market.push(drawCards(game._deck, 1))
    }
}

export function cardNumber(game, playerIndex, card) {
    let count = 0
    game._players[playerIndex].hand.forEach(elem => {
        if (elem === card) {
            count++
        }
    })
    return count
}

export function sellCards(game, playerIndex, card, amount) {
    const numberInHand = cardNumber(game, playerIndex, card)
    if (amount > numberInHand) {
        throw new Error("Too few amount of cards in hand")
    }
    for (let i = 0; i < amount; i++) {
        const index = game._players[playerIndex].hand.indexOf(card)
        game._players[playerIndex].hand.splice(index, 1)
        game._players[playerIndex].tokens.push(game.tokens[card].pop)
    }
    if (amount >= 5) {
        game._players[playerIndex].tokens.push(game._bonusTokens[5].pop)
    } else if (amount >= 3) {
        game._players[playerIndex].tokens.push(game._bonusTokens[amount].pop)
    }
}