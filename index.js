import BABYLON from './_snowpack/pkg/babylonjs.js'
const log = console.log
const canvas = document.querySelector("canvas")

const {MeshBuilder, HemisphericLight, FreeCamera,  Vector3, StandardMaterial, Color3, Scene, Engine} = BABYLON

const xrPolyfillPromise = new Promise((resolve) => {
    if (navigator.xr) {
        log('xr is available')
        return resolve();
    }
    if (window.WebXRPolyfill) {
        log('webXRPolyfill is available')
        new WebXRPolyfill();
        return resolve();
    } else {
        const url = "https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js";
        const s = document.createElement("script");
        s.src = url;
        document.head.appendChild(s);
        s.onload = () => {
            new WebXRPolyfill();
            resolve();
        };
    }
});

let _engine = new Engine(canvas, true);
let _scene = new Scene(_engine);

async function firstScene(){

    const newScene = new Scene(_engine);

    const cam = new FreeCamera("camera", new Vector3(0,1,0), newScene)
    cam.attachControl(canvas, true);

    const hemLight = new HemisphericLight("hem,Lig", new Vector3(0,10,10), newScene)
    const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10})
    const box = MeshBuilder.CreateBox("bux", {size: 10});

    const xr = await newScene.createDefaultXRExperienceAsync();

    await newScene.whenReadyAsync()
    log("success")
    _scene.dispose()
    _scene = newScene 
}

const initGame = async () => {
    
    await firstScene()

    _engine.runRenderLoop(() => {
        _scene.render()
    })

    window.addEventListener("resize", e => {
        _engine.resize()
    })
}



xrPolyfillPromise
.then((res) => {
    initGame()
})
.catch(err => {
    log(err)
})