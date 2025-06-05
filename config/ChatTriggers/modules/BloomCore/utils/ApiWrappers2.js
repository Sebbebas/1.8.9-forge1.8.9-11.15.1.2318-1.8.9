import request from "../../requestV2"
import { bcData } from "./Utils"

const cleanUUID = (uuid) => {
    return uuid.replace(/-/g, "")
}

const hypixelPlayerFuncs = {} // {uuid: [func, func, ...]}
const cachedHypixelPlayers = {} // {uuid: {updated: TIMESTAMP, data: {...}}}

/**
 * @callback HypixelPlayerCallback
 * @param {object} object
 * @param {boolean} object.success - Whether the API request succeeded or not
 * @param {object} object.data - The player data
 * @param {string} object.reason- Why the request failed
*/

const resolveList = (list, resp) => {
    for (let i = 0; i < list.length; i++) {
        let resolvFunc = list[i]

        resolvFunc(resp)
    }
}

/**
 * Fetches the player info from the v2/player Hypixel endpoint using the API currently set API key in /bcore setkey <key>
 * Does not use promises, but runs the given function once the API request has finished being fetched.
 * @param {string} uuid 
 * @param {HypixelPlayerCallback} func 
 * @returns 
*/
export const getHypixelPlayer = (uuid, func) => {
    if (!bcData.apiKey) {
        func({
            success: false,
            data: [],
            reason: "No API key."
        })

        return
    }

    if (!uuid) {
        func({
            success: false,
            data: [],
            reason: "No UUID provided."
        })
        
        return
    }

    uuid = cleanUUID(uuid)

    if (uuid in cachedHypixelPlayers && Date.now() - cachedHypixelPlayers[uuid].updated < 60_000) {
        func({
            success: true,
            data: cachedHypixelPlayers[uuid].data,
            reason: ""
        })
        
        return
    } 

    if (!(uuid in hypixelPlayerFuncs)) {
        hypixelPlayerFuncs[uuid] = []
    }

    hypixelPlayerFuncs[uuid].push(func)

    // Request is already being made
    if (hypixelPlayerFuncs[uuid].length > 1) {
        return
    }

    request({
        url: `https://api.hypixel.net/v2/player?key=${bcData.apiKey}&uuid=${uuid}`,
        json: true
    }).then(resp => {
        resolveList(hypixelPlayerFuncs[uuid], {
            success: true,
            data: resp,
            reason: ""
        })

        delete hypixelPlayerFuncs[uuid]

        if (uuid == cleanUUID(Player.getUUID())) {
            return
        }

        // Cache the data
        cachedHypixelPlayers[uuid] = {
            updated: Date.now(),
            data: resp
        }
    }).catch(error => {
        let errorStr = JSON.stringify(error)
        if ("cause" in error) {
            errorStr = error.cause
        }

        resolveList(hypixelPlayerFuncs[uuid], {
            success: false,
            data: [],
            reason: errorStr
        })

        delete hypixelPlayerFuncs[uuid]
    })

    // Remove old cached data
    Object.entries(cachedHypixelPlayers).forEach(([uuid, entry]) => {
        if (Date.now() - entry.updated > 60_000) {

            delete cachedHypixelPlayers[uuid]
        }
    })
}

/**
 * @callback BatchRequestCallback
 * @param {object} object
 * @param {boolean} object.success - Whether or not the data was all fetched successfully
 * @param {object[]} object.data - A list of the fetched API endpoint data
 * @param {string} object.reason - The reason for failiure (If any)
*/

/**
 * 
 * @param {string[]} uuids 
 * @param {BatchRequestCallback} func 
 */
export const getHypixelPlayerBatch = (uuids, func) => {
    const final = new Array(uuids.length).fill(null)

    for (let i = 0; i < uuids.length; i++) {
        let num = i
        let uuid = uuids[i]

        getHypixelPlayer(uuid, resp => {
            const { success, data, reason } = resp
            if (!success) {
                func({
                    success: false,
                    data: [],
                    reason: reason
                })

                return
            }

            final[num] = data

            if (final.includes(null)) {
                return
            }

            func({
                success: true,
                data: final,
                reason: ""
            })
        })
    }
}

const uuidFuncs = {} // {name: [func, func, ...]}
const cachedUUIDs = {} // {name: {uuid: uuid, username: username}, ...}

/**
 * @callback UUIDRequestFunc
 * @param {object} object
 * @param {boolean} object.success - Whether or not the request succeeded
 * @param {string} object.uuid - The UUID of the player
 * @param {string} object.username - The username of the player
 * @param {string} object.reason - The reason why the request failed
*/

const resolveUUIDRequests = (playerName, data) => {
    for (let i = 0; i < uuidFuncs[playerName].length; i++) {
        let func = uuidFuncs[playerName][i]

        func(data)
    }
}

/**
 * 
 * @param {string} playerName 
 * @param {UUIDRequestFunc} func 
 * @returns 
 */
export const requestPlayerUUID = (playerName, func) => {
    const nameLower = playerName.toLowerCase()

    if (nameLower in cachedUUIDs) {
        func({
            success: true,
            uuid: cachedUUIDs[nameLower].uuid,
            username: cachedUUIDs[nameLower].username,
            reason: ""
        })

        return
    }

    if (!(nameLower in uuidFuncs)) {
        uuidFuncs[nameLower] = []
    }

    uuidFuncs[nameLower].push(func)

    if (uuidFuncs[nameLower].length > 1) {
        return
    }

    request({
        url: `https://api.mojang.com/users/profiles/minecraft/${nameLower}`,
        json: true
    }).then((resp) => {
        

        resolveUUIDRequests(nameLower, {
            success: true,
            uuid: resp.id,
            username: resp.name,
            reason: ""
        })

        cachedUUIDs[nameLower] = {
            uuid: resp.id,
            username: resp.name
        }

        delete uuidFuncs[nameLower]
    }).catch(e => {
        let errorStr = e
        if (typeof(e) == "object") {
            if ("errorMessage" in e) {
                errorStr = e.errorMessage
            }
            else {
                errorStr = JSON.stringify(e)
            }
        }

        resolveUUIDRequests(nameLower, {
            success: false,
            uuid: null,
            username: null,
            reason: errorStr
        })

        delete uuidFuncs[nameLower]
    })
}

/**
 * 
 * @param {string[]} players 
 * @param {BatchRequestCallback} func 
 */
export const requestPlayerUUIDBatch = (players, func) => {
    const responses = new Array(players.length).fill(null)

    for (let i = 0; i < players.length; i++) {
        let player = players[i]
        let num = i

        requestPlayerUUID(player, (resp) => {
            let { success, uuid, username, reason } = resp

            if (!success) {
                func({
                    success,
                    data: [],
                    reason
                })

                return
            }

            responses[num] = {
                uuid,
                username
            }

            if (responses.includes(null)) {
                return
            }


            func({
                success,
                data: responses,
                reason
            })
        })
    }
}