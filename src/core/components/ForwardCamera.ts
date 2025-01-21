import { Component, TWEEN, Vector3 } from "../../libs/xviewer";

export const cameraCenter = new Vector3()

let __delta = new Vector3();
export class ForwardCamera extends Component {
    public speed = new Vector3(0, 0, -88)
    private shouldStop = false;
    private _zOffset = 0;
    private moveDirection = new Vector3(0, 0, 0); // 存储当前的运动方向
    private keyState: { [key: string]: boolean } = {}; // 存储按键状态
    private moveSpeed = 450; // 相机移动速度
    onLoad(props: any): void {
        cameraCenter.set(0, 0, 0);
        this.on("showDoor", this.stop, this)
        this.on("openDoor", this.openDoor, this)
        //捕获阶段事件
        window.addEventListener("keydown", this.onKeyDown,true);
        window.addEventListener("keyup", this.onKeyUp,true);
        console.log("test",this)
    }
    private onKeyDown = (event: KeyboardEvent) => {
        console.log("test_press")
        this.keyState[event.key.toLowerCase()] = true; // 标记按键为按下状态
    };

    private onKeyUp = (event: KeyboardEvent) => {
        this.keyState[event.key.toLowerCase()] = false; // 标记按键为释放状态
    };

    update(dt: number): void {
        if (!this.shouldStop) {
            if(window?.privateGame?.autoMove){
                cameraCenter.add(__delta.copy(this.speed).multiplyScalar(dt));
                this.viewer.camera.position.copy(cameraCenter)
                return;
            }
            // 根据按键状态更新运动方向
            // console.log("手动移动",this.keyState)
            this.moveDirection.set(0, 0, 0);
            if (this.keyState["w"]) this.moveDirection.z -= 1; // 向前
            if (this.keyState["s"]) this.moveDirection.z += 1; // 向后
            if (this.keyState["a"]) this.moveDirection.x -= 1; // 向左
            if (this.keyState["d"]) this.moveDirection.x += 1; // 向右
            if (this.keyState["arrowup"]) this.moveDirection.y += 1; // 向上
            if (this.keyState["arrowdown"]) this.moveDirection.y -= 1; // 向下

            // 归一化方向向量，并乘以速度和时间增量
            if (!this.moveDirection.equals(new Vector3(0, 0, 0))) {
                this.moveDirection.normalize().multiplyScalar(this.moveSpeed * dt);
                cameraCenter.add(this.moveDirection); // 更新相机中心位置
                this.viewer.camera.position.copy(cameraCenter)
                this.updateCameraControls()
            }
        }
    }
    updateCameraControls(){
        const controls = window.privateGame.orbitControls;
        controls.target.set(cameraCenter.x, cameraCenter.y, cameraCenter.z - 10); // 假设视线向前
        controls.update();
    }
    private stop(zOffset: number) {
        this.shouldStop = true;
        this._zOffset = zOffset;
        let orgPos = this.viewer.camera.position.clone()
        TWEEN.TweenManager.Tween(this.viewer.camera)
            .to({ position: new Vector3(orgPos.x, orgPos.y, zOffset - 165) }, 5)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }
    private openDoor(navigate) {
        let orgPos = this.viewer.camera.position.clone()
        TWEEN.TweenManager.KillTweensOf(this.viewer.camera);
        TWEEN.TweenManager.Tween(this.viewer.camera)
            .to({ position: new Vector3(orgPos.x, orgPos.y, this._zOffset - 400) }, 0.6)
            .easing(TWEEN.Easing.Cubic.In)
            .start()
            .onComplete(()=>{
                navigate('/home')
            });
    }
}