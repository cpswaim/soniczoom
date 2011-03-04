dojo.provide("simpleCanvas");
    
dojo.declare("simpleCanvas", null, {
    id:undefined,
    canvas_dom:undefined,
    width:undefined,
    height:undefined,
    context:undefined,
    fillColor:undefined,
    constructor:function(args){
        
        //Take arguments and mix them in.
        dojo.safeMixin(this, args);
        
        //Instantiate ID, Dom Node, and Context
        if(this.id != undefined){
            this.canvas_dom = dojo.byId(this.id);
            this.context = this.canvas_dom.getContext("2d");
        }
        else if (this.canvas_dom != undefined){
            this.id = this.canvas_dom.id;
            this.context = this.canvas_dom.getContext("2d");
        }
        
        //Do Work.
        if(this.id && this.canvas_dom && this.context){
            
            if(this.height && this.width){
                this.canvas_dom.height = this.height;
                this.canvas_dom.width = this.width;
            }
            else{
                this.height = this.canvas_dom.height;
                this.width = this.canvas_dom.width;
            }
            
            if(this.fillColor){
                this.fillCanvas(this.fillColor);
            }
            else{
                this.fillCanvas("rgba(0,0,0,1)");
            }
        }
        else{
            console.log("Canvas Instantiation Failed.");
        }
    },
    
        
    clear:function(){
        this.canvas_dom.width = this.canvas_dom.width;
    },
    
    fill:function(rgba){
        this.context.fillStyle = rgba;
    },
    
    fillRect:function(x,y,w,h){
        this.context.fillRect(x,y,w,h);
    },
    
    fillCanvas:function(color){
        this.fill(color);
        this.context.fillRect(0,0,this.width,this.height);
    },
    
 
});
