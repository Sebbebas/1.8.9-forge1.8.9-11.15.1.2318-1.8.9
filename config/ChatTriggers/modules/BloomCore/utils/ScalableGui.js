import PogObject from "../../PogData"

/**
 * A helper gui to help with moving and saving gui elements which need to be
 * scaled.
 * 
 * Scrolling will increase or decrease the scale field, and dragging will change the x and y fields
 * to where the cursor is on the screen.
 * 
 * To open this with a Vigilance gui, register a command to open the gui, and then have a button in Vigilance to run that command.
 */
export default class ScalableGui {
    /**
     * Creates a new ScalableGui.
     * 
     * NOTE: The subObject must already have a valid "x", "y", and "scale" field.
     * 
     * An example of how to use this class can be found at the bottom of the file.
     * 
     * @param {PogObject} pogObj - The main PogObject that the data will be saved to.
     * @param {Object} subObject - The sub-object to save to. For example "myPogObject.myFeature".
     */
    constructor(pogObj, subObject) {
        this.obj = pogObj
        this.subObj = subObject

        // In case they don't exist yet
        if (!("x" in this.subObj)) this.subObj.x = 0
        if (!("y" in this.subObj)) this.subObj.y = 0
        if (!("scale" in this.subObj)) this.subObj.scale = 1

        this.gui = new Gui()

        // The rendering functions. Stored here to allow for auto translating/scaling
        this.renderFuncs = [] // {func: Function, autoTranslate: false}
        this.renderTrigger = register("renderOverlay", () => {
            this.renderFuncs.forEach(entry => {
                const { func, autoTranslate } = entry
                // Set the rendering stuff
                if (autoTranslate) {
                    Renderer.translate(this.getX(), this.getY())
                    Renderer.scale(this.getScale())
                }

                func()

                if (autoTranslate) Renderer.finishDraw()
            })
        }).unregister()

        // Optimization so the trigger isn't active when it doesn't need to be.
        this.gui.registerOpened(() => this.renderTrigger.register())
        this.gui.registerClosed(() => this.renderTrigger.unregister())

        this.gui.registerScrolled((mx, my, dir) => {
            if (dir == 1) this.subObj.scale += 0.02
            else this.subObj.scale -= 0.02
            this.obj.save()
        })

        this.gui.registerMouseDragged((mx, my, btn, lastClick) => {
            this.subObj.x = mx
            this.subObj.y = my
            this.obj.save()
        })
    }

    /**
     * This function will be run every time the gui is drawn. This is where the render code should go.
     * @param {Function} func 
     * @param {Boolean} autoTranslate - Automatically translates and scales the rendering so you don't have to.
     */
    onRender(func, autoTranslate=false) {
        this.renderFuncs.push({ func, autoTranslate })
    }

    /**
     * Registers a command to open this ScalableGui
     * @param {String} commandName - The name of the command
     * @returns {ScalableGui} - This object for chaining
     */
    setCommand(commandName) {
        register("command", () => {
            this.open()
        }).setName(commandName)
        
        return this
    }

    /**
     * 
     * @returns {Number}
     */
    getX() {
        return this.subObj.x ?? 0
    }

    /**
     * 
     * @returns {Number}
     */
    getY() {
        return this.subObj.y ?? 0
    }

    /**
     * 
     * @returns {Number} - The current scale of the gui
     */
    getScale() {
        return this.subObj.scale ?? 1
    }

    /**
     * Open the gui
     */
    open() {
        this.gui.open()
    }

    /**
     * Close the gui
     */
    close() {
        this.gui.close()
    }
    
    /**
     * Runs a function when the gui is opened
     * @param {Function} func 
     */
    onOpen(func) {
        this.gui.registerOpened(func)
    }

    /**
     * Runs a function when the gui is closed
     * @param {Function} func 
     */
    onClose(func) {
        this.gui.registerClosed(func)
    }

    /**
     * 
     * @returns {Boolean}
     */
    isOpen() {
        return this.gui.isOpen()
    }
}

/*

// Example of how to use this class

// Example of what your PogObject might look like
const myData = new PogObject("GamerModule", {
    myFeature: {
        x: 0, // Some default x coordinate
        y: 0, // And some default y
        scale: 1 // Scale is not 0 since then it would be invisible (too small)
    },
    someOtherStuff: [],
    andMoreStuff: 0
})

// Create the ScalableGui and set it to open with the command "gamermodule"
const editGui = new ScalableGui(myData, myData.myFeature).setCommand("gamermodule")

editGui.onRender(() => {
    // The render code for the gui element you want to render would to here.
    // This is an example of rendering some text in the currently set position

    const myString = "Cool edit gui!"

    // Move to the position we want to render before we scale
    Renderer.translate(editGui.getX(), editGui.getY())

    // Scale the text
    Renderer.scale(editGui.getScale())

    // And render the string.
    Renderer.drawString(myString, 0, 0)
})

*/