/**
 * Change Galaxy
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 2
}
//link to random galaxy.html page
export function changeGalaxy() {

  window.location.href =
    "./galaxy" + getRandomInt(3) + ".html"

}