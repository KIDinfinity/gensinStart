import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    // 数组里面编写顶点的坐标数据
    0, 0, 0,
    50, 0, 0,
    8, 90, 0,
    0, 0, 30,//项点4坐标
    0, 0, 100,//项点5坐标
    50, 0, 10])

const attribute = new THREE.BufferAttribute(vertices,3)

geometry.attributes.position = attribute;

const material = new THREE.PointsMaterial({
    color:0xff0000,
    size:10
});

const points = new THREE.Points(geometry,material);

export default points;