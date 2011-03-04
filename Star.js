dojo.provide("Star");

dojo.declare("Star", [Container],{

	//alpha argument
	maxAlpha:0.95,
	minAlpha:0.4,
	
	//frequency of rotation, rotation speed, 
	//amount to twinkle, and speed to fall.
	frequency:50,
	rotationSpeed:180,
	twinkle:0.5,
	speedIncrement:1,
	
	scalar:1,
	stroke: 1,
		
	constructor:function(args) {		
				
		//Container Object to hold Ship and it's flame.
		//dojo.safeMixin(this,new Container());
		
		//Take arguments and mix them in.
       	dojo.safeMixin(this, args);
		
		this.starOne = new Shape();
		this.starTwo = new Shape();
		
		this.addChild(this.starOne);
		this.addChild(this.starTwo);
		
		this.makeShape();
		
		this.alphaRange = this.maxAlpha - this.minAlpha;
		
		//this.alpha = this.maxAlpha;
		
		this.scaleX = this.scaleY = this.scalar;
		
	},
	
	makeShape:function(){
		//console.log("star made");		
		//working graphics object
		var g = this.starOne.graphics;
		
		g.clear();
		g.setStrokeStyle(this.stroke,"round").beginStroke("#FFFFFF");
		g.beginFill("#FFF");
		
		g.moveTo(0, 5);	//top
		g.lineTo(0, -5);	//bottom
		g.moveTo(5, 0);	//left
		g.lineTo(-5, 0);	//right
		g.closePath(); 		//close
		
		//Now part two
		g = this.starTwo.graphics;
		
		g.clear();
		g.setStrokeStyle(this.stroke,"round").beginStroke("#FFF");
		g.beginFill("#FFF");
		
		g.moveTo(3, 3);		//NE
		g.lineTo(-3, -3);	//SW
		g.moveTo(-3, 3);	//NW
		g.lineTo(3, -3);	//SE
		g.closePath(); 		//close
		
	},
	
	tick:function(){
				
		var ticks = Ticker.getTicks(false);
		var amt = (ticks % this.frequency) / this.frequency;
		var t = this.twinkle;
					
		var scaleOne = t + (amt)*(1-t);
		var scaleTwo = t + (1 - amt)*(1-t);
		
		
		var alphaOne = this.minAlpha + this.alphaRange * amt;
		var alphaTwo = this.minAlpha + this.alphaRange * (1-amt);
		
		if (amt < 0.5) {
			this.starOne.scaleX = this.starOne.scaleY = scaleOne;
			this.starTwo.scaleX = this.starTwo.scaleY = scaleTwo;
			
			this.starOne.alpha = alphaOne;
			this.starTwo.alpha = alphaTwo;
			
		}else{
			this.starOne.scaleX = this.starOne.scaleY = scaleTwo;
			this.starTwo.scaleX = this.starTwo.scaleY = scaleOne;
			
			this.starOne.alpha = alphaTwo;
			this.starTwo.alpha = alphaOne;
		}

		this.rotation = ((ticks%this.rotationSpeed)/this.rotationSpeed)*360;

		this.y += this.speedIncrement;
	}
	
	
});