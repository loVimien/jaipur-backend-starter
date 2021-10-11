import request from "supertest"
import app from "../app"
import lodash from "lodash"
import { expectCt } from "helmet"

// Prevent database service to write tests game to filesystem
jest.mock("fs")
jest.mock("lodash")

lodash.shuffle.mockImplementation((x) => x)

// TODO: Mock lodash shuffle

describe("Game router", () => {
  test("should create a game", async () => {
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
})
