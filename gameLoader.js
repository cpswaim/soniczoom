dojo.require("sonicZoom");

//initialize function, called when page loads.
function init(){
    game = new sonicZoom({canvas_id:"worldCanvas"});
}

dojo.ready(init);

