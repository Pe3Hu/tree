var container, stats, raycaster, mouse;
var camera, scene, renderer, controls, clock;

var dragIndex, dragVec, dragOffset, dragHue, targetList;
var bottomСonnector, topСonnectors, connections;
var bCoffset, tCoffset;
var plane, pulsar;
var branchList;
var cameraVec = new THREE.Vector3(0,-300,300);
var branchSize = new THREE.Vector2(24,72);
var branchCount =  new THREE.Vector2(5,5);
var branchOffset = new THREE.Vector3()//-72*branchCount.x/2,-72*branchCount.y/2,0.1);
var colorHelper = [0, 30/360, 60/360, 120/360, 180/360, 240/360, 270/360];
var stringColor = {
	0: "red", 30 : "orange", 60: "yellow", 120 : "green", 180: "aqua", 240 : "blue", 270 : "indigo"
}

init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x909090 );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.add(cameraVec);
	scene.add( camera );
	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	clock = new THREE.Clock();
	tick = 0;

  var divisions = 100, s = branchSize.x*100;
  var gridHelper = new THREE.GridHelper( s, divisions );
  gridHelper.rotateX(Math.PI/2)
  scene.add( gridHelper );

	var geometry = new THREE.PlaneBufferGeometry( s, s, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( geometry, material );

	growth();

	controls = new THREE.OrbitControls( camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	//
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseDown( event )		{
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );
			var intersects = raycaster.intersectObjects( targetList );

			if ( intersects.length > 0 )
			{
				var name = intersects[ 0 ].object.name;
				//var r = rangePalette();
				if ( dragIndex===null  ){
						dragIndex = name;
						dragLast = targetList[dragIndex].position.clone();
						dragOffset = targetList[dragIndex].position.clone();
						dragOffset.sub(dragVec);
						bCoffset =dragVec.clone()
					  bCoffset.sub(targetList[dragIndex].position);
						var dragColor = targetList[dragIndex].geometry.colors[0];
						var hsl = dragColor.getHSL();
						minIndex= null;
						min = 1;
						for (var c = 0; c<colorHelper.length; c++){
							if (Math.abs(hsl.h-colorHelper[c])<min){
								minIndex = c;
								min = Math.abs(hsl.h-colorHelper[c]);
							}
						}
						dragHue = colorHelper[minIndex];
				}
				else {
					var f = findMacth();
					if (f){
						branchList[dragIndex].meshMoveTo(tCoffset);
					}
					else{
						branchList[dragIndex].meshMoveTo(dragLast);
					}

					tCoffset.set(0,0,0);
					dragIndex = null;
				}
			}
		}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	render();
}
function render() {
	renderer.render( scene, camera );

	var time = Date.now() * 0.001;
	var l = Math.abs(1+Math.sin(time)*branchSize.x)/4;
	for (var i=0;i<bottomСonnector.length;i++){

		bottomСonnector[i].mesh.position.set(
			l*bottomСonnector[i].vec.x+tCoffset.x,
			l*bottomСonnector[i].vec.y+tCoffset.y,
			0
		);
		}
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObject ( plane );
	for ( var i = 0; i < intersects.length; i++ ){
		dragVec = intersects[i].point.clone();


		}
	if (null !== dragIndex){
			var vecDrag = dragVec.clone();
			vecDrag.add(dragOffset);
			targetList[dragIndex].position.set(vecDrag.x,vecDrag.y,vecDrag.z);
			var f = findMacth();
	}
}
function growth() {
	targetList = [];
	branchList = [];
	bottomСonnector = [];
	dragIndex = null;
	pulsar = false;
	dragVec = new THREE.Vector3();
	bCoffset = new THREE.Vector3();
	tCoffset = new THREE.Vector3();

	for (var i=0;i<4;i++){
		var geometry = new THREE.RingBufferGeometry(
			branchSize.x/4, branchSize.x/2, 32, 1, Math.PI/2*i, Math.PI/2
		);
		var material = new THREE.MeshBasicMaterial({
			color: 0xffff00, side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		var vec = new THREE.Vector3(1,1,0);
		if (i==2 || i==1)
			vec.x = -1;
		if (i==2 || i==3)
			vec.y = -1;
		bottomСonnector.push({mesh: mesh, vec: vec});
		scene.add( bottomСonnector[i].mesh );
	}

	for (var i=0; i<branchCount.x; i++)
		for (var j=0; j<branchCount.y; j++){
			var color = colorHelper[Math.floor(Math.random()*(colorHelper.length))];
			var stem = [[],[]];
			for (var s=0; s<i; s++)
				stem[0].push(colorHelper[Math.floor(Math.random()*(colorHelper.length))]);
			for (var s=0; s<j; s++)
				stem[1].push(colorHelper[Math.floor(Math.random()*(colorHelper.length))]);
			var b = new Branch(i*branchCount.y+j, color, stem, true, new THREE.Vector2(i,j), branchSize);
			b.moveMesh(branchOffset);
			branchList.push(b);
		}

		for (var i=0; i<branchList.length; i++){
				targetList.push( branchList[i].mesh )
				scene.add( branchList[i].mesh );
		}
		console.log(branchList);

}
function findMacth(){
	var flag = false;
	var btmDrag = dragVec.clone();
	btmDrag.sub(bCoffset);
	for ( var i = 0; i < branchList.length; i++ )
		for ( var j = 0; j < branchList[i].connections.length; j++ ){
			var conn = branchList[i].connections[j];
			var d = btmDrag.distanceTo(conn.vec);
			if (d<branchSize.x/4 && conn.hue== dragHue){
					flag = true;
					console.log(stringColor[conn.hue*360], branchList[i].grid);
					tCoffset.set(conn.vec.x, conn.vec.y, conn.vec.z);
					pulsar = true;
			}
			else
				pulsar = false;
		}
	return flag;
}
