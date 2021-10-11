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

// Create a game object
export function createGame(name) {
  const gameList = databaseService.getGames()
  const deck = initDeck()
  const handP1 = drawCards(deck, 5)
  const handP2 = drawCards(deck, 5)
  let market = ["camel", "camel", "camel"]
  market = market.concat(drawCards(deck, 2))
  const game = {
    id: gameList.length,
    name: name,
    _deck: deck,
    market: market,
    _players: [
      {
        hand: handP1,
        camelsCount: 0,
        score: 0,
      },
      {
        hand: handP2,
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
  const response = {
    curentPlayerIndex: game.curentPlayerIndex,
    isDone: game.isDone,
    id: game.id,
    market: game.market,
    tokens: game.tokens,
  }
  return response
}
