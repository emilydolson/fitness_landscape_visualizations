var fun4_scales = {"x":d3.scaleLinear().domain([-6, 6]).range([-1.5, 1.5]),
"y":d3.scaleLinear().domain([-6, 6]).range([-1.5, 1.5]),
"z":d3.scaleLinear().domain([-1986, 199.99998]).range([0, 1])
};

var fun5_scales = {"x":d3.scaleLinear().domain([-1.9, 1.9]).range([-1.5, 1.5]),
"y":d3.scaleLinear().domain([-1.1, 1.1]).range([-1.5, 1.5]),
"z":d3.scaleLinear().domain([-5.86095, 1.031627]).range([0, 1.01])
};

var fun6_scales = {"x":d3.scaleLinear().domain([-10, 10]).range([-1.5, 1.5]),
"y":d3.scaleLinear().domain([-10, 10]).range([-1.5, 1.5]),
"z":d3.scaleLinear().domain([-210.27662470796076, 186.615794955561]).range([0, 1.01])
};

var fun7_scales = {"x":d3.scaleLinear().domain([.25, 10]).range([-1.5, 1.5]),
"y":d3.scaleLinear().domain([.25, 10]).range([-1.5, 1.5]),
"z":d3.scaleLinear().domain([-.9999982330513699, 0.999999972963692]).range([0, 1.01])
};

var fun10_scales = {"x":d3.scaleLinear().domain([0, 1]).range([-1.5, 1.5]),
 "y":d3.scaleLinear().domain([0, 1]).range([-1.5, 1.5]),
 "z":d3.scaleLinear().domain([-38.0, -2.0004450187892893]).range([0, 1.01])
};

var fun11_scales = {"x":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "y":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "z":d3.scaleLinear().domain([-2171.198973635492, -0.002367801442371835]).range([0, 1.01])
};

var fun12_scales = {"x":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "y":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "z":d3.scaleLinear().domain([-2049.851816104665, -0.016231402532577894]).range([0, 1.01])
};

var fun13_scales = {"x":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "y":d3.scaleLinear().domain([-5, 5]).range([-1.5, 1.5]),
 "z":d3.scaleLinear().domain([-3636.8380518041745, -0.0015356224293130573]).range([0, 1.01])
};


var x_scale = fun5_scales.x;
var y_scale = fun5_scales.y;
var z_scale = fun5_scales.z;

var problem_map = {4:0, 5:1, 6:2, 12:6};

document.addEventListener('DOMContentLoaded',function() {
			
    $(function () {
        // if(!('ontouchstart' in window)) {
            $('[data-toggle="tooltip"]').tooltip();
        // }
    })

    // from https://bootsnipp.com/snippets/featured/link-to-top-page
    $(function(){
        $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    $('#back-to-top').fadeIn();
                } else {
                    $('#back-to-top').fadeOut();
                }
            });
            // scroll body to 0px on click
            $('#back-to-top').click(function () {
                $('#back-to-top').tooltip('hide');
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
            
    })
    load_data();
},false);

function switchLandscape(n){
    console.log('Switch to '+n);
    document.getElementById('middle').setAttribute('aframe-heatmap3d', {
        src: '#fun' + n, srcMobile: '#fun' + n});
    x_scale = window["fun"+n+"_scales"].x
    y_scale = window["fun"+n+"_scales"].y
    z_scale = window["fun"+n+"_scales"].z
}

function load_data() {

    // Reset z_scale
    z_scale.range([0,1.01]);

    // Remove anything that was previously drawn
    var lines = document.querySelectorAll("[dataline]");
    for (var i = 0; i < lines.length; i++) {
        lines[i].parentNode.removeChild(lines[i]);
    }

    var spheres = document.querySelectorAll("a-sphere");
    for (var i = 0; i < spheres.length; i++) {
        spheres[i].parentNode.removeChild(spheres[i]);
    }

    var selection = document.querySelector('select[name="selection"]').value;
    var problem = problem_map[document.querySelector('select[name="problem"]').value];

    switchLandscape(document.querySelector('select[name="problem"]').value);

    // Data are split up by problem and selction to keep csv sizes reasonable
    d3.csv("data/P"+problem+"S"+selection+".csv", function(error, data) {
        if (error){
            throw error;
        }

        // Retrieve settings on which data to collect
        var tour_size = document.querySelector('select[name="tour_size"]').value;
        var mut_rate = document.querySelector('select[name="mut_rate"]').value;
        var elite = document.querySelector('#elite_checkbox').checked;
        var n_lineages = +document.querySelector('#n_lineages').value;

        var i = 0;
        for (line of data){
            if (line.SELECTION_METHOD == selection && 
            (line.TOURNAMENT_SIZE == tour_size || selection != "0") &&
            // (line.LEXICASE_EPSILON == epsilon || selection != "1") &&
            line.MUTATION_STD == mut_rate && line.PROBLEM == problem &&
            (line.ELITE_SELECT__ELITE_CNT == +elite)) {
                draw_lineage(line.path);
                // TODO: Allow user to select which lineages to draw
                i++;
                if (i >= n_lineages) {
                    break;
                }                    
            }
        }

    });				
}

var draw_lineage = function(data){
    var sceneEl = document.querySelector('a-scene');

    if (document.querySelector('#starts_checkbox').checked) {
        var startSphereEl = document.createElement('a-sphere');
        var startpos = data.slice(data.lastIndexOf(",")+1, data.length).split(" ");
        startpos[0] = x_scale(startpos[0]);
        var y = y_scale(startpos[1]);
        var z = z_scale(startpos[2]);
        startpos[1] = z;
        startpos[2] = y;

        startSphereEl.setAttribute("position", startpos.join(" "));
        startSphereEl.setAttribute("radius", .01);
        sceneEl.appendChild(startSphereEl);
    }

    if (document.querySelector('#ends_checkbox').checked) {
        var endSphereEl = document.createElement('a-sphere');
        var endpos = data.slice(0,data.indexOf(",")).split(" ");

        endpos[0] = x_scale(endpos[0]);
        y = y_scale(endpos[1]);
        z = z_scale(endpos[2]);
        endpos[1] = z;
        endpos[2] = y;

        endSphereEl.setAttribute("position", endpos.join(" "));
        endSphereEl.setAttribute("radius", .01);
        endSphereEl.setAttribute("material", "color", "black");
        sceneEl.appendChild(endSphereEl);
    }

    if (document.querySelector('#lines_checkbox').checked) {
        var lineEl = document.createElement('a-entity');
        lineEl.setAttribute("dataline", {"path": data, "z_increment":document.querySelector('#z_slider').value});
        sceneEl.appendChild(lineEl);
    }

};
	