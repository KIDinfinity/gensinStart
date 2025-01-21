import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from '../../../libs/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from '../../../libs/stats.module.js';
import points from './pointModel.js'
import { Vector3 } from '../../../libs/xviewer';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
export default () => {
    console.log("Three", THREE)
    const moveMap = {};
    let moveDirection = new Vector3(0, 0, 0);
    const canvasRef = useRef(null);
    let moveSpeed = 450;
    let curControls;
    const scene = new THREE.Scene();
    const gui = new GUI();





    const addLight = (scene, gui) => {
        const customGui = gui.addFolder("custom");
        const commonControl = {
            cameraSpeed: 450,
        }
        customGui
            .add(commonControl, 'cameraSpeed', 0, 1000) // 调整范围 0-10
            .name('walkSpeed')
            .onChange((value) => {
                moveSpeed = value;
            });
        const ambientFolder = customGui.addFolder("ambient");
        ambientFolder.close();
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const ambientSettings = {
            enable: true, // 初始值为启用
            intensity: 0, // 初始值为启用
        };
        ambientFolder.add(ambientSettings, "enable").name("ambient").onChange((value) => {
            console.log("change", value);
            ambientLight.visible = value;
        })
        ambientFolder
            .add(ambientSettings, 'intensity', 0, 10) // 调整范围 0-10
            .name('Intensity')
            .onChange((value) => {
                ambientLight.intensity = value; // 动态更新光强
            });

        // 添加点光源
        const pointLight = new THREE.PointLight(0xffffff, 1, 50);
        pointLight.position.set(0, 30, -30);
        scene.add(pointLight);

        // 添加点光源的辅助工具
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
        // scene.add(pointLightHelper);

        const pointFolder = customGui.addFolder("point");
        pointFolder.close();
        const pointSettings = {
            enable: true, // 初始值为启用
            intensity: 100, // 初始值为启用
            x: 10,
            y: 10,
            z: 10,
            color: '#ffffff', // 默认颜色
        };
        pointFolder.add(pointSettings, "enable").name("point").onChange((value) => {
            console.log("change", value);
            pointLight.visible = value;
        })
        pointFolder
            .add(pointSettings, 'intensity', 0, 10000) // 调整范围 0-10
            .name('Intensity')
            .onChange((value) => {
                pointLight.intensity = value; // 动态更新光强
            });
        pointFolder
            .add(pointSettings, 'x', -100, 100) // 调整范围 0-10
            .name('x')
            .onChange((value) => {
                pointLight.position.x = value;
                console.log("value_x", value)
            });
        pointFolder
            .add(pointSettings, 'y', -100, 100) // 调整范围 0-10
            .name('y')
            .onChange((value) => {
                pointLight.position.y = value;
                console.log("value_y", value)
            });
        pointFolder
            .add(pointSettings, 'z', -200, 200) // 调整范围 0-10
            .name('z')
            .onChange((value) => {
                pointLight.position.z = value;
                console.log("value_z", value)
            });
        pointFolder
            .addColor(pointSettings, 'color')
            .name('Color')
            .onChange((value) => {
                pointLight.color.set(value); // 更新点光源的颜色
            });

        // 添加阳光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(20, 20, 20); // 光源位置（右上角）
        directionalLight.target.position.set(0, 0, 0); // 光照目标（左下角）
        scene.add(directionalLight);
        scene.add(directionalLight.target);

        // 添加方向光的辅助工具
        const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
        scene.add(lightHelper);

        const directFolder = customGui.addFolder("direct");
        directFolder.close();
        const directSettings = {
            enable: true, // 初始值为启用
            intensity: 1, // 初始值为启用
            x: 20,
            y: 20,
            z: 20,
            color: '#ffffff', // 默认颜色
        };
        directFolder.add(directSettings, "enable").name("direct").onChange((value) => {
            console.log("change", value);
            directionalLight.visible = value;
        })
        directFolder
            .add(directSettings, 'intensity', 0, 10) // 调整范围 0-10
            .name('Intensity')
            .onChange((value) => {
                directionalLight.intensity = value; // 动态更新光强
            });
        directFolder
            .add(directSettings, 'x', -100, 100) // 调整范围 0-10
            .name('x')
            .onChange((value) => {
                directionalLight.position.x = value;
            });
        directFolder
            .add(directSettings, 'y', -100, 100) // 调整范围 0-10
            .name('y')
            .onChange((value) => {
                directionalLight.position.y = value;
            });
        directFolder
            .add(directSettings, 'z', -200, 200) // 调整范围 0-10
            .name('z')
            .onChange((value) => {
                directionalLight.position.z = value;
            });
        directFolder
            .addColor(directSettings, 'color')
            .name('Color')
            .onChange((value) => {
                directionalLight.color.set(value); // 更新点光源的颜色
            });


    }
    const renderYing = () => {
        const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        curControls = new OrbitControls(camera, renderer.domElement)
        camera.position.set(50, 50, 50);
        camera.lookAt(0, 0, 0);

        // const cameraHelper =new THREE.CameraHelper(camera,100);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        const ambient = new THREE.AmbientLight(0xffffff, 1)
        directionalLight.position.set(50, 50, 50)
        // renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        scene.add(directionalLight)
        scene.add(ambient)
        // scene.add(cameraHelper);
        const loader = new GLTFLoader();
        loader.load('../src/source/test/blend.glb', function (gltf) {
            console.log("gltf", gltf)
            scene.add(gltf.scene);
        });

        //move
        moveDirection

        renderer.render(scene, camera);
        // document.getElementById('webgl')!.appendChild(renderer.domElement);
        console.log("scene", scene)
        const render = () => {
            moveDirection = new Vector3(0, 0, 0);
            if (moveMap["w"]) moveDirection.z -= 1; // 向前
            if (moveMap["s"]) moveDirection.z += 1; // 向后
            if (moveMap["a"]) moveDirection.x -= 1; // 向左
            if (moveMap["d"]) moveDirection.x += 1; // 向右
            if (moveMap["arrowup"]) moveDirection.y += 1; // 向上
            if (moveMap["arrowdown"]) moveDirection.y -= 1; // 向下
            if (!moveDirection.equals(new Vector3(0, 0, 0))) {
                moveDirection.normalize().multiplyScalar(moveSpeed * 0.001);
                camera.position.copy(camera.position.add(moveDirection))
                curControls.target.set(camera.position.x, camera.position.y, camera.position.z - 10); // 假设视线向前
                curControls.update();
            }
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
        render();
    }

    const renderGaoda = () => {
        const loader = new GLTFLoader();
        loader.load('../src/source/gaoda/AyanamiRei.glb', function (gltf) {
            console.log("gltf", gltf)
            scene.add(gltf.scene);
        });
    }

    const keydown = (event) => {
        moveMap[event.key.toLowerCase()] = true;
        console.log("down")
    }
    const keyup = (event) => {
        moveMap[event.key.toLowerCase()] = false;
        console.log("up")
    }
    const addMove = () => {
        window.addEventListener("keydown", keydown, true)
        window.addEventListener("keyup", keyup, true)
    }
    addLight(scene, gui)
    useEffect(() => {
        // renderGaoda();
        renderYing();
        addMove();

        // renderShape();
    }, [])
    return (
        <div>
            home
            <canvas ref={canvasRef} id='webgl'></canvas>
        </div>)

}