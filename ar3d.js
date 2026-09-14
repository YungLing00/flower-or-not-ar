import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const canvas=document.getElementById('plantCanvas');
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x000000,0);
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.01,100);camera.position.set(0,.4,3.2);
scene.add(new THREE.HemisphereLight(0xffffff,0x25483d,2.0));
const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(3,5,4);scene.add(key);
const rim=new THREE.DirectionalLight(0x65efbd,1.8);rim.position.set(-4,2,-3);scene.add(rim);
const root=new THREE.Group();scene.add(root);
let current=null,currentRotation=0,autoRotate=true,loadToken=0;

function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(canvas);
function disposeObject(o){o?.traverse(n=>{n.geometry?.dispose?.();const mats=Array.isArray(n.material)?n.material:[n.material];mats.filter(Boolean).forEach(m=>{['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap'].forEach(k=>m[k]?.dispose?.());m.dispose?.()})})}
function clear(){if(current){root.remove(current);disposeObject(current);current=null}}
function fitObject(obj){const box=new THREE.Box3().setFromObject(obj),size=new THREE.Vector3(),center=new THREE.Vector3();box.getSize(size);box.getCenter(center);obj.position.sub(center);const max=Math.max(size.x,size.y,size.z)||1;obj.scale.setScalar(1.65/max);const box2=new THREE.Box3().setFromObject(obj);obj.position.y-=box2.min.y+0.78}
function render(){requestAnimationFrame(render);if(current&&autoRotate)current.rotation.y+=.0035;renderer.render(scene,camera)}render();
function loadMTL(folder,mtl){return new Promise((resolve,reject)=>{const l=new MTLLoader();l.setPath(folder);l.setResourcePath(folder);l.load(mtl,m=>{m.preload();resolve(m)},undefined,reject)})}
function loadOBJ(folder,obj,materials,onProgress){return new Promise((resolve,reject)=>{const l=new OBJLoader();if(materials)l.setMaterials(materials);l.setPath(folder);l.load(obj,resolve,onProgress,reject)})}
window.Plant3D={
  async load(config){
    const token=++loadToken;clear();currentRotation=0;if(!config?.obj||!config?.folder)return false;
    const status=document.getElementById('modelStatus');status.textContent='3D LOADING 0%';
    try{
      const materials=config.mtl?await loadMTL(config.folder,config.mtl):null;if(token!==loadToken)return false;
      const obj=await loadOBJ(config.folder,config.obj,materials,e=>{
        if(status)status.textContent=e.lengthComputable?'3D LOADING '+Math.min(99,Math.round(e.loaded/e.total*100))+'%':'3D LOADING...';
      });
      if(token!==loadToken){disposeObject(obj);return false}
      obj.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;const mats=Array.isArray(n.material)?n.material:[n.material];mats.filter(Boolean).forEach(m=>{if(m.map)m.map.colorSpace=THREE.SRGBColorSpace;m.side=THREE.DoubleSide;m.needsUpdate=true})}});
      fitObject(obj);root.add(obj);current=obj;current.rotation.y=currentRotation;canvas.classList.add('active');status.textContent='OBJ 3D MODEL';resize();return true;
    }catch(err){console.error('OBJ load failed',config,err);status.textContent='2D FALLBACK';canvas.classList.remove('active');clear();return false}
  },
  clear(){loadToken++;clear();canvas.classList.remove('active')},
  setRotation(rad){currentRotation=rad;if(current)current.rotation.y=rad},
  setAutoRotate(v){autoRotate=!!v},
  get active(){return !!current}
};