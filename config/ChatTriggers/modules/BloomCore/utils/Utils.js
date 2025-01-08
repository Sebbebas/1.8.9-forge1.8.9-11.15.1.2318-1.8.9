import { maxLevels, normalSkill } from "../skills/normal"
import { catacombs, cataSkills } from "../skills/catacombs"
import { runecrafting } from "../skills/runecrafting"
import PogObject from "../../PogData"
import { slayerLevelling } from "../skills/slayer"
import Vector3 from "./Vector3"
import { onScoreboardLine } from "./Events"

export const prefix = "&8[&bBloomCore&8]&r"
export const C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition")
export const C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook")
export const C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement")
export const C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook")
export const S22PacketMultiBlockChange = Java.type("net.minecraft.network.play.server.S22PacketMultiBlockChange")
export const S38PacketPlayerListItem = Java.type("net.minecraft.network.play.server.S38PacketPlayerListItem")
export const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")
export const S23PacketBlockChange = Java.type("net.minecraft.network.play.server.S23PacketBlockChange")
export const S30PacketWindowItems = Java.type("net.minecraft.network.play.server.S30PacketWindowItems")
export const C01PacketChatMessage = Java.type("net.minecraft.network.play.client.C01PacketChatMessage")
export const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow")
export const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow")
export const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow")
export const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
export const C02PacketUseEntity = Java.type("net.minecraft.network.play.client.C02PacketUseEntity")
export const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
export const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
export const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
export const S3EPacketTeams = Java.type("net.minecraft.network.play.server.S3EPacketTeams")
export const S34PacketMaps = Java.type("net.minecraft.network.play.server.S34PacketMaps")
export const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
export const MovingObjectPosition = Java.type("net.minecraft.util.MovingObjectPosition")
export const GuiContainer = Java.type("net.minecraft.client.gui.inventory.GuiContainer")
export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityEnderman = Java.type("net.minecraft.entity.monster.EntityEnderman")
export const EntityItemFrame = Java.type("net.minecraft.entity.item.EntityItemFrame")
export const EntityCreeper = Java.type("net.minecraft.entity.monster.EntityCreeper")
export const TileEntityChest = Java.type("net.minecraft.tileentity.TileEntityChest")
export const TileEntitySkull = Java.type("net.minecraft.tileentity.TileEntitySkull")
const CompressedStreamTools = Java.type("net.minecraft.nbt.CompressedStreamTools")
export const EntityZombie = Java.type("net.minecraft.entity.monster.EntityZombie")
export const ContainerChest = Java.type("net.minecraft.inventory.ContainerChest")
export const MouseEvent = Java.type("net.minecraftforge.client.event.MouseEvent")
export const EntityBlaze = Java.type("net.minecraft.entity.monster.EntityBlaze")
export const Enchantment = Java.type("net.minecraft.enchantment.Enchantment")
export const EntityItem = Java.type("net.minecraft.entity.item.EntityItem")
export const MapData = Java.type("net.minecraft.world.storage.MapData")
export const NBTTagString = Java.type("net.minecraft.nbt.NBTTagString")
const ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream")
export const BufferedImage = Java.type("java.awt.image.BufferedImage")
export const MovingObjectType = MovingObjectPosition.MovingObjectType
export const MCItemStack = Java.type("net.minecraft.item.ItemStack")
export const MCBlockPos = Java.type("net.minecraft.util.BlockPos")
export const BlockPoss = Java.type("net.minecraft.util.BlockPos")
export const MCEntity = Java.type("net.minecraft.entity.Entity")
export const MCBlock = Java.type("net.minecraft.block.Block")
export const Blockk = Java.type("net.minecraft.block.Block")
export const Blocks = Java.type("net.minecraft.init.Blocks")
export const ImageIO = Java.type("javax.imageio.ImageIO")
export const Vec3 = Java.type("net.minecraft.util.Vec3")
export const Color = Java.type("java.awt.Color")
export const File = Java.type("java.io.File")
const Base64 = Java.type("java.util.Base64")

export const colors = ["&a", "&b", "&c", "&d", "&e", "&f", "&0", "&1", "&2", "&3", "&4", "&5", "&6", "&7", "&8", "&9"]
export const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const alphabet = "abcdefghijklmnopqrstuvwxyz"
export const numerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
export const floorSecrets = {
    "F1": 0.3,
    "F2": 0.4,
    "F3": 0.5,
    "F4": 0.6,
    "F5": 0.7,
    "F6": 0.85
}
export const milestones = ["?", "❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾"]
export const entryMessages = [
    "[BOSS] Bonzo: Gratz for making it this far, but I'm basically unbeatable.",
    "[BOSS] Scarf: This is where the journey ends for you, Adventurers.",
    "[BOSS] The Professor: I was burdened with terrible news recently...",
    "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!",
    "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.",
    "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!",
    "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"
]

export const entryRegexes = [
    /^\[BOSS\] Bonzo: Gratz for making it this far, but I'm basically unbeatable\.$/,
    /^\[BOSS\] Scarf: This is where the journey ends for you, Adventurers\.$/,
    /^\[BOSS\] The Professor: I was burdened with terrible news recently\.\.\.$/,
    /^\[BOSS\] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!$/,
    /^\[BOSS\] Livid: Welcome, you've arrived right on time\. I am Livid, the Master of Shadows\.$/,
    /^\[BOSS\] Sadan: So you made it all the way here\.\.\. Now you wish to defy me\? Sadan\?!$/,
    /^\[BOSS\] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!$/
]

export const colorDictionary = {
	"BLACK": "&0",
	"DARK_BLUE": "&1",
	"DARK_GREEN": "&2",
	"DARK_AQUA": "&3",
	"DARK_RED": "&4",
	"DARK_PURPLE": "&5",
	"GOLD": "&6",
	"GRAY": "&7",
	"DARK_GRAY": "&8",
	"BLUE": "&9",
	"GREEN": "&a",
	"AQUA": "&b",
	"RED": "&c",
	"LIGHT_PURPLE": "&d",
	"YELLOW": "&e",
	"WHITE": "&f"
}

const numeralValues = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
}

export let bcData = new PogObject("BloomCore", {
    apiKey: null,
    debugDungeon: false,
    forceInDungeon: false,
    debugSkyblock: false,
    forceInSkyblock: false,
    debugMyPlayer: false,
    priceUtilsLastUpdated: null,
    forcePaul: false,
}, "data.json")

export const rooms = JSON.parse(FileLib.read("BloomCore", "dungeons/rooms.json"))

// Generate a random whole number from min to max
export const randint = (min, max) => Math.floor(Math.random()*(max-min+1)+min)
const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
// Generate a string "length" characters long filled with random characters
export const getRandomString = (length) => Array.from(Array(length).keys()).reduce((a, b) => a += possibleChars[randint(0, possibleChars.length)], "")
// Shuffles an array
export const shuffle = (array) => array.map(a => [a, Math.random()]).sort((a, b) => a[1] - b[1]).map(a => a[0])
// Returns true if number is between min and max
export const isBetween = (number, min, max) => (number - min) * (number - max) <= 0
// Removes the rank from the beginning of a player's name. (No formatting) eg "[MVP++] UnclaimedBloom6" -> "UnclaimedBloom6"
export const stripRank = (rankedPlayer) => rankedPlayer.replace(/\[[\w+\+-]+] /, "").trim()
// Returns the distance between two sets of 3D coordinates
export const getDistance3D = (x1, y1, z1, x2, y2, z2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2)
// Returns the distance between two sets of 2D coordinates
export const getDistance2D = (x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2)
// Upper cases the first letter of each word. Eg "hello world" -> "Hello World"
export const title = (text) => text.split(" ").map(a => a[0].toUpperCase() + a.slice(1)).join(" ")
// Short for 'formatnumber'. Returns a number turned into a string with thousands separators
export const fn = (num) => num?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
// Removes all unicode characters from a string
export const removeUnicode = (string) => typeof(string) !== "string" ? "" : string.replace(/[^\u0000-\u007F]/g, "")
// Removes all vowels from a word
export const abbreviate = (word) => title(word.toLowerCase().replace(/[aeiou]/g, ""))

export const getPlayerEyeHeight = () => Player.getPlayer().func_70047_e()

export const round = (number, decimalPlaces) => {
    const multi = 10 ** decimalPlaces
    return Math.floor(number * multi) / multi
}

export const getApiKey = () => bcData.apiKey || null

// Gets the dungeon map in the player's 9th hotbar slot
export const getDungeonMap = () => {
    if (!Player.getPlayer()) return
    let mapItem = Player.getInventory().getStackInSlot(8)
    if (!mapItem || mapItem.getID() !== 358 || !mapItem.getName().includes("Magical Map")) return null
    return mapItem

}
// Gets the map data of the dungeon map
export const getMapData = (mapItem) => {
    if (!mapItem) return null
    return mapItem.getItem().func_77873_a(mapItem.getItemStack(), World.getWorld())
}
// Gets an array of 16,000 map colors from map data or a map item
export const getMapColors = (map) => {
    let mapData = null
    if (map instanceof MapData) mapData = map
    if (map instanceof Item) mapData = getMapData(map)
    if (!mapData) return null
    return mapData.field_76198_e
    
}
// Gets the icons on the map
export const getMapDecorators = (map) => {
    let mapData = null
    if (map instanceof MapData) mapData = map
    if (map instanceof Item) mapData = getMapData(map)
    if (!mapData) return null
    return mapData.field_76203_h
}

// Get the scoreboard
export const getScoreboard = (formatted=false) => {
    if (!World.getWorld()) return null
    let sb = Scoreboard.getLines().map(a => a.getName())
    if (formatted) return Scoreboard.getLines()
    return sb.map(a => ChatLib.removeFormatting(a))
}
// Get the tab list
export const getTabList = (formatted=false) => {
    if (formatted) return TabList.getNames()
    return TabList.getNames().map(a => a.removeFormatting())
}
// Converts a timestamp to MM:SS or ??:?? if null or undefined.
export const convertToPBTime = (timeStamp) => {
	if (!timeStamp) return `??:??`
	let minutes = parseInt(timeStamp / 1000 / 60)
	let seconds = parseInt((timeStamp - (minutes * 1000 * 60)) / 1000)
	if (seconds.toString().length == 1) seconds = "0" + seconds
	if (isNaN(minutes) || isNaN(seconds)) return(`??:??`)
	return(`${minutes ? minutes+":" : ""}${seconds}`)
}

/**
 * Checks a line of text to see if the regex matches. If it matches then return as the 'type', otherwise return as a string.
 * If no match is found, then return the default value.
 * @param {String} text - The string of text to be run against.
 * @param {RegExp} regex - The regex to be found (With a match value)
 * @param {any} defaultValue - The value to return if no match is found
 * @param {*} type - "float" or "int" to return the match parsed as float or int. Defaults to String.
 * @returns - If there is a match, return the match. Otherwise return default value.
 */
export const getValue = (text, regex, defaultValue, type) => {
    let match = text.match(regex)
    if (!match) return defaultValue
    if (type == "int") return parseInt(match[1].replace(/[^\d]/g, ""))
    if (type == "float") return parseFloat(match[1].replace(/[^\d]/g, ""))
    return match[1]
}
// Similar to the previous function, but runs a regexp over an entire array of strings.
// If any match, then return an array containing the matches
export const matchAllLines = (regex, list) => list.map(a => a.match(regex)).filter(a => !!a).map(a => a[1])
// Similar to previous one, but returns the value instead if there is a match.
export const getMatchFromLines = (regex, list, type) => {
    for (let i = 0; i < list.length; i++) {
        let match = list[i].match(regex)
        if (!match) continue
        return type == "int" ? parseInt(match[1]) : type == "float" ? parseFloat(match[1]) : match[1]
    }
    return null
}

// Turns for example "2.3M" into 2,300,000 etc.
export const toInt = (str) => {
    if (typeof(str) !== "string") return str
    let match = str.toLowerCase().match(/([\d.]+)(.)/)
    if (!match) return 0
    let [msg, num, type] = match
    num = parseFloat(num)
    if (type == "k") num *= 1000
    if (type == "m") num *= 1000000
    if (type == "b") num *= 1000000000
    return parseInt(num)
}

/**
 * Calculates the skill level based off of the amount of skill XP to 2dp. Will calculate catacombs levels up to 120.
 * @param {String} skill - The name of the skill being calculated 
 * @param {Number} xp - The amount of skill XP to be calculated 
 * @returns - Skill level rounded to 2dp. Eg 48.12
 */
export const calcSkillLevel = (skill, xp) => {
    if (!xp || !skill) return 0
    skill = skill.toLowerCase()
    let level = 0
    let progression = normalSkill
    let maxLevel = 50

    const getLevel = () => {
        if (xp > progression[maxLevel]) {
            if (!cataSkills.includes(skill)) return maxLevel
            let level = Math.floor((50 + (xp - progression[50])/200000000) * 100)/100
            return level > 120 ? 120 : level
        }
        level = progression.filter(a => a < xp).length
        return Math.floor((level-1 + (xp - progression[level-1]) / (progression[level] - progression[level-1])) * 100) / 100
    }

    if (skill in maxLevels) {
        maxLevel = maxLevels[skill]
        return getLevel()
    }
    if (cataSkills.includes(skill)) {
        progression = catacombs
        return getLevel()
    }
    if (skill == "runecrafting") {
        progression = runecrafting
        maxLevel = 25
        return getLevel()
    }
    if (skill in slayerLevelling) {
        progression = slayerLevelling[skill]
        maxLevel = progression.length - 1
        return getLevel()
    }
    return 0
}

/**
 * Returns the x and y coordinates of the center of a slot. Code originally from Antonio.
 * @param {Number} slot - The slot number to be calculated 
 * @returns 
 */
export const getSlotCenter = (slot) => {
    let x = slot % 9;
    let y = Math.floor(slot / 9);
    let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
    let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getOpenedInventory().getSize() / 18) * 18);
    return [renderX, renderY]
}
/**
 * Returns the player's rank based off of the api.hypixel.net/player method.
 * @param {Object} playerInfo 
 * @returns {String} - The player's rank with color codes. Eg "&6[MVP&0++&6]"
 */
export const getRank = (playerInfo, includeSpace=false) => {
	// Gets the player's rank via the Hypixel player API method json
	const rankFormats = {
		"VIP": "&a[VIP]",
		"VIP_PLUS": "&a[VIP&6+&a]",
		"MVP": "&b[MVP]",
		"MVP_PLUS": "&b[MVP&c+&b]",
		"ADMIN": "&c[ADMIN]",
		"MODERATOR": "&2[MOD]",
		"HELPER": "&9[HELPER]",
		"YOUTUBER": "&c[&fYOUTUBE&c]",
        "GAME_MASTER": "&2[GM]"
	}
    const player = playerInfo.player
    // Special ranks
    if ("prefix" in player) return removeUnicode(player.prefix.replace(/§/g, "&")) + (includeSpace ? " " : "")
    if ("rank" in player) return rankFormats[player.rank] + (includeSpace ? " " : "")
    let plusColor = "&c"
    if ("rankPlusColor" in player) plusColor = colorDictionary[player.rankPlusColor]
    // MVP++
	if (player.monthlyPackageRank == "SUPERSTAR") {
        let color = "&6"
        if (player.monthlyRankColor == "AQUA") color = "&b"
        return `${color}[MVP${plusColor}++${color}]` + (includeSpace ? " " : "")
    }
    // MVP+
    if (player.newPackageRank == "MVP_PLUS") return `&b[MVP${plusColor}+&b]` + (includeSpace ? " " : "")
    // All other ranks
    if ("newPackageRank" in player) return rankFormats[player.newPackageRank] + (includeSpace ? " " : "")
    return "&7"
}

const partySpamMessages = [
    /.+ has disbanded the party!/,
    /(.+) invited (.+) to the party! They have 60 seconds to accept./,
    /-----------------------------------------------------/,
    /Party [Members|Leader:|Members:]+.+/
]

let hidingPartySpam = false
/**
 * Hides spammy party messages for a set amount of time.
 * Hides party invites, disband messages, line breaks and the /p list messages.
 * @param {Number} ms - The amount of time to hide party spam messages in ms 
 */
export const hidePartySpam = (ms) => {
    hidingPartySpam = true
    setTimeout(() => {
        hidingPartySpam = false
    }, ms);
}

register("chat", (e) => {
    if (!hidingPartySpam) return
    let unformatted = ChatLib.getChatMessage(e, false)
    if (partySpamMessages.some(a => unformatted.match(a))) return cancel(e)
})

/**
 * Parties a list of players quickly without creating a ghost party.
 * @param {Array} players - List of player usernames to party. 
 * @returns 
 */
export const partyPlayers = ([players]) => {
    if (!players || !players.length) return
    ChatLib.command(`p ${players[0]}`)
    if (players.length == 1) return
    setTimeout(() => ChatLib.command(`p ${players.splice(1).join(" ")}`), 500);
}

/**
 * Gets the Skull ID of the given MC Tile Entity
 * @param {MCTTileEntity} tileEntity 
 * @returns 
 */
export const getTESkullID = (tileEntity) => tileEntity?.func_152108_a()?.id

// Renders centered text at a position. Can split each word onto a new line.
// If an array of strings is passed, it will render each item on a new line.
/**
 * Renders text perfectly centered on the screen both horizontally and vertically. Supports color codes
 * or optionally, pass in a Java Color to force the text to render that color.
 * @param {String|String[]} string - The text to be rendered. If an array of strings is passed, each item will be rendered on a new line.
 * @param {Number} x - Left/Right on the screen.
 * @param {Number} y - Up/Down on the screen.
 * @param {Number} scale - Scale the text to make it larger/smaller.
 * @param {Boolean} splitWords - Split the string at each space and render on a new line.
 * @param {Color} forceColor - Force the text to be a certain Java Color.
 * @returns 
 */
export const renderCenteredString = (string, x, y, scale, splitWords=false, javaColor=null) => {
    if (!string || !x || !y) return
    Renderer.retainTransforms(true)
    string = Array.isArray(string) ? string : splitWords ? string.split(" ") : [string]
    let vertOffset = string.length*7 + (2*(string.length-1))
    let [r, g, b, a] = []
    if (javaColor) {
        r = javaColor.getRed()
        g = javaColor.getGreen()
        b = javaColor.getBlue()
        a = javaColor.getAlpha()
    }
    Renderer.translate(x, y)
    Renderer.scale(scale, scale)
    Renderer.translate(0, -vertOffset/2)
    for (let i = 0; i < string.length; i++) {
        if (javaColor) Renderer.colorize(r, g, b, a)
        Renderer.drawStringWithShadow(string[i], -Renderer.getStringWidth(string[i])/2, (i*7 + (2*i)))
    }
    Renderer.retainTransforms(false)
}

/**
 * Converts a time string to seconds
 * @param {String} timeString - String formatted like "1h 38m 37s"
 * @returns {Number}
 */
export const convertToSeconds = (timeString) => {
    if (!timeString) return 0
    let split = timeString.replace(/[^\d ]/g, "").split(" ").map(a => parseInt(a)).reverse()
    // 1x for seconds, 60x for mins, 3600x for hours.
    const timeMultpliers = [1, 60, 3600]
    return split.map((v, i) => v * timeMultpliers[i]).reduce((a, b) => a+b)
}

/**
 * Gets the MCBlock.
 * @param {String} block 
 * @returns {MCBlock}
 */
export const getBlock = (block) => Blockk.func_149684_b("minecraft:" + block.replace("minecraft:", ""))

/**
 * Sorts an object based on its keys in ascending order and returns a new object.
 * @param {Object} object 
 * @param {Boolean} reverse - Sort in descencing order instead
 * @param {Function} sorter - A custom sorting function
 * @returns {Object}
 */
export const sortObjectByValues = (object, reverse, sorter=null) => {
    if (!sorter) sorter = (a, b) => object[a] - object[b]
    const arr = Object.keys(object).sort(sorter)
    if (reverse) arr.reverse()
    return arr.reduce((a, b) => (a[b] = object[b], a), {})
}

/**
 * Sorts an object based on its values with the option for a custom key to be used.
 * @param {Object} object 
 * @param {Boolean} reverse - Sort in descencing order instead
 * @param {Function} key - What value will be used for the sorting comparison
 * @returns {Object}
 */
export const sortObjectByValues2 = (object, reverse, key=null) => {
    if (!key) key = (a) => object[a]
    const sortedArray = Object.keys(object).sort((a, b) => key(a) - key(b))
    if (reverse) sortedArray.reverse()
    
    return sortedArray.reduce((a, b) => (a[b] = object[b], a), {})
}

/**
 * Gets the server ID from the scoreboard.
 * @returns {String}
 */
export const getServerID = () => {
    let sb = Scoreboard.getLines()
    if (!sb || !sb.length) return null
    return removeUnicode(sb[sb.length-1].getName().removeFormatting().split(" ")[1])
}

/**
 * Gets the room id of the room the player is currently standing in in Dungeons
 * @returns {String}
 */
export const getRoomID = () => {
    let sb = getScoreboard(false)
    if (!sb) return null
    let line = removeUnicode(sb[sb.length-1])
    let match = line.match(/\d+\/\d+\/\d+ \w+ ([-\d]+,[-\d]+)/)
    if (!match) return null
    return match[1]
}

/**
 * Gets the room data object for the room with the given room ID
 * @param {String} roomID 
 * @returns {Object | null}
 */
export const getRoom = (roomID=null) => {
    if (roomID == null) roomID = getRoomID()
    return rooms?.find(a => a.id.includes(roomID)) ?? null
}

/**
 * Generates an evenly spaced set of numbers from the min value to the max value.
 * @param {Number} min - The min value (Inclusive)
 * @param {Number} max - The max value (Inclusive)
 * @param {Number} steps - How many numbers to generate 
 * @returns {Number[]}
 */
export const linSpread = (min, max, steps) => {
    let step = (max - min) / (steps - 1)
    return Array(steps).fill().map((v, i) => min + step * i)
}

/**
 * Returns an array of evenly spaced coords. The max distance sets the maximum distance apart each coordinate can be from the next.
 * 
 * @param {Number[]} initialCoords - Coords to start at
 * @param {Number[]} finalCoords - Coords to finish at
 * @param {Number} maxDistance - Max distance between coordinates
 * @param {Boolean} maxMode - Make all of the coords be the max distance apart, except for the final one. Eg if the total
 * distance is 10 and max distance is 7, it will return coords 7 and 3 blocks in distance.
 * @returns {Number[][]}
 */
export const spreadBetween = ([x1, y1, z1], [x2, y2, z2], maxDistance, maxMode=false) => {
    const distance = getDistance3D(x1, y1, z1, x2, y2, z2)/(maxDistance || 9)
    let steps = Math.ceil(distance)
    if (maxMode) steps = distance
    let dx = (x2 - x1)/steps
    let dy = (y2 - y1)/steps
    let dz = (z2 - z1)/steps
    let arr = Array(Math.floor(steps)+1).fill().map((v, i) => [
        x1 + dx*i,
        y1 + dy*i,
        z1 + dz*i
    ])
    if (maxMode) return [...arr, [x2, y2, z2]]
    return arr
}

let currentRoom = null // The json object room data saved in rooms.json

onScoreboardLine((line, text) => {
    const match = text.match(/^§7\d+\/\d+\/\d+ §8.+? ([\d,-]+)$/)
    if (!match) return
    const roomId = match[1]
    currentRoom = getRoom(roomId)
})

register("worldUnload", () => {
    currentRoom = null
})

export const getCurrentRoom = () => currentRoom

/**
 * Maps real world coords to 0-5 depending on where they are in the dungeon.
 * @param {Number} realX 
 * @param {Number} realZ 
 * @returns {Number[]}
 */
export const getRoomComponent = (realX=null, realZ=null) => {
    if (realX == null && realZ == null) {
        realX = Player.getX()
        realZ = Player.getZ()
    }

    return [
        Math.floor((realX + 200 + 0.5) / 32),
        Math.floor((realZ + 200 + 0.5) / 32)
    ]
}

/**
 * Gets the corner of the room component at the given real-world coordinates.
 * @param {Number} x 
 * @param {Number} z 
 * @returns {Number[]}
 */
export const getRoomCorner = (x=null, z=null) => {
    if (!x || !z) {
        x = Player.getX()
        z = Player.getZ()
    }
    let [cx, cz] = getRoomComponent(x, z)
    return [-200 + cx*32, -200 + cz*32]
}

/**
 * Gets the [x, z] coordinate of the center of the room at a certain x, z position.
 * @param {Number | null} x 
 * @param {Number | null} z 
 * @returns 
 */
export const getRoomCenter = (x=null, z=null) => {
    const [x, z] = getRoomCorner(x, z)
    return [x+15, z+15]
}

/**
 * Gets the player's x, y and z coordinates.
 * @returns {Number[]}
 */
export const getPlayerCoords = (ints=false) => {
    const coords = [Player.getX(), Player.getY(), Player.getZ()]
    if (ints) return coords.map(a => Math.floor(a))
    return coords
}

/**
 * Gets the coordinates of the player's eyes.
 * @param {Boolean} forceSneak - If the player is not sneaking, lower the Y value by 0.08 blocks.
 * @returns 
 */
export const getPlayerEyeCoords = (forceSneak=false) => {
    let x = Player.getX()
    let y = Player.getY() + Player.getPlayer().func_70047_e()
    let z = Player.getZ()

    if (forceSneak && !Player.isSneaking()) y -= 0.08
    return [x, y, z]
}
export const getEntityEyeCoords = (entity) => [entity.getX(), entity.getY() + entity.getEntity().func_70047_e(), entity.getZ()]
export const getEntityXYZ = (entity) => [entity.getX(), entity.getY(), entity.getZ()]

/**
 * Calls the object's .getX(), .getY() and .getZ() methods and returns them in an array. Will throw an error if the object doesn't have any of those methods.
 * @param {Object} object 
 * @param {Boolean} ints - Floor the values 
 * @returns {[Number, Number, Number]}
 */
export const getObjectXYZ = (object, ints=false) => {
    const pos = [object.getX(), object.getY(), object.getZ()]
    if (!ints) return pos
    return pos.map(a => Math.floor(a))
}

/**
 * Gets the player's look vector
 * @returns {Vector3}
 */
export const getPlayerLookVec = () => {
    let lookVec = Player.getPlayer().func_70040_Z() // .getLookVec()
    return new Vector3(
        lookVec.field_72450_a,
        lookVec.field_72448_b,
        lookVec.field_72449_c
    )
}

/**
 * Returns a Vector3 going from your own eye position to the eye position of the entity.
 * @param {Entity} entity 
 */
export const getVectorToEntity = (entity) => {
    if (!entity) return null
    let [px, py, pz] = getPlayerEyeCoords()
    let [ex, ey, ez] = [entity.getX(), entity.getY() + entity.getEntity().func_70047_e(), entity.getZ()]
    return new Vector3(ex - px, ey - py, ez - pz)
}

/**
 * Sets the item at a specific slot to an MCItemStack
 * @param {Number} slot - The Slot number 
 * @param {MCItemStack} mcItemStack - The MCItemStack
 * @returns 
 */
export const setItem = (slot, mcItemStack) => Player.getContainer().container.func_75141_a(slot, mcItemStack)

/**
 * Sends a window click pakcet at the slot with the given window id and button.
 * @param {Number} slot - The numerical slot to click.
 * @param {Number|null} windowId - The window id to click with. If no window ID is given, it will default to the window id of the current gui.
 * @param {Number|null} btn - The button to click.
 * @returns 
 */
export const clickSlot = (slot, windowId, btn) => Client.getMinecraft().field_71442_b.func_78753_a(windowId ? windowId : Player.getContainer().getWindowId(), slot, btn ? btn : 2, 3, Player.getPlayer())

/**
 * Renders a line in the world between two sets of coordinates.
 * @param {Number} x1 - Start X
 * @param {Number} y1 - Start Y
 * @param {Number} z1 - Start Z
 * @param {Number} x2 - End X
 * @param {Number} y2 - End Y
 * @param {Number} z2 - End Z
 * @param {Number} red - Red value 0-1
 * @param {Number} green - Green value 0-1
 * @param {Number} blue - Blue Value 0-1
 * @param {Number} alpha - Alpha value 0-1
 * @param {Number} thickness - Line thickness
 * @param {Boolean} phase - Render the line through blocks
 */
export const drawLine3d = (x1, y1, z1, x2, y2, z2, red, green, blue, alpha, thickness, phase=false) => {
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(thickness);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    if (phase) GlStateManager.func_179097_i() // enableDepth
    GL11.glDepthMask(false);
    GlStateManager.func_179094_E(); // pushMatrix()

    Tessellator.begin(3).colorize(red, green, blue, alpha);

    Tessellator.pos(x1, y1, z1);
    Tessellator.pos(x2, y2, z2);

    Tessellator.draw();

    GlStateManager.func_179121_F(); // popMatrix()
    if (phase) GlStateManager.func_179126_j() // disableDepth
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}

export const getDistanceToEntity = (entity) => getDistance3D(...getPlayerCoords(), ...getEntityXYZ(entity))

export const sendWindowClick = (windowId, slot, clickType, actionNumber=0) => Client.sendPacket(new C0EPacketClickWindow(windowId ?? Player.getContainer().getWindowId(), slot, clickType ?? 0, 0, null, actionNumber))
export const sendUseEntity = (entity, hitVec=false) => {
    let e = (entity instanceof Entity) ? entity.getEntity() : entity
    let packet = new C02PacketUseEntity(e, C02PacketUseEntity.Action.INTERACT)
    if (hitVec) packet = new C02PacketUseEntity(e, new Vec3(0, 0, 0))
    Client.sendPacket(packet)
}

/**
 * Gets the texture property of the skull item.
 * @param {Item} skullItem 
 * @returns {String|null}
 */
export const getSkullTexture = (skullItem) => {
    if (skullItem instanceof MCItemStack) skullItem = new Item(skullItem)
    if (!(skullItem instanceof Item)) return null
    const textures = skullItem.getNBT()?.toObject()?.tag?.SkullOwner?.Properties?.textures
    if (!textures || !textures.length) return
    return textures[0].Value
}

/**
 * Gets the texture property of the skull item which the entity is wearing.
 * @param {Entity} entity - The entity whose skull's texture you want. 
 * @returns {String|null}
 */
export const getEntitySkullTexture = (entity) => {
    if (!entity || !(entity instanceof Entity)) return null
    let helm = entity.getEntity().func_71124_b(4)
    if (!helm) return null
    let item = new Item(helm)
    if (!item || item.getID() !== 397 || item.getMetadata() !== 3) return null
    return getSkullTexture(item)
}

/**
 * Gets the texture property of the skull item which the entity is wearing.
 * @param {Entity} entity - The entity whose skull's texture you want. 
 * @returns {String|null}
 */
export const getEntityHoldingTexture = (entity) => {
    if (!entity || !(entity instanceof Entity)) return null
    let heldItem = entity.getEntity().func_70694_bm()
    ChatLib.chat(`Held: ${heldItem}`)
    if (!heldItem) return null
    let item = new Item(heldItem)
    if (!item || item.getID() !== 397 || item.getMetadata() !== 3) return null
    return getSkullTexture(item)
}

/**
 * Creates a 
 * @returns {Number[]}
 */
export const range = (min, max) => [...Array(Math.abs((max-min+1))||1).fill().keys()].map(a => a+min)

/**
 * Checks if the chunk at the specified coordinate is loaded.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @returns 
 */
export const chunkLoaded = (x, y, z) => {
    if (!World || !World.getWorld()) return false
    return World.getChunk(x, y, z).chunk.func_177410_o()
}

const aotvIds = [
    "ASPECT_OF_THE_VOID",
    "ASPECT_OF_THE_END"
]
export const holdingAOTV = () => {
    const held = Player.getHeldItem()
    return held && aotvIds.includes(getSkyblockItemID(held))
}

/**
 * Raytraces from the player's look vector for the set number of blocks
 * @param {Number} distance 
 * @returns {Block|null}
 */
export const raytraceBlock = (distance=100) => {
    let rt = Player.getPlayer().func_174822_a(distance, 0)
    let bp = rt.func_178782_a()
    if (!bp) return null
    return World.getBlockAt(new BlockPos(bp))
}

/**
 * Color shifts a color from color1 to color2 by an amount. Accepts either a Java Color or two equal length arrays of numbers.
 * @param {[Number, Number, Number] | Color} color1 - The color to be shifted.
 * @param {[Number, Number, Number] | Color} color2 - The color which color1 will be shifted towards.
 * @param {Number} amount - Percentage to shift by. 0-1, for example 0.5 = 50% color shift. 
 */
export const colorShift = (color1, color2, amount) => {

    const shift = (arr1, arr2, amt) => arr1.map((v, i) => v + (arr2[i] - v) * amt)
    const getColorArray = (color) => [color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha()]
    if (color1 instanceof Color && color2 instanceof Color) {
        let c1Components = getColorArray(color1)
        let c2Components = getColorArray(color2)
        return new Color(...shift(c1Components, c2Components, amount).map(a => a/255))
    }
    if (color1.length !== color2.length) return color1
    return shift(color1, color2, amount)
}

/**
 * Gets the vector from the player's eye coordinates to a set of coordinates.
 * @param {Number[]} coords 
 * @returns 
 */
export const getVectorToCoord = ([x, y, z], shift) => {
    let [x0, y0, z0] = getPlayerCoords()
    y0 += 1.62
    y0 -= shift ? 0.08 : 0

    let dx = x - x0
    let dy = y - y0
    let dz = z - z0
    return new Vector3(dx, dy, dz)
}

export const manhattanDistance = (x0, y0, x1, y1) => Math.abs(x1 - x0) + Math.abs(y1 - y0)
export const manhattanDistance3D = (x0, y0, z0, x1, y1, z1) => Math.abs(x1 - x0) + Math.abs(y1 - y0) + Math.abs(z1 - z0)

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @param {Boolean} fromEyePos - Use the xyz of the player's eye position. 
 */
export const getDistanceToCoord = (x, y, z, fromEyePos=false) => {
    let [x0, y0, z0] = fromEyePos ? getPlayerEyeCoords() : getPlayerCoords()
    return getDistance3D(x0, y0, z0, x, y, z)
}

/**
 * Returns an array of [[x, y, z], ...] coordinates containing offsets of every block in a cube of the size distance * 2 + 1
 * Eg distance=1 would return the offsets of a 3x3 cube, distance=3 would return a 7x7 cube etc.
 * Does not include [0, 0, 0].
 * @param {Number} distance 
 * @returns {Number[][]}
 */
export const getDirections = (distance=1) => {
    let final = []
    for (let x = -distance; x <= distance; x++) {
        for (let y = -distance; y <= distance; y++) {
            for (let z = -distance; z <= distance; z++) {
                if (x==0 && y==0 && z==0) continue
                final.push([x, y, z])
            }
        }
    }
    return final
}

export const getGameSettings = () => Client.getMinecraft().field_71474_y

/**
 * Appends a string to a new line in a file. If the file does not exist, the file is created.
 * @param {String} moduleName 
 * @param {String} filePath 
 * @param {String} toWrite 
 * @returns 
 */
export const appendToFile = (moduleName, filePath, toWrite) => {
    if (!FileLib.exists(moduleName, filePath)) return FileLib.write(moduleName, filePath, toWrite, true)
    FileLib.append(moduleName, filePath, `\n${toWrite}`)
}

/**
 * Reads a file and returns the lines as an array. If the file does not exist, returns null
 * @param {String} moduleName 
 * @param {String} filePath 
 * @returns {String[] | null}
 */
export const readFileLines = (moduleName, filePath) => {
    if (!FileLib.exists(moduleName, filePath)) return null
    return FileLib.read(moduleName, filePath).split("\n")
}

/**
 * Converts miliseconds to string. Eg 1000ms = 1s, 65000ms = 1m 5s
 * @param {Number} ms 
 * @returns 
 */
export const convertToTimeString = (ms) => {
    let secs = Math.floor(ms / 100) / 10
    let mins = Math.floor(secs / 60)
    let hours = Math.floor(mins / 60)
    let days = Math.floor(hours / 24)

    secs %= 60
    mins %= 60
    hours %= 24

    let final = ""
    if (days) final += `${days}d `
    if (hours) final += `${hours}h `
    if (mins) final += `${mins}m `
    if (secs) final += `${secs}s `
    return final.trim()
}

/**
 * Gets the Skyblock item ID of the given MCItem or CT Item
 * @param {Item | MCItemStack} item 
 */
export const getSkyblockItemID = (item) => {
    if (item instanceof MCItemStack) item = new Item(item)
    if (!(item instanceof Item)) return null

    const extraAttributes = item.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
    const itemID = extraAttributes?.getString("id") ?? null

    if (itemID !== "ENCHANTED_BOOK") return itemID
    
    // Enchanted books are a pain in the ass
    const enchantments = extraAttributes.getCompoundTag("enchantments")
    const enchants = [...enchantments.getKeySet()]
    if (!enchants.length) return null

    const enchantment = enchants[0]
    const level = enchantments.getInteger(enchants[0])

    return `ENCHANTMENT_${enchantment.toUpperCase()}_${level}`
}

const checkingTriggers = [] // [[trigger, func]]
/**
 * Registers and unregisters the trigger depending on the result of the checkFunc. Use with render triggers to reduce lag when they are not being used.
 * @param {() => void} trigger 
 * @param {Function} checkFunc 
 * @returns 
 */
export const registerWhen = (trigger, checkFunc) => checkingTriggers.push([trigger.unregister(), checkFunc])

register("tick", () => {
    for (let i = 0; i < checkingTriggers.length; i++) {
        let [trigger, func] = checkingTriggers[i]
        if (func()) trigger.register()
        else trigger.unregister()
    }
})

/**
 * @callback BlockCheckFunction
 * @param {Block} - The current block the algorithm is at.
 * @return {Boolean} - If the function returns true, then the traversal is stopped at this block.
 */


// For etherwarp shit to be perfectly accurate
let lastSentCoords = null
let lastSentLook = null
export const getLastSentCoord = () => lastSentCoords ? [...lastSentCoords] : null 
/**
 * 
 * @returns {[Number, Number] | null} - The last [pitch, yaw] sent to the server
 */
export const getLastSentLook = () => lastSentLook ? [...lastSentLook] : null 

const getPacketCoord = (c03Packet) => {
    const x = c03Packet.func_149464_c()
    const y = c03Packet.func_149467_d()
    const z = c03Packet.func_149472_e()
    return [x, y, z]
}

const getPacketLook = (c03Packet) => {
    const pitch = c03Packet.func_149470_h()
    const yaw = c03Packet.func_149462_g()
    return [pitch, yaw]
}

register("packetSent", (packet) => {
    if (packet instanceof C04PacketPlayerPosition) lastSentCoords = getPacketCoord(packet)
    else if (packet instanceof C05PacketPlayerLook) lastSentLook = getPacketLook(packet)
    else if (packet instanceof C06PacketPlayerPosLook) {
        lastSentCoords = getPacketCoord(packet)
        lastSentLook = getPacketLook(packet)
    }
}).setFilteredClass(C03PacketPlayer)

/**
 * Quickly traverses the blocks from the start coordinate to the end coordinate.
 * @param {[Number, Number, Number]} start 
 * @param {[Number, Number, Number]} end 
 * @param {BlockCheckFunction} blockCheckFunc - Will stop traversal if this function returns true.
 * @param {Boolean} returnWhenTrue - Instead of returning the path, only return the block when the blockCheckFunc returns true. If the end is reached, return null instead.
 * @param {Boolean} stopWhenNotAir - Stops traversal when a block which isn't air is reached. This is checked after the blockCheckFunc.
 * @param {Boolean} returnIntersection - Also returns the point where the ray intersected the final block. Return an Object: {hit: [x, y, z], intersection: [x, y, z]}
 * @returns {Number[][] | [Number, Number, Number] | null | Object} - The coordinate(s) as integers, or null if miss.
 */
export const traverseVoxels = (start, end, blockCheckFunc=null, returnWhenTrue=false, stopWhenNotAir=false, returnIntersection=false) => {
    // Initialize Shit
    const direction = end.map((v, i) => v - start[i])
    const step = direction.map(a => Math.sign(a))
    const thing = direction.map(a => 1/a)
    const tDelta = thing.map((v, i) => Math.min(v * step[i], 1))
    const tMax = thing.map((v, i) => Math.abs((Math.floor(start[i]) + Math.max(step[i], 0) - start[i]) * v))
    
    // Ints
    let currentPos = start.map(a => Math.floor(a))
    let endPos = end.map(a => Math.floor(a))
    let intersectionPoint = [...start]

    let path = []
    let iters = 0
    while (true && iters < 1000) {
        iters++

        // Do block check function stuff
        let currentBlock = World.getBlockAt(...currentPos)
        if (blockCheckFunc && blockCheckFunc(currentBlock)) {
            // Return the hit block instead of the entire path
            if (returnWhenTrue) {
                // Return an Object which contains the hit block and the intersection point
                if (returnIntersection) return {
                    hit: currentPos,
                    intersection: intersectionPoint
                }
                return currentPos
            }
            break
        }

        // Non-air block reached
        if (stopWhenNotAir && currentBlock.type.getID() !== 0) {
            if (returnIntersection) return {
                hit: currentPos,
                intersection: intersectionPoint
            }
            break
        }

        // Add the current position to the tarversed path
        path.push([...currentPos])

        // End Reached
        if (currentPos.every((v, i) => v == endPos[i])) break

        // Find the next direction to step in
        let minIndex = tMax.indexOf(Math.min(...tMax))
        tMax[minIndex] += tDelta[minIndex]
        currentPos[minIndex] += step[minIndex]

        // Update the intersection point
        intersectionPoint = start.map((v, i) => v + tDelta[minIndex] * direction[i])
    }
    if (returnWhenTrue) return null
    return path
}

/**
 * Does a voxel traversal from the startPos (Or player eye coord by default) until it hits a non-air block.
 * @param {[Number, Number, Number] | null} startPos - The position to start at
 * @param {Vector3 | null} directionVector - The direction for the ray to travel in. Keep as null to use the player's look vector 
 * @param {Number} distance 
 * @param {BlockCheckFunction} blockCheckFunc 
 * @param {Boolean} returnWhenTrue 
 * @param {Boolean} stopWhenNotAir
 */
export const raytraceBlocks = (startPos=null, directionVector=null, distance=60, blockCheckFunc=null, returnWhenTrue=false, stopWhenNotAir=true) => {
    // Set default values to send a raycast from the player's eye pos, along the player's look vector.
    if (!startPos) startPos = getPlayerEyeCoords()
    if (!directionVector) directionVector = getPlayerLookVec()

    const endPos = directionVector.normalize().multiply(distance).add(startPos).getComponents()

    return traverseVoxels(startPos, endPos, blockCheckFunc, returnWhenTrue, stopWhenNotAir)
}

// If one of these blocks is above the targeted etherwarp block, it is a valid teleport.
// However if the block itself is being targetted, then it is not a valid block to etherwarp to.
const etherBlockTypes = [
    "minecraft:air",
    "minecraft:fire",
    "minecraft:carpet",
    "minecraft:skull",
    "minecraft:lever",
    "minecraft:stone_button",
    "minecraft:wooden_button",
    "minecraft:torch",
    "minecraft:tripwire_hook",
    "minecraft:tripwire",
    "minecraft:rail",
    "minecraft:activator_rail",
    "minecraft:snow_layer",
    "minecraft:carrots",
    "minecraft:wheat",
    "minecraft:potatoes",
    "minecraft:nether_wart",
    "minecraft:pumpkin_stem",
    "minecraft:melon_stem",
    "minecraft:redstone_torch",
    "minecraft:redstone_wire",
    "minecraft:red_flower",
    "minecraft:yellow_flower",
    "minecraft:sapling",
    "minecraft:flower_pot",
    "minecraft:deadbush",
    "minecraft:tallgrass",
    "minecraft:ladder",
    "minecraft:double_plant",
    "minecraft:unpowered_repeater",
    "minecraft:powered_repeater",
    "minecraft:unpowered_comparator",
    "minecraft:powered_comparator",
    "minecraft:web",
    "minecraft:waterlily",
    "minecraft:water",
    "minecraft:lava",
    "minecraft:torch",
    "minecraft:vine",
    "minecraft:brown_mushroom",
    "minecraft:red_mushroom",
    "minecraft:piston_extension",
].map(a => new BlockType(a).getID())

// Make it so that the array can be directly indexed into via the block id instead of having to calculate a hash with a set
// Each index corresponds to a block ID, where that index can either be true or false depending on if this is a valid ether foot block
export const validEtherwarpFeetBlocks = new Array(500).fill(false).map((_, i) => etherBlockTypes.includes(i))

/**
 * Checks whether the given block is a valid spot to etherwarp to.
 * @param {Block | [Number, Number, Number]} block 
 * @returns {Boolean}
 */
export const isValidEtherwarpBlock = (block) => {
    if (!block) return false
    if (!(block instanceof Block)) block = World.getBlockAt(...block)
    if (block.type.getID() == 0) return false

    // Checking the actual block to etherwarp ontop of
    // Can be at foot level, but not etherwarped onto directly.
    if (validEtherwarpFeetBlocks[block.type.getID()]) return false

    // The block at foot level
    const blockAbove = World.getBlockAt(block.getX(), block.getY()+1, block.getZ())
    if (!validEtherwarpFeetBlocks[blockAbove.type.getID()]) return false

    // The block at head height
    const blockAboveAbove = World.getBlockAt(block.getX(), block.getY()+2, block.getZ())
    
    return validEtherwarpFeetBlocks[blockAboveAbove.type.getID()]
}

/**
 * Returns the coordinate of the block you would teleport to if you were to use etherwarp.
 * @param {Boolean} useLastPacketPos - Use the coordinates and look position from your last sent C03 packets to sync it with the server.
 */
export const getEtherwarpBlock = (useLastPacketPos=true, distance=60) => {
    if (!useLastPacketPos) return raytraceBlocks(getPlayerEyeCoords(true), null, distance, isValidEtherwarpBlock, true, true)

    if (!lastSentCoords || !lastSentLook) return null

    const [pitch, yaw] = lastSentLook
    const lookVec = Vector3.fromPitchYaw(pitch, yaw).multiply(distance)
    const startPos = [...lastSentCoords]
    startPos[1] += Player.getPlayer().func_70047_e()
    // const [x0, y0, z0] = startPos
    const endPos = lookVec.getComponents().map((v, i) => v + startPos[i])
    return traverseVoxels(startPos, endPos, isValidEtherwarpBlock, true, true, false)
}

/**
 * Returns a 2-long array containing a boolean of whether the etherwarp prediction thinks the etherwarp will succeed,
 * and the position of the end block. Will return null if the max distance is reached.
 * @param {Boolean} useLastPacketPos 
 * @param {Number} distance 
 * @returns {[Boolean, Number[]]}
 */
export const getEtherwarpBlockSuccess = (useLastPacketPos=true, distance=60) => {
    if (!lastSentCoords || !lastSentLook) return [false, [0, 0, 0]]

    let startPos = null
    let endPos = null
    const playerHeightSneaking = 1.5399999618530273 // Foot to eye level when sneaking

    if (useLastPacketPos) {
        let [pitch, yaw] = lastSentLook
        let lookVec = Vector3.fromPitchYaw(pitch, yaw).multiply(distance)
        startPos = [...lastSentCoords]
        startPos[1] += playerHeightSneaking
        endPos = lookVec.getComponents().map((v, i) => v + startPos[i])
    }
    else {
        let lookVec = Vector3.fromPitchYaw(Player.getPitch(), Player.getYaw()).multiply(distance)
        startPos = [Player.getRenderX(), Player.getRenderY(), Player.getRenderZ()]
        startPos[1] += playerHeightSneaking
        endPos = lookVec.getComponents().map((v, i) => v + startPos[i])
    }

    const etherSpot = traverseVoxels(startPos, endPos, (block) => block.type.getID() !== 0, true, true, false)

    return [isValidEtherwarpBlock(etherSpot), etherSpot]
}

/**
 * Adds padChar onto the end of a String until it reaches the maxLength (measured with Renderer.getStringWidth).
 * Eg "Hello World" -> "Hello World..........."
 * @param {String} text - The initial text to lengthen.
 * @param {String} padChar - The text to pad the end of the string with.
 * @param {Number} maxLength - The length of string to aim for (Render length). 
 * @returns 
 */
export const padText = (text, padChar, maxLength) => {
    const remaining = maxLength - Renderer.getStringWidth(text)
    if (remaining <= 0) return text
    const charsToAdd = Math.floor(remaining / Renderer.getStringWidth(padChar))
    for (let i = 0; i < charsToAdd; i++) text += padChar
    return text
}

/**
 * Decodes a roman numeral into it's respective number. Eg VII -> 7, LII -> 52 etc.
 * Returns null if the numeral is invalid.
 * Supported symbols: I, V, X, L, C, D, M
 * @param {String} numeral 
 * @returns {Number | null}
 */
export const decodeNumeral = (numeral) => {
    if (!numeral.match(/^[IVXLCDM]+$/)) return null
    let sum = 0
    for (let i = 0; i < numeral.length; i++) {
        let curr = numeralValues[numeral[i]]
        let next = i < numeral.length-1 ? numeralValues[numeral[i+1]] : 0

        if (curr < next) {
            sum += next - curr
            i++
            continue
        }
        sum += curr
    }
    return sum
}

/**
 * Adds lines to the lore of an MC ItemStack.
 * @param {MCTItemStack} itemStack 
 * @param {String | String[]} strings 
 * @returns 
 */
export const addLinesToItemStackLore = (itemStack, strings) => {
    if (!itemStack) return

    if (!strings || !strings.length) return
    if (typeof(strings) == "string") strings = [strings]

    // CT Item
    if (itemStack instanceof Item) {
        itemStack.setLore(itemStack.getLore().concat(strings))
        return
    }

    // MC Item
    const nbt = itemStack.func_77978_p()
    if (!nbt.func_150297_b("display", 10)) return
    
    let nbttagcompound = nbt.func_74775_l("display")
    if (!nbttagcompound.func_150299_b("Lore") == 9) return
    
    let nbttaglist1 = nbttagcompound.func_150295_c("Lore", 8)
    if (nbttaglist1.func_74745_c() == 0) return

    strings.forEach(string => nbttaglist1.func_74742_a(new NBTTagString(string)))
}

/**
 * 
 * @param {Entity} entity 
 * @returns 
 */
export const canSfToEntity = (entity) => {
    const baseRange = 12

    const [x0, y0, z0] = getPlayerCoords()
    const [x1, y1, z1] = getObjectXYZ(entity)
    
    const playerHeight = Player.asPlayerMP().getHeight()
    const playerWidth = Player.asPlayerMP().getWidth()
    const entityHeight = entity.getHeight()
    const entityWidth = entity.getWidth()

    const maxHorizRange = baseRange + playerWidth/2 + entityWidth/2
    if (Math.abs(x1 - x0) > maxHorizRange || Math.abs(z1 - z0) > maxHorizRange) return false

    const dy = y1 - y0
    if (dy >= 0 && dy > baseRange + playerHeight) return false
    if (dy < 0 && dy < -baseRange - entityHeight) return false

    return true
}

let cachedSbItems = null
const itemIDMap = new Map()

/**
 * Returns the json from the https://api.hypixel.net/resources/skyblock/items about the given item
 * @param {String | null} itemID 
 * @param {String | null} itemName 
 */
export const getSbApiItemData = (itemID=null, itemName=null) => {
    if (!FileLib.exists("BloomCore", "data/skyblockItems.json")) return null
    
    if (!cachedSbItems) {
        cachedSbItems = JSON.parse(FileLib.read("BloomCore", "data/skyblockItems.json"))
        cachedSbItems.forEach(item => {
            if (!item.id) return
            itemIDMap.set(item.id, item)
        })
    }

    if (itemID) return itemIDMap.get(itemID) ?? null
    if (itemName) return cachedSbItems.find(a => a.name == itemName) ?? null

    return null
}

export const getSortedMap = (map, sorter = (a, b) => b[1] - a[1]) => new Map([...map.entries()].sort(sorter))


const guiContainerLeftField = GuiContainer.class.getDeclaredField("field_147003_i")
const guiContainerTopField = GuiContainer.class.getDeclaredField("field_147009_r")
guiContainerLeftField.setAccessible(true)
guiContainerTopField.setAccessible(true)

/**
 * 
 * @param {Number} slotNumber 
 * @param {GuiContainer} mcGuiContainer
 * @returns {[Number, Number]}
 */
export const getSlotRenderPosition = (slotNumber, mcGuiContainer) => {
    const guiLeft = guiContainerLeftField.get(mcGuiContainer)
    const guiTop = guiContainerTopField.get(mcGuiContainer)
    
    const slot = mcGuiContainer.field_147002_h.func_75139_a(slotNumber)

    return [guiLeft + slot.field_75223_e, guiTop + slot.field_75221_f]
}


/**
 * 
 * @param {GuiContainer} gui - The GuiContainer to render inside of
 * @param {Number} slotIndex - The slot index 
 * @param {Number} r - 0-1
 * @param {Number} g - 0-1
 * @param {Number} b - 0-1
 * @param {Number} a - 0-1
 * @param {Boolean} aboveItem - Hightlight in front of the item in the slot
 * @param {Number} z - The z position for the highlight to be rendered. Will override the aboveItem parameter if used.
 */
export const highlightSlot = (gui, slotIndex, r, g, b, a, aboveItem=false, z=null) => {
    if (!(gui instanceof GuiContainer)) return
    
    const [x, y] = getSlotRenderPosition(slotIndex, gui)

    let zPosition = 245
    if (aboveItem) zPosition = 241
    if (z !== null) zPosition = z 

    Renderer.translate(x, y, zPosition)
    Renderer.drawRect(Renderer.color(r*255, g*255, b*255, a*255), 0, 0, 16, 16)
    Renderer.finishDraw()
}

/**
 * @deprecated - Typo
 */
export const hightlightSlot = highlightSlot


/**
 * Adds the enchantment with the specified enchantment ID and level to the given CT Item or MCItemStack.
 * Returns the original item for method chaining.
 * @param {Item | MCItemStack} item 
 * @param {Number} enchantID 
 * @param {Number} enchantLevel 
 * @returns 
 */
export const addEnchantToItem = (item, enchantID, enchantLevel) => {
    let itemStack = item
    if (item instanceof Item) itemStack = item.itemStack

    itemStack.func_77966_a(Enchantment.func_180306_c(enchantID), enchantLevel)

    return item
}

/**
 * Converts a string formatted as "1d 10h 20m 20s" into the total milliseconds.
 * For example: "19s" -> 19000
 * @param {String} timeStr 
 * @returns {Number}
 */
export const timeToMS = (timeStr) => {
    const match = timeStr.match(/^((\d+d\s?)?(\d+h\s?)?(\d+m\s?)?(\d+s)?)$/)

    if (!match) return 0

    const days = parseInt(match[2]) || 0
    const hours = parseInt(match[3]) || 0
    const minutes = parseInt(match[4]) || 0
    const seconds = parseInt(match[5]) || 0

    return total = (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000
}

export const isSingleplayer = () => Client.getMinecraft().func_71356_B()

/**
 * 
 * @param {Block} ctBlock 
 * @returns {Number[]} - A 6-long array of numbers with the [x0, y0, z0, x1, y1, z1] corners of the block's bounding box.
 */
export const getBlockBoundingBox = (ctBlock) => {
    const mcBlock = ctBlock.type.mcBlock
    return [
        ctBlock.getX() + mcBlock.func_149704_x(),
        ctBlock.getY() + mcBlock.func_149665_z(),
        ctBlock.getZ() + mcBlock.func_149706_B(),
        ctBlock.getX() + mcBlock.func_149753_y(),
        ctBlock.getY() + mcBlock.func_149669_A(),
        ctBlock.getZ() + mcBlock.func_149693_C()
    ]
}

export const getHighestBlock = (x, z) => {
    for (let y = 255; y > 0; y--) {
        let id = World.getBlockAt(x, y, z)?.type?.getID()
        // Ignore gold blocks too because of Gold room with a random ass gold block on the roof sometimes.
        if (id == 0 || id == 41) continue
        return y
    }
    return null
}

/**
 * @deprecated - Use PriceUtils#getBINPriceAfterTax instead
 */
export const getBINPriceAfterTax = (initialPrice) => {
    if (initialPrice < 10_000_000) return initialPrice * (1 - 0.01)
    if (initialPrice < 100_000_000) return initialPrice * (1 - 0.02)

    return initialPrice * (1 - 0.025)
}


/**
 * Rotates a set of coordinates clockwise.
 * @param {[Number, Number, Number]} coordinates 
 * @param {Number} degree - Angle in 90 degree intervals 
 * @returns 
 */
export const rotateCoords = ([x, y, z], degree) => {
    if (degree < 0) degree = degree + 360

    if (degree == 0) return [x, y, z]
    if (degree == 90) return [z, y, -x]
    if (degree == 180) return [-x, y, -z]
    if (degree == 270) return [-z, y, x]
    return [x, y, z]
}

/**
 * Gets the player's yaw in range 0 to 360
 * @returns {Number}
 */
export const getAbsoluteYaw = (yaw=null) => {
    if (yaw == null) yaw = Player.getYaw()
    if (yaw < 0) return (yaw % 360) + 360
    
    return yaw % 360
}

/**
 * Gets the player's pitch in range 0 to 360
 * @returns {Number}
 */
export const getAbsolutePitch = (pitch=null) => {
    if (pitch == null) pitch = Player.getPitch()
    if (pitch < 0) return (pitch % 180) + 180

    return pitch % 180
}


/**
 * Gets the x, y and z components of the entity's motion in blocks per tick
 * @param {MCEntity | Entity} entity 
 * @returns {[Number, Number, Number] | null}
 */
export const getEntityMotion = (entity) => {
    if (entity instanceof Entity) entity = entity.getEntity()
    if (!(entity instanceof MCEntity)) return null
    //            .motionX              .motionY              .motionZ
    return [entity.field_70159_w, entity.field_70181_x, entity.field_70179_y]
}

/**
 * Returns the how fast the entity is travelling in blocks per tick
 * @param {Entity | MCEntity} entity 
 * @returns 
 */
export const getEntityVelocity = (entity, excludeVertical=false) => {
    const motionComponents = getEntityMotion(entity)

    if (!motionComponents) return null
    if (excludeVertical) motionComponents[1] = 0

    return Math.sqrt(motionComponents.reduce((a, b) => a + Math.pow(b, 2), 0))
}

/**
 * Maps a number between two values using MathLib.map() but clamps the number to
 * between the minimum/maximum values instead of mapping on either side.
 * 
 * @param {Number} number 
 * @param {Number} in_min 
 * @param {Number} in_max 
 * @param {Number} out_min 
 * @param {Number} out_max 
 * @returns 
 */
export const clampAndMap = (number, in_min, in_max, out_min, out_max) => {
    if (number <= in_min) return out_min
    if (number >= in_max) return out_max
    
    return MathLib.map(number, in_min, in_max, out_min, out_max)
}

/**
 * Recursively deep copies an object or array. Any new Objects or Arrays created in the copy will not
 * be a reference to the original, they will be new and can be modified without altering the place they were
 * copied from.
 * @param {Object} obj 
 * @returns {Object}
 */
export const deepCopyObject = (obj) => {
    // Duplicate the array
    if (Array.isArray(obj)) return obj.map(a => deepCopyObject(a))
    // Not an Object or Array
    else if (typeof(obj) !== "object" || obj == null) return obj

    // Only Objects left, create a new one and clone the keys and values into the new one
    return Object.entries(obj).reduce((a, [k, v]) => {
        a[k] = deepCopyObject(v)
        return a
    }, {})
}

/**
 * Opens a URL in the default browser
 * @param {String} url - The URL to open
 */
export const openUrl = (url) => {
    java.awt.Desktop.getDesktop().browse(new java.net.URI(url))
}


/**
 * Uncompresses gzipped base64 data (From Hypixel API) and returns an NBTTagCompound of the decoded data
 * 
 * Yoinked from Soopy
 * @param {String} data - The gzipped base64 data
 * @returns 
 */
export const unzipGzipData = (data) => {
    if (!data) return null

    return new NBTTagCompound(CompressedStreamTools.func_74796_a(new ByteArrayInputStream(Base64.getDecoder().decode(data))))
}

/**
 * Returns the median of the given sorted array, or null if the array is empty
 * @param {Array<Number>} array 
 * @returns {Number | null}
 */
export const getMedian = (array) => {
    if  (!Array.isArray(array) || array.length == 0) return null

    // Array is an odd number, can find center easily
    if (array.length % 2 == 1) {
        return array[array.length >> 1] // Same as dividing by 2
    }

    // Even number, need to do find the average of the two middle values
    const mid = (array.length - 1) >> 1

    return (array[mid] + array[mid+1]) / 2
}
