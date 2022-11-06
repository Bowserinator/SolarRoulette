import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/AfterimagePass.js';
import image from '../imgdata.json' assert {type: 'json'};

// Sim parameters
const CELESTIAL_SPHERE = 1200; // Radius of stars
const DRAW_SPHERE = 1000; // Radius of plane to draw stuff
const AMBIENT_LIGHT_INTENSITY = 0.1;

const container = document.getElementById('canvas-container');

// WebGL1 renderer required for certain shader options
const renderer = new THREE.WebGL1Renderer({
	powerPreference: 'high-performance',
	antialias: true
});
let base = getBase();
renderer.setSize(base.innerWidth, base.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
renderer.domElement.classList.add('three-canvas');
renderer.domElement.id = 'sky-canvas';

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(40, base.innerWidth / base.innerHeight, 1, 100000);
const controls = new OrbitControls( camera, renderer.domElement );

controls.minDistance = 1;
controls.maxDistance = 100;

controls.minAzimuthAngle = Math.PI - Math.PI / 4; // radians
controls.maxAzimuthAngle = Math.PI + Math.PI / 4; // radians

camera.position.set( 0, 0, 100 );
controls.update();

// Bloom + effects
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2( base.innerWidth, base.innerHeight ), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 0.25;
bloomPass.radius = 0;
composer.addPass(bloomPass);

const afterImagePass = new AfterimagePass(0.2);
composer.addPass(afterImagePass);

// Add ambient light for the ground
const ambientLight = new THREE.AmbientLight(0xabcbff, AMBIENT_LIGHT_INTENSITY);
scene.add(ambientLight);

let isSun = false;
let groundPlane;

// Ground plane
(() => {
    const repeat = 32;
    const groundTexture = new THREE.TextureLoader().load('../img/ground.jpg');
    const normalGroundTexture = new THREE.TextureLoader().load('../img/ground-normal.png');

    groundTexture.repeat.set(repeat, repeat);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    normalGroundTexture.repeat.set(repeat, repeat);
    normalGroundTexture.wrapS = normalGroundTexture.wrapT = THREE.RepeatWrapping;

    const groundMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture, normalMap: normalGroundTexture
    });
    const PLANE_SIZE = 10000;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE), groundMaterial);
    mesh.geometry.center();
    mesh.position.y = -100.0;
    mesh.rotation.x = -Math.PI / 2;
    groundPlane = mesh;

    scene.add(mesh);

    // Add black fog for ground so it fades into the distance
    scene.fog = new THREE.Fog(0x000000, 500, 1000);

    // Point light where you are standing
    const light2 = new THREE.PointLight(0x707070, 2);
    light2.position.set(0, -20, 0)
    scene.add(light2);
})();


// Starry night sky
let skyMesh;
(() => {
    const vertex = document.getElementById('sky-vert').innerText;
    const frag = document.getElementById('sky-frag').innerText;

    new THREE.TextureLoader().load(
        '../img/starmap_8k.jpg',
        texture => {
            const objGeometry = new THREE.SphereGeometry(CELESTIAL_SPHERE, 60, 60);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    rand1: { type: 'f', value: Math.random() },
                    texture: { type: 't', value: texture},
                },
                fog: false,
                vertexShader: vertex,
                fragmentShader: frag
            });
            material.side = THREE.BackSide;

            skyMesh = new THREE.Mesh(objGeometry, material);
            scene.add(skyMesh);
        },
        xhr => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); },
        console.error
    );
})();


// Planet creation (small)
let planets = [];

/**
 * 
 * @param {number} size Radius in km
 * @returns {number} Angular size in rad
 */
function calcAngularSize(size) {
    return 2 * Math.asin(size / 384472.282);
}

/**
 * Create a non-gas giant image
 * @param {number} size radius of planet in km
 * @param {string} img name
 */
function createPlanet(size, img, override=[-1, -1]) {
    size = override[0] > 0 ? override[0] : calcAngularSize(size) * 4;
    
    // planets.forEach(p => scene.remove(p));
    const map = new THREE.TextureLoader().load(img.startsWith('http') ? img : `../img/${img}`);
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.RepeatWrapping;

    let offset = size;
    const height = override[1] > 0 ? DRAW_SPHERE * override[1] : DRAW_SPHERE * Math.sin(offset);
    offset *= (1.1 + Math.cos(offset)) / 2.1;

    const offset2 = size;
    // const objGeometry = new THREE.SphereGeometry(DRAW_SPHERE, 60, 60,
    //     Math.PI / 2 - offset, 2 * offset,
    //     Math.PI / 2 - offset2, 2 * offset2);
    const objGeometry = new THREE.CylinderGeometry(DRAW_SPHERE, DRAW_SPHERE,
        height, // Arclength
        60, 60,
        true,
        0, offset);
    const objMaterial = new THREE.MeshBasicMaterial({
        map: map,
        transparent: true,
        fog: false
    });
    objMaterial.side = THREE.BackSide;

    const planetMesh = new THREE.Mesh(objGeometry, objMaterial);
    // planetMesh.rotation.y = ([{ size: 0 }].concat(planets)).map(p => p.size + 0.1).reduce((a, b) => a + b);
    planetMesh.position.y = 300 - height * 0.2;
    console.log(planetMesh.position.y)
    scene.add(planetMesh);

    planets.push({
        mesh: planetMesh,
        size: offset
    });

    ambientLight.intensity = AMBIENT_LIGHT_INTENSITY + 
        Math.min(0.5, planets.map(p => p.size ** 2).reduce((a, b) => a + b));
}

window.onChangeBody = body => {
    planets.forEach(p => scene.remove(p.mesh));
    planets = [];
    isSun = false;
    skyMesh.visible = true;
    groundPlane.visible = true;

    switch (body.englishName) {
        case "Sun":
            isSun = true;
            skyMesh.visible = false;
            groundPlane.visible = false;

            scene.background = new THREE.Color('white');
            break;
        case "Mercury":
            createPlanet(2439, 'mercury.png');
            break;
        case "Venus":
            createPlanet(6051.8, 'venus.png');
            break;
        case "Earth":
            createPlanet(6371, 'earth.png');
            break;
        case "Moon":
            createPlanet(1737.4, 'moon.png');
            break;
        case "Mars":
            createPlanet(3389.5, 'mars.png');
            break;
        case "Jupiter":
            createPlanet(69911, 'jupiter.png', [-1, 0.9]);
            break;
        case "Saturn":
            createPlanet(58232 * 3.4, 'saturn.png', [-1, 1.2]);
            break;
        case "Io":
            createPlanet(1821, 'io.png');
            break;
        case "Uranus":
            createPlanet(25362, 'uranus.png');
            break;
        case "Neptune":
            createPlanet(15299, 'neptune.png');
            break;
        case "Pluto":
            createPlanet(1188, 'pluto.png');
            break;
        case "Titan":
            createPlanet(2574, 'titan.png');
            break;
        case "136199 Eris":
            createPlanet(1163, 'eris.png');
            break;
        default:
            if (body.meanRadius < 100000 && body.meanRadius > 200) {
                console.log(body);
                createPlanet(body.meanRadius, image[body.englishName]);
            }
            break;
    }

    onWindowResize();
};

// Rendering
let startTime = Date.now();

function animate() {
    let timeElapsed = Date.now() - startTime ;
	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	// renderer.render(scene, camera);
    composer.render();


    if (skyMesh) // Twinkle over time
        skyMesh.material.uniforms.rand1.value = timeElapsed / 20;
}

animate();


// On resize
window.addEventListener('resize', onWindowResize, false);

function getBase() {
    let base = document.getElementById('myCanvas');
    base = {
        innerWidth: base.offsetWidth,
        innerHeight: base.offsetHeight
    };
    return base;
}

function onWindowResize(){
    let base = getBase();
    camera.aspect = base.innerWidth / base.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(base.innerWidth, base.innerHeight);
    composer.setSize(base.innerWidth, base.innerHeight);
    
}
