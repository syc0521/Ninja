import Bullet from "./Bullet"
import Ninja from "./Ninja";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component
{

    @property(cc.Node)
    ninja: cc.Node = null
    @property(cc.Prefab)
    bullet: cc.Prefab = null
    @property(cc.Node)
    bulletWrapNode: cc.Node = null
    @property(cc.Label)
    timeLabel: cc.Label = null
    @property(cc.Animation)
    anim: cc.Animation = null
    @property(cc.Node)
    startNode: cc.Node = null
    @property(cc.Node)
    stateNode: cc.Node = null
    @property([cc.SpriteFrame])
    sprites: cc.SpriteFrame[] = []
    @property(cc.Node)
    box: cc.Node = null

    private _bulletPool: cc.NodePool = new cc.NodePool()
    private readonly _positionY = 1072
    private _time = 12
    private running = false
    private complete = false
    private lastPosition: number = 0
    private _positionPool = [
        [200, 422, 842, 996],
        [111, 657, 772, 1021],
        [200, 422, 842, 996],
        [118, 317, 513, 989],
        [153, 275, 415, 968],
        [118, 317, 513],
        [56, 888],
        [200, 422, 996],
    ]

    moveNinja(position: number)
    {
        this.ninja.setPosition(position, this.ninja.position.y)
    }


    start()
    {
        this.timeLabel.enabled = false
        this.box.setPosition(this.box.position.x, 1083)
    }

    onLoad()
    {
        this.ninja.getComponent(Ninja).setManager(this)
        for (let index = 0; index < 20; index++)
        {
            const temp = cc.instantiate(this.bullet)
            this._bulletPool.put(temp)
        }
    }

    update(dt: number) 
    {
        if (this._time < 4)
        {
            this.box.setPosition(this.box.position.x, this.box.position.y - 10)
        }
        if (this.box.position.y <= -543)
        {
            this.box.setPosition(this.box.position.x, -543)
        }
        this.ShowTime(dt)
        this.ChangeState()
    }

    private ChangeState()
    {
        if (this.ninja.position.x - this.lastPosition > 0)
        {
            this.anim.play('Ninja_Right').wrapMode = cc.WrapMode.Loop
        }
        else if (this.ninja.position.x - this.lastPosition < 0)
        {
            this.anim.play('Ninja_Left').wrapMode = cc.WrapMode.Loop
        }
        this.lastPosition = this.ninja.position.x
    }

    private ShowTime(dt: number)
    {
        if (this._time < 0 && !this.complete)
        {
            this._time = 0;
            this.gameComplete()
            this.complete = true
        }
        if (this._time > 0 && this.running)
        {
            this._time -= dt
            this.timeLabel.string = this._time.toFixed(2)
        }
        else { this.timeLabel.string = "0.00" }
    }

    createBullet(positionX: cc.Vec3, random: boolean)
    {
        let bulletNode: cc.Node = null
        if (this._bulletPool.size() > 0)
        {
            bulletNode = this._bulletPool.get()
        }
        else
        {
            bulletNode = cc.instantiate(this.bullet)
        }
        this.bulletWrapNode.addChild(bulletNode)
        bulletNode.getComponent(Bullet).Create(positionX)
        bulletNode.getComponent(Bullet).setManager(this)
        if (random)
        {
            bulletNode.getComponent(Bullet).setSpeed(5.8 + 2.4 * Math.random())
        }
    }

    putBullet(bullet: cc.Node)
    {
        this._bulletPool.put(bullet)
    }

    startGame()
    {
        this.running = true
        this.timeLabel.enabled = true
        this.startNode.active = false
        let index = 0
        this.schedule(function create()
        {
            if (index < this._positionPool.length - 3)
            {
                for (let i = 0; i < this._positionPool[index].length; i++)
                {
                    this.createBullet(cc.v3((this._positionPool[index][i] - 540) * 0.8, this._positionY), false)
                }
            }
            else
            {
                for (let i = 0; i < this._positionPool[index].length; i++)
                {
                    this.createBullet(cc.v3((this._positionPool[index][i] - 540) * 0.8, this._positionY), true)
                }
            }
            index++
        }, 0.75, this._positionPool.length - 1, 0)
    }

    gameOver()
    {
        this.putAllBullet()
        this.running = false
        this.bulletWrapNode.active = false
        this.timeLabel.enabled = false
        this.stateNode.active = true
        this.stateNode.getComponent(cc.Sprite).spriteFrame = this.sprites[0]
    }

    gameComplete()
    {
        this.running = false
        this.putAllBullet()
    }

    putAllBullet()
    {
        this.bulletWrapNode.children.forEach((node) => this._bulletPool.put(node))
    }

    ShowComplete()
    {
        this.timeLabel.enabled = false
        this.box.active = false
        this.stateNode.active = true
        this.stateNode.getComponent(cc.Sprite).spriteFrame = this.sprites[1]
    }
}
