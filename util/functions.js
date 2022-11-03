import fs from "fs"

export const getTimestampInMilliseconds = () => {
    return Math.floor(Date.now())
}

export const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=> f.endsWith(ending))
}

export function interpretEmoji(s) {
    return eval("(function(){ return '" + s + "'})()");
}
