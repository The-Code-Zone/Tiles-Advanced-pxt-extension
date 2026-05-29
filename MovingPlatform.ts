let MovingPlatform = SpriteKind.create();
let MovingPlatformHitbox = SpriteKind.create();

namespace tilesAdvanced {
    
    let _spritesOnMovingPlatforms: Sprite[] = [];
    let _allHorizontallMovingPlatforms: HorizontallyMovingPlatform[] = [];

    export class HorizontallyMovingPlatform extends Sprite {

        public hitbox: Sprite;

        constructor(img: Image, location: tiles.Location, vx: number){
            super(img);
            game.currentScene().physicsEngine.addSprite(this);
            this.setKind(MovingPlatform);
            this.vx = vx;
            this.setFlag(SpriteFlag.BounceOnWall, true);
            tiles.placeOnTile(this, location);
            this.setupHitbox();
            _allHorizontallMovingPlatforms.push(this);
        }

        private setupHitbox() {
            let hitbox = sprites.create(image.create(this.image.width, 1));
            hitbox.image.fill(1);
            hitbox.setFlag(SpriteFlag.Invisible, true);
            setTimeout( () => {
                game.onUpdate( () => {
                    hitbox.x = this.x;
                    hitbox.bottom = this.top;
                })
            }, 0)
        }

    }

    //% block="make horizontally moving platform with image $img at $location with velocity $vx"
    //% img.shadow="screen_image_picker"
    //% location.shadow="mapgettile"
    //% inlineInputMode=inline
    //% group="Moving Platforms"
    //% weight=90
    //% blockSetVariable="myPlatform"
    export function createHorizontallyMovingPlatform(img: Image, location: tiles.Location, vx: number): HorizontallyMovingPlatform {
        return new HorizontallyMovingPlatform(img, location, vx);
    }
    
    function spriteWallCollision(sprite: Sprite, wall: HorizontallyMovingPlatform): void {
        const overlapX = (sprite.width / 2 + wall.width / 2) - Math.abs(sprite.x - wall.x);
        const overlapY = (sprite.height / 2 + wall.height / 2) - Math.abs(sprite.y - wall.y);

        if (overlapX <= overlapY) {
            if (sprite.x < wall.x) {
                sprite.right = wall.left;
            } else {
                sprite.left = wall.right;
            }
            sprite.vx = 0;
        } else {
            if (sprite.y < wall.y) {
                sprite.bottom = wall.top;
                sprite.vx = wall.vx //makes it follow
            } else {
                sprite.top = wall.bottom;
            }
            sprite.vy = 0;
        }
    };

    //% block="sprites of kind $kind move with moving platforms"
    //% kind.shadow="spritekind"
    //% group="Moving Platforms"
    //% weight=80
    export function spritesOfKindMoveWithMovingPlatforms(kind: number): void {

        game.onUpdate( () => {
            for (let mover of sprites.allOfKind(kind)) {
                if (_allHorizontallMovingPlatforms.length < 1){ return }
                for (let wall of _allHorizontallMovingPlatforms) {
                    if (mover.overlapsWith(wall)) {
                        spriteWallCollision(mover, wall as HorizontallyMovingPlatform);
                    }
                    let hitbox = wall.hitbox;
                    if (mover.overlapsWith(hitbox)) {
                        if (_spritesOnMovingPlatforms.indexOf(mover) < 0) {
                            _spritesOnMovingPlatforms.push(mover)
                        }
                    } else {
                        _spritesOnMovingPlatforms.removeElement(mover)
                    }
                }
            }
        })
    }
    
    //% block="$sprite is on moving platform"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% inlineInputMode=inline
    //% group="Moving Platforms"
    //% weight=70
    export function isOnMovingPlatform(sprite: Sprite): boolean {
        return _spritesOnMovingPlatforms.indexOf(sprite) >= 0
    }
}

