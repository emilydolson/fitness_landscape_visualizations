
// x_scale = d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]);
// y_scale = d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]);
// z_scale = d3.scaleLinear().domain([-1554, 0]).range([0, 1]);

draw_points = function(data) {

    var points = d3.select("#scene").append("a-entity").selectAll("a-sphere").data(data);
    points.enter()
        .append("a-sphere")
        .attrs({"position": function(d){return x_scale(d[0]) + " " +
                                              z_scale(d[2]) + " " +
                                              y_scale(d[1]);},
                  "radius":".01",
                  "color":"red" 
               });

};

// draw_points([[-5, -5, -1487.74298182], [-4.98,-4.98,-1512.09607226],[-4.96,-4.96,-1531.31799008],[-4.94,-4.94,-1544.7049961], [-0.12,-0.12,-467.724123203], [-0.1,-0.1,-496.30454135], [-0.0800000000001,-0.0800000000001,-525.143107232],[-0.0600000000001,-0.0600000000001,-544.182201207]]);

AFRAME.registerComponent("dataline", {
   schema: {
       path: {
           default: ["0 0 0"],
           type: "array"
       }
   },
   init: function(){
    var geometry = new THREE.Geometry();

    for (var i = 0; i < this.data.path.length; i++) {
        var vert = this.data.path[i].split(" ");
        // console.log(vert);
        geometry.vertices.push(
            new THREE.Vector3( x_scale(vert[0]), z_scale(vert[2]), y_scale(vert[1]) )
        );
        if (i > 0 && i < this.data.path.length) {
            geometry.vertices.push(
                new THREE.Vector3( x_scale(vert[0]), z_scale(vert[2]), y_scale(vert[1]) )
            );
        }
    }

    for (var i = 0.0; i < geometry.vertices.length; i+=2) {
        hsl_color = d3.hsl(0.0, 0.0, i/geometry.vertices.length);
        geometry.colors[i] = new THREE.Color(hsl_color.toString());
        geometry.colors[i+1] = new THREE.Color(hsl_color.toString());    
    }

    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });    
    
    this.line = new THREE.LineSegments(geometry, material);
    this.el.setObject3D('dataline', this.line);
   }
});