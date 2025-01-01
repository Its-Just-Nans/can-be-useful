import Plotly from "plotly.js-dist";

export const copyContextToImage = (gd, format = "png") => {
    Plotly.toImage(gd, {
        format: format,
        height: 800,
        width: 800,
    }).then(function (url_base64) {
        let type = `image/${format}`;
        const base64Data = url_base64.split(",")[1];
        let blobInput = convertBase64ToBlob(base64Data, type);
        const clipboardItemInput = new ClipboardItem({
            [type]: blobInput,
        });
        navigator.clipboard.write([clipboardItemInput]);
        console.log("success");
    });
};

function convertBase64ToBlob(base64, type) {
    var bytes = window.atob(base64);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
}
