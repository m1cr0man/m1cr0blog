interface Numbers {
	a: number,
	b: number
}

function add(vals: Numbers): number {
	return vals.a + vals.b
}

console.log("4 + 5 is ", add({a: 4, b: 5}))
