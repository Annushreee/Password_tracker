const API_URL = "https://crudcrud.com/api/2f11b975c0384794b6f0b279bd2e63e5/passwords";

const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const searchInput = document.getElementById("search");
const passwordsList = document.getElementById("passwordsList");
const passwordCount = document.getElementById("passwordCount");

const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const passwordForm = document.getElementById("passwordForm");

let editId = null;
passwordForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const website = websiteInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    const passwordData = {
        website: website,
        username: username,
        password: password
    };


    if (editId !== null) {

        axios.put(API_URL + "/" + editId, passwordData)
            .then(function(response) {

                console.log("Password updated successfully!");

                editId = null;

                passwordForm.reset();

                getPasswords();

            })
            .catch(function(error) {

                console.log("Error:", error);

            });

        return;
    }


    axios.post(API_URL, passwordData)
        .then(function(response) {

            console.log("Password saved:", response.data);

            passwordForm.reset();

            getPasswords();

        })
        .catch(function(error) {

            console.log("Error:", error);

        });

});
function getPasswords() {

    axios.get(API_URL)
        .then(function(response) {

            console.log("All passwords:", response.data);
            displayPasswords(response.data);

        })
        .catch(function(error) {

            console.log("Error:", error);

        });

}
function displayPasswords(passwords) {

    passwordsList.innerHTML = "";

    passwords.forEach(function(passwordEntry) {

        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <strong>${passwordEntry.website}</strong>
            - ${passwordEntry.username}
            - <span class="passwordText">••••••••</span>

    <button class="showPasswordBtn" data-password="${passwordEntry.password}">
        👁
    </button>

            <button class="editBtn" data-id="${passwordEntry._id}">
                Edit
            </button>

            <button class="deleteBtn" data-id="${passwordEntry._id}">
                Delete
            </button>
        `;

        const showPasswordBtn = listItem.querySelector(".showPasswordBtn");
        showPasswordBtn.addEventListener("click", function(event) {

    const passwordText = listItem.querySelector(".passwordText");

    if (passwordText.textContent === "••••••••") {

        passwordText.textContent = event.target.dataset.password;

    } else {

        passwordText.textContent = "••••••••";

    }

});
        const deleteBtn = listItem.querySelector(".deleteBtn");

        deleteBtn.addEventListener("click", function(event) {

            const id = event.target.dataset.id;

            axios.delete(API_URL + "/" + id)
                .then(function(response) {

                    console.log("Password deleted successfully");

                    getPasswords();

                })
                .catch(function(error) {

                    console.log("Error:", error);

                });

        });


        const editBtn = listItem.querySelector(".editBtn");

        editBtn.addEventListener("click", function(event) {

            const id = event.target.dataset.id;

            axios.get(API_URL + "/" + id)
                .then(function(response) {

                    const passwordEntry = response.data;

                    websiteInput.value = passwordEntry.website;
                    usernameInput.value = passwordEntry.username;
                    passwordInput.value = passwordEntry.password;

                    editId = id;

                })
                .catch(function(error) {

                    console.log("Error:", error);

                });

        });


        passwordsList.appendChild(listItem);

    });

    passwordCount.textContent = passwords.length;

}

searchBtn.addEventListener("click", function() {

    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    axios.get(API_URL)
        .then(function(response) {

            const passwords = response.data;

            const filteredPasswords = passwords.filter(
                function(passwordEntry) {

                    return passwordEntry.website
                        .toLowerCase()
                        .includes(searchValue);

                }
            );

            displayPasswords(filteredPasswords);

        })
        .catch(function(error) {

            console.log("Error:", error);

        });

});
showAllBtn.addEventListener("click", function() {

    searchInput.value = "";

    getPasswords();

});