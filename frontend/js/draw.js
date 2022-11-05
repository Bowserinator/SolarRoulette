import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/AfterimagePass.js';

// Sim parameters
const CELESTIAL_SPHERE = 1200; // Radius of stars
const DRAW_SPHERE = 1000; // Radius of plane to draw stuff
const AMBIENT_LIGHT_INTENSITY = 0.1;

// WebGL1 renderer required for certain shader options
const renderer = new THREE.WebGL1Renderer({
	powerPreference: 'high-performance',
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
const controls = new OrbitControls( camera, renderer.domElement );

controls.minDistance = 1;
controls.maxDistance = 100;

camera.position.set( 0, 0, 100 );
controls.update();

// Bloom + effects
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 0.25;
bloomPass.radius = 0;
composer.addPass(bloomPass);

const afterImagePass = new AfterimagePass(0.2);
composer.addPass(afterImagePass);

// Add ambient light for the ground
const ambientLight = new THREE.AmbientLight(0xabcbff, AMBIENT_LIGHT_INTENSITY);
scene.add(ambientLight);

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
    const map = new THREE.TextureLoader().load(`../img/${img}`);
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
    planetMesh.rotation.y = ([{ size: 0 }].concat(planets)).map(p => p.size + 0.1).reduce((a, b) => a + b);
    planetMesh.position.y = 300 - height * 0.2;
    scene.add(planetMesh);
    planets.push({
        mesh: planetMesh,
        size: offset
    });

    ambientLight.intensity = AMBIENT_LIGHT_INTENSITY + 
        Math.min(0.5, planets.map(p => p.size ** 2).reduce((a, b) => a + b));
}

createPlanet(2439, 'mercury.png');
createPlanet(6051.8, 'venus.png');
createPlanet(6371, 'earth.png');
createPlanet(1737.4, 'moon.png');
createPlanet(3389.5, 'mars.png');

createPlanet(69911, 'jupiter.png', [-1, 0.9]);
createPlanet(1821, 'io.png');
createPlanet(58232 * 3.4, 'saturn.png', [-1, 1.2]);
createPlanet(2574, 'titan.png');
createPlanet(25362, 'uranus.png');
createPlanet(15299, 'neptune.png');
createPlanet(1188, 'pluto.png');


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

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
