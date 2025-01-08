
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
const S30PacketWindowItems = Java.type("net.minecraft.network.play.server.S30PacketWindowItems")
const S38PacketPlayerListItem = Java.type("net.minecraft.network.play.server.S38PacketPlayerListItem")
const S3EPacketTeams = Java.type("net.minecraft.network.play.server.S3EPacketTeams")

const triggerEvent = (functionArray, ...args) => functionArray.forEach(func => func(...args))

/**
 * @callback ScoreboardLineFunction
 * @param {Int} line - The line
 * @param {String} text - The new text for that line
 */

const scoreboardLineFuncs = []
/**
 * Runs a function when a new Scoreboard line is received.
 * @param {ScoreboardLineFunction} method 
 */
export const onScoreboardLine = (method) => scoreboardLineFuncs.push(method)

register("packetReceived", (packet) => {
    const channel = packet.func_149307_h()
    if (channel !== 2) return

    const teamStr = packet.func_149312_c()
    const teamMatch = teamStr.match(/^team_(\d+)$/)
    if (!teamMatch) return

    const line = parseInt(teamMatch[1])
    const message = packet.func_149311_e().concat(packet.func_149309_f())
    
    triggerEvent(scoreboardLineFuncs, line, message)
}).setFilteredClass(S3EPacketTeams)


/**
 * @callback TablistAddFunc
 * @param {String} text - The text which was added or changed
 */

const tablistAddFuncs = []
const tablistUpdateFuncs = []

/**
 * 
 * @param {TablistAddFunc} func 
 * @returns 
 */
export const onTabLineAdded = (func) => tablistAddFuncs.push(func)

/**
 * 
 * @param {TablistAddFunc} func 
 * @returns 
 */
export const onTabLineUpdated = (func) => tablistUpdateFuncs.push(func)
register("packetReceived", (packet) => {
    const players = packet.func_179767_a() // .getPlayers()
    const action = packet.func_179768_b() // .getAction()

    if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME && action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return
    
    players.forEach(addPlayerData => {
        const name = addPlayerData.func_179961_d() // .getDisplayName()
        if (!name) return
        const text = name.func_150254_d() // .getFormattedText()
        if (action == S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) triggerEvent(tablistUpdateFuncs, text)
        if (action == S38PacketPlayerListItem.Action.ADD_PLAYER) triggerEvent(tablistAddFuncs, text)
    })
}).setFilteredClass(S38PacketPlayerListItem)


/**
 * @callback OpenWindowPacket
 * @param {String} windowTitle
 * @param {Number} windowID
 * @param {Boolean} hasSlots
 * @param {Number} slotCount
 * @param {Number} guiID
 * @param {Number} entityID
 * @param {CancellableEvent} event
 */

const openWindowFuncs = []

/**
 * Fired every time an S2DPacketOpenWindow packet is received.
 * @param {OpenWindowPacket} func 
 * @returns 
 */
export const onOpenWindowPacket = (func) => openWindowFuncs.push(func)

register("packetReceived", (packet, event) => {
    const windowTitle = packet.func_179840_c().func_150254_d()
    const windowID = packet.func_148901_c()
    const hasSlots = packet.func_148900_g()
    const slotCount = packet.func_148898_f()
    const guiID = packet.func_148902_e()
    const entityID = packet.func_148897_h()

    triggerEvent(openWindowFuncs, windowTitle, windowID, hasSlots, slotCount, guiID, entityID, event)
}).setFilteredClass(S2DPacketOpenWindow)


/**
 * @callback WindowItemsReceived
 * @param {MCItemStack[]} items
 * @param {Number} windowID
 * @param {CancellableEvent} event
 */

const windowItemsPacketFuncs = []

/**
 * Triggered when an S30PacketWindowItems packet is received. 
 * @param {WindowItemsReceived} func 
 * @returns 
 */
export const onWindowItemsPacket = (func) => windowItemsPacketFuncs.push(func)

register("packetReceived", (packet, event) => {
    const itemStacks = packet.func_148910_d()
    const windowID = packet.func_148911_c()

    triggerEvent(windowItemsPacketFuncs, itemStacks, windowID, event)
}).setFilteredClass(S30PacketWindowItems)


/**
 * @callback ItemSetSlotReceived
 * @param {MCItemStack} item
 * @param {Number} slot
 * @param {Number} windowID
 * @param {CancellableEvent} event
 */

const setSlotFunctions = []

/**
 * 
 * @param {ItemSetSlotReceived} func 
 * @returns 
 */
export const onSetSlotReceived = (func) => setSlotFunctions.push(func)

register("packetReceived", (packet, event) => {
    const item = packet.func_149174_e()
    const slot = packet.func_149173_d()
    const windowID = packet.func_149175_c()

    triggerEvent(setSlotFunctions, item, slot, windowID, event)
}).setFilteredClass(S2FPacketSetSlot)

const chatFuncs = []

class ChatPacketEvent {

    constructor(func) {
        this.func = func
        this.criteria = null
        this.formatted = false // Event should run on formatted messages
        this.isActive = false
        this.register()
    }

    /**
     * 
     * @param {RegExp | String} criteria - The criteria. Capture groups are supported, and will be passed in before the event argument.
     * @returns 
     */
    setCriteria(criteria) {
        this.criteria = criteria
        
        // Test for color codes
        let rawCriteria = criteria
        if (criteria instanceof RegExp) rawCriteria.source
        this.formatted = /[§&]./g.test(rawCriteria)

        return this
    }

    trigger(msg, event) {
        // No criteria has been set, so the trigger is activated
        if (!this.criteria) {
            this.func(event)
            return
        }

        if (this.criteria instanceof RegExp) {
            const match = msg.match(this.criteria)
            if (!match) return
    
            this.func(...match.slice(1), event)
        }

        if (typeof(this.criteria) == "string" && msg == this.criteria) {
            this.func(event)
        }
    }

    isRegistered() {
        return this.isActive
    }

    register() {
        this.isActive = true
        if (!chatFuncs.includes(this)) chatFuncs.push(this)
        return this
    }

    unregister() {
        this.isActive = false
        const idx = chatFuncs.indexOf(this)
        if (idx !== -1) chatFuncs.splice(idx, 1)
        return this
    }
}

/**
 * @callback ChatPacketFunction
 * @param {...*} args
 * @param {CancellableEvent} event
 */

/**
 * 
 * @param {ChatPacketFunction} func The function to be run when the packet is received.
 * If the criteria regex contains capturing groups, will return those groups too. The final argument
 * will always be the packet received event. (Safe to cancel since it's a Chat packet) 
 * @returns {ChatPacketEvent}
 */
export const onChatPacket = (func) => {
    let trigger = new ChatPacketEvent(func).register()
    return trigger
}

register("packetReceived", (packet, event) => {
    if (packet.func_148916_d()) return

    const chatComponent = packet.func_148915_c()
    const formatted = chatComponent.func_150254_d()
    const unformatted = formatted.removeFormatting()

    chatFuncs.forEach(trigger => {
        if (trigger.formatted) trigger.trigger(formatted, event)
        else trigger.trigger(unformatted, event)
})
}).setFilteredClass(S02PacketChat)

register("command", (...message) => {
    message = message.join(" ")
    let unformatted = message.removeFormatting()
    chatFuncs.forEach(trigger => {
        if (trigger.formatted) trigger.trigger(message, null)
        else trigger.trigger(unformatted, null)
    })
}).setName("simulatechatpacket")
