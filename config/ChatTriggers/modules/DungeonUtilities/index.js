/*
 * This is an experimental version of the DungeonUtilities module.
 * There will be bugs and things will be changed.
 * TODO:
 *  * Move this in multiple files.
 *
 * Credits:
 *  * ComplexOrigin for a lot of help with the map feature.
 *  * Flonja for even more help with the map feature in it's early development.
 *  * Vals for fixing the weird rendering with the players and the riddles solver.
 *  * DJtheRedstoner for making map scaling and the map background.
 *  <3ython3.
 */

import { Setting, SettingsObject } from "../SettingsManager/SettingsManager";

const GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
const _Tessellator = Java.type("net.minecraft.client.renderer.Tessellator");
const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats");
const ResourceLocation = Java.type("net.minecraft.util.ResourceLocation");
const GL11 = Java.type("org.lwjgl.opengl.GL11");

const RES_MAP_BACKGROUND = new ResourceLocation("textures/map/map_background.png");

let oldMapData = null;

const settings = new SettingsObject(
    "DungeonUtilities",
    [
        {
            name: "Main",
            settings: [
                new Setting.Button("                                        &eDungeonUtilities", "&dBETA v0.9", () => {}),
                new Setting.Button("&bA collection of useful utilities for dungeons!", "By &aAntonio32A", () => {}),
                new Setting.Button("", "", () => {}),
                new Setting.Button("                                        &dCredits", "", () => {}),
                new Setting.Button("&bComplexOrigin", "Help with rendering the map.", () => {}),
                new Setting.Button("&6Flonja", "Helping with the map feature in it's early development.", () => {}),
                new Setting.Button("&dVals", "Map rendering fixes and the riddle solver.", () => {}),
                new Setting.Button("&6DJtheRedstoner", "Map scale and the map background feature.", () => {}),
                new Setting.Button("", "", () => {}),
                new Setting.Button("&dNote: &eAll mods are &cuse at your own risk&e.", "&cWARNING", () => {
                    ChatLib.chat(
                        "&eThis mod is use at your own risk meaning that I (&aAntonio32A) &eam not responsible for any " +
                        "punishments caused while using this mod.\n" +
                        "&aThe map preview is allowed by the admins &ebut other addons haven't been confirmed, meaning " +
                        "that they &dmight &ebe punishable. It doesn't mean that you will be instantly banned, but " +
                        "there is always a small chance.\n" +
                        "&bThis is why all the modules except the map are automatically disabled when you install the mod.\n" +
                        "&cIf you ever decide to uninstall the mod, do /ct delete DungeonUtilities"
                    )
                })
            ]
        },
        {
            name: "Map",
            settings: [
                new Setting.Button("", "Shows the dungeon map on your screen.", () => {}),
                new Setting.Toggle("Enabled", true),
                new Setting.Slider("X", 300, 0, Renderer.screen.getWidth(), 0),
                new Setting.Slider("Y", 10, 0, Renderer.screen.getHeight(), 0),
                new Setting.Slider("Scale", 100, 0, 500, 0),
                new Setting.Toggle("Cache Map Data", true),
                new Setting.Toggle("Draw Background", false)
            ]
        },
        {
            name: "Blaze Solver",
            settings: [
                new Setting.Button("", "Tells you which blaze to hit in the blaze puzzle.", () => {}),
                new Setting.Toggle("Enabled", false)
            ]
        },
        {
            name: "Party Kicker",
            settings: [
                new Setting.Button(
                    "", "Automatically kicks people under the level requirement.", () => {}),
                new Setting.Toggle("Enabled", false),
                new Setting.Slider("Minimum Level", 0, 0, 50, 0)
            ]
        },
        {
            name: "Riddle Solver",
            settings: [
                new Setting.Button("", "Solves the 3 man riddles.", () => {}),
                new Setting.Toggle("Enabled", false)
            ]
        },
        {
            name: "Health Notify",
            settings: [
                new Setting.Button("", "Notifies you when somebody is low on health.", () => {}),
                new Setting.Toggle("Enabled", false)
            ]
        },
    ]
);
settings.setCommand("dungeon").setSize(500, 200);
Setting.register(settings);

let blockTimer = 0;
let block = false;

register("renderOverlay", () => {
    if (block) return;
    if (!settings.getSetting("Map", "Enabled")) return;

    let x = ~~settings.getSetting("Map", "X");
    let y = ~~settings.getSetting("Map", "Y");
    let scale = ~~settings.getSetting("Map", "Scale") / 100;

    let item = Player.getInventory().getItems()[8];
    let mapData;

    try {
        mapData = item.getItem().func_77873_a(item.getItemStack(), World.getWorld()); // ItemStack.getItem().getMapData()
        oldMapData = mapData;
    } catch (error) {
        if (error instanceof TypeError) {
            if (!settings.getSetting("Map", "Cache Map Data")) return;
            if (oldMapData !== null) {
                mapData = oldMapData;
            } else return;
        }
        else {
            ChatLib.chat("&a[&DungeonUtilities&a] &cError loading map! Check your console and report this to &dAntonio32A&c!");
            return;
        }
    }

    try {
        GlStateManager.func_179094_E(); //GlStateManager.push()
        GlStateManager.func_179137_b(x, y, 0.0); // GlStateManager.translate()
        GlStateManager.func_179152_a(scale, scale, 1); //GlStateManager.scale()
        GlStateManager.func_179131_c(1.0, 1.0, 1.0, 1.0); // GlStateManager.color()
        if (settings.getSetting("Map", "Draw Background")) {
            drawMapBackground();
        }
        // Minecraft.entityRenderer.getMapItemRenderer.renderMap() draw the map without players
        Client.getMinecraft().field_71460_t.func_147701_i().func_148250_a(mapData, true);
        drawPlayersOnMap(mapData);
        GlStateManager.func_179121_F(); //GlStateManager.pop()
    } catch(error) {
        block = true;
        print(error);
    }
});

register("tick", () => {
    if (!block) return;
    blockTimer += 1;
    if (blockTimer > 300) {
        blockTimer = 0;
        block = false;
    }
});

// source: net.minecraft.client.gui/MapItemRenderer
const drawPlayersOnMap = (mapData) => {
    let i = 0;
    let j = 0;
    let k = 0;
    let tessellator = _Tessellator.func_178181_a();
    let worldrenderer = tessellator.func_178180_c();
    let z = 1.0;

    mapData.field_76203_h.forEach((icon, vec4b) => {
        GlStateManager.func_179094_E(); // push
        GlStateManager.func_179137_b(0, 0, z);
        GlStateManager.func_179109_b(i + vec4b.func_176112_b() / 2.0 + 64.0, j + vec4b.func_176113_c() / 2.0 + 64.0, -0.02);
        GlStateManager.func_179114_b((vec4b.func_176111_d() * 360) / 16.0, 0.0, 0.0, 1.0);
        GlStateManager.func_179152_a(4.0, 4.0, 1);
        GlStateManager.func_179109_b(-0.125, 0.125, 0.0);
        let b0 = vec4b.func_176110_a();
        let f1 = (b0 % 4) / 4.0;
        let f2 = (Math.floor(b0 / 4)) / 4.0;
        let f3 = (b0 % 4 + 1) / 4.0;
        let f4 = (Math.floor(b0 / 4) + 1) / 4.0;
        worldrenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);
        worldrenderer.func_181662_b(-1.0, 1.0, (k * -0.001)).func_181673_a(f1, f2).func_181675_d();
        worldrenderer.func_181662_b(1.0, 1.0, (k * -0.001)).func_181673_a(f3, f2).func_181675_d();
        worldrenderer.func_181662_b(1.0, -1.0, (k * -0.001)).func_181673_a(f3, f4).func_181675_d();
        worldrenderer.func_181662_b(-1.0, -1.0, (k * -0.001)).func_181673_a(f1, f4).func_181675_d();
        tessellator.func_78381_a();
        GlStateManager.func_179121_F(); // pop
        k++;
        z++;
    });

    GlStateManager.func_179094_E();
    GlStateManager.func_179109_b(0.0, 0.0, -0.04);
    GlStateManager.func_179152_a(1.0, 1.0, 1.0);
    GlStateManager.func_179121_F();
};

const drawMapBackground = () => {
    Client.getMinecraft().func_110434_K().func_110577_a(RES_MAP_BACKGROUND); //Minecraft.getTextureManager().bindTexture()
    let tessellator = _Tessellator.func_178181_a();
    let worldrenderer = tessellator.func_178180_c();
    GlStateManager.func_179094_E(); // push
    GlStateManager.func_179141_d();
    GL11.glNormal3f(0.0, 0.0, -1.0);
    GlStateManager.func_179137_b(0, 0, -1.0)
    worldrenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);
    worldrenderer.func_181662_b(-7.0, 135.0, 0.0).func_181673_a(0.0, 1.0).func_181675_d();
    worldrenderer.func_181662_b(135.0, 135.0, 0.0).func_181673_a(1.0, 1.0).func_181675_d();
    worldrenderer.func_181662_b(135.0, -7.0, 0.0).func_181673_a(1.0, 0.0).func_181675_d();
    worldrenderer.func_181662_b(-7.0, -7.0, 0.0).func_181673_a(0.0, 0.0).func_181675_d();
    tessellator.func_78381_a();
    GlStateManager.func_179121_F(); // pop
}


register("renderWorld", () => {
    let blazes = {};
    if (!settings.getSetting("Blaze Solver", "Enabled")) return;

    World.getAllEntities().forEach(entity => {
        if (entity.getName().includes("Blaze ")) {
            let name = entity.getName().split(" ")[2].split("/")[1];
            if (name === undefined) {
                name = entity.getName().split(" ")[3].split("/")[1]; // runic mobs
            }
            let hp = name.slice(0, -3);
            hp = hp.slice(2);
            blazes[parseInt(hp)] = entity;
        }
    });

    if (Math.min.apply(Math, Object.keys(blazes)) === Infinity) return;

    let smallest = Math.min.apply(Math, Object.keys(blazes));
    smallest = blazes[smallest];
    let biggest = Math.max.apply(Math, Object.keys(blazes));
    biggest = blazes[biggest];

    let partialTicks = Tessellator.INSTANCE.getPartialTicks();

    let entity = smallest;
    Tessellator.drawString(
        "Smallest",
        entity.getLastX() + (entity.getX() - entity.getLastX()) * partialTicks,
        entity.getLastY() + (entity.getY() - entity.getLastY()) * partialTicks,
        entity.getLastZ() + (entity.getZ() - entity.getLastZ()) * partialTicks,
        16711680, true, 0.04, false
    );

    entity = biggest;
    Tessellator.drawString(
        "Biggest",
        entity.getLastX() + (entity.getX() - entity.getLastX()) * partialTicks,
        entity.getLastY() + (entity.getY() - entity.getLastY()) * partialTicks,
        entity.getLastZ() + (entity.getZ() - entity.getLastZ()) * partialTicks,
        65280, true, 0.04, false
    );
});


register("chat", (name, _class, level, event) => {
    if (!settings.getSetting("Party Kicker", "Enabled")) return;

    let requirement = settings.getSetting("Party Kicker", "Minimum Level");
    if (parseInt(level) < requirement) {
        ChatLib.command("party kick " + name);
    }
}).setCriteria(
    "Dungeon Finder > ${name} joined the dungeon group! (${_class} Level ${level})"
);
// Dungeon Finder > ${name} joined the dungeon group! (${_class} Level ${level})

// Made by Vals, thank you so much for this feature <3
let answers = []

let loaded = FileLib.read("DungeonUtilities", "answers.json");

if (loaded === "" || loaded === null) {
    ChatLib.chat("&cFailed to load answers.json.");
} else {
    answers = JSON.parse(loaded);
}

answers.forEach(answer => {
    answer.statements.forEach((statement, i) => {
        if (i === answer.answer) {
            register('chat', (name, target) => {
                if (!settings.getSetting("Riddle Solver", "Enabled")) return;
                ChatLib.chat(`&eDungeonUtilities &8> ${name} &ehas the blessing!`);
            }).setCriteria(statement).setParameter("contains");
        }
    });
});


register("tick", () => {
    if (!settings.getSetting("Health Notify", "Enabled")) return;
    Scoreboard.getLines(false).forEach(line => {
        let unformatted = line.toString();
        line = ChatLib.removeFormatting(line);
        if (line.endsWith("❤")) {
            line = line.split("❤")[0];
            let name = line.split(" ")[1];
            if (name.includes("-")) return;

            let unformattedHP = unformatted.split(" ")[2].split("§c❤")[0];
            if (unformattedHP.includes("§e") || (unformattedHP.includes("§c"))) {
                Client.showTitle(`&c${name} is low!`, unformattedHP + "❤", 0, 10, 10);
            }
        }
    });
});