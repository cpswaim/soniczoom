dojo.provide("Ship");

dojo.declare("Ship", [Container],{

	TOGGLE: 6,
	canvasHeight : 480,
	canvasWidth : 640,
	currentLane:1,
	numberOfLanes:3,
	
	constructor:function(args) {
		
		//Container Object to hold Ship and it's flame.
		//dojo.safeMixin(this,new Container());
		
		//Take arguments and mix them in.
       	dojo.safeMixin(this, args);
		
		this.shipFlame = new Shape();
		this.shipBody = new Shape();
		
		this.addChild(this.shipFlame);
		this.addChild(this.shipBody);
		
		// 5% of the width, divided by the default 40x10
		
				
		this.makeShape();
		this.timeout = 0;
		this.thrust = 0;
		this.vX = 0;
		this.vY = 0;
		
		this.scaleX = (this.canvasWidth*0.1)/40;
		this.scaleY = (this.canvasHeight*0.1)/30;
		
		var bigScalar = Math.max(this.scaleX,this.scaleY)
		this.bounds = 20*bigScalar;
	},
	
	makeShape:function() {
		
		//draw ship body
		var g = this.shipBody.graphics;
		g.clear();
		g.setStrokeStyle(1,"round").beginStroke("#FFFFFF");
		g.beginFill("#00F");
		
		g.moveTo(0, 20);	//nose
		g.lineTo(10, -12);	//rfin
		g.lineTo(0, -4);	//notch
		g.lineTo(-10, -12);	//lfin
		g.closePath(); 		//nose
		
		
		//draw ship flame
		var o = this.shipFlame;
		o.y = -7;
		
		g = o.graphics;
		g.clear();
		g.setStrokeStyle(1,"round").beginStroke("#F60");
		g.beginFill("#F00");
		
		g.moveTo(0, 1);		//ship
		g.lineTo(2, -1.5);	//rpoint
		g.lineTo(1, -1);	//rnotch
		g.lineTo(0, -2.5);	//tip
		g.lineTo(-1, -1);	//lnotch
		g.lineTo(-2, -1.5);	//lpoint
		g.closePath();	//ship
		
		this.rotation = 180;
	},
	
	tick : function() {
		
		this.timeout++;
		this.shipFlame.alpha = 1;
		
		if (this.timeout > this.TOGGLE) {
			this.timeout = 0;

			if (this.shipFlame.scaleX == this.scaleX) {
				this.shipFlame.scaleX = this.scaleX*0.5;
				this.shipFlame.scaleY = this.scaleY*0.5;
			}
			else {
				this.shipFlame.scaleX = this.scaleX;
				this.shipFlame.scaleY = this.scaleY;
			}
		}

	},
	
	moveLeft: function(){
		if(this.currentLane > 0){
			this.x = (this.canvasWidth / this.numberOfLanes)*(this.currentLane-1) + (this.canvasWidth / (this.numberOfLanes*2));
			this.y = (this.canvasHeight - this.bounds - 10);
			this.currentLane--;
		}
	},
		
	moveRight: function(){
		if (this.currentLane < this.numberOfLanes - 1) {
			this.x = (this.canvasWidth / this.numberOfLanes) * (this.currentLane + 1) + (this.canvasWidth / (this.numberOfLanes * 2));
			this.y = (this.canvasHeight - this.bounds - 10);
			this.currentLane++;
		}
	},
	
	reset:function(){
		this.x = (this.canvasWidth / this.numberOfLanes) * (Math.floor(this.numberOfLanes/2)) + (this.canvasWidth / (this.numberOfLanes * 2));
		this.y = (this.canvasHeight - this.bounds - 10);
	}


});