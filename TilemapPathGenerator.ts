namespace tilesAdvanced {

    function generateHorizontalPath(direction: PathDirection, turnChancePercentage: number, width: number, startCol: number, endCol: number): tiles.Location[] {
        let step = 1
        if (direction == PathDirection.Left) {
            let step = -1
        }
        let column = startCol
        let row = randint(0, tilesAdvanced.getTilemapHeight() - 1)
        let tilesInPath = []
        let half_width = Math.floor(width / 2)
        for (let i = -half_width; i <= half_width; i++) {
            let tile = tiles.getTileLocation(column, row + i)
            tilesInPath.push(tile)
        }
        while (column != endCol) {
            if (Math.percentChance(turnChancePercentage)) {
                row += randint(0, 1) * 2 - 1
                row = Math.constrain(row, 0, tilesAdvanced.getTilemapHeight() - 1)
                let half_width = Math.floor(width / 2)
                for (let i = -half_width; i <= half_width; i++) {
                    let tile = tiles.getTileLocation(column + i, row)
                    tilesInPath.push(tile)
                }
            } else {
                column += step
                let half_width = Math.floor(width / 2)
                for (let i = -half_width; i <= half_width; i++) {
                    let tile = tiles.getTileLocation(column, row + i)
                    tilesInPath.push(tile)
                }
            }
            tilesInPath.push(tiles.getTileLocation(column, row))
        }
        return tilesInPath
    }

    function generateVerticalPath(direction: PathDirection, turnChancePercentage: number, width: number, startRow: number, endRow: number): tiles.Location[] {
        let step = 1
        if (direction == PathDirection.Up) {
            let step = -1
        }
        let row = startRow
        let column = randint(0, tilesAdvanced.getTilemapWidth() - 1)
        let tilesInPath = []
        let half_width = Math.floor(width / 2)
        for (let i = -half_width; i <= half_width; i++) {
            let tile = tiles.getTileLocation(column + i, row)
            tilesInPath.push(tile)
        }
        while (row != endRow) {
            if (Math.percentChance(turnChancePercentage)) {
                column += randint(0, 1) * 2 - 1
                column = Math.constrain(row, 0, tilesAdvanced.getTilemapWidth() - 1)
                for (let i = -half_width; i <= half_width; i++) {
                    let tile = tiles.getTileLocation(column, row + i)
                    tilesInPath.push(tile)
                }
            } else {
                row += step
                for (let i = -half_width; i <= half_width; i++) {
                    let tile = tiles.getTileLocation(column + i, row)
                    tilesInPath.push(tile)
                }
            }
            tilesInPath.push(tiles.getTileLocation(column, row))
        }
        return tilesInPath
    }


    //TODO include wall togle on these

    /**
     * Creates a path across the tilemap in the given direction.
     */
    //% blockId=generatePathAcrossMap
    //% block="generate path across map in $direction with turn chance $turnChancePercentage width $width start $startRowOrColumn end $endRowOrColumn"
    //% turnChancePercentage.defl=50
    //% startRowOrColumn.defl=0
    //% endRowOrColumn.defl=15
    //% group="Pathfinding"
    //% weight=1

    export function generatePathAcrossMap(direction: PathDirection, turnChancePercentage = 50, width = 1, startRowOrColumn = 0, endRowOrColumn = 15): tiles.Location[] {
        if (width % 2 == 0) {
            width--
        }
        width = Math.constrain(width, 1, 101)
        turnChancePercentage = Math.constrain(turnChancePercentage, 0, 99)
        let tilesInPath: tiles.Location[] = []
        if (direction == PathDirection.Up || direction == PathDirection.Down) {
            tilesInPath = generateVerticalPath(direction, turnChancePercentage, width, startRowOrColumn, endRowOrColumn)
        }
        else {
            tilesInPath = generateHorizontalPath(direction, turnChancePercentage, width, startRowOrColumn, endRowOrColumn)

        }
        return tilesInPath
    }

}