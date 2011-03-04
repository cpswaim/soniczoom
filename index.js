dojo.require("SonicZoom");
audio = undefined;
uow.getAudio().then(function(a) {
				  a.say({text : "Welcome to the UNC Open Web Server!"});
				  audio = a;
				});

//initialize function, called when page loads.
function init(){
	var gameheight = 480;
	var gamewidth = 640;
	
    game = new SonicZoom({canvas_id:"worldCanvas", height:gameheight, width:gamewidth, audio:audio, debug:true});
	
	
}

dojo.ready(init);