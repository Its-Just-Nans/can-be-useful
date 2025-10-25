import {
    Scene,
    BoxGeometry,
    EdgesGeometry,
    LineSegments,
    TextureLoader,
    MeshStandardMaterial,
    Mesh,
    WebGLRenderer,
    PerspectiveCamera,
    LineBasicMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Logo from "./DVD_logo.png";

const scene = new Scene();
let camera;
let renderer;
let cube;
let dvdMesh;
let controls;
let i = 0;
let timeBase = 1;
let animationId;
const size = 3;
const line = new LineSegments(
    new EdgesGeometry(new BoxGeometry(size, size, size)),
    new LineBasicMaterial({ color: 0xffffff })
);
scene.add(line);
const cubeSize = 0.3;
const createCube = () => {
    const geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    const loader = new TextureLoader();
    const dvd = loader.load(Logo);
    dvdMesh = new MeshStandardMaterial({
        map: dvd,
        transparent: true,
        emissive: "red",
        emissiveIntensity: 10000000,
    });
    cube = new Mesh(geometry, dvdMesh);
    scene.add(cube);
};

let indexColor = 0;
const colors = ["red", "blue", "green", "yellow", "purple", "pink", "white"];
const changeColor = () => {
    dvdMesh.emissive.set(colors[indexColor++ % colors.length]);
};

const div = 100000;

const square = { x: 50, y: 50, dx: 2, dy: 1, dz: 1, width: 10, height: 10 };
let then10 = new Date().getTime();
const animateCube = () => {
    const now10 = new Date().getTime();
    const dt10 = now10 - then10;
    then10 = now10;
    cube.position.x += (square.dx * dt10 * 60) / div;
    cube.position.y += (square.dy * dt10 * 60) / div;
    cube.position.z += (square.dz * dt10 * 60) / div;

    const max = size / 2;
    const minBorder = -max + cubeSize / 2;
    const maxBorder = max - cubeSize / 2;
    let change = false;
    if (cube.position.x <= minBorder) {
        square.dx = -square.dx;
        change = true;
        cube.position.x = minBorder;
    } else if (cube.position.x >= maxBorder) {
        square.dx = -square.dx;
        change = true;
        cube.position.x = maxBorder;
    }
    if (cube.position.y <= minBorder) {
        square.dy = -square.dy;
        change = true;
        cube.position.y = minBorder;
    } else if (cube.position.y >= maxBorder) {
        square.dy = -square.dy;
        change = true;
        cube.position.y = maxBorder;
    }
    if (cube.position.z <= minBorder) {
        square.dz = -square.dz;
        change = true;
        cube.position.z = minBorder;
    } else if (cube.position.z >= maxBorder) {
        square.dz = -square.dz;
        change = true;
        cube.position.z = maxBorder;
    }
    if (change) {
        changeColor();
    }
};

const animate = () => {
    animationId = requestAnimationFrame(animate);
    if (i++ % timeBase === 0) {
        animateCube();
        i = 1;
    }
    controls.update();
    renderer.render(scene, camera);
};

const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

export const setBaseTime = (newTimeBase) => {
    timeBase = newTimeBase;
};

export const createScene = (el) => {
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener("resize", resize);
    window.addEventListener("focus", () => {
        then10 = new Date().getTime();
        animate();
    });
    window.addEventListener("blur", () => {
        cancelAnimationFrame(animationId);
    });
    createCube();
    resize();
    animate();
};
