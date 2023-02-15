var scannedDevices = []

document.getElementById("scan").addEventListener("click", function() {
    Android.scan()
    document.querySelector(".device-found-title").style.display = "initial"
})
function data() {
    document.getElementById("scan").innerHTML = "Scanning..."
}
function newDevice(device) {
    device = device.split(",")
    
    if (!scannedDevices.includes(device[2])) {
        console.log("js device", device)
        scannedDevices.push(device[2])
        document.querySelector(".found-deviceList").innerHTML = document.querySelector(".found-deviceList").innerHTML + `
            <div id="${device[2]}" class="found-device ">
                <div class="found-device-img">
                    <img width="100%" src="img/Nix_Mini2_Face_Amazon.png" alt="">
                </div>
                <div class="found-device-info">
                    <p>Name: ${device[0]}</p>
                    <p>Type: ${device[1]}</p>

                </div>
            </div>
        `
        document.getElementById(device[2]).addEventListener("click", function() {
            document.getElementById("scan").style.display = "none"
            document.querySelector(".device-found-title").innerHTML = "Connected Device:"
            Android.connect(device[2])
        })
    }
    
}

document.getElementById("scanColor").addEventListener("click", function() {
    Android.scanColor()
})

function connect(add) {
    console.log("Address from JS", add)
    // Android.connect(add)
}

function value(params) {
    console.log("Application params", params)
    params = params.split(",")
    document.getElementById("value").innerHTML = `<h5>R:${params[0]} G:${params[1]} B:${params[2]}</h5>`
    document.getElementById("value").style.backgroundColor = `rgb(${params[0]},${params[1]},${params[2]})`
}