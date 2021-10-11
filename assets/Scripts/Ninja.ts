import GameManager from "./GameManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Ninja extends cc.Component
{
    private _gameManager: GameManager = null

    setManager(manager: GameManager)
    {
        this._gameManager = manager
    }

    onLoad()
    {
        cc.director.getCollisionManager().enabled = true
        //cc.director.getCollisionManager().enabledDebugDraw = true
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)  
    {
        if (other.name.match('box'))
        {
            this._gameManager.ShowComplete()
        }
        else
        {
            this._gameManager.gameOver()
        }
    }
}
