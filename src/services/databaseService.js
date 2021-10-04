const fs = require('fs')

export function readDB() {
    return JSON.parse(fs.readFileSync("src/storage/database.json"));
}

export function writeDB(dbObj) {
    fs.writeFileSync("src/storage/database.json", JSON.stringify(dbObj));
}