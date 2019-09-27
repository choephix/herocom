import * as GUI from 'dat.gui'
import * as TWEEN from 'tweeno'
import { GridBody, UnitBody } from './madels'

//import * as THREE from 'three'
//window.THREE = THREE
//import FBXLoader from 'three/examples/js/loaders/FBXLoader'
var THREE = window.THREE = require('three');



var renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

var gui = new GUI.GUI()
gui.open()

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x102030 )

var light = new THREE.DirectionalLight( 0xffffff, 0.5 )
light.position.set( 1, 1, 1 ).normalize()
scene.add( light )
scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ) )

var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 500 )
camera.position.set( 0, 25, 50 )
camera.lookAt( 0, 0, 0 )

const GRIDX = 25, GRIDY = 25
var grid = new GridBody( GRIDX, GRIDY, 4 )
scene.add( grid )

let queue = new TWEEN.Queue()

function selectUnit( unit )
{
  if ( selectedUnit )
    selectedUnit.setEmissive(0x0)
  selectedUnit = unit
  if ( selectedUnit )
    selectedUnit.setEmissive(0x0044BB)
}

function setUnitLocation( unit, x, y )
{
  let tile = grid.getTile( x, y )
  console.log( x, y )
  queue.add( new TWEEN.Tween( unit.position, { to: { x: tile.position.x, y: 0, z: tile.position.z }, duration: 100 } ).start() )
}

function addUnit()
{
  let i = units.length
  let unit = new UnitBody()
  scene.add( unit )
  units.push( unit )
  setUnitLocation( unit, 8+i,12 )

  unit.scale.multiplyScalar( .50 + .30 * ( Math.random() - Math.random() ) )
}


var units = [], selectedUnit
for ( let i = 0 ; i < 8 ; i ++ )
  addUnit()

selectUnit( units[0] )


/*** /
var material_line = new THREE.LineBasicMaterial( { color: 0xDDAA22 } );
var geometry_line = new THREE.Geometry();
geometry_line.vertices.push(new THREE.Vector3( -10, 0, 0) );
geometry_line.vertices.push(new THREE.Vector3( 0, 10, 0) );
geometry_line.vertices.push(new THREE.Vector3( 10, 0, 0) );
var line = new THREE.Line( geometry_line, material_line );
scene.add( line );
/** */

let HOVERED, mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'resize', onWindowResize, false );

function handleHover():UnitBody|THREE.Mesh
{
  raycaster.setFromCamera( mouse, camera )
  let intersects, intersect
  
  intersects = raycaster.intersectObjects( units, true );
  intersect = intersects.length > 0 ? intersects[0].object.parent : null
  if ( intersect )
    return intersect as UnitBody;

  intersects = raycaster.intersectObjects( [grid], true );
  intersect = intersects.length > 0 ? intersects[0].object : null
  if ( intersect )
    return intersect as THREE.Mesh
}


function animate() {
	requestAnimationFrame( animate )

  for ( let unit of units )
  {
    unit.rotation.y += 0.01
    unit.updateMatrix()
  }

  queue.update()

  let hover = handleHover()
  if ( HOVERED != hover )
    HOVERED = hover
	
  renderer.render( scene, camera )
}
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function onDocumentMouseMove( event ) {
  event.preventDefault()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
}


function onDocumentMouseDown( event ) {
  if ( HOVERED == null )
    return
  event.preventDefault()
  if ( HOVERED.type === "unit" )
    selectUnit( HOVERED )
  if ( HOVERED.type === "tile" )
    setUnitLocation( selectedUnit, HOVERED.data.x, HOVERED.data.y )
  //selectUnit( units[ ( units.indexOf(selectedUnit) + 1 ) % units.length ] )
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function moveCamera(dx,dz) {
  let dy = 0
  let cameraSpeed = 5
  moveCameraTo(
    camera.position.x + dx * cameraSpeed, 
    camera.position.y + dy * cameraSpeed, 
    camera.position.z + dz * cameraSpeed
  )
}
function moveCameraTo( x,y,z,instant=false ) {
  if ( instant )
  {
    camera.position.x = x
    camera.position.y = y
    camera.position.z = z
  }
  else
  {
    queue.add( new TWEEN.Tween( camera.position, { to: { x:x, y:y, z:z }, duration: 100 } ).start() )
  }
}
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 87) {
    moveCamera( 0, -1 )
  } else if (keyCode == 83) {
    moveCamera( 0, 1 )
  } else if (keyCode == 65) {
    moveCamera( -1, 0 )
  } else if (keyCode == 68) {
    moveCamera( 1, 0 )
  } else if (keyCode == 32) {
    moveCameraTo( 0, 20, 50 );
  }  
}