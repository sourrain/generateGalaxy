import './style.css'
import './three.js'
import './storge.js'

/**
 * Modal
 */
// Get the modal
var modal = document.getElementById("myModal")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0]

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none"
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}


//Get openModal
window.onload = function () {
    var openModal = document.getElementById("openModal")

    // When the user clicks anywhere outside of the modal, close it
    openModal.onclick = function () {
        openModal.style.display = "none"
        console.log('Open Modal closed')
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
    var imgData, imgNode

    try {
        var strMime = "image/jpeg"
        imgData = renderer.domElement.toDataURL(strMime)
        console.log("saved")
        saveFile(imgData, "test.jpg")
    } catch (e) {
        console.log(e);
        return;
    }

}
/**
 * Download and Share
 */
document.body.onkeyup = function (e) {
    if (e.keyCode == 32 || 'Spacebar') {
        saveAsImage()
        modal.style.display = "block"
        firebase.storage().ref('users/' + currentUser.uid + '/galaxy.jpg').then(
            (e) => {
                console.log(e.task)
            })

        firebase.firestore().collection('galaxys').doc().set({
            title: 'starring night'

        }).then(
            console.log('screenshot stored')
        )

    }

}


