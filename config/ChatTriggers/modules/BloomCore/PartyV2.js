
export default new class Party {
    constructor() {
        this.members = {} // "Username": {name: "UnclaimedBloom6", rank: "", formattedRank: "&7", formattedName: "&7UnclaimedBloom6"}
        this.size = 0
        this.leader = null // Unformatted username
        this.inParty = false

        this.cachedranks = {} // {"UnclaimedBloom6": "&c[ADMIN]"}

        this.partyCreatedListeners = []
        this.partyDisbandRegisters = []

        this.memberJoinedFuncs = []
        this.memberLeftFuncs = []

        register("chat", (rank, name) => {
            this._addMember(name, rank)
        }).setCriteria(/^((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ejoined the party.&r$/) // https://regex101.com/r/eDxnco/1

        register("chat", (_, name) => {
            this._removeMember(name)
        }).setCriteria(/^((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ehas left the party.&r$/)

        register("chat", (_, name) => {
            this._removeMember(name)
        }).setCriteria(/^((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ehas been removed from the party.&r$/)

        register("chat", (rank, name) => {
            this._addMember(name, rank)
        }).setCriteria(/^((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&einvited .+ &r&eto the party! They have &r&c60 &r&eseconds to accept.&r$/)

        register("chat", (rank, name) => {
            this._addMember(name, rank, true)
        }).setCriteria(/^&r&9Party &8> ((?:&.(?:\[[^\]]+\])?)) *(\w+)&f: &r.+&r$/)

        register("chat", (rank, name) => {
            this._addMember(name, rank)
            this.leader = name

            this._addMember(Player.getName())
        }).setCriteria(/^&eYou have joined &r((?:&.(?:\[[^\]]+\])?)) *(\w+)'s &r&eparty!&r$/)

        register("chat", (rest) => {
            const segments = rest.split(" ● &r")
            for (let segment of segments) {
                let match = segment.match(/^((?:&.(?:\[[^\]]+\])?)) *(\w+)&r&(.)$/) // https://regex101.com/r/jCuCDD/1

                if (!match) continue

                let [_, rank, name, dotColor] = match

                this._addMember(name, rank, dotColor == "a")
            }
        }).setCriteria(/^&eParty (?:Members|Moderators): &r(.+)$/)

        register("chat", (rank, name, dotColor) => {
            this._addMember(name, rank)
            this.leader = name

            if (dotColor == "a") {
                this.members[name].online = true
            }
            else if (dotColor == "c") {
                this.members[name].online = false
            }
        }).setCriteria(/^&eParty Leader: (?:&r)?((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&(\w)●&r$/) // https://regex101.com/r/VDlXZY/1

        register("chat", (rank, name) => {
            this._addMember(name, rank, false)
        }).setCriteria(/^^((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ehas disconnected, they have &r&c5 &r&eminutes to rejoin before they are removed from the party\.&r$$/)

        register("chat", (rank, name) => {
            this._addMember(name, rank, false)
            this.leader = name
        }).setCriteria(/^&eThe party leader, &r((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ehas disconnected, they have &r&c5 &r&eminutes to rejoin before the party is disbanded\.&r$/)

        register("chat", (rank, name, rank2, name2) => {
            this._addMember(name, rank)
            this.leader = name

            this._addMember(name2, rank2)
        }).setCriteria(/^&eThe party was transferred to &r((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&eby &r((?:&.(?:\[[^\]]+\])?)) *(\w+)&r$/)

        register("chat", (rank1, name1, leaderRank, leaderName) => {
            if (leaderName == Player.getName()) {
                this._disband()
                return
            }

            this._addMember(name1, rank1)
            this.leader = name1
            this._removeMember(leaderName)
        }).setCriteria(/^&eThe party was transferred to &r((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&ebecause &r((?:&.(?:\[[^\]]+\])?)) *(\w+) &r&eleft&r$/)

        register("chat", (color, name) => {
            this._addMember(name)
        }).setCriteria(/^&dParty Finder &r&f> &r(&.)(\w{1,16}) &r&ejoined the dungeon group! \(&r&b(\w+) Level (\d+)&r&e\)&r$/)

        // General chat to extract names and ranks
        register("chat", (sbLevel, emblem, rank, name, message) => {
            this.cachedranks[name] = rank
        }).setCriteria(/^(?:(?:&.)+\[(?:&.)+(\d+)(?:&.)+\] )?(?:(?:&.)+([^\w]) )?(&r(?:&.\[[^\]]+\]|&7))\s?(\w{1,16})(?:&.)+: (.+)$/) // https://regex101.com/r/G5tv03/1

        const disbands = [
            /^.+ &r&ehas disbanded the party!&r$/,
            /^&eYou have been kicked from the party by .+ &r&e&r$/,
            /^&cThe party was disbanded because all invites expired and the party was empty\.&r$/,
            /^&cThe party was disbanded because the party leader disconnected\.&r$/,
            /^&eYou left the party\.&r$/,
			/^&6Party Members \(\d+\)&r$/,
            /^You are not currently in a party\.$/,
        ]

        for (let regex of disbands) {
            register("chat", () => {
                this._disband()
            }).setCriteria(regex)
        }
    }

    _addMember(player, rank="", online=true) {
        if (!this.inParty) {
            for (let i = 0; i < this.partyCreatedListeners.length; i++) {
                this.partyCreatedListeners[i]()
            }
        }
        this.inParty = true

        if (rank == "" && player in this.cachedranks) {
            rank = this.cachedranks[player]
        }

        // Cache ranks
        if (rank !== "" && !(player in this.cachedranks)) {
            this.cachedranks[player] = rank
        }

        const isNew = player in this.members

        this.members[player] = {
            name: player,
            rank: rank.removeFormatting(),
            formattedRank: rank,
            formattedName: this.getFormattedName(player),
            online: online,
        }

        if (isNew) {
            for (let i = 0; i < this.memberJoinedFuncs.length; i++) {
                this.memberJoinedFuncs[i](player)
            }
        }

        this.size = Object.keys(this.members).length
    }

    _removeMember(player) {
        for (let i = 0; i < this.memberLeftFuncs.length; i++) {
            this.memberLeftFuncs[i](player)
        }

        delete this.members[player]

        this.size = Object.keys(this.members).length

        if (this.size == 0) {
            this._disband()
        }
    }

    _disband() {
        this.members = {}
        this.size = 0
        this.leader = null
        this.inParty = false

        for (let i = 0; i < this.partyDisbandRegisters.length; i++) {
            this.partyDisbandRegisters[i]()
        }
    }

    /**
     * Runs a function when you join a party
     * @param {Function} func 
     */
    onPartyJoined(func) {
        this.partyCreatedListeners.push(func)
    }

    /**
     * Runs a function when you are no longer in a party
     * @param {Function} func 
     */
    onPartyDisband(func) {
        this.partyDisbandRegisters.push(func)
    }

    /**
     * @callback MemberChangeFunc
     * @param {String} player
    */

    /**
     * Runs a function when a player joins the party
     * @param {MemberChangeFunc} func 
     */
    onPlayerJoined(func) {
        this.memberJoinedFuncs.push(func)
    }

    /**
     * Runs the function when a player leaves or is kicked from the party
     * @param {MemberChangeFunc} func 
     */
    onPlayerLeft(func) {
        this.memberLeftFuncs.push(func)
    }

    getFormattedName(player) {
        if (!(player in this.cachedranks)) {
            return player
        }

        const rank = this.cachedranks[player]

        let formattedName = `${rank}`
        if (!/^(?:&.)*$/.test(rank)) {
            formattedName += " "
        }
        
        return formattedName + player
    }
}