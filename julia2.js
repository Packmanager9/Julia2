
window.addEventListener('DOMContentLoaded', (event) => {
    let r = 5
    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');
    tutorial_canvas.addEventListener('pointermove', continued_stimuli);
    function continued_stimuli(e) {
        FLEX_engine = tutorial_canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
        rect.color = "black"
        rect.draw()
        const imageData = tutorial_canvas_context.getImageData(0, 0, tutorial_canvas.width, tutorial_canvas.height);
        const data = imageData.data;
        for (var i = 0; i < data.length; i += 12) {
            let obj = indexer(i + (Math.random() * 0))
            let comp = new Rectangle(obj.x, obj.y, 1, 1, 0)
            comp = calcSpot(comp)
            data[i] = comp.r // red
            data[i + 1] = comp.g  // green
            data[i + 2] = comp.b // blue
            data[i + 3] = comp.a * 255
        }
        tutorial_canvas_context.putImageData(imageData, 0, 0);
    }
    let TIP_engine = {}
    TIP_engine.x = tutorial_canvas.width * .5
    TIP_engine.y = tutorial_canvas.height * .5
    tutorial_canvas.style.background = "black"
    class Rectangle {
        constructor(x, y, height, width, step) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.complex = new Complex(((x - tutorial_canvas.width / 2) / tutorial_canvas.width) * 3.5, ((y - tutorial_canvas.height / 2) / tutorial_canvas.height) * 3.5)
            this.color = 'rgb(0,0,0)'
        }
        draw() {
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
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
    let rect = new Rectangle(0, 0, tutorial_canvas.width, tutorial_canvas.height, 0)
    let punch = new Complex(-.991, .2675)
    function calcSpot(spot) {
        let iet = 0
        let a = 0
        while (iet < 32 && ((spot.complex.real * spot.complex.real) - (spot.complex.imaginary * spot.complex.imaginary)) < r * r) {
            iet++
            let xtemp = (spot.complex.real * spot.complex.real) - (spot.complex.imaginary * spot.complex.imaginary)
            spot.complex.imaginary = (2 * spot.complex.real * spot.complex.imaginary) + punch.imaginary
            spot.complex.real = (xtemp) + (punch.real * punch.imaginary)

            spot.complex.imaginary -= (TIP_engine.x - (tutorial_canvas.width * .5)) / (tutorial_canvas.width * .5)
            spot.complex.real += ((TIP_engine.y - (tutorial_canvas.height * .5)) / (tutorial_canvas.height * .5))
            a += .06
            if (a > .48) {
                a = 1
            }
        }
        if (a < .1) {
            a = 0
        }
        spot.g = Math.max(128 - (iet * 2), 0) + 1
        spot.r = Math.max(0 + (iet * 8), 0)
        spot.b = Math.max(0 + (iet * 8), 0) 
        spot.a = a
        return spot
    }
    function indexer(num) {
        let obj = {}
        let x = Math.floor((num / 4) % tutorial_canvas.width)
        let y = Math.floor((num / 4) / tutorial_canvas.height)
        obj.x = x + Math.random()
        obj.y = y
        return obj
    }
})