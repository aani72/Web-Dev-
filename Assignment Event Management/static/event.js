function validateForm() {
    let name = document.forms["form"]["name"].value;
    if (name == "") {
        alert("Name required");
        return false;
    }
}

function searchEvent() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        let text = cards[i].innerText.toLowerCase();
        cards[i].style.display = text.includes(input) ? "block" : "none";
    }
}