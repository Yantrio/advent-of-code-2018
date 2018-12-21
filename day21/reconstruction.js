let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r6 = 0;

r1 = 123;
r1 = r1 & 456;
r1 = r1 === 72 ? 1 : 0;
if (r1 === 0) { console.log('LOOP'); } //infinate loop of the 3 commmands above here}


r1 = 0;
r4 = r1 | 65536;
r1 = 12772194;
while (true) {
    r3 = r4 & 255;
    r1 += r3;
    r1 &= 16777215; // this is 0xFFFFFF
    r1 *= 65899
    r1 &= 16777215;
    if (256 > r3) {
        console.log('BREAK');
        break;
    } else {
        ..
    }
}

// this just isn't working and I cant figure out why, i feel like reversing the entire thing is wrong somehow
// I'll commit what I have now anyway