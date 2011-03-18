var KEYCODE_SPACE = 32;		//usefull keycode
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_DOWN = 40;
var KEYCODE_W = 87;			//usefull keycode
var KEYCODE_A = 65;			//usefull keycode
var KEYCODE_D = 68;			//usefull keycode
var KEYCODE_S = 83;			//usefull keycode
var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;

dojo.provide("SonicZoom");

dojo.require("dojox.timing._base");

dojo.require("Ship");
dojo.require("Star");
dojo.require("Coin");


dojo.declare("SonicZoom", null,{
    
		debug:false,
	
		//set up objects
        canvas_id:undefined,
        canvas:undefined,
        height:document.documentElement.clientHeight-60,
        width:document.documentElement.clientWidth-25,
		numberOfLanes:3,
		fps:30,
		
		//Text
		lives:undefined,
		scoreField:undefined,
		messageField:undefined,
		loadingText:undefined,
		fpsCounter:undefined,
		objectCounter:undefined,
		
		//Menu
		titleText:undefined,
		trainingText:undefined,
		startGameText:undefined,
		menuStar:undefined,
		menuPos: 0,
		menuItems: 2,
		menuTimer: undefined,
		repeatInterval:10000,
		
		//Game Objects
		ship: undefined,
		rock: undefined,
		coin: undefined,
		score:0,
		
		//Image stuff
		images:{},
		coinPath:"img/coin.png",
		
		//sound
		soundDir:'snd/',
		audio:undefined,
		menuBg:undefined,
		trainingOver: undefined,
		
		//keydown booleans
		shootHeld :	false,
		lfHeld :	false,
		rtHeld :	false,
		fwdHeld :	false,
		dnHeld :	false,
		
		//connect objects
		clicker: undefined,
		keyDownEvent: undefined,
		keyUpEvent: undefined,
		
		TURN_FACTOR:7,

        constructor:function(args){
        
            //Take arguments and mix them in.
            dojo.safeMixin(this, args);
            
            //Instantiate ID & Dom Node
            if(this.canvas_id != undefined){
                this.canvas = dojo.byId(this.canvas_id);
            }
            else if (this.canvas != undefined){
                this.canvas_id = this.canvas.id;
            }
            
            //Do Work.
            if(this.canvas_id && this.canvas){
                
                this.canvas.height = this.height;
                this.canvas.width = this.width;
				
				this.menuTimer = new dojox.timing.Timer();
	        	this.menuTimer.setInterval(this.repeatInterval);
                
                //EaselJS Stage instance that wraps the Canvas element
                this.stage;
                
                this.bounds = new Rectangle();
                
                this.bounds.w = this.canvas.width;
                this.bounds.h = this.canvas.height;
				
                this.stage = new Stage(this.canvas);
				
				this.displayWelcome();
				this.drawStars(0);
				
				this.stage.tick();
				
				this.loadImages();
				
				
				                    
                
            }
            else{
                console.log("Canvas Instantiation Failed.");
            }
        
        
        },
		
		tick : function(){/**Overridden to switch between menus and game**/},
		
		menuInit : function(){
			
			
			this.menuPos = 0;			
			
			this.audio.stop({channel:'menuinstruction'});
			this.audio.stop({channel:'menuBackground'});
			this.audio.stop({channel:'lane'});
			
			dojo.disconnect(this.clicker);
			dojo.disconnect(this.keyDownEvent);
			
			this.keyDownEvent = dojo.connect(null, 'onkeydown', this, this.menuNavigation);
			this.keyUpEvent = dojo.connect(null, 'onkeyup', this, this.menuNavigationRelease); 
			
			this.startMenuMusic(undefined);
			
			this.menuBg = this.audio.addObserver(this.startMenuMusic, 'menuBackground', ['finished-play']);
						
			this.audio.play({url:this.soundDir+'soniczoom', cache:true, channel:'menuinstruction'});
			this.audio.play({url:this.soundDir+'menuinstructions', cache:true, channel:'menuinstruction'});
			
			this.audio.play({url:this.soundDir+'training', cache:true, channel:'menuinstruction'}).callAfter(dojo.hitch(this, function(){
				
		        this.setMenuRepeat(0);
					
		        this.menuTimer.start();
			
			}));
			
			this.titleText = new Text("SONIC ZOOM!", "bold 60px Verdana", "#FFFFFF");
			this.titleText.textAlign = "center";
			this.titleText.x = this.canvas.width / 2;
			this.titleText.y = 70;
			
			this.trainingText = new Text("Training",  "bold 28px Verdana", "#FFFFFF");
			this.trainingText.textAlign = "left";
			this.trainingText.x = this.canvas.width / 2;
			this.trainingText.y = (this.canvas.height / 2) - 50;
			
			this.startGameText = new Text("Start Game",  "bold 28px Verdana", "#FFFFFF");
			this.startGameText.textAlign = "left";
			this.startGameText.x = this.canvas.width / 2;
			this.startGameText.y = (this.canvas.height / 2);
			
			var random = Math.random()
			this.menuStar = new Star({
				"x": this.canvas.width/2 - 50,
				"y": (this.canvas.height/2)-64,
				scalar: 6,
				maxAlpha: (0.3 + Math.floor(random * 66)/10),
				minAlpha: 0.3,
				frequency: (20 + Math.floor(random*56)),
				rotationSpeed: (80 + random * 181),
				speedIncrement: 0
			});
			
			
			
			
			this.stage.removeAllChildren();
			
			this.drawStars(0);
			
			this.stage.addChild(this.titleText);
			this.stage.addChild(this.trainingText);
			this.stage.addChild(this.startGameText);
			this.stage.addChild(this.menuStar);
			
			this.stage.tick()
			
			this.tick = this.menuTick;
			
			
			
		},
		
		menuTick : function() {
			
			this.stage.tick();
			
		},
        
        gameTick : function(){  
		
			var ticks = Ticker.getTicks(false);
			
			var secondsElapsed = ticks/this.fps;
			if (Math.floor(secondsElapsed) == secondsElapsed) {
				this.score = this.score + 5;
				this.scoreField.text = "score: " + (this.score);
			}
			
            if(this.debug){
				 this.fpsCounter.text = "fps: " + (Math.floor(Ticker.getMeasuredFPS())).toString();
				 this.objectCounter.text ="objects: "+this.stage.children.length;
			}
			
			for(var i = 0; i < this.canvas.width; i++){
				this.drawStar(i,0,1);
			}
			
			//garbage collection
			this.GC();
			
            this.stage.tick();
        },
		
		loadImages:function(){
			
			var coin = new Image();
			coin.onload = this.loadImageCheck();
			coin.src = this.coinPath;
			
			this.images.coin = coin;
			
			//more images here.
			
		},
		
		loadImageCheck:function(){
			
			for(var x in this.images){
				if(!this.images[x].complete){ return; }
			}
			
			console.log("images loaded!", this.images);
			this.clicker = dojo.connect(this.canvas, 'onclick', this, this.menuInit);
			this.keyDownEvent = dojo.connect(null, 'onkeydown', this, this.menuInit); 
			this.loadingText.text = "Press Any Key to Play!";
			
			this.stage.tick();
				 
		},
		
		displayWelcome : function(){
			this.messageField = new Text("SONIC ZOOM!", "bold 24px Verdana", "#FFFFFF");
			this.messageField.textAlign = "center";
			this.messageField.x = this.canvas.width / 2;
			this.messageField.y = this.canvas.height / 2;
			
			this.loadingText = new Text("Loading Your Space Adventure...", "bold 12px Verdana", "#FFFFFF");
			this.loadingText.textAlign = "center";
			this.loadingText.x = this.canvas.width / 2;
			this.loadingText.y = (this.canvas.height / 2)+20;
			
			this.stage.addChild(this.messageField);
			this.stage.addChild(this.loadingText);
			
			this.tick = this.menuTick;
			
			Ticker.addListener(this);
		},
		
		beginGame : function(){
			dojo.disconnect(this.clicker);
			dojo.disconnect(this.keyDownEvent);
			
			this.keyDownEvent = dojo.connect(null,'onkeydown', this, this.handleKeyDown);
			this.keyUpEvent = dojo.connect(null,'onkeyup', this, this.handleKeyUp);
						
			this.stage.removeAllChildren();
			
			this.drawUI();
			this.drawShip();
			this.drawStars(1);
			
			//this.drawCoin(this.canvas.width/2,this.canvas.height/2);			
			
			this.stage.tick();
			
			Ticker.setInterval(1000/this.fps);
			
			this.tick = this.gameTick;
		},
		
		drawUI:function(){
			if (this.debug) {
				this.drawFPSCounter();
				this.drawObjectCounter();
			}
			
			this.drawScoreField();
		},
		
		drawShip : function(){

			this.ship = new Ship({canvasHeight:this.canvas.height, canvasWidth:this.canvas.width, TOGGLE:Math.floor(this.fps/12), numberOfLanes:this.numberOfLanes});
			this.ship.reset();
			
			this.stage.addChild(this.ship);
			
		},
		
		/*	Initial star drawing,
		 * 	called from tick after this.
		 */
		drawStars: function(speed){
			
			for(var i = 0; i < this.canvas.width; i++){
				for (var j = 0; j < this.canvas.height; j++){
					this.drawStar(i,j,speed);	
				}
			}
			
		},
		
		drawStar:function(x,y,speed){
			var random = Math.random();

				if (Math.floor(random * 3000) == 1) {
					random = Math.random()
					 var star = new Star({
						"x": x,
						"y": y,
						scalar: 0.2 + Math.floor(random*7)/10,
						maxAlpha: (0.3 + Math.floor(random * 66)/10),
						minAlpha: 0.3,
						frequency: (20 + Math.floor(random*56)),
						rotationSpeed: (80 + random * 181),
						speedIncrement: (speed + speed*Math.floor(random*4))
					});
					this.stage.addChild(star);
			}
		},
		
		drawCoin:function(x,y){
			var coin = new Coin({"x":x,"y":y, coinImg:this.images.coin});
			console.log(coin);
			this.stage.addChild(coin);
		},
		
		drawScoreField: function(){
			this.scoreField = new Text("score: 0", "bold 12px Arial", "#FFFFFF");
			this.scoreField.textAlign = "right";
			this.scoreField.x = this.canvas.width - 10;
			this.scoreField.y = this.canvas.height - 5;
			this.stage.addChild(this.scoreField);
		},
		
		drawFPSCounter:function(){
			this.fpsCounter = new Text("0", "bold 12px Arial", "#FFFFFF");
			this.fpsCounter.textAlign = "center";
			this.fpsCounter.x = this.canvas.width / 2;;
			this.fpsCounter.y = this.canvas.height - 5;
			this.stage.addChild(this.fpsCounter);
		},
		
		drawObjectCounter:function(){
			this.objectCounter = new Text("objects: 0", "bold 12px Arial", "#FFFFFF");
			this.objectCounter.textAlign = "left";
			this.objectCounter.x = 5;
			this.objectCounter.y = this.canvas.height - 5;
			this.stage.addChild(this.objectCounter);
		},
		
		menuNavigation : function(e){
						
						
			//console.log(e.keyCode);
			
					
			if(!e){ var e = window.event; }
			switch(e.keyCode) {
				case KEYCODE_ENTER:
				case KEYCODE_SPACE:	
					//Selection Made
					this.selectMenuOption();
					break;
				case KEYCODE_W:
				case KEYCODE_UP:
					if (!this.fwdHeld && this.menuPos > 0) {
						this.fwdHeld = true;
						this.menuStar.y = this.menuStar.y - 50;
						this.menuPos = this.menuPos-1;
					} 
					this.playMenuChoice();
					this.setMenuRepeat(this.menuPos);
					break;
					
				case KEYCODE_S:
				case KEYCODE_DOWN:
					if (!this.dnHeld && this.menuPos < (this.menuItems-1)) {
						this.dnHeld = true;
						this.menuStar.y = this.menuStar.y + 50;
						this.menuPos = this.menuPos+1;
					} 
					this.playMenuChoice();
					this.setMenuRepeat(this.menuPos);
					break;
			}
			
			
			
		},
		
		menuNavigationRelease : function(e){
						
			if(!e){ var e = window.event; }
			switch(e.keyCode) {
				case KEYCODE_SPACE:	
					//Selection Made
					break;
				case KEYCODE_W:
				case KEYCODE_UP:
					this.fwdHeld = false;
					break;
					
				case KEYCODE_S:
				case KEYCODE_DOWN:
					this.dnHeld = false;
					break;
			}
			
		},
				
		handleKeyDown:function(e) {
					
			
			if(!e){ var e = window.event; }
			switch(e.keyCode) {
				case KEYCODE_A:
				case KEYCODE_LEFT:
					if (!this.lfHeld) {
						this.lfHeld = true;
						this.ship.moveLeft();
					}
					break;
				case KEYCODE_D:
				case KEYCODE_RIGHT: 
					if (!this.rtHeld) {
						//console.log("right");
						this.rtHeld = true;
						this.ship.moveRight();
					}
					break;
				case KEYCODE_W:
				case KEYCODE_UP:
					if (!this.fwdHeld) {
						this.fwdHeld = true;
					} 
					break;
				case KEYCODE_ESC:
					this.menuInit();
			}
			
						
			this.playLaneSound();
		},
		
		 handleKeyUp:function(e) {
			console.log("u:",e.keyCode);

			if(!e){ var e = window.event; }
			switch(e.keyCode) {
//				case KEYCODE_SPACE:	
//					this.shootHeld = false; 
//					break;
				case KEYCODE_A:
				case KEYCODE_LEFT:
					this.lfHeld = false;
					break;
				case KEYCODE_D:
				case KEYCODE_RIGHT: 
					this.rtHeld = false; 
					break;
				case KEYCODE_W:
				case KEYCODE_UP:	
					this.fwdHeld = false; 
					break;

			}

			
		},
		
		selectMenuOption : function() {
			
			this.audio.stop({channel:'menuinstruction'});
			
			this.menuTimer.stop();
			
			console.log(this.audio);
			
			if(this.menuPos == 0){
				//Training!
				//connect button
				dojo.disconnect(this.keyDownEvent);
				dojo.disconnect(this.keyUpEvent);
				this.keyDownEvent = dojo.connect(null, 'onkeydown', this, this.returnToMenu);
				
				//play training
				this.audio.play({
					url: this.soundDir+'traininginstructions',
					cache: true,
					channel: 'menuinstruction'
				});
				
				//re-attach listener
				this.trainingOver = this.audio.addObserver(this.returnToMenu, 'menuinstruction', ['finished-play']);
				
			}
			else if(this.menuPos == 1){
				//Game On!
				this.audio.stop({channel:'menuinstruction'});
				this.audio.stop({channel:'lane'});
				this.beginGame();
				
			}
			
		},
		
		playMenuChoice : function() {
			
			this.audio.stop({channel:'menuinstruction'});
			
			if (this.menuPos == 0) {
				this.menuTimer.stop();
				this.audio.play({
					url: this.soundDir + 'training',
					cache: true,
					channel: 'menuinstruction'
				});
			}
			else if (this.menuPos == 1) {
				this.menuTimer.stop();
				this.audio.play({
					url: this.soundDir + 'startgame',
					cache: true,
					channel: 'menuinstruction'
				});
			}
			
		},
		
		returnToMenu : function(e){
			if(e.keyCode == KEYCODE_ESC){
				this.audio.stop({channel: 'menuinstruction'});
				dojo.disconnect(this.keyDownEvent);
				dojo.disconnect(this.keyUpEvent);
				
				this.stage.removeAllChildren();
				
				this.menuInit();
			}
			
		},
		
		playLaneSound:function(){
			
			this.audio.stop({channel:'lane'});
			
			if (this.ship.currentLane == 0) {
				this.audio.play({
					url: this.soundDir+'leftlane-L',
					cache: false,
					channel: 'lane'
				});
			}
			else if (this.ship.currentLane == 1) {
				this.audio.play({
					url: this.soundDir+'centerlane',
					cache: false,
					channel: 'lane'
				});
			}
			else if (this.ship.currentLane == 2) {
				this.audio.play({
					url: this.soundDir+'rightlane-R',
					cache: false,
					channel: 'lane'
				});
			}
			
		},
		
		startMenuMusic: function(event){
			
			this.audio.play({url: this.soundDir+'music', cache: true, channel:'menuBackground'});
			this.audio.setProperty({name:'loop', value:true, immediate:true, channel:'menuBackground'});
			this.audio.setProperty({name:'volume', value:0.5, immediate:true, channel:'menuBackground'});
			
		},
		
		setMenuRepeat: function (menuPosition){
			
			var soundByte = "";
			
			this.menuTimer.stop();
			
			if(menuPosition == 0) soundByte = "training";
			else if(menuPosition == 1) soundByte = "startgame";
			
			
			this.menuTimer.onTick = dojo.hitch(this, function(){
				this.audio.play({url:this.soundDir+soundByte, cache:true, channel:'menuinstruction'})
				});
				
			this.menuTimer.start();
			
		},
		
		GC:function(){
			
			var cheight = this.canvas.height;
			
			this.stage.sortChildren(function(c){
				return (cheight - c.y)
			});
			
			for(var childCount = 0; 
				(childCount < this.stage.children.length);
				childCount++){
					var childObject = this.stage.children[childCount];
					if(childObject.y > this.canvas.height){
						this.stage.removeChild(childObject);
					}
				}
		}
    
    
});
