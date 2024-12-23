import {EventEmitter, MathUtils} from '../libs/xviewer';

class TaskManager {
    private _taskCount: number = 0;
    private _taskFinished: number = 0;
    private _resolve: Promise<void> = Promise.resolve();
    private _progress: number = 0;

    public get progress(){
        return this._progress;
    }

    public task(handle:Function | Promise<any>,{name="", weight=1}={}){
        console.log("test_____")
        this._regist(weight);
        return this._resolve
            .then(()=> typeof handle === "function" ? handle() : handle)
            .then(()=> this._finish(weight,name))
            .catch(err=>{
                this._finish(weight, name);
                console.error(err);
            })
    }

    public reset(){
        this._taskCount = 0;
        this._taskFinished = 0;
        this._progress = 0;
    }

    private _finish(w: number, name: string){
        this._taskFinished += w;
        this._progress = MathUtils.clamp01(Math.max(this._progress, this._taskFinished / this._taskCount));
    }

    private _regist(w: number){
        this._taskCount = Math.max(1, this._taskCount + w);
    }
}

class GameManager extends EventEmitter {
    public taskManager: TaskManager = new TaskManager();
    public restartCount: number = 0;

    public reset(){
        this.clear();
        this.taskManager.reset();
        this.taskManager = new TaskManager();
    }

    public get progress(){
        return this.taskManager.progress;
    }

    public restart(){
        console.log("restart")
        window.location.href = '#'
    }
    
    public task(handle: Function | Promise<any>, props={}){
        console.log("taskStart")
        //调用task，就是执行handle，最后将props={name="", weight=1}传给_finish
        return this.taskManager.task(handle, props);
    }
}

export const gameManager = new GameManager();