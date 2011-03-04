dojo.require("SonicZoom");

uow.getAudio().then(function(a) {
				  a.say({text : "Welcome to the UNC Open Web Server!"});
				});

//initialize function, called when page loads.
function init(){
	var gameheight = 480;
	var gamewidth = 640;
	
    game = new SonicZoom({canvas_id:"worldCanvas", height:gameheight, width:gamewidth, debug:true});
	
	
}

dojo.ready(init);