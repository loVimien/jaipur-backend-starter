/* eslint-disable prettier/prettier */
import express from "express"
import * as gameService from "../services/gameService"
const router = express.Router()

router.post("/", (req, res) => {
    const newGame = gameService.removePrivateDataFromGame(gameService.createGame(req.body.name));
    res.status(201).json(newGame)
})

router.get("/", (req, res) => {
    res.status(200).json(gameService.listGames())
})

router.get("/:id", (req, res) => {
    try {
        res.status(200).json(gameService.gameInfo(parseInt(req.params.id)));
    } catch (e) {
        res.status(404).send("Not found");
    }
})

export default router