import Dungeon from "./dungeons/Dungeon";
import MyPlayer from "./MyPlayer";
import PriceUtils from "./PriceUtils";
import Skyblock from "./Skyblock";
import { bcData, prefix, S02PacketChat } from "./utils/Utils";
import "./utils/ItemAPIGrabber"

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
        if (!args[1]) return ChatLib.chat(`&c/bcore setkey <API_KEY>`)

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
}).setTabCompletions(["setkey", "d", "sb", "mp", "debug"]).setName("bcore")

register("chat", (key) => {
    bcData.apiKey = key
    bcData.save()
    ChatLib.chat(`&8[&bBloomCore&8] &aAPI key has been set!`)
}).setCriteria(/^Your new API key is (.+)$/)

register("command", () => {
    if (!bcData.apiKey) return ChatLib.chat(`${prefix} &cAPI Key not set!`)
    ChatLib.command(`ct copy ${bcData.apiKey}`, true)
    ChatLib.chat(`${prefix} &aCopied your API key to clipboard!`)
}).setName("copykey")

register("command", (key) => {
    if (!key) return ChatLib.chat(`&e/simkey <API_KEY> - Simulates the /api new message with the given API key. This allows your other mods to auto detect your API key from the chat message.`)
    const component = new TextComponent(`§aYour new API key is §r§b${key}§r`).setClick("suggest_command", key)
    const packet = new S02PacketChat(component.chatComponentText)
    Client.getMinecraft().func_147114_u().func_147251_a(packet)
}).setName("simkey")

register("messageSent", (message) => {
    if (message.toLowerCase() !== "/api new") return
    new Message(
        `${prefix} &eHypixel has changed how obtaining API keys works. After getting your new API key from &b`,
        new TextComponent("developer.hypixel.net").setClick("open_url", "https://developer.hypixel.net"),
        `&e, run the &b/simkey <API_KEY> &ecommand to have all of your mods auto detect the API key.`
    ).chat()
})
