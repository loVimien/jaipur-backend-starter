/* eslint-disable prettier/prettier */
import request from "supertest"
import app from "../app"
import lodash from "lodash"
import * as databaseService from "../services/databaseService"
import { createGame } from "../services/gameService"


let db = []
    // Prevent database service to write tests game to filesystem
jest.mock("fs")
jest.mock("lodash")
jest.mock("../services/databaseService")

lodash.shuffle.mockImplementation(x => x)
databaseService.getGames.mockImplementation(() => db)
databaseService.saveGame.mockImplementation(x => db.push(x))
databaseService.deleteGame.mockImplementation(id => { db = db.filter(val => val.id !== id) })

// TODO: Mock lodash shuffle

describe("Game router", () => {
    test("should create a game", async() => {
        const response = await request(app).post("/games").send({ name: "test" })
        expect(response.body.isDone).toEqual(false)
        expect(typeof response.body.id).toBe("number")
        expect(response.body.market.length).toEqual(5)
        expect(response.body.tokens).toEqual({
            diamonds: [7, 7, 5, 5, 5],
            gold: [6, 6, 5, 5, 5],
            silver: [5, 5, 5, 5, 5],
            cloth: [5, 3, 3, 2, 2, 1, 1],
            spice: [5, 3, 3, 2, 2, 1, 1],
            leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
        })
    })
    test("should list games", async() => {
        const response = await request(app).get("/games")
        response.body.forEach(val => {
            expect(Object.keys(val)).toEqual(expect.arrayContaining(["id", "name", "market", "tokens", "isDone", "currentPlayerIndex"]))
        })
    })
    test("should get game info", async() => {
        db = []
        createGame("test")
        const response = await request(app).get("/games/0")
        expect(response.statusCode).toEqual(200)
        expect(response.body.id).toEqual(0)
        expect(response.body.name).toEqual("test")
        db = []
        const response2 = await request(app).get("/games/0")
        expect(response2.statusCode).toEqual(404)
    })
    test("should remove a game", async() => {
        await request(app).post("/games");
        console.log(databaseService.getGames())
        const resp = await request(app).get("/games");
        const id = resp.body[0].id
        const resp2 = await request(app).delete(`/games/${id}`)
        console.log(databaseService.getGames())
        expect(resp2.statusCode).toEqual(200)
        const resp3 = await request(app).get(`/games/${id}`)
        expect(resp3.statusCode).toEqual(404)
    })
})