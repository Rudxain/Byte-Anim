'use strict';
const canv = document.getElementById('c'),
	ctx = canv.getContext('2d', {alpha: false, desynchronized: true}),
	FPS_to_ms = f => 1000 / f,
	Mersenne = n => (typeof (n = n?.valueOf()) == 'bigint' ? ~(-1n << n) : 2 ** n - 1)

const numToHexColor = (n, bits) => {
	n = Number(n & Mersenne(bits))
	//https://en.wikipedia.org/wiki/8-bit_color
	let color = {
		0: '000',
		1: n ? 'fff' : '000',
		2: ['000', '3f3f3f', '9f9f9f', 'fff'][n],
		3: (n & 4 ? 'f' : '0') + (n & 2 ? 'f' : '0') + (n & 1 ? 'f' : '0'),
		4: '',//use planar
		8: ((n >> 5) & 7).toString(16) + ((n >> 2) & 7).toString(16) + ['00','3f','9f','ff'][n & 3],
		24: n.toString(16)
	}[bits]
	if (color) return color
	throw new RangeError('Unsupported bit depth')
}

let wrapT = true, bitDepth = 2,
	t = 0, f = () => (Math.sin(t) + 1) * 2,
	w = canv.width, h = canv.height,
	start

if (!wrapT) {t = BigInt(t); bitDepth = BigInt(bitDepth)}

const baseFrame = () => {
	for (let y = 0; y < h; y++)
	for (let x = 0; x < w; x++) {
		ctx.fillStyle = '#' + numToHexColor(f(), bitDepth); ctx.fillRect(x, y, 1, 1)
		t++; if (wrapT) t >>>= 0
	}
}
const nextFrame = now => {
	if (now - start > FPS_to_ms(1)) {baseFrame(); start = now}
	requestAnimationFrame(nextFrame)
}

requestAnimationFrame(now => {baseFrame(); start = now})
requestAnimationFrame(nextFrame)
