window.addEventListener('DOMContentLoaded', (event) => {
    
    let speed = -1
    class Complex {
        constructor(r = 0, i = 0) {
            this.imaginary = i
            this.real = r
        }
        add(target) {
            this.imaginary += target.imaginary
            this.real += target.real
            return this.clone()
        }
        subtract(target) {
            this.imaginary -= target.imaginary
            this.real -= target.real
            return this.clone()
        }
        multiply(target) {
            let loss = this.imaginary * target.imaginary
            let igain1 = this.real * target.imaginary
            let igain2 = this.imaginary * target.real
            let gain = this.real * target.real
            let out = new Complex(gain - loss, igain1 + igain2)
            return out
        }
        clone() {
            return new Complex(this.real, this.imaginary)
        }
        divide(target) {
            let num1, num2;
            num1 = this.clone()
            num2 = target.clone()
            var denom = num2.imaginary * num2.imaginary + num2.real * num2.real;
            var real = (num1.real * num2.real + num1.imaginary * num2.imaginary) / denom;
            var imaginary = (num2.real * num1.imaginary - num1.real * num2.imaginary) / denom;
            return new Complex(real, imaginary)
        }
    }
	
	class Rectangle {
        constructor(x, y, height, width) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.complex = new Complex(x * domain - zoom, y * range - zoom)
            this.color = 'rgb(0,0,0)'
        }
        draw() {
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
	
    const r = 8
	const r2 = r*r;
    let tutorial_canvas = document.getElementById("tutorial");
    let redval = document.getElementById("red");
    let redx = 0
    let greenval = document.getElementById("green");
    let greenx = 0
    let blueval = document.getElementById("blue");
    let bluex = 0
    let speedr = document.getElementById("speed");
    speedr.onclick = flipper
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');
    tutorial_canvas.addEventListener('pointermove', positionUpdate);
	tutorial_canvas.addEventListener('wheel', zoomUpdate);
    
    function flipper(){
        speed*=-1
    }
	let halfCanvasW = tutorial_canvas.width * 0.5
	let halfCanvasH = tutorial_canvas.height * 0.5
	let imgOffset
	let realOffset
	
	let TIP_engine = {}
    TIP_engine.x = halfCanvasW
    TIP_engine.y = halfCanvasH
    tutorial_canvas.style.background = "black"
	
	const imageData = tutorial_canvas_context.getImageData(0, 0, tutorial_canvas.width, tutorial_canvas.height);
	const data = imageData.data;
	
	let zoom = 3.5/2
	let domain = zoom / halfCanvasW
	let range = zoom / halfCanvasH
	
	let rect = new Rectangle(0, 0, tutorial_canvas.width, tutorial_canvas.height, 0)
	const punch = new Complex(-1.0, 0.0)
	

	
	function positionUpdate(event) {
        FLEX_engine = tutorial_canvas.getBoundingClientRect();
        XS_engine = event.clientX - FLEX_engine.left;
        YS_engine = event.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
        rect.color = "black"
        rect.draw()
		
		halfCanvasW = tutorial_canvas.width * .5
		halfCanvasH = tutorial_canvas.height * .5
		
		imgOffset =  punch.imaginary - XS_engine/ halfCanvasW + 1
		realOffset = punch.real * punch.imaginary + YS_engine/ halfCanvasH - 1
        redx = redval.value
        greenx = greenval.value
        bluex = blueval.value
		continued_stimuli()
	}
	
	function zoomUpdate(event) {
		return //Doesn't really add anything, so skipped
		
		event.preventDefault();

		zoom += event.deltaY * -0.001;
		
		zoom = Math.min(Math.max(0.01, zoom), 3.5);
		  
		continued_stimuli()
	}
	
    function continued_stimuli() {

		domain = zoom / halfCanvasW
		range = zoom / halfCanvasH
        
		let X = 0
		let Y = 0
		const skip = 1
        const skipP = skip * 4
        if(speed == -1){
            for (var i = 0; i < data.length; i += skipP) {
                X += skip;
                if(X >= tutorial_canvas.width){
                    X = 0
                    Y += 1
                }
                let comp = new Rectangle(X, Y, 1, 1)
                comp = calcSpot(comp)
                data[i] = comp.r // red
                data[i + 1] = comp.g  // green
                data[i + 2] = comp.b // blue
                data[i + 3] = comp.a * 255
            }
        }else{
        for (var i = 0; i < data.length; i += 8) {
			X += 2;
			if(X >= tutorial_canvas.width){
				X = 0
				Y += 1
            }
            let comp = new Rectangle(X, Y, 1, 1)
            comp = calcSpot(comp)
            data[i] = comp.r // red
            data[i + 1] = comp.g  // green
            data[i + 2] = comp.b // blue
            data[i + 3] = comp.a * 255
        }
        }

        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)
        tutorial_canvas_context.putImageData(imageData, 0, 0);
    }
	
    function calcSpot(spot) {
        let iet = 0
		let xtemp = (spot.complex.real * spot.complex.real) - (spot.complex.imaginary * spot.complex.imaginary);
		
        while (iet < 64 && xtemp < r2) {
            iet++
            spot.complex.imaginary = (2 * spot.complex.real * spot.complex.imaginary) + imgOffset
            spot.complex.real = xtemp + realOffset
            xtemp = (spot.complex.real * spot.complex.real) - (spot.complex.imaginary * spot.complex.imaginary)
            // xtemp+=2
        }
        spot.g = Math.max(255 - (iet * greenx), 0) + 1
        spot.r = Math.max((Math.sqrt((iet * redx))*20), 0)
        spot.b = Math.max((Math.sqrt((iet * bluex))*10), 0) 
        spot.a = Math.min((iet-1)/8, 1)
        return spot
    }

    // window.setInterval(function () {
    //     continued_stimuli
    // }, 17)
})