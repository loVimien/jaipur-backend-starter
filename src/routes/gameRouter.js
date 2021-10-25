import express from "express"
import { createGame, listGames } from "../services/gameService"
import * as databaseService from "../services/databaseService"
import * as gameService from "../services/gameService"
const router = express.Router()

router.post("/", (req, res) => {
  const newGame = createGame(req.body.name)
  res.status(201).json(newGame)
})

router.get("/", (req, res) => {
  res.status(200).json(listGames())
})

export default router

router.put("/games/:id/take-good", function (req, res) {
  /* Return 200 if player can take good
    400 if he has 7 cards or if it's not his turn
    404 if the game id doesn't exist or good not found
  */
  const games = databaseService.getGames()
  const currGame = games.find((game) => game.id === req.params.id)
  if (currGame) {
    if (currGame.currentPlayerIndex === req.body.playerIndex) {
      if (currGame._players[req.body.playerIndex].hand.length < 8) {
        if (
          currGame.market.findIndex((card) => card === req.body.takeGoodPayload)
        ) {
          gameService.takeGood(
            currGame,
            req.body.playerIndex,
            req.body.takeGoodPayload
          )
        } else {
          req.status(404).send("Good not found")
        }
      } else {
        req.status(400).send("The hand's size can't exceed 7 cards")
      }
    } else {
      res.status(400).send("It's not this player's turn")
    }
  } else {
    res.status(404).send("Invalid game id")
  }
  res.status(200).json(gameService.takeGood)
})
