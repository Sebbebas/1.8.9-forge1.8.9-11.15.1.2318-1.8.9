import Dungeon from "./dungeons/Dungeon";
import MyPlayer from "./MyPlayer";
import PriceUtils from "./PriceUtils";
import Skyblock from "./Skyblock";
import { bcData, prefix } from "./utils/Utils";
import "./utils/ItemAPIGrabber"
import PartyV2 from "./PartyV2";

register("command", (...args) => {
    if (!args || !args.length) return
    if (["d", "dung"].includes(args[0])) {
        bcData.debugDungeon = !bcData.debugDungeon
        bcData.debugDungeon ? Dungeon.debugRenderTrigger.register() : Dungeon.debugRenderTrigger.unregister()

    }
    if (["sb", "skyblock"].includes(args[0])) {
        bcData.debugSkyblock = !bcData.debugSkyblock
        bcData.debugSkyblock ? Skyblock.debugRenderTrigger.register() : Skyblock.debugRenderTrigger.unregister()

    }
    if (["mp", "myplayer"].includes(args[0])) {
        bcData.debugMyPlayer = !bcData.debugMyPlayer
        bcData.debugMyPlayer ? MyPlayer.debugRenderTrigger.register() : MyPlayer.debugRenderTrigger.unregister()
    }

    if (args[0] == "setkey") {
        if (!args[1]) return ChatLib.chat(`&c/bcore setkey <API_KEY>\n&cTo reset your API key, run /bcore setkey reset`)

        if (args[1] == "reset") {
            bcData.apiKey = null
            bcData.save()
            ChatLib.chat(`${prefix} &aAPI key reset!`)
            return
        }

        bcData.apiKey = args[1]
        bcData.save()
        ChatLib.chat(`${prefix} &aAPI key has been set!`)
        ChatLib.chat(`&cNOTE: If the API key is invalid or the key has expired, then API requests will stop working and you will need to set a new key.`)
        return
    }

    if (args[0] == "forcepaul") {
        if (!args[1]) bcData.forcePaul = !bcData.forcePaul
        else if (args[1] == "true") bcData.forcePaul = true
        else if (args[1] == "false") bcData.forcePaul = false

        bcData.save()
        ChatLib.chat(`${prefix} &aForced Paul ${bcData.forcePaul ? "&aEnabled" : "&cDisabled"}`)
        if (Dungeon.inDungeon) Dungeon.updateScoreCalc()
        return
    }
    
    if (args[0] == "debug") {
        if (!args[1]) {
            ChatLib.chat(`&e/bcore debug inDungeon|inSkyblock`)
            return
        }
        if (args[1] == "inDungeon") {
            bcData.forceInDungeon = !bcData.forceInDungeon
            ChatLib.chat(`${prefix} forced inDungeon set to ${bcData.forceInDungeon}`)
            Dungeon.checkStuff()
        }
        if (args[1] == "inSkyblock") {
            bcData.forceInSkyblock = !bcData.forceInSkyblock
            ChatLib.chat(`${prefix} forced inSkyblock set to ${bcData.forceInSkyblock}`)
        }
        bcData.save()
    }

    if (args[0] == "updateprices") {
        ChatLib.chat(`${prefix} &aManually updating PriceUtils prices!`)
        PriceUtils.update()
    }
    bcData.save()
}).setTabCompletions((args) => {
    const firstArgs = ["setkey", "d", "sb", "mp", "debug", "updateprices", "forcepaul"]

    if (args.length == 0) {
        return firstArgs
    }

    if (args[0] == "debug" && args.length < 3) {
        const debugCompletions = ["inDungeon", "inSkyblock"]

        return debugCompletions.filter(a => a.toLowerCase().startsWith(args[1].toLowerCase()))
    }

    if (args.length == 1) {
        return firstArgs.filter(a => a.startsWith(args[0].toLowerCase()))
    }

    return []
}).setName("bcore")

register("command", () => {
    if (!bcData.apiKey) return ChatLib.chat(`${prefix} &cAPI Key not set!`)
    ChatLib.command(`ct copy ${bcData.apiKey}`, true)
    ChatLib.chat(`${prefix} &aCopied your API key to clipboard!`)
}).setName("copykey")
