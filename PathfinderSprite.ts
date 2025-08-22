namespace tilesAdvanced {
    
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
            let myLocation = this.tilemapLocation()
            this.path = scene.aStar(myLocation, this.target.tilemapLocation());
            if (myLocation.x != this.x || myLocation.y != this.y){
                this.path.shift();
            }
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
    //% weight=7
    export function resumeFollowingSprite(follower: any) {
        follower = follower as PathfinderSprite
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
    //% weight=6
    export function changeTarget(follower: any, target: Sprite) {
        follower = follower as PathfinderSprite
        follower.target = target;
    }

    /**
     * Changes the speed the sprite is following at
     */
    //% blockId=changeFollowSpeed
    //% block="change %follower=variables_get(myEnemy) speed $speed"
    //% group="Pathfinding"
    //% weight=5
    export function changeFollowSpeed(follower: any, speed: number) {
        follower = follower as PathfinderSprite
        follower.speed = speed
        scene.followPath(follower, [], 0);
        follower.startFollowing()
    }

}