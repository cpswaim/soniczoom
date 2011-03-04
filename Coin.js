dojo.provide("Coin");

dojo.declare("Coin", null,{
	
	coinImg:undefined,
	
	imgPath:"img/coin.png",
			
	constructor: function(args){
		
		//Take arguments and mix them in.
		dojo.safeMixin(this, args);
		
		//create sprite
		if (this.coinImg) {
			var coinSprite = new SpriteSheet(this.coinImg, 32, 32);
			
			//Now make this class a sprite
			dojo.safeMixin(this, new BitmapSequence(coinSprite));
			
			this.regX = this.spriteSheet.frameWidth/2|0;
			this.regY = this.spriteSheet.frameHeight/2|0;
			
			
			console.log("Coin Created!");
		}
		else{
			console.log("Coin Fail.");
		}
		//Take arguments and mix them in.
		dojo.safeMixin(this, args);
				
		
	}
	
	
});
