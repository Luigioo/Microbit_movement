def on_bluetooth_connected():
    pass
bluetooth.on_bluetooth_connected(on_bluetooth_connected)

def on_bluetooth_disconnected():
    pass
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)

def on_button_pressed_a():
    serial.write_line("hellow")
input.on_button_pressed(Button.A, on_button_pressed_a)

now = 0
advertise = False
now1 = 0
Xoff = 0
Xold = 0
Yoff = 0
Yold = 0
movement = False
Zoff = 0
Zold = 0
Zmovement = 0
Ymovement = 0
Xmovement = 0
timet = 12
Zthreshold = 300
Ythreshold = 300
Xthreshold = 300
timet = 12
xv = 0
yv = 0
xleast = 100
yleast = 100
positions = [100, 100]
oldTime = input.running_time()
delt = 0
input.set_accelerometer_range(AcceleratorRange.FOUR_G)

def on_every_interval():
    serial.write_line("{\"x\":" + str(xv) + ", \"y\":" + str(yv) + ", \"z\":" + str(Zmovement) + "}")
loops.every_interval(100, on_every_interval)

def on_forever():
    global curTime, delt, oldTime, Zmovement, Xmovement, Ymovement, xv, yv, Zoff, Zold, movement, Yoff, Yold, Xoff, Xold, now1, advertise, now
    # get some delta Time
    curTime = input.running_time()
    delt = curTime - oldTime
    delt = delt / 1000
    oldTime = curTime
    Zmovement = input.acceleration(Dimension.Z)
    Xmovement = input.acceleration(Dimension.X)
    Ymovement = input.acceleration(Dimension.Y)
    if not (Zmovement > 1024 or Zmovement < 950):
        # if microbit is flat
        if Xmovement > xleast:
            xv += Xmovement / 1023 * 9.807 * delt * delt
            Xmovement = 0
        if Ymovement > yleast:
            yv += Ymovement / 1023 * 9.807 * delt * delt
            yv += Ymovement
            Ymovement = 0
    if Zmovement != Zold:
        # basic.showString("x")
        if Zmovement < Zold - Zthreshold or Zmovement > Zold + Zthreshold:
            Zoff += Zmovement - Zold
            Zold = Zmovement
            movement = True
            basic.show_leds("""
                # . . . .
                                . . . . .
                                . . . . .
                                . . . . .
                                . . . . .
            """)
    if Ymovement != Yold:
        # basic.showString("x")
        if Ymovement < Yold - Ythreshold or Ymovement > Yold + Ythreshold:
            Yoff += Ymovement - Yold
            Yold = Ymovement
            movement = True
            basic.show_leds("""
                . # . . .
                                . . . . .
                                . . . . .
                                . . . . .
                                . . . . .
            """)
    if Xmovement != Xold:
        # basic.showString("x")
        if Xmovement < Xold - Xthreshold or Xmovement > Xold + Xthreshold:
            Xoff += Xmovement - Xold
            Xold = Xmovement
            movement = True
            basic.show_leds("""
                . . # . .
                                . . . . .
                                . . . . .
                                . . . . .
                                . . . . .
            """)
    if movement:
        movement = False
        now1 = input.running_time()
        advertise = False
        bluetooth.stop_advertising()
        basic.pause(500)
        basic.clear_screen()
    else:
        now = input.running_time()
        if now > now1 + timet * 1000 * 60:
            if advertise == False:
                basic.show_leds("""
                    . . . . .
                                        . . . . .
                                        . . # . .
                                        . . . . .
                                        . . . . .
                """)
                # basic.showString("F")
                bluetooth.advertise_url("http://www.google.com", 7, False)
                advertise = True
basic.forever(on_forever)
