import * as THREE from 'three';

// new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )

export class UnitBody extends THREE.Object3D
{
  constructor() 
  {
    super()
    this.type = "unit"
    this.addBox(-.8, 0.5, 1.3, 1.25, 0x334466 )
    this.addBox( .8, 0.5, 1.3, 1.25, 0x334466 )
    this.addBox( 0, 1.5, 0, 3.0, 0x3355CC )
    this.addBox( 0, 4.5, 0, 3.0, Math.random() * 0xffffff )
    this.addBox( 0, 7.0, 0, 2.0, 0xEECCBB )
  }

  addBox( x, y, z, size, color )
  {
    var geometry_box = new THREE.BoxBufferGeometry( size, size, size )
    var material_box = new THREE.MeshLambertMaterial( { color: color } )
    var cube = new THREE.Mesh( geometry_box, material_box )
    this.add( cube )
    cube.position.set( x, y, z )
  }

  setEmissive( hex )
  {
    for ( let o of this.children )
      (<any>o).material.emissive.setHex( hex )
  }
}

export class GridBody extends THREE.Object3D
{
  constructor( private gridSizeX, private gridSizeY, private tileSize ) 
  {
    super()
    for ( let iy = 0 ; iy < gridSizeY ; iy++ )
      for ( let ix = 0 ; ix < gridSizeX ; ix++ )
        this.addTile( ix, iy, (ix+iy)%2===0 ? 0x111111 : 0x222222 )
  }

  addTile( x, y, color )
  {
    let size = this.tileSize
    let xx = size * ( x - .5 * this.gridSizeX + .5 )
    let yy = size * ( y - .5 * this.gridSizeY + .5 )
    var geometry  = new THREE.PlaneBufferGeometry( size, size )
    var material = new THREE.MeshLambertMaterial( { color: color } )

    var o = new THREE.Mesh( geometry, material )
    this.add( o )
    o.position.set( xx, 0, yy )
    o.rotation.set( -.5*Math.PI, 0, 0 )
    o.data = { x:x, y:y }
    o.type = "tile"
  }

  getTile( x, y )
  {
    return this.children[ this.gridSizeX * y + x ]
  }
}