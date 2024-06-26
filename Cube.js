class Cube{
    constructor(){
      this.type='cube';
      //this.position =[0.0,0.0,0.0]
      this.color =[1.0,1.0,1.0,1.0]
      this.mouth =[1.0,1.0,1.0,1.0]
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
    }
  
    //render shape
    render(){

        var rgba = this.color;

        //pass matrix to 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        //color of front and back
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        
        //draw front of cube
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] )
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] )
        //draw back of cube
        drawTriangle3D( [0,0,1, 0,1,1, 1,1,1] )
        drawTriangle3D( [0,0,1, 1,0,1, 1,1,1] )

        //Top and bottom
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //top
        drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] )
        drawTriangle3D( [0,1,0, 1,1,0, 1,1,1] )
        //bottom
        drawTriangle3D( [0,0,0, 0,0,1, 1,0,1] )
        drawTriangle3D( [0,0,0, 1,0,0, 1,0,1] )

       //sides
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        // R
        drawTriangle3D( [0,0,0, 0,1,0, 0,1,1] )
        drawTriangle3D( [0,0,0, 0,0,1, 0,1,1] )
        // L
        drawTriangle3D( [1,0,0, 1,1,0, 1,1,1] )
        drawTriangle3D( [1,0,0, 1,0,1, 1,1,1] )



    }

    //render shape
    render_tri(side,top,flip){

        var rgba = this.color;
        var mouth = this.mouth;

        //pass matrix to 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)
        
        if(flip==false){
        //color of point
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
   
        //draw front of cube
        drawTriangle3D( [side,0,0, 1-side,1-top,0, 1-side,0,0] )
        drawTriangle3D( [side,0,0, 1-side,1-top,0, side,1-top,0] )

        //draw back of cube
        drawTriangle3D( [0,0,1, 1,1,1, 0,1,1] )
        drawTriangle3D( [0,0,1, 1,1,1, 1,0,1] )
    

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //top
        drawTriangle3D( [side,1-top,0, 0,1,1, 1,1,1] )
        drawTriangle3D( [side,1-top,0, 1-side,1-top,0, 1,1,1] )
        gl.uniform4f(u_FragColor, mouth[0], mouth[1], mouth[2], mouth[3]);
        //bottom
        drawTriangle3D( [side,0,0, 0,0,1, 1,0,1] )
        drawTriangle3D( [side,0,0, 1-side,0,0, 1,0,1] )

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

         // R
         drawTriangle3D( [side,0,0, side,1-top,0, 0,1,1] )
         drawTriangle3D( [side,0,0, 0,0,1, 0,1,1] )
         // L
         drawTriangle3D( [1-side,0,0, 1-side,1-top,0, 1,1,1] )
         drawTriangle3D( [1-side,0,0, 1,0,1, 1,1,1] )
   
        }
        else{

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //draw front of cube
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] )
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] )

        //back
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [side,0,1, 1-side,1-top,1, 1-side,0,1] )
        drawTriangle3D( [side,0,1, 1-side,1-top,1, side,1-top,1] )
  

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //top
        drawTriangle3D( [0,1,0, 1,1,0, 1-side,1-top,1] )
        drawTriangle3D( [0,1,0, side,1-top,1, 1-side,1-top,1] )
        gl.uniform4f(u_FragColor, mouth[0], mouth[1], mouth[2], mouth[3]);
        //bottom
        drawTriangle3D( [0,0,0, 1,0,0, 1-side,0,1] )
        drawTriangle3D( [0,0,0, 1-side,0,1, side,0,1] )

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

         // L
         drawTriangle3D( [1,0,0, 1,1,0, 1-side,1-top,1] )
         drawTriangle3D( [1,0,0, 1-side,0,1, 1-side,1-top,1] )
         // R
         drawTriangle3D( [0,0,0, 0,1,0, side,1-top,1] )
         drawTriangle3D( [0,0,0, side,0,1, side,1-top,1] )

        }

    }
  }