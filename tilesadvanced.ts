
enum Shapes { Plus, Square }
enum PathDirection { Up, Down, Left, Right }

/**
* Adds additional tilemap functionality
*/
//% weight=0 color=#13a89e icon="\uf041" block="Tiles Advanced"
//% advanced=false
//% groups="['Getting Tiles', 'Tilemap Population', 'Tile Comparisons', 'Tile Animation', 'Pathfinding']"



namespace tilesAdvanced {

    function adjacentTilesInPlus(tile: tiles.Location, distance: number): tiles.Location[] {
        let col = tile.col;
        let row = tile.row;
        let adjacentTiles = [tile];

        for (let i = 0; i < distance; i++) {
            adjacentTiles.push(tiles.getTileLocation(col - i, row))
        }
        for (let i = 0; i < distance; i++) {
            adjacentTiles.push(tiles.getTileLocation(col + i, row))
        }
        for (let i = 0; i < distance; i++) {
            adjacentTiles.push(tiles.getTileLocation(col, row - i))
        }
        for (let i = 0; i < distance; i++) {
            adjacentTiles.push(tiles.getTileLocation(col, row + i))
        }
        return adjacentTiles
    }

    function adjacentTilesInSquare(tile: tiles.Location, distance: number): tiles.Location[] {
        let startCol = tile.col - distance;
        let startRow = tile.row - distance;
        let endCol = tile.col + distance;
        let endRow = tile.row + distance;
        let adjacentTiles = [tile];

        for (let col = startCol; col < endCol + 1; col++) {
            for (let row = startRow; row < endRow + 1; row++) {
                adjacentTiles.push(tiles.getTileLocation(col, row))
            }
        }
        return adjacentTiles
    }

    /**
     * Returns a list of tiles in the given shape and size relative to the given tile
     */
    //% blockId=getAdjacentTiles
    //% block="get tiles in shape $shape near $tile within $distance"
    //% tile.shadow=mapgettile
    //% group="Getting Tiles"
    //% weight=99
    export function getAdjacentTiles(shape: Shapes, tile: tiles.Location, distance: number): tiles.Location[] {
        if (shape == 0){
            return adjacentTilesInPlus(tile, distance);
        }
        else if (shape == 1){
            return adjacentTilesInSquare(tile, distance);
        }
        return [];
    }

    /**
     * Returns the loaded tilemap.
     */
    //% block="get current tilemap"
    //% blockId=getCurrentTilemap
    //% group="Tilemaps" weight=100
    export function getCurrentTilemap(): tiles.TileMapData {
        if (!game.currentScene().tileMap){
            return null;
        }
        return game.currentScene().tileMap.data;   
    }

    /**
     * Returns true if the given tiles are the same tile
     */
    //% blockId=tileIsTile
    //% block="$tile is $otherTile"
    //% tile.shadow=mapgettile
    //% otherTile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=100
    export function tileIsTile(tile: tiles.Location, otherTile: tiles.Location): boolean {
        if (tile.col == otherTile.col && tile.row == otherTile.row) {
            return true
        }
        return false
    }

    /**
     * Returns true if the given tile is in the list of tiles provided
     */
    //% blockId=tileIsInList
    //% block="$tile is in $tileList=variables_get(list)"
    //% tile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=3
    export function tileIsInList(tile: tiles.Location, tileList: tiles.Location[]): boolean {
        for (let tileInList of tileList) {
            if (tileIsTile(tile, tileInList)) {
                return true
            }
        }
        return false
    }

    /**
     * Sets the wall on or off for all tiles of a given type
     */
    //% blockId=setWallOnTilesOfType
    //% block="set walls $makeWall on tiles of type $tile"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% group="Tilemap Population"
    //% weight=4
    export function setWallOnTilesOfType(tile: Image, makeWall: boolean) {
        for (let tileOfType of tiles.getTilesByType(tile)) {
            tiles.setWallAt(tileOfType, makeWall)
        }
    }

    /**
     * All tiles of the same design have their image swapped for a given design
     */
    //% blockId=swapAllTiles
    //% block="swap tiles $from to $to"
    //% from.shadow=tileset_tile_picker
    //% from.decompileIndirectFixedInstances=true
    //% to.shadow=tileset_tile_picker
    //% to.decompileIndirectFixedInstances=true
    //% group="Tilemap Population"
    //% weight=5
    export function swapAllTiles(from: Image, to: Image) {
        for (let tileOfType of tiles.getTilesByType(from)) {
            tiles.setTileAt(tileOfType, to);
        }
    }

    /**
     * Returns true if the given sprite is within the bounds of the screen
     * @param sprite
     * @param tile
     */
    //% blockId=isSpriteOnScreen
    //% block="is $sprite=variables_get(mySprite) on screen"
    //% group="Tile Comparisons"
    //% weight=6
    export function isSpriteOnScreen(sprite: Sprite) {
        let currentScene = game.currentScene();
        let onX = sprite.right > currentScene.camera.left && sprite.left < currentScene.camera.right;
        let onY = sprite.bottom > currentScene.camera.top && sprite.top < currentScene.camera.bottom;
        let isOnScreen = onX && onY;
        return isOnScreen;
    }

    /**
     * Center the given sprite on a random location that is the given type (image) and is off screen
     * @param sprite
     * @param tile
     */
    //% blockId=placeOnRandomTileOffScreen
    //% block="place $sprite=variables_get(mySprite) on top of random $tile off screen"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% help=tiles/place-on-random-tile
    //% group="Tilemap Population"
    //% weight=6
    export function placeOnRandomTileOffScreen(sprite: Sprite, tile: Image) {
        let currentScene = game.currentScene();
        tiles.placeOnRandomTile(sprite, tile);
        if (isSpriteOnScreen(sprite)) {
            placeOnRandomTileOffScreen(sprite, tile);
        }
    }

    /**
     * Returns a list of all the tiles that are a wall
     */
    //% blockId=getAllTilesWhereWallIs
    //% block="array of all tiles where wall is $isWall"
    //% group="Getting Tiles"
    //% weight=6
    export function getAllTilesWhereWallIs(isWall: boolean): tiles.Location[] {
        let width = getTilemapWidth();
        let height = getTilemapHeight();
        let walls = [];
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                let tile = tiles.getTileLocation(w, h);
                if (tiles.tileAtLocationIsWall(tile) == isWall) {
                    walls.push(tile);
                }
            }
        }
        return walls;
    }

    /**
     * Returns the width of the tilemap in use
     */
    //% blockId=getTilemapWidth
    //% block="get tilemap width"
    //% group="Getting Tiles"
    //% weight=7
    export function getTilemapWidth(): number {
        return game.currentScene().tileMap.data.width;
    }

    /**
     * Returns the height of the tilemap in use
     */
    //% blockId=getTilemapHeight
    //% block="get tilemap height"
    //% group="Getting Tiles"
    //% weight=8
    export function getTilemapHeight(): number {
        return game.currentScene().tileMap.data.height;
    }

    /**
     * Animates all tiles of the given type with the animation passed in on the interval given
     */
    //% blockId=animateTileOfTypeWith
    //% block="animate $tile with $animation=animation_editor || every $frameLength"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% expandableArgumentMode="toggle"
    //% frameLength.defl=200
    //% group="Tile Animation"
    //% weight=6
    export function animateTileOfTypeWith(tile: Image, animation: Image[], frameLength: number = 200) {
        let frame = 0
        let tilesToAnimate = tiles.getTilesByType(tile)
        let tilemap = game.currentScene().tileMap.data
        control.runInBackground(function () {
            while (game.currentScene().tileMap) {
                if (tilemap != game.currentScene().tileMap.data){
                    break
                }
                for (let tileOfType of tilesToAnimate) {
                    tiles.setTileAt(tileOfType, animation[frame])
                }
                frame += 1
                if (frame == animation.length) {
                    frame = 0
                }
                pause(frameLength)
            }
        })
    }

    /**
     * Returns true if one sprite can see another without a wall in the way
     */
    //% blockId=checkLineOfSight
    //% block="can %sprite=variables_get(myEnemy) see %target=variables_get(mySprite)"
    //% group="Pathfinding"
    //% weight=9
    export function checkLineOfSight(sprite: Sprite, target: Sprite): boolean {
        let xDif = target.x - sprite.x
        let yDif = target.y - sprite.y
        // let distance = Math.sqrt(xDif ** 2 + yDif ** 2) // inventing triangles 
        let xIncrement = xDif / 25
        let yIncrement = yDif / 25
        for (let i = 0; i < 25; i++) {
            let x = sprite.x + i * xIncrement
            let y = sprite.y + i * yIncrement
            let col = Math.floor(x / 16)
            let row = Math.floor(y / 16)
            if (tiles.tileAtLocationIsWall(tiles.getTileLocation(col, row))) {
                return false
            }
        }
        return true
    }

    export class PathfinderSprite extends Sprite {

        public isFollowing: boolean = false;
        public path: tiles.Location[];
        public target: Sprite;
        public speed: number;

        constructor(image: Image, kind: number) {
            super(image);
            this.setKind(kind);
        }

        public followUsingPathfinding(speed: number) {
            let myStart = this.tilemapLocation();
            this.speed = speed;
            this.isFollowing = true;
            this.startFollowing();
            game.onUpdate(function () {
                if (this.isFollowing) {
                    if (!tileIsTile(this.tilemapLocation(), myStart)) {
                        myStart = this.tilemapLocation();
                        this.path = scene.aStar(myStart, this.target.tilemapLocation());
                        scene.followPath(this, this.path, this.speed);
                    }
                }
            })
        }

        public startFollowing() {
            this.path = scene.aStar(this.tilemapLocation(), this.target.tilemapLocation());
            scene.followPath(this, this.path, this.speed);
        }
    }

    /**
     * Creates a sprite capable of carrying out advanced pathfinding
     */
    //% blockId=createPathfinderSprite
    //% block="pathfinder sprite %img=screen_image_picker of kind %kind=spritekind"
    //% group="Pathfinding"
    //% weight=10
    export function createPathfinderSprite(image: Image, kind: number): PathfinderSprite {
        const sprite = new PathfinderSprite(image, kind);
        game.currentScene().physicsEngine.addSprite(sprite);
        return sprite;
    }

    /**
     * Makes this sprite follow the target sprite using pathfinding
     */
    //% blockId=followUsingPathfinding
    //% block="set %sprite=variables_get(myEnemy) follow %target=variables_get(mySprite) || with speed %speed"
    //% group="Pathfinding"
    //% weight=9
    export function followUsingPathfinding(sprite: any, target: Sprite, speed = 100) {
        sprite = sprite as PathfinderSprite
        sprite.target = target;
        sprite.followUsingPathfinding(speed);
    }

    /**
     * Stops the path finding sprite from following the sprite
     */
    //% blockId=stopFollowingSprite
    //% block="stop %sprite=variables_get(myEnemy) following sprite"
    //% group="Pathfinding"
    //% weight=8
    export function stopFollowingSprite(sprite: any) {
        sprite = sprite as PathfinderSprite
        sprite.isFollowing = false;
        sprite.path = [];
        scene.followPath(sprite, sprite.path, 0);
    }

    /**
     * Resume following target sprite
     */
    //% blockId=resumeFollowingSprite
    //% block="%follower=variables_get(myEnemy) resume following a sprite"
    //% group="Pathfinding"
    //% weight=6
    export function resumeFollowingSprite(follower: PathfinderSprite) {
        if (follower.path.length < 1) {
            follower.isFollowing = true;
            follower.startFollowing();
        }
    }

    /**
     * Changes the target a sprite is following
     */
    //% blockId=changeTarget
    //% block="change %follower=variables_get(myEnemy) target they follow %target=variables_get(mySprite)"
    //% group="Pathfinding"
    //% weight=7
    export function changeTarget(follower: PathfinderSprite, target: Sprite) {
        follower.target = target;
    }


    /**
    * Returns the distance between the centres of the given tiles
    */
    //% blockId=distanceBetweenTiles
    //% block="distance between $tile and $otherTile"
    //% tile.shadow=mapgettile
    //% otherTile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=20
    export function distanceBetweenTiles(tile: tiles.Location, otherTile: tiles.Location): number {
        let x = tile.column - otherTile.column;
        let y = tile.row - otherTile.row;
        return Math.sqrt(x ** 2 + y ** 2)
    }

    /**
     * Returns a given list of tiles sorted by their distance to a given tile
     */
    //% blockId=sortListOfTilesByDistance
    //% block="sort $allTiles=variables_get(list) by distance to $tile"
    //% tile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=20     
    export function sortListOfTilesByDistance(tile: tiles.Location, allTiles: tiles.Location[]): tiles.Location[] {
        let sortedTiles: tiles.Location[] = [];
        sortedTiles.push(allTiles.shift());
        allTiles.forEach(function (unsortedTile: tiles.Location) {
            let inserted = false;
            for (let i = 0; i < sortedTiles.length; i++) {
                let sortedTile = sortedTiles[i];
                if (distanceBetweenTiles(tile, unsortedTile) < distanceBetweenTiles(tile, sortedTile)) {
                    sortedTiles.insertAt(i, unsortedTile);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                sortedTiles.push(unsortedTile)
            }
        })
        return sortedTiles
    }

    function generateHorizontalPath(direction: PathDirection, turnChancePercentage: number, startCol: number, endCol: number): tiles.Location[] {
        let step = 1
        if (direction == PathDirection.Left) {
            let step = -1
        }
        let column = startCol
        let row = randint(0, tilesAdvanced.getTilemapHeight() - 1)
        let tilesInPath = []
        tilesInPath.push(tiles.getTileLocation(column, row))
        while (column != endCol) {
            if (Math.percentChance(turnChancePercentage)) {
                column += step
            } else {
                row += randint(0, 1) * 2 - 1
            }
            row = Math.constrain(row, 0, tilesAdvanced.getTilemapHeight() - 1)
            let tile = tiles.getTileLocation(column, row)
            tilesInPath.push(tile)
        }
        return tilesInPath
    }

    function generateVerticalPath(direction: PathDirection, turnChancePercentage: number, startRow: number, endRow: number): tiles.Location[] {
        let step = 1
        if (direction == PathDirection.Up) {
            let step = -1
        }
        let row = startRow
        let column = randint(0, tilesAdvanced.getTilemapWidth() - 1)
        let tilesInPath = []
        tilesInPath.push(tiles.getTileLocation(column, row))
        while (row != endRow) {
            if (Math.percentChance(turnChancePercentage)) {
                row += step
            } else {
                column += randint(0, 1) * 2 - 1
            }
            column = Math.constrain(row, 0, tilesAdvanced.getTilemapWidth() - 1)
            let tile = tiles.getTileLocation(column, row)
            tilesInPath.push(tile)
        }
        return tilesInPath
    }

    //TODO include wall togle on these

    /**
     * Creates a path across the tilemap in the given direction.
     */
    //% blockId=generatePathAcrossMap
    //% block="generate path across map in $direction with $turnChancePercentage turn chance start $startRowOrColumn end $endRowOrColumn"
    //% turnChancePercentage.defl=50
    //% startRowOrColumn.defl=0
    //% endRowOrColumn.defl=15
    //% group="Pathfinding"
    //% weight=1

    export function generatePathAcrossMap(direction: PathDirection, turnChancePercentage = 50, startRowOrColumn = 0, endRowOrColumn = 15): tiles.Location[] {
        let tilesInPath: tiles.Location[] = []
        if (direction == PathDirection.Up || direction == PathDirection.Down) {
            tilesInPath = generateVerticalPath(direction, turnChancePercentage, startRowOrColumn, endRowOrColumn)
        }
        else {
            tilesInPath = generateHorizontalPath(direction, turnChancePercentage, startRowOrColumn, endRowOrColumn)

        }
        return tilesInPath
    }

}
