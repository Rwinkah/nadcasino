

reference point is 400, 50

create a row

    for i+3 is even ,



        ball location at 1 <= x <= i+ 3

    for i+3 is odd, 


        ball locations at 0 <= x < i+3 




    example if i+3 = 6

        ball location is [400-(1*32), 400+(2*32), 400-(3*32, 400+(4*32), 400-(5*32), 400+(6*32))]





    start
    check if i+3 is even?
    even? type boolean
    i + 3 / 2 = y
    from z in (-y to + y )
    if z = 0 and even is true continue
    create ball with x value z
    inc z
    
