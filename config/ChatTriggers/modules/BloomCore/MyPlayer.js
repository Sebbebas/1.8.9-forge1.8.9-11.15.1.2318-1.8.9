import Skyblock from "./Skyblock"
import { ScoreboardChecker, TabListChecker } from "./utils/DataChecker"
import { bcData, getScoreboard, getTabList, getValue, removeUnicode, toInt } from "./utils/Utils"

export default new class MyPlayer {
    constructor() {
        this.reset()

        register("tick", (ticks) => {
            if (ticks%10) return
            if (!Skyblock.inSkyblock) return
            let scoreboard = getScoreboard(false)
            let tabList = getTabList(false)

            // const removeScoreboardBS = a => parseInt(removeUnicode(a).replace(/,/g, ""))
            this.dataCheckers = [
                new TabListChecker(/ Speed: ✦(\d+)/, this, "speed", "int", false),
                // new TabListChecker(/ Strength: ❁(\d+)/, this, "strength", "int", false),
                // new TabListChecker(/ Crit Chance: ☣(\d+)/, this, "critChance", "int", false),
                // new TabListChecker(/ Crit Damage: ☠(\d+)/, this, "critDamage", "int", false),
                // new TabListChecker(/ Attack Speed: ⚔(\d+)/, this, "attackSpeed", "int", false),
                // new TabListChecker(/ Bank: (.+)\/.+/, this, "bank", null, false).setModifierFunction(toInt),
                // new ScoreboardChecker(/Purse: (.+)/, this, "purse", null, true).setModifierFunction(removeScoreboardBS),
                // new ScoreboardChecker(/Bits: (.+)/, this, "bits", null, true).setModifierFunction(removeScoreboardBS)
            ]
            for (let i = 0; i < this.dataCheckers.length; i++) {
                if (this.dataCheckers[i] instanceof TabListChecker) this.dataCheckers[i].check(tabList)
                if (this.dataCheckers[i] instanceof ScoreboardChecker) this.dataCheckers[i].check(scoreboard)
            }

        })
        
        register("actionBar", (message) => {
            message = message.removeFormatting()
            this.health = getValue(message, /(\d+)\/\d+❤/, this.health, "int")
            this.maxHealth = getValue(message, /\d+\/(\d+)❤/, this.maxHealth, "int")
            this.defense = getValue(message, /(\d+)❈ Defense/, this.defense, "int")
            this.mana = getValue(message, /([\d,]+)\/[\d,]+✎ Mana/, this.mana, "int")
            this.maxMana = getValue(message, /[\d,]+\/([\d,]+)✎ Mana/, this.maxMana, "int")
        }).setCriteria("${message}")

        this.debugRenderTrigger = register("renderOverlay", () => {
            Renderer.drawString(
                `
                Speed: ${this.speed}
                Strength: ${this.strength}
                Crit Chance: ${this.critChance}
                Crit Damage: ${this.critDamage}
                Attack Speed: ${this.attackSpeed}
                Health: ${this.health}
                Max Health: ${this.maxHealth}
                Defense: ${this.defense}
                Mana: ${this.mana}
                Max Mana: ${this.maxMana}
                Purse: ${this.purse}
                Bits: ${this.bits}
                Bank: ${this.bank}
                `, 500, 40
            )
        }).unregister()

        bcData.debugMyPlayer ? this.debugRenderTrigger.register() : this.debugRenderTrigger.unregister()

    }
    reset() {
        this.speed = 0
        this.strength = 0
        this.critChance = 0
        this.critDamage = 0
        this.attackSpeed = 0
        this.health = 0
        this.maxHealth = 0
        this.defense = 0
        this.mana = 0
        this.maxMana = 0
        this.bank = 0
    }
}