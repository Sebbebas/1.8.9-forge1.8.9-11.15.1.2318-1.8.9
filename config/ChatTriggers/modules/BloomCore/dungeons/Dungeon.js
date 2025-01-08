/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />


import Skyblock from "../Skyblock"
import { getElectonData, getMojangInfo, getRecentProfile } from "../utils/APIWrappers"
import { onChatPacket, onScoreboardLine, onTabLineUpdated } from "../utils/Events"
import {
    S34PacketMaps,
    bcData,
    convertToSeconds,
    decodeNumeral,
    entryRegexes,
    floorSecrets,
    getMatchFromLines,
    getTabList,
    removeUnicode,
} from "../utils/Utils"

const ItemMap = Java.type("net.minecraft.item.ItemMap")

const EntityZombie = Java.type("net.minecraft.entity.monster.EntityZombie")
const mimicMessages = [
	"mimic dead!",
    "mimic dead",
    "mimic killed!",
    "mimic killed",
	"$skytils-dungeon-score-mimic$",
	"child destroyed!",
	"mimic obliterated!",
	"mimic exorcised!",
	"mimic destroyed!",
	"mimic annhilated!",
    "breefing killed",
    "breefing dead"
]

// const DungeonClassMap = new Map([
//     ["M", "Mage"],
//     ["B", "Berserk"],
//     ["A", "Archer"],
//     ["H", "Healer"],
//     ["T", "Tank"]
// ])

export default new class Dungeon {
    constructor() {
        this.isPaul = false
        this.roomSize = 31
        
        this.inDungeon = false

        this.mapUpdateFuncs = []
        this.dungeonChangeFuncs = []

        this.reset()

        // In case CT is reloaded inside of the dungeon. Can't call checkStuff outside of a trigger
        // since it will be ran before other modules can be loaded
        const initialChecker = register("tick", () => {
            this.checkStuff()
            initialChecker.unregister()
        })
        
        register("tick", (ticks) => {
            if (ticks%10) return
            if (bcData.forceInDungeon) {
                this._setInDungeon(true)
                return
            }
            if (!Skyblock.inSkyblock && !this.inDungeon) return this.reset()
            
            let tabList = getTabList(false)
            if (!tabList || tabList.length < 60) return
            
            this.doPartyAndPuzzleStuff(tabList)
            this.updateScoreCalc()

        })

        entryRegexes.forEach(msg => {
            onChatPacket(() => {
                this.bossEntry = Date.now()
            }).setCriteria(msg)
        })

        onChatPacket(() => {
            if (this.bloodOpened) return
            this.bloodOpened = Date.now()
        }).setCriteria(/^\[BOSS\] The Watcher: .+$/)

        onChatPacket(() => {
            this.watcherSpawned = Date.now()
        }).setCriteria(/\[BOSS\] The Watcher: That will be enough for now\./)

        onChatPacket(() => {
            this.watcherCleared = Date.now()
        }).setCriteria(/\[BOSS\] The Watcher: You have proven yourself\. You may pass\./)

        onChatPacket(() => {
            this.runEnded = Date.now()
        }).setCriteria(/                             > EXTRA STATS </)

        onChatPacket(() => this.openedWitherDoors++).setCriteria(/.+ opened a WITHER door\!/)

        // Spirit pet checker
        register("chat", (player, cause) => {
            if (!this.inDungeon || this.deaths > 0 || !this.time || !bcData.apiKey) return
            if (player == "You") player = Player.getName()
            getMojangInfo(player).then(mojangInfo => {
                const uuid = mojangInfo.id
                getRecentProfile(uuid, null, bcData.apiKey).then(profile => {
                    if (!profile.members[uuid].pets.some(a => a.type == "SPIRIT" && a.tier == "LEGENDARY")) return ChatLib.chat(`&c${mojangInfo.name} does not have a spirit pet`)
                    this.firstDeathSpirit = true
                    ChatLib.chat(`&a${mojangInfo.name} Has a spirit pet!`)
                })
            })
        }).setCriteria(/^ ☠ (\w{1,16}) (.+) and became a ghost\.$/)

        this.registerWhenInDungeon(register("entityDeath", (entity) => {
            let e = entity.getEntity()
            if (!(e instanceof EntityZombie) || ![6, 7].includes(this.floorNumber) || this.mimicKilled) return
            // func_70631_g_ = isChild
            // func_82169_q = getCurrentArmor
            if (!e.func_70631_g_() || e.func_82169_q(0) || e.func_82169_q(1) || e.func_82169_q(2) || e.func_82169_q(3)) return
            this.mimicKilled = true
        }))

        register("chat", (partyMessage) => {
            if (mimicMessages.some(a => a == partyMessage.toLowerCase())) this.mimicKilled = true
        }).setCriteria(/^Party > .*?: (.+)$/)

        this.debugRenderTrigger = register("renderOverlay", () => {
            Renderer.drawString(
                `
                In Dungeon: ${this.inDungeon}
                Party Size: ${this.partySize}
                Secrets Found: ${this.secretsFound}
                Secrets Percent: ${this.secretsPercent}
                Crypts: ${this.crypts}
                Opened Rooms: ${this.openedRooms}
                Completed Rooms: ${this.completedRooms}
                Percent Cleared: ${this.percentCleared}
                Adjusted: ${this.adjustedCompleted}
                Completed Puzzles: ${this.completedPuzzles}
                Incomplete Puzzles: ${this.incompletePuzzles}
                Deaths: ${this.deaths}
                Discoveries: ${this.discoveries}
                Total Secrets: ${this.totalSecrets}
                Total Rooms: ${this.totalRooms}
                Floor: ${this.floor}
                Floor Number: ${this.floorNumber}
                Time: ${this.time}
                Seconds: ${this.seconds}
                Puzzles: ${JSON.stringify(this.puzzles)}
                Party: ${JSON.stringify([...this.party])}
                Skill Score: ${this.skillScore}
                Explore Score: ${this.exploreScore}
                Speed Score: ${this.speedScore}
                Bonus Score: ${this.bonusScore}
                Score: ${this.score}
                Blood Open: ${this.bloodOpen}
                Blood Done: ${this.bloodDone}
                Blod Map Index: ${this.mapBloodIndex}
                Boss Entry: ${this.bossEntry}
                Healing Done: ${this.healingDone}
                Damage Dealt: ${this.damageDealt}
                Milestone: ${this.milestone}
                Dead Players: ${JSON.stringify([...this.deadPlayers])}
                `, 150, 5
            )
            Renderer.drawString(
                `
                Secret Percent Needed: ${this.secretsPercentNeeded}
                Secret Score: ${this.secretsScore}
                Secrets for Max: ${this.secretsForMax},
                Icons: ${JSON.stringify(this.icons)}
                Player Icons: ${JSON.stringify(this.playerIcons)}
                Map Corner: ${JSON.stringify(this.mapCorner)}
                Map Room Size: ${this.mapRoomSize}
                Gap Size: ${this.mapGapSize}
                Classes: ${JSON.stringify(this.classes)}
                `, 300, 5
            )
        }).unregister()
        
        bcData.debugDungeon ? this.debugRenderTrigger.register() : this.debugRenderTrigger.unregister()

        let lastPaulCheck = null
        this.onDungeonChange((inDungeon) => {
            if (!inDungeon) return
            if (Date.now() - lastPaulCheck < 6e5) return

            getElectonData().then(d => {
                // Must have EZPZ perk otherwise cringe !
                this.isPaul = d.mayor.name == "Paul" && d.mayor.perks.some(a => a.name == "EZPZ")
            })
        })

        onScoreboardLine((lineNumber, text) => {
            const cataMatch = text.match(/^ §7⏣ §cThe Catac§combs §7\((\w+)\)$/)
            if (cataMatch) {
                this._setInDungeon(true)

                this.floor = cataMatch[1]
                this.setFloorStuff()
            }

            const clearedMatch = text.match(/^Cleared: §[c6a](\d+)% §8(?:§8)?\(\d+\)$/)
            if (clearedMatch) {
                this.percentCleared = parseInt(clearedMatch[1])
                return
            }

            const timeMatch = text.match(/^Time Elapsed: §a§a([\dsmh ]+)$/)
            if (timeMatch) {
                this.time = timeMatch[1]
                this.seconds = convertToSeconds(this.time)
                if (!this.runStarted) this.runStarted = Date.now()
                return
            }
        })

        onTabLineUpdated((text) => {
            if (text == "§r§b§lDungeon: §r§7Catacombs§r") {
                this._setInDungeon(true)

            }
            if (!this.inDungeon) return

            const secretCountMatch = text.match(/^§r Secrets Found: §r§b(\d+)§r$/)
            if (secretCountMatch) return this.secretsFound = parseInt(secretCountMatch[1])

            const secretPercentMatch = text.match(/^§r Secrets Found: §r§[ea]([\d.]+)%§r$/)
            if (secretPercentMatch) return this.secretsPercent = parseFloat(secretPercentMatch[1])

            const cryptMatch = text.match(/^§r Crypts: §r§6(\d+)§r$/)
            if (cryptMatch) return this.crypts = parseInt(cryptMatch[1])

            const openedRoomsMatch = text.match(/^§r Opened Rooms: §r§5(\d+)§r$/)
            if (openedRoomsMatch) return this.openedRooms = parseInt(openedRoomsMatch[1])

            const completedRoomsMatch = text.match(/^§r Completed Rooms: §r§d(\d+)§r$/)
            if (completedRoomsMatch) return this.completedRooms = parseInt(completedRoomsMatch[1])

            const deathsMatch = text.match(/^§r§a§lTeam Deaths: §r§f(\d+)§r$/)
            if (deathsMatch) return this.deaths = parseInt(deathsMatch[1])

            const discoveriesMatch = text.match(/^§r§a§lDiscoveries: §r§f\((\d+)\)§r$/)
            if (discoveriesMatch) return this.discoveries = parseInt(discoveriesMatch[1])

        })

        // onSetSlotReceived((item, slot) => {
        //     ChatLib.chat(`&aItem: ${item}, Slot: ${slot}`)
        // })
        // onWindowItemsPacket((items, windowId) => {
        //     const ItemMap = Java.type("	net.minecraft.item.ItemMap")

        //     for (let item of items) {
        //         if (!(item instanceof ItemMap)) continue
        //         let mapData = item.func_77873_a()

        //     }
        //     let str = items.reduce((a, b, i) => a + `\n${i}: ${b}`, "")
        //     ChatLib.chat(`&cWindowID: ${windowId}\nItems: ${str}`)
        // })

        register("packetReceived", (packet) => {
            
            this.mapData = ItemMap.func_150912_a(packet.func_149188_c(), World.getWorld())
            
            if (!this.mapCorner) this.doMapStuff()
            this.updateMapIcons()
            this.checkIfBloodDone()
            
            this.mapUpdateFuncs.forEach((func, i) => {
                // ChatLib.chat(`Doing func ${i}: ${func}`)
                func(this.mapData)
            })
        }).setFilteredClass(S34PacketMaps)

        // register("renderOverlay", () => {
        //     if (!this.mapData) return

        //     const mapItemRenderer = Client.getMinecraft().field_71460_t.func_147701_i()

        //     Tessellator.popMatrix()
        //     Renderer.translate(150, 10)
        //     mapItemRenderer.func_148250_a(this.mapData, true)
        //     Renderer.finishDraw()
        // })

        register("worldUnload", () => this.reset())

    }
    reset() {
        this._setInDungeon(false)
        this.time = null
        this.seconds = null
        this.floor = null
        this.floorNumber = null
        this.dungeonType = null

        this.setMapBounds = false
        this.dungeonDimensions = [5, 5] // 0 indexed. So a 6x6 grid for F7 for example.
        
        this.partySize = 0
        /** @type {Set<String>} */
        this.party = new Set()
        this.deadPlayers = new Set()
        this.classes = {}
        this.playerClasses = {} // {"UnclaimedBloom6": {class: "Mage", level: 50, numeral: "L"}}

        /** {"icon-0": {x: 0, y: 0, rotation: 0, player: "UnclaimedBloom6"}, ...} */
        this.icons = {}

        this.puzzles = []
        this.completedPuzzles = 0
        this.incompletePuzzles = 0

        this.crypts = 0
        this.deaths = 0
        this.firstDeathSpirit = false
        this.discoveries = 0
        this.openedWitherDoors = 0

        this.damageDealt = 0
        this.healingDone = 0
        this.milestone = null

        this.openedRooms = 0
        this.completedRooms = 0
        this.adjustedCompleted = 0

        this.secretsFound = 0
        this.totalSecrets = 0
        this.secretsPercent = 0
        this.secretsPercentNeeded = null
        this.secretsForMax = 0
        this.minSecrets = 0
        this.secretsRemaining = 0
        this.mimicKilled = false

        this.totalRooms = 0
        this.percentCleared = 0
        this.bloodDone = false
        this.bloodOpen = false
        this.mapBloodIndex = 0
        this.mapBounds = [[-200, -200], [-10, -10]] // Corners of the dungeon

        // Hotbar map stuff
        /** @type {[Number, Number] | null} */
        this.mapCorner = null // Corner of the map
        this.mapRoomSize = 16 // Room Width
        this.mapGapSize = 20 // Room + Door. Door is always four pixels so no point to scan it.

        this.mapData = null

        this.score = 0
        this.exploreScore = 0
        this.skillScore = 0
        this.speedScore = 0
        this.bonusScore = 0
        this.secretsScore = 0
        this.deathPenalty = 0

        // Timestamps, null by default
        this.runStarted = null
        this.bloodOpened = null
        this.watcherSpawned = null
        this.watcherCleared = null
        this.bossEntry = null
        this.runEnded = null
    }

    /**
     * @callback OnDungeonChangeFunction - A function which is ran whenever the state of inDungeon is changed
     * @param {Boolean} inDungeon - The new inDungeon state
     */

    /**
     * Runs a function any time you enter or exit a Dungeon
     * @param {OnDungeonChangeFunction} func 
     */
    onDungeonChange(func) {
        this.dungeonChangeFuncs.push(func)
    }

    _triggerDungeonChangeFuncs(state) {
        this.dungeonChangeFuncs.forEach(f => f(state))
    }

    _setInDungeon(newState) {
        if (newState !== this.inDungeon) this._triggerDungeonChangeFuncs(newState)
        this.inDungeon = newState
    }

    /**
     * Registers a trigger when a dungeon is entered, and unregisters it when left
     * @param {IRegister} trigger 
     * @param {Boolean} unregisterDefault - Will automatically unregister the trigger
     */
    registerWhenInDungeon(trigger, unregisterDefault=true) {
        if (unregisterDefault) trigger.unregister()
            
        this.onDungeonChange((inDungeon) => {

            if (inDungeon) trigger.register()
            else trigger.unregister()
        })
    }

    /**
     * @callback MapDataReceivedFunction
     * @param {MapData} mapData 
     */

    /**
     * Runs a function when a new map data packet is received
     * @param {MapDataReceivedFunction} func 
     */
    onMapData(func) {
        this.mapUpdateFuncs.push(func)
    }

    setFloorStuff() {
        this.floorNumber = 0
        if (this.floor !== "E") this.floorNumber = parseInt(this.floor[this.floor.length-1])

        this.dungeonType = "The Catacombs"
        if (this.floor.startsWith("M")) this.dungeonType = "Master Mode"

        if (this.floorNumber == 1) this.dungeonDimensions = [3, 4]
        if ([2, 3].includes(this.floorNumber)) this.dungeonDimensions = [4, 4]
        if (this.floorNumber == 4) this.dungeonDimensions = [5, 4]
        if (this.floorNumber >= 5) this.dungeonDimensions = [5, 5]
        
        if (this.setMapBounds) return

        this.setMapBounds = true
        if (this.floor == "E") this.mapBounds[1] = [-74, -74]
        if (this.floorNumber == 1) this.mapBounds[1] = [-74, -42]
        if (this.floorNumber == 2 || this.floorNumber == 3) this.mapBounds[1] = [-42, -42]
        if (this.floorNumber == 4) this.mapBounds[1] = [-10, -42]
        return
    }

    /**
     * Does a check from the Tab List and Scoreboard. This should only be used when reloading CT whilst in a dungeon.
     * @returns 
     */
    checkStuff() {
        const tabList = TabList?.getNames()
        const scoreboard = Scoreboard.getLines().map(a => removeUnicode(a.getName().removeFormatting()))

        this.floor = getMatchFromLines(/^\s*The Catacombs \((.{1,3})\)$/, scoreboard) ?? this.floor
        this._setInDungeon(!!this.floor)

        if (!this.floor) return
        this.setFloorStuff()

        this.secretsFound = getMatchFromLines(/^§r Secrets Found: §r§b(\d+)§r$/, tabList, "int") ?? this.secretsFound
        this.secretsPercent = getMatchFromLines(/^§r Secrets Found: §r§[ea]([\d.]+)%§r$/, tabList, "float") ?? this.secretsPercent
        this.crypts = getMatchFromLines(/^§r Crypts: §r§6(\d+)§r$/, tabList, "int") ?? this.crypts
        this.openedRooms = getMatchFromLines(/^§r Opened Rooms: §r§5(\d+)§r$/, tabList, "int") ?? this.openedRooms
        this.completedRooms = getMatchFromLines(/^§r Completed Rooms: §r§d(\d+)§r$/, tabList, "int") ?? this.completedRooms
        this.deaths = getMatchFromLines(/^§r§a§lDeaths: §r§f\((\d+)\)§r$/, tabList, "int") ?? this.deaths
        this.discoveries = getMatchFromLines(/^§r§a§lDiscoveries: §r§f\((\d+)\)§r$/, tabList, "int") ?? this.discoveries

        this.percentCleared = getMatchFromLines(/^Cleared: (\d+)% \(\d+\)$/, scoreboard, "int") ?? this.percentCleared

        this.updateScoreCalc()
    }

    /**
     * Gets the multipler for the cooldown reduction in Dungeons from the mage ability.
     * If you are not mage this will always be 1.
     * Takes into account your mage level and solo mage bonus.
     * @returns 
     */
    getMageCooldownMultipler() {
        const myName = Player.getName()
        const mages = Object.values(this.playerClasses).reduce((a, b) => a + (b.class == "Mage" ? 1 : 0), 0)
        const isMage = myName in this.playerClasses && this.playerClasses[myName].class == "Mage"
        if (!isMage) return 1

        const classBonus = Math.floor(this.playerClasses[myName].level/2) / 100

        return 1 - 0.25 - classBonus * (mages == 1 ? 2 : 1)
    }

    /**
     * Gets the new ability cooldown after mage cooldown reductions.
     * @param {Number} baseSeconds - The base cooldown of the ability in seconds. Eg 10
     * @returns {Number} - The new time
     */
    getAbilityCooldown(baseSeconds) {
        return baseSeconds * this.getMageCooldownMultipler()
    }

    checkIfBloodDone() {
        if (!this.inDungeon || this.bloodDone || !this.mapCorner) return
        const mapColors = this.mapData.field_76198_e

        if (!mapColors) return

        for (let x = this.mapCorner[0]+(this.mapRoomSize/2); x < 118; x+=this.mapGapSize/2) {
            for (let y = this.mapCorner[1]+(this.mapRoomSize/2)+1; y < 118; y+=this.mapGapSize/2) {
                let i = x + y*128
                if (i%1) break
                if (!mapColors[i]) continue
                let center = mapColors[i-1]
                let roomColor = mapColors[i+5 + 128*4]
                if (roomColor !== 18) continue
                this.bloodOpen = true
                if (center !== 30) continue
                this.bloodDone = true
            }
        }
    }

    doMapStuff() {
        if (!this.mapData) return

        const colors = this.mapData.field_76198_e
        if (!colors) return

        // Find the top left most green pixel and if there are green pixels 15 pixels to the left and below: https://i.imgur.com/j18x8m6.png
        let thing = colors.findIndex((a, i) => a == 30 && i+15 < colors.length && colors[i+15] == 30 && i+128*15 < colors.length && colors[i+15*128] == 30)
        if (thing == -1) return

        // Get the room size. Entrance is always a 1x1 and spawns immediately so it is perfect.
        let i = 0
        while (colors[thing + i] == 30) i++
        this.mapRoomSize = i
        this.mapGapSize = this.mapRoomSize + 4

        // Find the corner of the top left most room on the map
        let x = (thing%128) % this.mapGapSize
        let y = Math.floor(thing/128) % this.mapGapSize
        
        // Adjust for Entrance and Floor 1's altered map position
        if ([0, 1].includes(this.floorNumber)) x += this.mapGapSize
        if (this.floorNumber == 0) y += this.mapGapSize
        
        this.mapCorner = [x, y]
    }

    updateMapIcons() {
        // The order of each player's icons. Eg the first player would be "icon-0", the second "icon-1" etc
        try {
            let iconOrder = [...this.party]
            iconOrder.push(iconOrder.shift()) // Move the first player (You) to the end
            iconOrder = iconOrder.filter(a => !this.deadPlayers.has(a)) // Filter dead players since they have no icon

            if (!this.mapData) return
            let decorators = this.mapData.field_76203_h

            this.icons = {}
            decorators.forEach((iconName, vec4b) => {
                const match = iconName.match(/^icon-(\d+)$/)
        
                if (!match) return
                let [_, iconNumber] = match
                iconNumber = parseInt(iconNumber)
        
                let iconPlayer = null
                if (iconNumber <= iconOrder.length) iconPlayer = iconOrder[iconNumber]
        
                this.icons[iconName] = {
                    x: vec4b.func_176112_b() + 128,
                    y: vec4b.func_176113_c() + 128,
                    rotation: (vec4b.func_176111_d() * 360) / 16 + 180,
                    player: iconPlayer || null
                }
            })
        }
        catch(e) {}
    }

    updateScoreCalc() {
        this.totalSecrets = Math.floor(100/this.secretsPercent * this.secretsFound + 0.5) || 0
        this.secretsRemaining = this.totalSecrets - this.secretsFound
        this.totalRooms = Math.floor(100 / this.percentCleared * this.completedRooms + 0.4) || 36
        this.secretsPercentNeeded = this.floor in floorSecrets ? floorSecrets[this.floor] : 1
        
        // Change the completed rooms so that the score calc is accurate when blood/boss isn't done
        this.adjustedCompleted = this.completedRooms
        if (!this.bloodDone || !this.bossEntry) this.adjustedCompleted++
        if (this.completedRooms <= this.totalRooms - 1 && !this.bloodDone) this.adjustedCompleted++

        this.deathPenalty = this.deaths * -2 + (this.firstDeathSpirit && this.deaths > 0 ? 1 : 0)

        let completedRoomsRatio = this.adjustedCompleted / this.totalRooms

        // Clamp this to 80
        let roomsCompletedScore = 80*completedRoomsRatio
        if (roomsCompletedScore > 80) roomsCompletedScore = 80

        // Skill score can't go lower than 20
        this.skillScore = Math.floor(20 + (roomsCompletedScore) - 10*this.incompletePuzzles + this.deathPenalty)
        if (this.skillScore < 20) this.skillScore = 20

        // Secret score maxed out at 40
        this.secretsScore = 40*((this.secretsPercent/100)/(this.secretsPercentNeeded))
        if (this.secretsScore > 40) this.secretsScore = 40

        // Explore score is 0 when the dungeon hasn't started
        this.exploreScore = Math.floor(60*completedRoomsRatio + this.secretsScore)
        if (!this.time) this.exploreScore = 0

        this.bonusScore = (this.crypts > 5 ? 5 : this.crypts) + (this.mimicKilled ? 2 : 0) + (this.isPaul || bcData.forcePaul ? 10 : 0)

        // I don't want to calculate this
        this.speedScore = 100
        if (this.skillScore > 100) this.skillScore = 100
        if (this.exploreScore > 100) this.exploreScore = 100

        this.score = this.skillScore + this.exploreScore + this.speedScore + this.bonusScore

        this.secretsForMax = Math.ceil(this.totalSecrets * this.secretsPercentNeeded)
        this.minSecrets = Math.floor(this.secretsForMax*((40 - this.bonusScore + (this.deathPenalty))/40))

    }

    doPartyAndPuzzleStuff(tabList) {
        // Party and Classes
        const lines = Array(5).fill().map((_,i) => tabList[i*4+1])
        // Matches the name and class of every player in the party
        // [74] UnclaimedBloom6 (Mage XXXIX)
        const matches = lines.reduce((a, b) => {
            // https://regex101.com/r/cUzJoK/7
            const match = b.match(/^.?\[(\d+)\] (?:\[\w+\] )*(\w+) (?:.)*?\((\w+)(?: (\w+))*\)$/)
            if (!match) return a
            let [_, sbLevel, player, dungeonClass, classLevel] = match
            return a.concat([[player, dungeonClass, classLevel]])
        }, [])

        this.party.clear()
        matches.forEach(a => {
            let [player, dungeonClass, classLevel] = a
            if (!["DEAD", "EMPTY"].includes(dungeonClass)) this.classes[player] = dungeonClass
            this.party.add(player)

            if (!classLevel) return

            this.playerClasses[player] = {
                class: dungeonClass,
                level: decodeNumeral(classLevel),
                numeral: classLevel
            }
        })

        this.deadPlayers = matches.reduce((a, b) => {
            let [player, dungeonClass] = b
            if (dungeonClass == "DEAD") a.add(player)
            return a
        }, new Set())

        this.completedPuzzles = 0
        this.puzzles = tabList.slice(48, 53).reduce((a, b) => {
            const match = b.match(/ (.+): \[[✦|✔|✖].+/)
            if (b.includes("✔")) this.completedPuzzles++
            if (!match) return a
            return a.concat(match[1])
        }, [])
        this.incompletePuzzles = this.puzzles.length - this.completedPuzzles
    }
}
