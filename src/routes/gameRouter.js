import express from "express"
import { createGame, listGames } from "../services/gameService"
const router = express.Router()

router.post("/", (req, res) => {
  const newGame = createGame(req.body.name)
  res.status(201).json(newGame)
})

router.get("/", (req, res) => {
  res.status(200).json(listGames())
})

export default router
