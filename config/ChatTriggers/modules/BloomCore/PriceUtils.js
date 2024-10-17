import request from "../requestV2"
import { MCItemStack, NBTTagString, bcData, getSbApiItemData, getSkyblockItemID, title } from "./utils/Utils"

const bzFilePath = "data/bz.json"
const binFilePath = "data/bins.json"

const masterStars = [
    "FIRST_MASTER_STAR",
    "SECOND_MASTER_STAR",
    "THIRD_MASTER_STAR",
    "FOURTH_MASTER_STAR",
    "FIFTH_MASTER_STAR"
]

const stackingEnchants = new Set([
    "champion",
    "cultivating",
    "toxophilite",
    "compact",
    "hecatomb",
    "expertise"
])

const promisingTools = [
    "PROMISING_PICKAXE",
    "PROMISING_SPADE",
    "PROMISING_AXE",
    "PROMISING_HOE"
]

export default new class PriceUtils {
    constructor() {
        this.bins = new Map()
        this.bzBuyPrices = new Map()
        this.bzSellPrices = new Map()

        this.locations = {
            AUCTION: 0,
            BAZAAR: 1
        }

        // Read data from file
        this.loadFromBZFile()
        this.loadFromBinFile()

        // Update the prices every 20 mins
        register("tick", () => {
            if (Date.now() - bcData.priceUtilsLastUpdated < 1.2e6) return
            bcData.priceUtilsLastUpdated = Date.now()
            bcData.save()
            this.update()
        })
    }

    /**
     * Loads the last saved bazaar buy/sell prices from file.
     */
    loadFromBZFile() {
        if (!FileLib.exists("BloomCore", bzFilePath)) return
        const bzData = JSON.parse(FileLib.read("BloomCore", bzFilePath))
        Object.entries(bzData).forEach(([k, v]) => {
            this.bzBuyPrices.set(k, v.buy)
            this.bzSellPrices.set(k, v.sell)
        })
    }

    /**
     * Loads the last saved BINs from file.
     */
    loadFromBinFile() {
        if (!FileLib.exists("BloomCore", binFilePath)) return
        const binData = JSON.parse(FileLib.read("BloomCore", binFilePath))
        Object.entries(binData).forEach(([k, v]) => {
            this.bins.set(k, v)
        })
    }

    /**
     * Requests Hypixel's Bazaar API and Moulberry's lowestbin.json file and updates the price data.
     */
    update() {
        // Update Bazaar Prices
        request({url: "https://api.hypixel.net/skyblock/bazaar", json: true}).then(data => {
            if (!data.success || !("products" in data)) return
            let prices = Object.keys(data.products).reduce((a, b) => {
                const p = data.products[b]
                a[b] = {
                    buy: p.quick_status.buyPrice,
                    sell: p.quick_status.sellPrice
                }
                return a
            }, {})
            FileLib.write("BloomCore", bzFilePath, JSON.stringify(prices, null, 4), true)
            this.loadFromBZFile()
        })

        // Update BINs
        request({url: "https://moulberry.codes/lowestbin.json", json: true}).then(data => {
            FileLib.write("BloomCore", binFilePath, JSON.stringify(data, null, 4), true)
            this.loadFromBinFile()
        })
    }

    /**
     * Gets the buy price or BIN or a Skyblock item.
     * If includeLocation is true, it will return something like [ITEM_PRICE, PriceUtils.locations.BAZAAR] or null if no price is found
     * @param {String} skyblockID 
     * @param {Boolean} includeLocation
     * @returns {Number | Array | null}
     */
    getPrice(skyblockID, includeLocation=false) {
        if (this.bzBuyPrices.has(skyblockID)) {
            if (includeLocation) return [
                this.bzBuyPrices.get(skyblockID),
                this.locations.BAZAAR
            ]
            return this.bzBuyPrices.get(skyblockID)
        }
        if (this.bins.has(skyblockID)) {
            if (includeLocation) return [
                this.bins.get(skyblockID),
                this.locations.AUCTION
            ]
            return this.bins.get(skyblockID)
        }
        return null
    }
    
    /**
     * Gets the sell price or lowest BIN of a Skyblock item.
     * If includeLocation is true, it will return something like [ITEM_PRICE, PriceUtils.locations.BAZAAR] or null if no price is found
     * @param {String} skyblockID 
     * @param {Boolean} includeLocation
     * @returns {Number | Array | null}
     */
    getSellPrice(skyblockID, includeLocation=false) {
        if (this.bzSellPrices.has(skyblockID)) {
            if (includeLocation) return [
                this.bzSellPrices.get(skyblockID),
                this.locations.BAZAAR
            ]
            return this.bzSellPrices.get(skyblockID)
        }
        if (this.bins.has(skyblockID)) {
            if (includeLocation) return [
                this.bins.get(skyblockID),
                this.locations.AUCTION
            ]
            return this.bins.get(skyblockID)
        }
        return null
    }

    /**
     * Gets the coins required to upgrade by the given requirements (Using the hypixel Skyblock items API data).
     * @param {*} requirements 
     * @returns 
     */
    getUpgradeCost(requirements) {
        let cost = 0
        for (let upgrade of requirements) {
            let type = upgrade.type
            let amount = upgrade.amount ?? 1

            if (type == "ESSENCE") cost += (this.getPrice(`ESSENCE_${upgrade.essence_type}`) ?? 0) * amount
            else if (type == "ITEM") cost += (this.getPrice(upgrade.item_id) ?? 0) * amount
            else if (type == "COINS") cost += amount
        }
        return cost
    }


    getBINPriceAfterTax(initialPrice) {
        if (initialPrice < 10_000_000) return initialPrice * (1 - 0.01)
        if (initialPrice < 100_000_000) return initialPrice * (1 - 0.02)
    
        return initialPrice * (1 - 0.025)
    }

    /**
     * Gets the value of a book when crafted to it's highest tier. Eg Ultimate Wise 1 book would be calculated as Ultimate Wise 5 / 16
     * @param {Item | String} item 
     */
    getBookPriceWhenCrafted(item, instaSell=false) {
        let itemID = item
        if (item instanceof Item) itemID = getSkyblockItemID(item)

        const match = itemID.match(/^(.+?)(\d+)$/)
        if (!match) return null
        
        const enchantNoTier = match[1]
        const tier = parseInt(match[2])

        let maxTier = tier
        while (this.bzBuyPrices.has(`${enchantNoTier}${maxTier+1}`)) maxTier++
        
        const maxTierId = `${enchantNoTier}${maxTier}`

        const t1sForCurrent = 2 ** (tier - 1)
        const t1sForMax = 2 ** (maxTier - 1)
        const maxTierValue = instaSell ? this.getSellPrice(maxTierId) : this.getPrice(maxTierId)

        if (maxTierValue == null) return null
        
        return maxTierValue / t1sForMax * t1sForCurrent
    }

    /**
     * Gets the value of this enchanted book if it were crafted from T1 enchantments
     * @param {Item | String} item 
     * @param {Boolean} instaSell 
     */
    getBookPriceFromT1s(item, instaSell=false) {
        let itemID = item
        if (item instanceof Item) itemID = getSkyblockItemID(item)

        const match = itemID.match(/^(.+?)(\d+)$/)
        if (!match) return null
        
        const enchantNoTier = match[1]
        const tier = parseInt(match[2])

        const tier1ID = `${enchantNoTier}1`

        const t1sForCurrent = 2 ** (tier - 1)
        const level1Value = instaSell ? this.getSellPrice(tier1ID) : this.getPrice(tier1ID)

        if (level1Value == null) return null
        
        return level1Value * t1sForCurrent
    }

    /**
     * Returns the value of an item taking into account gemstones, recombs, enchants etc.
     * @param {Item | MCTItemStack} itemStack
     * @param {Boolean} returnBreakdown - Returns an object containing a breakdown of the costs of each part of the item. Will return [value, breakdownObject]
     * @returns {Number | [Number, Object]}
     */
    getItemValue(item, returnBreakdown=false) {
        if (item instanceof MCItemStack) item = new Item(item)

        const sbId = getSkyblockItemID(item)
        if (!sbId) return null

        let baseValue = this.getPrice(sbId) ?? 0
        if (item.getRegistryName() == "minecraft:enchanted_book") baseValue = 0
        
        const breakdown = {
            total: baseValue,
            base: baseValue,
        }

        const nbt = item.getNBT()?.toObject()
        const extra = nbt?.tag?.ExtraAttributes
        const itemJsonData = getSbApiItemData(sbId) ?? {}

        if (!extra) return returnBreakdown ? [breakdown.total, breakdown] : breakdown.total

        // // Recomb
        if (extra.rarity_upgrades == 1) {
            breakdown.recomb = this.getPrice("RECOMBOBULATOR_3000") ?? 0
            breakdown.total += breakdown.recomb
        }

        // // Hot Potato Books
        if (extra.hot_potato_count) {
            let hpbCount = extra.hot_potato_count
            let hpbCost = this.getPrice("HOT_POTATO_BOOK") ?? 0
            if (hpbCount > 10) {
                breakdown.hotPotatoBooks = hpbCost * 10
                breakdown.fumings = (this.getPrice("FUMING_POTATO_BOOK") ?? 0) * (hpbCount % 10)
                breakdown.total += breakdown.fumings
            }
            else breakdown.hotPotatoBooks = hpbCost * hpbCount

            breakdown.total += breakdown.hotPotatoBooks
        }

        // Gemstone shit
        if (extra.gems) {
            let gemNbt = extra.gems

            // Unlocked slots cost
            if (gemNbt.unlocked_slots) {
                let unlockedSlots = gemNbt.unlocked_slots
                if ("gemstone_slots" in itemJsonData) {
                    breakdown.gemstoneUnlocks = 0
                    // Store the indexes since the json doesn't
                    let currIndexes = {}
                    for (let unlockableSlot of itemJsonData["gemstone_slots"]) {
                        let type = unlockableSlot.slot_type
                        if (!(type in currIndexes)) currIndexes[type] = -1
                        currIndexes[type]++
                        let typeStr = `${type}_${currIndexes[type]}`
                        if (!unlockedSlots.includes(typeStr)) continue

                        breakdown.gemstoneUnlocks += this.getUpgradeCost(unlockableSlot.costs)
                    }

                    breakdown.total += breakdown.gemstoneUnlocks
                }
            }
            // Actual gemstones cost
            let gemTypes = {} // {"COMBAT_0": "SAPPHIRE", ...}
            let keys = Object.keys(gemNbt)
            // Initialize the gem types for combat, universal etc slots
            for (let key of keys) {
                let match = key.match(/^(\w+_\d+)_gem$/)
                if (!match) continue
                gemTypes[match[1]] = gemNbt[key]
            }

            breakdown.gemstones = 0
            for (let entry of Object.entries(gemNbt)) {
                let [key, value] = entry
                let match = key.match(/^(\w+)_\d+$/)
                if (!match) continue
                let [_, gemType] = match

                if (key in gemTypes) gemType = gemTypes[key]

                // If gemstone is perfect, it will have a UUID and a quality key
                // Otherwise, value will just be the quality
                let gemId = `${value.quality ?? value}_${gemType}_GEM`

                breakdown.gemstones += this.getPrice(gemId)
            }
            breakdown.total += breakdown.gemstones

        }

        // Hype scrolls etc
        if (extra.ability_scroll) {
            breakdown.scrolls = 0
            // Have to use reduce to avoid nullpointerexception, fuck java
            breakdown.scrolls = extra.ability_scroll.reduce((a, b) => a + this.getPrice(b) ?? 0, 0)
            breakdown.total += breakdown.scrolls
        }

        // Art of war
        if (extra.art_of_war_count) {
            breakdown.artOfWar = this.getPrice("THE_ART_OF_WAR")
            breakdown.total += breakdown.artOfWar
        }

        // Dungeon conversion cost
        if (extra.dungeon_item_conversion_cost) {
            breakdown.dungeonConversion = this.getPrice(extra.dungeon_item_conversion_cost) ?? 0
            breakdown.total += extra.dungeonConversion
        }

        // Stars and Master Stars
        if (extra.upgrade_level) {
            let maxUpgrades = itemJsonData?.upgrade_costs?.length || 0
            breakdown.stars = 0
            for (let i = 0; i < Math.min(extra.upgrade_level, maxUpgrades); i++) {
                breakdown.stars += this.getUpgradeCost(itemJsonData.upgrade_costs[i])
            }
            breakdown.total += breakdown.stars

            // Master Stars
            if (extra.upgrade_level > maxUpgrades && extra.upgrade_level - maxUpgrades <= 5) {
                let masterStarCount = extra.upgrade_level - maxUpgrades
                breakdown.masterStars = masterStars.slice(0, masterStarCount).reduce((a, b) => {
                    return a + (this.getPrice(b) ?? 0)
                }, 0)
                breakdown.total += breakdown.masterStars
            }
        }

        // Enchants
        if (extra.enchantments) {
            for (let entry of Object.entries(extra.enchantments)) {
                let [enchant, level] = entry
                if (enchant == "efficiency" && level > 5 && !promisingTools.includes(sbId)) {
                    let silexes = level - 5
                    if (sbId == "STONK_PICKAXE") level--
                    breakdown.silexes = (this.getPrice("SIL_EX") ?? 0) * silexes
                    breakdown.total += breakdown.silexes
                    continue
                }

                if (enchant == "scavenger" && itemJsonData.dungeon_item) {
                    continue
                }

                if (stackingEnchants.has(enchant)) {
                    level = 1
                }

                let enchantStr = `ENCHANTMENT_${enchant.toUpperCase()}_${level}`
                let enchantValue = (this.getPrice(enchantStr) || this.getBookPriceFromT1s(enchantStr)) || 0
                if (!enchantValue) continue
                if (!breakdown.enchantments) breakdown.enchantments = {}
                breakdown.enchantments[`${title(enchant.replace(/_/g, " "))} ${level}`] = enchantValue
                breakdown.total += enchantValue
            }
        }

        // Dyes
        if (extra.dye_item) {
            breakdown.dye = this.getPrice(extra.dye_item) ?? 0
            breakdown.total += breakdown.dye
        }

        // Etherwarp
        if (extra.ethermerge) {
            breakdown.etherwarp = (this.getPrice("ETHERWARP_MERGER") ?? 0) + (this.getPrice("ETHERWARP_CONDUIT") ?? 0) 
            breakdown.total += breakdown.etherwarp
        }

        // Transmission Tuners
        if (extra.tuned_transmission) {
            breakdown.transmissionTuners = (this.getPrice("TRANSMISSION_TUNER") ?? 0) * extra.tuned_transmission
            breakdown.total += breakdown.transmissionTuners
        }

        // Enrichment
        if (extra.talisman_enrichment) {
            breakdown.enrichment = this.getPrice(`TALISMAN_ENRICHMENT_${extra.talisman_enrichment.toUpperCase()}`) ?? 0
            breakdown.total += breakdown.enrichment
        }


        return returnBreakdown ? [breakdown.total, breakdown] : breakdown.total
    }
}