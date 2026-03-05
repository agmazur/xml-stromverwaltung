async function sent_coment_server() {
    const messege_1 = document.getElementById('coment_input').value;
    const name_1 = document.getElementById('name_input').value;


    const response = await fetch('/add_coment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messege_1,sender:name_1,date:new Date().toISOString().split('T')[0],})
    });

    const data = await response.json();
    console.log("Response from server:", data.status);
    reload_iframe()
}

window.onload = function() {
    const myButton = document.getElementById('add_coment');
    myButton.addEventListener('click',sent_coment_server );
    } 
;
function reload_iframe() {
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        iframe.contentWindow.location.reload();
    }
}