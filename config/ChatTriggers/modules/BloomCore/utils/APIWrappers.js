import Promise from "../../PromiseV2"
import request from "../../requestV2"
import { BufferedImage, Color, ImageIO, bcData, getApiKey } from "./Utils"

/**
 * Gets a player's mojang info containing their username, uuid and other related information. Returns null if there is an error.
 * @param {String} player - UUID or Username of the player.
 * @returns 
 */
export const getMojangInfo = (player) => {
    if (player.length > 16) return request({url: `https://sessionserver.mojang.com/session/minecraft/profile/${player}`, json: true}).catch(e => null)
    return request({url: `https://api.mojang.com/users/profiles/minecraft/${player}`, json: true}).catch(e => null)
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
    let img = ImageIO.read(new java.net.URL(`https://crafatar.com/avatars/${uuid}?overlay`)).getScaledInstance(8, 8, java.awt.Image.SCALE_SMOOTH)
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
        
    getMojangInfo(player).then(mojangInfo => {
        let uuid = mojangInfo.id
        if (!uuid) resolve(null)
        resolve(getHeadFromAPI(uuid, border, both))
    })
})

const cachedUUIDs = {} // {PLAYER: {uuid: UUID, updated: TIMESTAMP}}

export const getPlayerUUID = (player) => {
    // Little optimization
    if (player == Player.getName()) return new Promise((resolve) => resolve(Player.getUUID().replace(/-/g, "")))
    if (player.toLowerCase() in cachedUUIDs) {
        // ChatLib.chat(`&aReturning cached UUID for ${player}`)
        return new Promise((resolve) => resolve(cachedUUIDs[player.toLowerCase()].uuid))
    }

    return request({
        url: `https://api.mojang.com/users/profiles/minecraft/${player}`,
        json: true
    }).then(mojangInfo => {
        const { id, name } = mojangInfo
        // ChatLib.chat(`Set cached uuid for ${player}: ${uuid}`)
        cachedUUIDs[name.toLowerCase()] = {
            uuid: id,
            name,
            updated: Date.now()
        }
        
        // ChatLib.chat(`&eRequesting new UUID data for ${player}`)
        return id
    })
}

const cachedPlayerEndpointData = {} // {UUID: {data: ENDPOINT_DATA, updated: TIMESTAMP}} This endpoint is cached for a minute

export const getHypixelPlayerV2 = (uuid, key=null) => {
    // Cached data
    if (uuid in cachedPlayerEndpointData && Date.now() - cachedPlayerEndpointData[uuid].updated < 120_000 && uuid !== Player.getUUID().replace(/-/g, "")) {
        // ChatLib.chat(`&2Using cached player data for ${uuid} ${Date.now() - cachedPlayerEndpointData[uuid].updated}`)
        return new Promise((resolve) => resolve(cachedPlayerEndpointData[uuid].data))
    }

    return request({
        url: `https://api.hypixel.net/v2/player?key=${key ?? bcData.apiKey}&uuid=${uuid}`,
        json: true
    }).then(resp => {
        if (resp.success) {
            // ChatLib.chat(`&2Cached ${uuid} PLAYER DATA`)
            cachedPlayerEndpointData[uuid] = {
                data: resp,
                updated: Date.now()
            }
        }

        // ChatLib.chat(`&6Returning new player data for ${uuid}`)
        return resp
    })
}
export const getSkyblockProfilesV2 = (uuid, key=null) => request({url: `https://api.hypixel.net/v2/skyblock/profiles?key=${key ?? bcData.apiKey}&uuid=${uuid}`, json: true})
export const getElectionDataV2 = () => request({url: `https://api.hypixel.net/v2/resources/skyblock/election`, json: true})

export const getSelectedProfileV2 = (uuid, key=null) => {
    return getSkyblockProfilesV2(uuid, key).then(profileData => profileData.profiles.find(a => a.selected))
}

// Load cached data

if (FileLib.exists("BloomCore", "data/uuids.json")) {
    const uuidJson = JSON.parse(FileLib.read("BloomCore", "data/uuids.json"))

    Object.entries(uuidJson).forEach(([player, info]) => {
        const { uuid, updated } = info

        if (Date.now() - updated > 6.048e8) return // 7 Days

        cachedUUIDs[player] = {
            uuid,
            updated
        }
    })

}

if (FileLib.exists("BloomCore", "data/cachedHypixelEndpoint.json")) {
    const playerEndpointData = JSON.parse(FileLib.read("BloomCore", "data/cachedHypixelEndpoint.json"))

    Object.entries(playerEndpointData).forEach(([uuid, info]) => {
        const { data, updated } = info

        if (Date.now() - updated > 120_000) return

        cachedPlayerEndpointData[uuid] = {
            data,
            updated
        }
    })
}

register("gameUnload", () => {
    FileLib.write("BloomCore", "data/uuids.json", JSON.stringify(cachedUUIDs, null, 4))
    FileLib.write("BloomCore", "data/cachedHypixelEndpoint.json", JSON.stringify(cachedPlayerEndpointData))

    // ChatLib.chat(`Wrote ${Object.keys(cachedPlayerEndpointData).length} player data`)
    // ChatLib.chat(`Wrote ${Object.keys(cachedUUIDs).length} UUIDs`)
})