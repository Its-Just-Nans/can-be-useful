const el = document.getElementById("openrunner-create");
if (el.style.cssText && el.style.cssText.length < 40) {
    el.style.cssText = "height:100vh;width:100vw;z-index:100000;position:fixed;top:0px;right:0px;left:0px";
    var resizeEvent = new Event("resize"); // to update the map
    window.dispatchEvent(resizeEvent);
} else {
    el.style.cssText = "position: relative;";
}