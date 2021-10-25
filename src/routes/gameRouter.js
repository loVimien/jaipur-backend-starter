/* eslint-disable prettier/prettier */
import express from "express"
import { createGame, gameInfo, listGames } from "../services/gameService"
const router = express.Router()

router.post("/", (req, res) => {
    const newGame = createGame(req.body.name)
    res.status(201).json(newGame)
})

router.get("/", (req, res) => {
    res.status(200).json(listGames())
})

router.get("/:id", (req, res) => {
    try {
        res.status(200).json(gameInfo(parseInt(req.params.id)));
    } catch (e) {
        res.status(404).send("Not found");
    }
})

export default router