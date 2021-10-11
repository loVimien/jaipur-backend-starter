import fs from "fs"
import * as databaseService from "./databaseService"

jest.mock("fs")
afterEach(() => {
  jest.clearAllMocks()
})

describe("Database service", () => {
  test("should save a game in new file", () => {
    const games = databaseService.saveGame({ id: 1 })
    expect(fs.writeFileSync).toHaveBeenCalled()
    expect(games.length).toBe(1)
  })

  test("should save a game in existing file", () => {
    fs.readFileSync.mockImplementation(() => `[{"id": 1}]`)
    const games = databaseService.saveGame({ id: 2 })
    expect(fs.writeFileSync).toHaveBeenCalled()
    expect(games.length).toBe(2)
  })

  test("should update a game", () => {
    fs.readFileSync.mockImplementation(() => `[{"id": 1}]`)
    const games = databaseService.saveGame({ id: 1 })
    expect(fs.writeFileSync).toHaveBeenCalled()
    expect(games.length).toBe(1)
  })

  test("should get all games", () => {
    fs.readFileSync.mockImplementation(() => `[{"id": 1}, {"id": 1}]`)
    const games = databaseService.getGames()
    expect(games.length).toBe(2)
    expect(games[0].id).toBe(1)
  })
})
