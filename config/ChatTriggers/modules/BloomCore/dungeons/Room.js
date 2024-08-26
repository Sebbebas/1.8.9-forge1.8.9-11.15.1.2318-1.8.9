
export default class Room {
    /**
     * Creates a new Room object.
     * roomData is the room's JSON data from the rooms.json file.
     * @param {*} roomData 
     */
    constructor(roomData) {
        // If an array of components is passed instead of a roomData object, do this
        if (Array.isArray(roomData)) {
            this.components = roomData
            return
        }
        this.init(roomData)
    }
    init(roomData) {
        this.name = roomData.name
        this.type = roomData.type
        this.shape = roomData.shape
        this.secrers = roomData.secrets
        this.crypts = roomData.crypts
        this.reviveStones = roomData.revive_stones
        this.journals = roomData.journals
        this.spiders = roomData.spiders
        this.secretDetails = roomData.secretDetails
        this.soul = roomData.soul
        this.roomIDs = roomData.id
    }
}