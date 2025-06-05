import Promise from "../../PromiseV2"
import request from "../../requestV2"
import { BufferedImage, Color, ImageIO, bcData } from "./Utils"

/**
 * Gets a player's mojang info containing their username, uuid and other related information. Returns null if there is an error.
 * @param {String} player - UUID or Username of the player.
 * @returns 
 */
export const getMojangInfo = (player) => {
    // Using UUID
    if (player.length > 16) return request({
        url: `https://sessionserver.mojang.com/session/minecraft/profile/${player}`,
        json: true}
    ).then(resp => {
        resp.success = true

        return resp
    }).catch(e => {
        const { path, errorMessage } = e

        return {
            success: false,
            reason: errorMessage,
            path,
        }
    })

    // Using Username
    return request({
        url: `https://api.mojang.com/users/profiles/minecraft/${player}`,
        json: true}
    ).then(resp => {
        resp.success = true

        return resp

    }).catch(e => {
        const { path, errorMessage } = e

        return {
            success: false,
            reason: errorMessage,
            path,
        }
    })
}
/**
 * Gets a player's data via hypixel API's /player method. Returns null if there is an error.
 * @param {String} uuid 
 * @param {String} apiKey 
 * @returns
 */
export const getHypixelPlayer = (uuid, apiKey) => request({url: `https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`, json: true}).catch(e => null)
/**
 * Gets a player's Skyblock profiles via the /skyblock/profiles method. Returns null if there is an error.
 * @param {String} uuid 
 * @param {String} apiKey 
 * @returns
 */
export const getSbProfiles = (uuid, apiKey) => request({url: `https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`, json: true}).catch(e => null)
/**
 * @deprecated Gets a player's name history via mojang's user/profiles api. Returns a promise containing an array of objects of previous usernames.
 * @param {String} uuid 
 * @returns 
 */
export const getNameHistory = (uuid) => request({url: `https://api.mojang.com/user/profiles/${uuid}/names`, json: true}).catch(e => null)

/**
 * Gets the player's most recent Skyblock profile based off the last_save.
 * @param {String} uuid - UUID of the player who's profile you want to get.
 * @param {Object} profiles - The object returned from the /skyblock/profiles method. If not given then an API request will be made to get this data.
 * @param {String} apiKey - If profiles is not given, then the API key will be used to get the player's profiles and return the most recent one.
 * @returns 
 */
export const getRecentProfile = (uuid, profiles=null, apiKey=null) => {
    uuid = uuid.replace(/-/g, "")
    const getRecent = (profiles) => !profiles.profiles || !profiles.profiles.length ? null : profiles.profiles.find(a => a.selected) ?? profiles[0]
    if (profiles) return getRecent(profiles)
    return getSbProfiles(uuid, apiKey).then(profiles => getRecent(profiles)).catch(e => null)
}

/**
 * Gets a Skyblock profile using the profile ID
 * @param {String} profileID 
 * @param {String} apiKey 
 * @returns 
 */
export const getProfileByID = (profileID, apiKey=null) => {
    return request({url: `https://api.hypixel.net/skyblock/profile?key=${apiKey}&profile=${profileID}`, json: true}).then(p => p.profile).catch(e => null)
}

/**
 * Gets a player's guild stats. Returns an object containing data about the player's guild including tag, members, guild experience etc.
 * @param {String} player - The UUID or Username of the player. 
 * @returns 
 */
export const getGuildInfo = (player) => request(`https://api.slothpixel.me/api/guilds/${player}`).then(a => JSON.parse(a)).catch(e => null)

/**
 * @deprecated Returns an object containing data on the API key from Hypixel's /key method.
 * @param {String} apiKey 
 * @returns 
 */
export const getApiKeyInfo = (apiKey) => request(`https://api.hypixel.net/key?key=${apiKey}`).then(a => JSON.parse(a)).catch(e => null)

/**
 * Gets the election data for Skyblock.
 * @returns 
 */
export const getElectonData = () => request(`https://api.hypixel.net/resources/skyblock/election`).then(a => JSON.parse(a)).catch(e => null)


const setBlackBG = (image) => {
    image = image.getScaledInstance(8, 8, java.awt.Image.SCALE_SMOOTH)
    let img = new BufferedImage(10, 10, BufferedImage.TYPE_INT_ARGB)
    let g = img.getGraphics()
    g.setPaint(new Color(0, 0, 0, 1))
    g.fillRect(0, 0, img.getWidth(), img.getHeight())
    g.drawImage(image, 1, 1, null)
    return img
}

const getHeadFromAPI = (uuid, border, both) => {
    let img = null
    try {
        img = ImageIO.read(new java.net.URL(`https://crafatar.com/avatars/${uuid}?overlay`)).getScaledInstance(8, 8, java.awt.Image.SCALE_SMOOTH)
    }
    catch(e) {
        return null
    }

    if (!img) {
        return null
    }

    img.getWidth()
    img = img.getBufferedImage()
    let normal = new Image(img)
    let bordered = new Image(setBlackBG(img))

    if (both) return [normal, bordered]
    if (border) return bordered
    else return normal
}

/**
 * Returns a promise containing the player's head texture. If both = true then
 * an array containing the normal head and the borered version will be returned.
 * @param {String} player - The username of the player (Case Sensitive) 
 * @param {Boolean} border - Return the image with a black border 
 * @param {Boolean} both - Return an array containing the normal image and the bordered image. 
 */
 export const getHead = (player, border, both=false, uuid=null) => new Promise((resolve) => {
    
    if (uuid) resolve(getHeadFromAPI(uuid, border, both))
    
    getPlayerUUID(player).then(uuid => {
        resolve(getHeadFromAPI(uuid, border, both))
    }).catch(e => {
        resolve(null)
    })
})

const cachedUUIDs = {} // {player: {uuid: UUID, name: Username, updated: TIMESTAMP, promise: Promise}}

export const getPlayerUUID = (player) => {
    const nameLower = player.toLowerCase()

    if (nameLower == Player.getName().toLowerCase()) {
        return new Promise((resolve) => resolve(Player.getUUID().replace(/-/g, "")))
    }


    if (nameLower in cachedUUIDs) {
        if (cachedUUIDs[nameLower].promise) {
            // ChatLib.chat(`&c[UUID]&r PROMISe for uuid! ! ! `)
            return cachedUUIDs[nameLower].promise
        }

        if (cachedUUIDs[nameLower].uuid) {
            // ChatLib.chat(`&c[UUID]&r &aReturning cached UUID for ${player}`)
            return new Promise((resolve) => resolve(cachedUUIDs[player.toLowerCase()].uuid))
        }
    }
    
    // ChatLib.chat(`&c[UUID]&r Making UUID request for ${player}`)
    const promise = getMojangInfo(player)

    cachedUUIDs[nameLower] = {
        uuid: null,
        name: null,
        updated: null,
        promise
    }

    return promise.then(mojangInfo => {
        cachedUUIDs[nameLower].promise = null

        if (!mojangInfo.success) {
            return null
        }

        const { id, name } = mojangInfo
        // ChatLib.chat(`&c[UUID]&r Set cached uuid for ${player}: ${id}`)

        cachedUUIDs[nameLower].uuid = id
        cachedUUIDs[nameLower].name = name
        cachedUUIDs[nameLower].updated = Date.now()

        
        // ChatLib.chat(`&c[UUID]&r &eRequesting new UUID data for ${player}`)

        return id.trim()
    })
}

const cachedPlayerEndpointData = {} // {UUID: {data: ENDPOINT_DATA, updated: TIMESTAMP, promise: Promise}} This endpoint is cached for a minute

export const getHypixelPlayerV2 = (uuid, key=null) => {

    // Cached data
    if (uuid in cachedPlayerEndpointData && uuid !== Player.getUUID().replace(/-/g, "")) {
        if (cachedPlayerEndpointData[uuid].promise) {
            // ChatLib.chat(`&5[PLAYER INFO]&r Returning le promise!`)
            return cachedPlayerEndpointData[uuid].promise
        }
        // Cache it for a minute
        if (Date.now() - cachedPlayerEndpointData[uuid].updated < 60_000) {
            // ChatLib.chat(`&5[PLAYER INFO]&r &2Using cached player data for ${uuid} ${Date.now() - cachedPlayerEndpointData[uuid].updated}`)
            return new Promise((resolve) => resolve(cachedPlayerEndpointData[uuid].data))
        }
    }

    // ChatLib.chat(`&5[PLAYER INFO]&r Making request for ${uuid}`)
    const promise = new Promise((resolve, reject) => {
        request({
            url: `https://api.hypixel.net/v2/player?key=${key ?? bcData.apiKey}&uuid=${uuid}`,
            json: true
        }).then(resp => {
            if (!resp.success) {
                
            }
            // Update cached data
            cachedPlayerEndpointData[uuid].data = resp
            cachedPlayerEndpointData[uuid].promise = null
    
            if (resp.success) {
                // ChatLib.chat(`&5[PLAYER INFO]&r &2Caching ${uuid} PLAYER DATA`)
                cachedPlayerEndpointData[uuid].updated = Date.now()
            }
    
            // ChatLib.chat(`&5[PLAYER INFO]&r &6Returning new player data for ${uuid}`)
            resolve(resp)
        }).catch(e => {
            cachedPlayerEndpointData[uuid].promise = null
            reject(e)
        })
    })

    // Initialize the cached data
    cachedPlayerEndpointData[uuid] = {
        data: null,
        updated: null,
        promise: promise
    }

    return promise
}
export const getSkyblockProfilesV2 = (uuid, key=null) => request({url: `https://api.hypixel.net/v2/skyblock/profiles?key=${key ?? bcData.apiKey}&uuid=${uuid}`, json: true})
export const getElectionDataV2 = () => request({url: `https://api.hypixel.net/v2/resources/skyblock/election`, json: true})

export const getSelectedProfileV2 = (uuid, key=null) => {
    return getSkyblockProfilesV2(uuid, key).then(profileData => profileData.profiles.find(a => a.selected))
}

// Load cached data

if (FileLib.exists("BloomCore", "data/uuids.json")) {
    let uuidJson = {}

    try {
        uuidJson = JSON.parse(FileLib.read("BloomCore", "data/uuids.json"))
        
        Object.entries(uuidJson).forEach(([player, info]) => {
            if (!info || !player) return
    
            const { uuid, name, updated } = info
    
            if (Date.now() - updated > 6.048e8 || !uuid || !name) return // Cache for 7 Days
    
            cachedUUIDs[player] = {
                uuid,
                name,
                updated,
            }
        })
    }
    catch(e) {
        uuidJson = {}
    }
}

// Probably don't need this
// if (FileLib.exists("BloomCore", "data/cachedHypixelEndpoint.json")) {
//     const playerEndpointData = JSON.parse(FileLib.read("BloomCore", "data/cachedHypixelEndpoint.json"))

//     Object.entries(playerEndpointData).forEach(([uuid, info]) => {
//         const { data, updated } = info

//         if (Date.now() - updated > 120_000) return

//         cachedPlayerEndpointData&c[uuid]&r = {
//             data,
//             updated
//         }
//     })
// }

register("gameUnload", () => {
    const uuidsToWrite = Object.entries(cachedUUIDs).reduce((a, [nameLower, info]) => {
        const { uuid, name, updated } = info

        if (!uuid || !name) return a

        a[nameLower] = {
            uuid,
            name,
            updated
        }

        return a
    }, {})

    FileLib.write("BloomCore", "data/uuids.json", JSON.stringify(uuidsToWrite, null, 4))
    // FileLib.write("BloomCore", "data/cachedHypixelEndpoint.json", JSON.stringify(cachedPlayerEndpointData))

    // ChatLib.chat(`Wrote ${Object.keys(cachedPlayerEndpointData).length} player data`)
    // ChatLib.chat(`Wrote ${Object.keys(uuidsToWrite).length} UUIDs`)
})