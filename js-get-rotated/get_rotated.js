i = 0;
a = document.createElement("style");
a.innerHTML = "*{perspective: 100vh}";
document.body.append(a);
setInterval(() => {
    document.body.style.transform = `translate3d(213px, 0, -1317px) rotateY(${i}deg)`;
    i = i > 360 ? 0 : i + 1;
}, 10);
