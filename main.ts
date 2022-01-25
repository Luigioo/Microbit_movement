
input.onButtonPressed(Button.A, function () {
    serial.writeLine("hellow")
})
let Ymovement = 0
let Xmovement = 0
let Zmovement = 0
let delt = 0
let yv = 0
let xv = 0
let Zold = 0
let Zoff = 0
let movement = false
let Yold = 0
let Yoff = 0
let Xold = 0
let Xoff = 0
let now1 = 0
let advertise = false
let now = 0
let timet = 12
let Zthreshold = 300
let Ythreshold = 10
let Xthreshold = 10
timet = 12
//new stuff
let xleast = 100
let yleast = 100
let positions = [100, 100]
let oldTime = input.runningTimeMicros()
let curTime
let xdis = 0;
let ydis = 0;
let xmiss = 0;
let ymiss = 0;
// low pass filter https://www.w3.org/TR/motion-sensors/#low-pass-filter
const bias = 0.8
let oldxacc = input.acceleration(Dimension.X);
let oldyacc = input.acceleration(Dimension.Y);
let oldzacc = input.acceleration(Dimension.Z);
function updateLowFilter(xmov: number, ymov: number, zmov: number) {
    oldxacc = oldxacc * bias + xmov * (1 - bias)
    oldyacc = oldyacc * bias + ymov * (1 - bias)
    oldzacc = oldzacc * bias + zmov * (1 - bias)
}
//compass in radians
function getCompass(){
    return input.compassHeading() / 180 * Math.PI
}
let oldcompass = getCompass();
//
input.setAccelerometerRange(AcceleratorRange.FourG)
// serial.writeString("{\"x\":" + Xmovement + ", \"y\":" + Ymovement + ", \"z\":" + Zmovement + "}")
// serial.writeLine("{\"x\":" + xv + ", \"y\":" + yv + ", \"z\":" + Zmovement + "}")
loops.everyInterval(200, function () {
    let xrelDis = xv * 0.2    //speed * time
    let yrelDis = yv * 0.2
    //total distance:
    let totalDis = Math.sqrt(xrelDis*xrelDis+yrelDis*yrelDis)

    // let xtilt = input.rotation(Rotation.Pitch)
    // let ytilt = input.rotation(Rotation.Roll)
    oldcompass = oldcompass*bias+getCompass()*(1-bias)
    let vectorx = Math.cos(oldcompass)
    let vectory = Math.sin(oldcompass)
    
    //actual positions
    xdis += vectorx*totalDis
    ydis += vectory*totalDis
    serial.writeValue("heading", oldcompass)
    serial.writeValue("x", xdis)
    serial.writeValue("y", ydis)

    // serial.writeValue("check", Math.sqrt(vectory*vectory+vectorx*vectorx))
    // serial.writeValue("compass", compass)
})

basic.forever(function () {
    // get some delta Time
    curTime = input.runningTimeMicros()
    delt = curTime - oldTime
    delt = delt / 1000000
    oldTime = curTime
    Zmovement = input.acceleration(Dimension.Z)
    Xmovement = input.acceleration(Dimension.X)
    Ymovement = input.acceleration(Dimension.Y)
    // if(Xmovement>10||Ymovement>10){
    // }
    if (true || !(Zmovement > 1024 || Zmovement < 950)) {
        // if microbit is flat
        if (Xmovement != Xold) {
            if (Xmovement < Xold - Xthreshold || Xmovement > Xold + Xthreshold) {
                Xold = Xmovement

                xv += Xmovement / 1024 * 9.807 * delt
                xmiss = Math.max(0, xmiss + 1);
                if (Xmovement > 0) {
                    led.plot(4, 2)
                } else {
                    led.plot(0, 2)
                }
            }
            else {
                xmiss = Math.min(0, xmiss - 1);
                if (xmiss < 5) {
                    xv = 0;
                }
            }
        }
        // serial.writeValue("xmiss", xmiss);

        // if (Math.abs(Xmovement) > xleast) {

        //     // serial.writeValue("xAcc", Xmovement)
        // }
        if (Ymovement != Yold) {
            if (Ymovement < Yold - Ythreshold || Ymovement > Yold + Ythreshold) {
                Yold = Ymovement
                yv += Ymovement / 1024 * 9.807 * delt
                ymiss = Math.max(0, ymiss + 1);
            } else {
                ymiss = Math.min(0, ymiss - 1);
                if (ymiss < 5) {
                    yv = 0;
                }
            }
            // if (Math.abs(Ymovement) > yleast) {

            //     if (Ymovement > 0) {
            //         led.plot(2, 4)
            //     } else {
            //         led.plot(2, 0)
            //     }
            // }
        }
    }
    // if (Zmovement != Zold) {
    // // basic.showString("x")
    // if (Zmovement < Zold - Zthreshold || Zmovement > Zold + Zthreshold) {
    // Zoff += Zmovement - Zold
    // Zold = Zmovement
    // movement = true
    // basic.showLeds(`
    // # . . . .
    // . . . . .
    // . . . . .
    // . . . . .
    // . . . . .
    // `)
    // }
    // }
    // if (Ymovement != Yold) {
    // // basic.showString("x")
    // if (Ymovement < Yold - Ythreshold || Ymovement > Yold + Ythreshold) {
    // Yoff += Ymovement - Yold
    // Yold = Ymovement
    // movement = true
    // basic.showLeds(`
    // . # . . .
    // . . . . .
    // . . . . .
    // . . . . .
    // . . . . .
    // `)
    // }
    // }
    // if (Xmovement != Xold) {
    // // basic.showString("x")
    // if (Xmovement < Xold - Xthreshold || Xmovement > Xold + Xthreshold) {
    // Xoff += Xmovement - Xold
    // Xold = Xmovement
    // movement = true
    // basic.showLeds(`
    // . . # . .
    // . . . . .
    // . . . . .
    // . . . . .
    // . . . . .
    // `)
    // }
    // }
    // if (movement) {
    // movement = false
    // now1 = input.runningTime()
    // advertise = false
    // bluetooth.stopAdvertising()
    // basic.pause(500)
    // basic.clearScreen()
    // } else {
    // now = input.runningTime()
    // if (now > now1 + timet * 1000 * 60) {
    // if (advertise == false) {
    // basic.showLeds(`
    // . . . . .
    // . . . . .
    // . . # . .
    // . . . . .
    // . . . . .
    // `)
    // // basic.showString("F")
    // bluetooth.advertiseUrl(
    // "http://www.google.com",
    // 7,
    // false
    // )
    // advertise = true
    // }
    // }
    // }

})
