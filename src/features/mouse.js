/**
 * onDocument Mouse Move
 */
document.addEventListener('mousemove', onDocumentMouseMove, false);

export function onDocumentMouseMove(event, mouse) {
    event.preventDefault()
    //mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    //mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    //console.log(mouse.x + ", " + mouse.y);
}

/**
 * Mapping Mouse Value
 */
export function mouseMap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

