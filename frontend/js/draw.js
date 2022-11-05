import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'https://unpkg.com/three@0.146.0/examples/jsm/postprocessing/AfterimagePass.js';

// Sim parameters
const CELESTIAL_SPHERE = 2200; // Radius of stars
const DRAW_SPHERE = 2000; // Radius of plane to draw stuff

// WebGL1 renderer required for certain shader options
const renderer = new THREE.WebGL1Renderer({
	powerPreference: 'high-performance',
	antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
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
bloomPass.strength = 0.35;
bloomPass.radius = 0;
composer.addPass(bloomPass);

const afterImagePass = new AfterimagePass(0.2);
composer.addPass(afterImagePass);

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
    scene.fog = new THREE.Fog(0x000000, 500, 2000);

    // Add ambient light for the ground
    const light = new THREE.AmbientLight(0x707070, 0.1);
    scene.add(light);

    // Point light where you are standing
    const light2 = new THREE.PointLight(0x707070, 2);
    light2.position.set(0, -20, 0)
    scene.add(light2);
})();


function test(size) {
    const map = new THREE.TextureLoader().load( '../img/jupiter.png' );

    let offset = size / 1.15;
    let offset2 = size;
    var objGeometry = new THREE.SphereGeometry(DRAW_SPHERE, 60, 60,
        Math.PI / 2 - offset, 2 * offset,
        Math.PI / 2 - offset2, 2 * offset2);
    var objMaterial = new THREE.MeshBasicMaterial({
        map: map,
        transparent: true,
        fog: false
    });
    objMaterial.side = THREE.BackSide;
    let earthMesh = new THREE.Mesh(objGeometry, objMaterial);
    earthMesh.rotation.x = -Math.PI / 2;
    scene.add(earthMesh);

}
// test(Math.PI / 6);
test(Math.PI / 52);

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
