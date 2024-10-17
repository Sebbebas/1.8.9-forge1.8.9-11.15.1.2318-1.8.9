import { getBlockBoundingBox } from "./utils/Utils"

const renderBoxOutlineFromCorners = (x0, y0, z0, x1, y1, z1, r, g, b, a, lineWidth=2, phase=true) => {
    Tessellator.pushMatrix()

    GL11.glLineWidth(lineWidth)
    Tessellator.begin(3)
    Tessellator.depthMask(false)
    Tessellator.disableTexture2D()
    Tessellator.enableBlend()
    
    if (phase) Tessellator.disableDepth()
    
    Tessellator.colorize(r, g, b, a)

    Tessellator.pos(x0, y0, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z1).tex(0, 0)
    Tessellator.pos(x0, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z1).tex(0, 0)
    Tessellator.pos(x0, y0, z1).tex(0, 0)
    Tessellator.pos(x0, y1, z1).tex(0, 0)
    Tessellator.pos(x0, y1, z0).tex(0, 0)
    Tessellator.pos(x1, y1, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    
    Tessellator.draw()
    
    if (phase) Tessellator.enableDepth()

    Tessellator.enableTexture2D()
    Tessellator.disableBlend()
    Tessellator.depthMask(true)
    Tessellator.popMatrix()
}

const renderFilledBoxFromCorners = (x0, y0, z0, x1, y1, z1, r, g, b, a, phase=true) => {
    Tessellator.pushMatrix()

    Tessellator.begin(GL11.GL_QUADS)
    GlStateManager.func_179129_p(); // disableCullFace
    Tessellator.depthMask(false)
    Tessellator.disableTexture2D()
    Tessellator.enableBlend()
    
    if (phase) Tessellator.disableDepth()
    
    Tessellator.colorize(r, g, b, a)
    
    Tessellator.pos(x1, y0, z1).tex(0, 0)
    Tessellator.pos(x1, y0, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z1).tex(0, 0)

    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y1, z1).tex(0, 0)

    Tessellator.pos(x0, y1, z1).tex(0, 0)
    Tessellator.pos(x0, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z1).tex(0, 0)

    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z1).tex(0, 0)

    Tessellator.pos(x1, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y1, z0).tex(0, 0)
    Tessellator.pos(x0, y0, z0).tex(0, 0)
    Tessellator.pos(x1, y0, z0).tex(0, 0)

    Tessellator.pos(x0, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x1, y0, z1).tex(0, 0)
    Tessellator.pos(x0, y0, z1).tex(0, 0)

    Tessellator.draw()
    
    if (phase) Tessellator.enableDepth()

    GlStateManager.func_179089_o(); // enableCull
    Tessellator.enableTexture2D()
    Tessellator.disableBlend()
    Tessellator.depthMask(true)
    Tessellator.popMatrix()
}

/**
 * 
 * @param {Number} x0 - Corner 1 x coordinate
 * @param {Number} y0 - Corner 1 y coordinate
 * @param {Number} z0 - Corner 1 z coordinate
 * @param {Number} x1 - Corner 2 x coordinate
 * @param {Number} y1 - Corner 2 y coordinate
 * @param {Number} z1 - Corner 2 z coordinate
 * @param {Number} r - 0-1
 * @param {Number} g - 0-1
 * @param {Number} b - 0-1
 * @param {Number} a - 0-1
 * @param {Boolean} phase - The box can be seen through walls
 * @param {*} lineWidth - Does not affect filled boxes
 * @param {*} filled - Render a box with filled walls instead of a frame
 * @returns 
 */
export const renderBoxFromCorners = (x0, y0, z0, x1, y1, z1, r, g, b, a, phase=true, lineWidth=2, filled=false) => {
    if (filled) return renderFilledBoxFromCorners(x0, y0, z0, x1, y1, z1, r, g, b, a, phase)
    renderBoxOutlineFromCorners(x0, y0, z0, x1, y1, z1, r, g, b, a, lineWidth, phase)
}


/**
 * 
 * @param {Number[][]} points - List of vertices as [[x, y, z], [x, y, z], ...]
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @param {Number} a 
 * @param {Boolean} phase - Show the line through walls
 * @param {Number} lineWidth - The width of the line
 */
export const drawLineThroughPoints = (points, r, g, b, a, phase=true, lineWidth=2, loop=false) => {
    Tessellator.pushMatrix()

    GL11.glLineWidth(lineWidth)
    GlStateManager.func_179129_p(); // disableCullFace
    Tessellator.depthMask(false)
    Tessellator.disableTexture2D()
    Tessellator.enableBlend()
    
    if (phase) Tessellator.disableDepth()
    
    if (loop) Tessellator.begin(GL11.GL_LINE_LOOP)
    else Tessellator.begin(3)

    Tessellator.colorize(r, g, b, a)
    for (let i = 0; i < points.length; i++) {
        Tessellator.pos(points[i][0], points[i][1], points[i][2])
    }

    Tessellator.draw()
    
    if (phase) Tessellator.enableDepth()

    GlStateManager.func_179089_o(); // enableCull
    Tessellator.enableTexture2D()
    Tessellator.disableBlend()
    Tessellator.depthMask(true)
    Tessellator.popMatrix()
}

export const renderBoxOutline = (x, y, z, w, h, r, g, b, a, lineWidth=2, phase=true) => {
    renderBoxOutlineFromCorners(x-w/2, y, z-w/2, x+w/2, y+h, z+w/2, r, g, b, a, lineWidth, phase)
}

export const renderFilledBox = (x, y, z, w, h, r, g, b, a, phase=true) => {
    renderFilledBoxFromCorners(x-w/2, y, z-w/2, x+w/2, y+h, z+w/2, r, g, b, a, phase)
}

/**
 * 
 * @param {Block} ctBlock - The CT Block to render
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @param {Number} a 
 * @param {Boolean} phase - Render through walls
 * @param {Number} lineWidth - Line width, only effective if filled=false
 * @param {Boolean} filled - Draw the box with walls filled in
 */
export const renderBlockHitbox = (ctBlock, r, g, b, a, phase=true, lineWidth=2, filled=false) => {
    const [x0, y0, z0, x1, y1, z1] = getBlockBoundingBox(ctBlock)
    renderBoxFromCorners(x0, y0, z0, x1, y1, z1, r, g, b, a, phase, lineWidth, filled)
}

/**
 * 
 * @param {Number} x - The center x of the circle
 * @param {Number} y - The center y of the circle
 * @param {Number} radius - Radius of the circle
 * @param {Number} segments - The number of segments, higher number = smoother circle
 * @param {Number} r - 0-1
 * @param {Number} g - 0-1
 * @param {Number} b - 0-1
 * @param {Number} a - 0-1
 */
export const drawCircle2D = (x, y, radius, segments, r, g, b, a) => {
    
    let theta = 2 * Math.PI / segments
    
    const points = []
    for (let i = 0; i < segments; i++) {
        let px = x + Math.cos(theta * i) * radius
        let py = y + Math.sin(theta * i) * radius

        points.push([px, py])
    }
    
    Renderer.colorize(r, g, b, a)
    Renderer.drawShape(Renderer.WHITE, points)
}

/**
 * 
 * @param {Number[][]} points - List of vertices as [[x, y, z], [x, y, z], ...]
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @param {Number} a 
 * @param {Boolean} phase - Show the line through walls
 */
export const renderShape3D = (points, r, g, b, a, phase=true, filled=true) => {
    Tessellator.pushMatrix()

    GlStateManager.func_179129_p(); // disableCullFace
    Tessellator.depthMask(false)
    Tessellator.disableTexture2D()
    Tessellator.enableBlend()
    
    if (phase) Tessellator.disableDepth()
    
    if (filled) Tessellator.begin(GL11.GL_POLYGON)
    else Tessellator.begin(GL11.GL_LINE_LOOP)

    Tessellator.colorize(r, g, b, a)
    for (let i = 0; i < points.length; i++) {
        Tessellator.pos(points[i][0], points[i][1], points[i][2])
    }

    Tessellator.draw()
    
    if (phase) Tessellator.enableDepth()

    GlStateManager.func_179089_o(); // enableCull
    Tessellator.enableTexture2D()
    Tessellator.disableBlend()
    Tessellator.depthMask(true)
    Tessellator.popMatrix()
}