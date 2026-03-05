console.log("Comment script loaded");
window.onload = function() {
    const myButton = document.getElementById('add_coment');
    myButton.addEventListener('click', function() {
    });
    } 
;


async function addComment() {
    const newComment = {
        name: "User Name", // You'd get this from an input field
        text: "This is a new comment!",
        date: new Date().toLocaleDateString()
    };

    const response = await fetch('/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
    });

    if (response.ok) {
        location.reload(); // Refresh to see the new comment via your XSLT
    }
}



async function sendCommentToServer() {
    const data = {
        name: "Andrii Mazur",
        text: "This will actually save to the file!",
        date: "09-02-26"
    };

    // We "POST" the data to a specific URL on our Node server
    await fetch('/save-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    alert("Saved to server!");
}