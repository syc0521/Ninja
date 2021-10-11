import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component
{

    @property
    speed = 10.0;
    private _gameManager: GameManager = null

    setManager(manager)
    {
        this._gameManager = manager
    }

    update(dt)
    {
        this.node.angle -= 5
        this.node.setPosition(this.node.position.x, this.node.position.y - this.speed)
        if (this.node.position.y < -497)
        {
            this._gameManager.putBullet(this.node)
        }
    }

    Create(Position: cc.Vec3)
    {
        this.node.position = Position
    }

    setSpeed(speed: number)
    {
        this.speed = speed
    }
}
