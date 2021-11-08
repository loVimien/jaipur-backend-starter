import fs from "fs"
import path from "path"

const DATABASE_FILE = path.join(__dirname, "../../storage/database.json")

// Read the file storage/database.json and return the parsed array of games.
export function getGames() {
  try {
    const file = fs.readFileSync(DATABASE_FILE)
    return JSON.parse(file)
  } catch (e) {
    return []
  }
}

// Save a game to storage/database.json
export function saveGame(game) {
  let games = getGames()
  const gameIndex = games.findIndex((g) => g.id === game.id)
  if (gameIndex >= 0) {
    games[gameIndex] = game
  } else {
    games.push(game)
  }
  games = games.sort((val1, val2) => val1.id - val2.id)
  console.log(games)
  try {
    fs.mkdirSync(path.dirname(DATABASE_FILE))
  } catch (e) {
    // Do nothing
  }
  fs.writeFileSync(path.join(DATABASE_FILE), JSON.stringify(games))
  return games
}

export function deleteGame(id) {
  let count = 0
  const games = getGames().filter((elem) => {
    if (elem.id === id) {
      count = 1
      return false
    } else {
      return true
    }
  })
  if (count === 0) {
    throw new Error("Game not found")
  }
  try {
    fs.mkdirSync(path.dirname(DATABASE_FILE))
  } catch (e) {
    // Do nothing
  }
  fs.writeFileSync(path.join(DATABASE_FILE), JSON.stringify(games))
}
