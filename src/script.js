import './style.css'
import './three.js'
import './storge.js'

/**
 * Modal
 */
var openModal = document.getElementById("openModal")
var infoModal = document.getElementById("infoModal")
var infoBtn = document.getElementById("infoBtn")
var shareModal = document.getElementById("shareModal")

// Close OpenModal
openModal.onclick = () => {
    openModal.style.display = "none"
    console.log('Open Modal closed')
}

//Get infoModal
infoBtn.onclick = () => {
    infoModal.style.display = "flex"
    console.log('Open Info Modal')
}

window.onclick = function (event) {
    console.log(event.target)
    if (event.target == infoBtn) {
        infoModal.style.display = "none"
        console.log('Close Info Modal')
    }
}

/**
 * Save Screenshot
 */
var saveFile = function (strData, filename) {
    var link = document.createElement('a')
    if (typeof link.download === 'string') {
        link.download = filename
        link.href = strData
        link.click()
        document.body.removeChild(link); //remove the link when done
        console.log("saved")
    } else {
        location.replace(uri)
        console.log("saved")
    }
}
function saveAsImage() {
    var imgData

    try {
        var strMime = "image/jpeg"
        imgData = renderer.domElement.toDataURL(strMime)
        //document.getElementById('twitter-link').setAttribute('data-url', imgData)
        console.log("saved")
        saveFile(imgData, "test.jpg")
    } catch (e) {
        console.log(e);
        return
    }
}


// Get Share Modal
document.body.onkeyup = function (e) {
    if (e.keyCode == 32 || 'Spacebar') {
        saveAsImage()
        shareModal.style.display = "block"
        console.log('Open Share Modal')
        // firebase.storage().ref('users/' + currentUser.uid + '/galaxy.jpg').then(
        //     (e) => {
        //         console.log(e.task)
        //     })

        // firebase.firestore().collection('galaxys').doc().set({
        //     title: 'starring night'

        // }).then(
        //     console.log('screenshot stored')
        // )

    }

}

// Close Share Modal
window.onclick = function (event) {
    if (event.target == shareModal) {
        shareModal.style.display = "none"
        console.log('Close Share Modal')
    }
}



