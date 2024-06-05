var convertBtn = document.getElementById('convert-button');
var URLinput = document.getElementById('URL-input');
var stats = document.getElementById("status")

convertBtn.addEventListener('click', () => {
    console.log(`URL: ${URLinput.value}`);
    sendURL(URLinput.value);
});
function sendURL(URL) {
    fetch(`http://localhost:4000/download?URL=${URL}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    stats.innerHTML = "Youtube link it kelangan 🙂"
                }

                else if (response.status == 500) {
                    stats.innerHTML === "Igchat ak bas ko tuhayon :/"
                }
            }

            else {
                window.open(`http://localhost:4000/download?URL=${URL}`)
                stats.innerHTML = "Enjoy tim new music kikayyyy😇!"
            }
        })
}