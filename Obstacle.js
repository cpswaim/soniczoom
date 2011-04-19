dojo.provide("Obstacle");

dojo.declare("Obstacle", [Container],{

	canvasHeight : 480,
	canvasWidth : 640,
	lane:1,
	
	hitRadius:0,
	
	constructor:function(args) {
		
		//Container Object to hold Ship and it's flame.
		//dojo.safeMixin(this,new Container());
		
		//Take arguments and mix them in.
       	dojo.safeMixin(this, args);
		
		this.outerBox = new Shape();
		this.innerBox = new Shape();
		
		this.addChild(this.outerBox);
		this.addChild(this.innerBox);
		
		// 5% of the width, divided by the default 40x10
		
				
		this.makeShape();
		
		this.scaleX = (this.canvasWidth*0.1)/40;
		this.scaleY = (this.canvasHeight*0.1)/30;
		
		this.bigScalar = Math.max(this.scaleX,this.scaleY)
		this.bounds = 20*this.bigScalar;
	},
	
	makeShape:function() {
		
		//draw ship body
		var g = this.outerBox.graphics;
		g.clear();
		g.setStrokeStyle(1,"round").beginStroke("#FFFFFF");
		g.beginFill("#F66");
		
		g.moveTo(20, 20);	//nose
		g.lineTo(20, -20);	//rfin
		g.lineTo(-20, -20);	//notch
		g.lineTo(-20, 20);	//lfin
		g.closePath();
		
		
		//draw ship flame
		var o = this.innerBox;
		
		g = o.graphics;
		g.clear();
		g.setStrokeStyle(1,"round").beginStroke("#F60");
		g.beginFill("#F00");
		
		g.moveTo(17, 17);	//nose
		g.lineTo(17, -17);	//rfin
		g.lineTo(-17, -17);	//notch
		g.lineTo(-17, 17);	//lfin
		g.closePath();
		
		this.rotation = 180;
	},
	
	tick : function() {

		this.rotation = (this.rotation + 2)%360;

	}
	}
	


});
