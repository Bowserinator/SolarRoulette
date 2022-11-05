import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const scene = new THREE.Scene();
scene.background = new THREE.Color('black');



// Ground plane
let groundTexture = new THREE.TextureLoader().load( '../img/ground.jpg' );
groundTexture.repeat.set(32, 32);
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
let normalGroundTexture = new THREE.TextureLoader().load( '../img/ground-normal.png' );
normalGroundTexture.repeat.set(32, 32);
normalGroundTexture.wrapS = normalGroundTexture.wrapT = THREE.RepeatWrapping;
var groundMaterial = new THREE.MeshStandardMaterial( { map: groundTexture, normalMap: normalGroundTexture });
var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), groundMaterial );
mesh.position.y = -100.0;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

scene.fog = new THREE.Fog(0x000000, 500, 2000);

const light = new THREE.AmbientLight( 0x707070, 0.1);
scene.add( light );

const light2 = new THREE.PointLight( 0x707070, 0.9);
light2.position.set(0, 0, 0)
scene.add( light2 );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 0, 100 );
controls.update();


function test(size) {
    const map = new THREE.TextureLoader().load( '../img/jupiter.png' );

    let offset = size / 1.15;
    let offset2 = size;
    var objGeometry = new THREE.SphereGeometry(210, 60, 60,
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

let shaderMaterials = [];

var loader = new THREE.TextureLoader();
loader.load(
    "../img/starmap_8k.jpg",
    texture => {
        var objGeometry = new THREE.SphereGeometry(2200, 60, 60);
        var objMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            opacity: 0.3,
            fog: false
        });

        const material = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                rand1: { type: "f", value: Math.random() },
                resolution: { value: new THREE.Vector2() },
                texture: { type: "t", value: texture},
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_PointSize = 8.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
           `,
        
            fragmentShader: `
                    varying vec2 vUv;
                    float d, rate;
                    uniform float rand1;
                    uniform sampler2D texture;
                    void main() {
                        gl_FragColor = texture2D(texture, vUv);

                        rate = mod(vUv.x / 20.0 + vUv.y / 20.0, 5.0);
                        d = 10.0 + 8.0 * sin(rate * (rand1 + vUv.x + vUv.y));
                        gl_FragColor.r = clamp(1.0 - 1.5 / (1.0 + exp(d * (gl_FragColor.r - 0.5))), 0.0, 1.0); // gl_FragColor.r * gl_FragColor.r * clamp(sin(rand1*5.0), 0.5, 1.0);
                        gl_FragColor.g = clamp(1.0 - 1.5 / (1.0 + exp(d * (gl_FragColor.g - 0.5))), 0.0, 1.0); // gl_FragColor.g * gl_FragColor.g * clamp(sin(rand1*5.0), 0.5, 1.0);
                        gl_FragColor.b = clamp(1.0 - 1.5 / (1.0 + exp(d * (gl_FragColor.b - 0.5))), 0.0, 1.0); // gl_FragColor.b * gl_FragColor.b * clamp(sin(rand1*5.0), 0.5, 1.0);
                    }
            `
        } );


        material.side = THREE.BackSide;
        let earthMesh = new THREE.Mesh(objGeometry, material);
        scene.add(earthMesh);
        shaderMaterials.push(earthMesh);
    },
    xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    console.error
);



let x = Date.now();
function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

    let timeElapsed = Date.now() - x;

    if (shaderMaterials[0]) {
        shaderMaterials[0].material.uniforms.rand1.value = timeElapsed / 10;
    }
}

animate();
