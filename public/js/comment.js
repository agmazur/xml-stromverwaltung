async function sent_coment_server() {
    
    const response = await fetch('/add_coment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "cool mesege",name:"andrii",date:new Date().toISOString().split('T')[0],})
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