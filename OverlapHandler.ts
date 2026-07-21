namespace tilesAdvanced {

    class OverlapWatcher {
        kind: number
        tile: Image
        handler: (sprite: Sprite) => void
        active: { [id: number]: boolean }

        constructor(kind: number, tile: Image, handler: (sprite: Sprite) => void) {
            this.kind = kind
            this.tile = tile
            this.handler = handler
            this.active = {}
        }
    }

    let watchers: OverlapWatcher[] = []
    let loopStarted = false

    /**
     * Run code the moment a sprite of the given kind stops overlapping
     * the given tile (i.e. moves off of it). MakeCode Arcade has no
     * built-in "exit" event, so this polls once per frame and compares
     * each watched sprite's current tile against its last known state.
     * @param kind the kind of sprite to watch, eg: SpriteKind.Player
     * @param tile the tile to watch for, eg: assets.tile`myTile`
     * @param handler code to run when a sprite exits the tile
     */
    //% blockId=tileEvents_onOverlapTileExit
    //% block="on $kind=spritekind exit tile $tile=tileset_tile_picker"
    //% draggableParameters="reporter"
    //% weight=90
    //% blockGap=8
    //% group="Tiles"
    export function onOverlapTileExit(kind: number, tile: Image, handler: (sprite: Sprite) => void) {
        const watcher = new OverlapWatcher(kind, tile, handler)
        watchers.push(watcher)

        // mark a sprite as "on" the tile the moment it overlaps it
        scene.onOverlapTile(kind, tile, function (sprite, location) {
            watcher.active[sprite.id] = true
        })

        // stop tracking sprites once they're destroyed so the
        // active-sprite table doesn't grow forever
        sprites.onDestroyed(kind, function (sprite) {
            delete watcher.active[sprite.id]
        })

        // one shared per-frame loop handles every registered watcher,
        // so dropping in multiple "on exit tile" blocks stays cheap
        if (!loopStarted) {
            loopStarted = true
            game.onUpdate(function () {
                for (const w of watchers) {
                    for (const sprite of sprites.allOfKind(w.kind)) {
                        if (w.active[sprite.id]) {
                            const stillOn = tiles.tileAtLocationEquals(sprite.tilemapLocation(), w.tile)
                            if (!stillOn) {
                                w.active[sprite.id] = false
                                w.handler(sprite)
                            }
                        }
                    }
                }
            })
        }
    }
    
}