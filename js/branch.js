class Branch { //stem trunk
   constructor (index, color, stem, top, grid, size){
      this.index = index ? index : 0;
      this.colorInt = color;
      this.color =  new THREE.Color().setHSL(this.colorInt, 1, 0.5);
      this.stem = stem ? stem : [[],[]];
      this.top = top ? top : true;
      this.grid = grid ? grid : new THREE.Vector2(0,0);
      this.size = size ? size : new THREE.Vector2(36,72);
      this.value = ""+this.stem[0].length+this.stem[1].length;
      this.name = this.index+this.color+this.value;
      this.connections = [];
      this.originConnections = []
      this.bottomСonnector = new THREE.Vector3();
    	var lineGeometry = new THREE.Geometry();
      var max = Math.max(this.stem[1].length, this.stem[0].length);
      lineGeometry.vertices.push(
        new THREE.Vector3( 0, y*max, 0 ),
      );

      lineGeometry.colors[ 0 ] = this.color;

    	for (var i=0; i<this.stem.length; i++){
        var l = this.stem[i].length;
        var x = this.size.x/l;
        var y = this.size.y/(l+1);
        var sign = 1;
        if (i==0)
          sign = -1;
        for (var j=0; j<this.stem[i].length; j++){
          var stemL = lineGeometry.vertices.length;
          lineGeometry.vertices.push(
            new THREE.Vector3( 0, y*(l-j), 0 ),
            new THREE.Vector3( sign*x*(j+1), y*(l-(j-1)/2), 0 ),
            new THREE.Vector3( sign*x*(j+1), this.size.y, 0 ),
            new THREE.Vector3( sign*x*(j+1), y*(l-(j-1)/2), 0 ),
            new THREE.Vector3( 0, y*(l-j), 0 )
            );

          var hsl = new THREE.Color().setHSL(this.stem[i][j], 1, 0.5);

          lineGeometry.colors[ stemL ] = this.color;
          lineGeometry.colors[ stemL+1 ] = this.color;
          lineGeometry.colors[ stemL+2 ] = hsl;
          lineGeometry.colors[ stemL+3 ] = hsl;
          lineGeometry.colors[ stemL+4 ] = this.color;
          lineGeometry.colors[ stemL+5 ] = this.color;

          this.originConnections.push( {
            hue : this.stem[i][j],
            vec : new THREE.Vector3( sign*x*(j+1), this.size.y, 0 )
          })
         }
      }

      lineGeometry.vertices.push(
        new THREE.Vector3( 0, this.size.y, 0 ),
      );
      lineGeometry.colors[ lineGeometry.vertices.length-2 ] = this.color;
      lineGeometry.colors[ lineGeometry.vertices.length-1 ] = this.color;

      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.VertexColors
    		});

    	this.mesh = new THREE.Line( lineGeometry, lineMaterial );

      this.mesh.position.set(
        (this.grid.x)*(this.size.x*2),
        this.grid.y*this.size.y,
        0//this.size.x
      );

      this.start = this.mesh.position.clone();
      this.originConnections.push({
        hue : this.colorInt,
        vec : new THREE.Vector3( 0, this.size.y, 0 )
      });

      for (var i=0; i<this.originConnections.length; i++){
          this.connections.push({
            hue: this.originConnections[i].hue,
            vec: this.originConnections[i].vec.clone()
          });
          this.connections[i].vec.add(this.mesh.position);
      }
      this.mesh.name = this.index;//this.value+this.color;
    }

    meshMoveTo(vec){
      this.connections = [];
      this.mesh.position.set(vec.x, vec.y, vec.z);
      for (var i=0; i<this.originConnections.length; i++){
          this.connections.push({
            hue: this.originConnections[i].hue,
            vec: this.originConnections[i].vec.clone()
          });
          this.connections[i].vec.add(this.mesh.position);
      }
      console.log(vec,this.connections)
    }

    moveMesh(vec){
    for (var i=0; i<this.connections.length; i++)
        this.connections[i].vec.add(vec);
    this.mesh.position.add(vec);
    this.start = this.mesh.position.clone();
    //this.bottomСonnector.add(vec);
    }
}
