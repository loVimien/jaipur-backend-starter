/* eslint-disable prettier/prettier */
import * as gameService from "./gameService"

// Prevent database service to write tests game to filesystem
jest.mock("fs")

// TODO: Mock lodash shuffle

describe("Game service", () => {
    test("should init a deck", () => {
        const deck = gameService.initDeck()
        let diamonds = 0
        let gold = 0
        let silver = 0
        let cloth = 0
        let spices = 0
        let leather = 0
        let camel = 0
        for (const card of deck) {
            if (card === "diamants") {
                diamonds++
            } else if (card === "or") {
                gold++
            } else if (card === "argent") {
                silver++
            } else if (card === "tissus") {
                cloth++
            } else if (card === "épices") {
                spices++
            } else if (card === "cuir") {
                leather++
            } else {
                camel++
            }
        }
        expect(deck.length).toEqual(52)
        expect(diamonds).toEqual(6)
        expect(gold).toEqual(6)
        expect(silver).toEqual(6)
        expect(cloth).toEqual(8)
        expect(spices).toEqual(8)
        expect(leather).toEqual(10)
        expect(camel).toEqual(8)
    })

    test("should draw cards", () => {
        let deck = gameService.initDeck()
        const cards1 = gameService.drawCards(deck)
        expect(cards1.length).toEqual(1)
        expect(deck.length).toEqual(51)
        const cards2 = gameService.drawCards(deck, 3)
        expect(cards2.length).toEqual(3)
        expect(deck.length).toEqual(48)
        deck = []
        const cards3 = gameService.drawCards(deck)
        expect(cards3.length).toEqual(0)
        expect(deck.length).toEqual(0)
    })

    test("should put camels from hands to herd", () => {
        const game = {
            _players: [
                { hand: ["camel", "gold"], camelsCount: 0 },
                { hand: ["gold", "gold"], camelsCount: 0 },
            ],
        }
        gameService.putCamelsFromHandToHerd(game)
        expect(game._players[0].hand.length).toEqual(1)
        expect(game._players[1].hand.length).toEqual(2)
        expect(game._players[0].camelsCount).toEqual(1)
        expect(game._players[1].camelsCount).toEqual(0)
    })
    test("should remove private data from game", () => {
        const game = gameService.removePrivateDataFromGame(gameService.createGame())
        console.log(Object.keys(game))
        expect(Object.keys(game)).toEqual(expect.arrayContaining(["id", "name", "market", "tokens", "isDone", "currentPlayerIndex"]))
        expect(Object.keys(game)).toEqual(expect.not.arrayContaining(["_deck", "_players", "_bonusTokens"]))
    })
    test("should take a good from market to hand", () => {
        const game = {
          market: ["camel", "gold", "gold", "spice", "leather"],
          _players: [
            { hand: ["camel", "gold"], camelsCount: 0 },
            { hand: ["gold", "gold"], camelsCount: 0 },
          ],
          _deck: ["camel", "leather", "leather"],
        }
        gameService.takeGood(game, 0, "gold")
        expect(game._players[0].hand.length).toEqual(3)
        expect(game._players[1].hand.length).toEqual(2)
        expect(game._deck.length).toEqual(2)
        expect(game.market.length).toEqual(5)
      })
    
})
  

