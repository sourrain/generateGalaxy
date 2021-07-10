/**
 * Subtraction Vectors: a - b
 */
export function substract(a, b, res) {

    const aArray = [a.x, a.y]
    const bArray = [b.x, b.y]
    const xArray = aArray.map(
        function (item, index) {
            // In this case item correspond to currentValue of array a, 
            // using index to get value from array b
            return item - bArray[index];
        }
    )

    res.x = xArray[0]
    res.y = xArray[1]

    return res

}


/**
 * Add Vectors: a + b
 */
export function add(a, b, res) {

    res.x = a.x + b.x
    res.y = a.y + b.y

    return res
}


/**
 * Divide vectorA by b
 */
export function divide(vectorA, a, res) {

    res.x = vectorA.x / a
    res.y = vectorA.y / a
    return res
}

/**
 * Reset the magitude of the vectorA
 */
export function setMag(a, mag, res) {


    res.x = a.x / Math.abs(a.x) * Math.abs(mag)
    res.y = a.y / Math.abs(a.y) * Math.abs(mag)

    return res
}


/**
 * Vector a Magnitude Squared
 */
export function magSquared(a) {

    const magSq = a.x * a.x + a.y * a.y
    return magSq
}
