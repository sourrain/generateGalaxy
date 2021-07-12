//Parameters
export const parameters = {
    count: 10000,
    size: 0.02,
    branches: 5,
    radius: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    //Not set yet from https://codepen.io/ykob/pen/avEpdd?editors=1010
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    },
    getDegree: function (radian) {
        return radian / Math.PI * 180
    },
    getRadian: function (degrees) {
        return degrees * Math.PI / 180
    },
    getSpherical: function (rad1, rad2, r) {
        var x = Math.cos(rad1) * Math.cos(rad2) * r
        var z = Math.cos(rad1) * Math.sin(rad2) * r
        var y = Math.sin(rad1) * r
        return [x, y, z]
    }
}
