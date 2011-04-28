dojo.provide("Coin");

dojo.declare("Coin", null,{
	
	coinImg:undefined,
	
	imgPath:"img/coin.png",
	
	lane:1,
	
	speedIncrement:1,
			
	constructor: function(args){
		
		//Take arguments and mix them in.
		dojo.safeMixin(this, args);
		
		//create sprite
		if (this.coinImg) {
			var coinSprite = new SpriteSheet(this.coinImg, 32, 32);
			
			//Now make this class a sprite
			dojo.safeMixin(this, new BitmapSequence(coinSprite));
			
			this.regX = this.spriteSheet.frameWidth/2;
			this.regY = this.spriteSheet.frameHeight/2;
			
			this.scaleX = 2;
			this.scaleY = 2;
			
			//console.log("Coin Created!");
		}
		
		//Take arguments and mix them in.
		dojo.safeMixin(this, args);
		
	},

});
