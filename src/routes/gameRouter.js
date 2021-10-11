import express from "express"
import { createGame } from "../services/gameService"
const router = express.Router()

router.post("/", (req, res) => {
  const newGame = createGame(req.body.name)
  res.status(201).json(newGame)
})

export default router
