import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    app,
    initializeApp,
    auth,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    db,
    getDownloadURL,
    ref,
    storage,
    uploadBytesResumable,
} from "./firbase.js";




const wrapper = document.querySelector(".wrapper"),
signupHeader = document.querySelector(".signup header"),
loginHeader = document.querySelector(".login header");

wrapper.classList.add("active");

loginHeader.addEventListener("click", () => {
wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
wrapper.classList.remove("active");
});

async function signup(event) {
    event.preventDefault();
    console.log("signup");
    var email_signup = document.getElementById("email_sign");
    var name_sign = document.getElementById("name_sign");
    var password_signup = document.getElementById("password_sign");

    try {
        const success = await createUserWithEmailAndPassword(auth, email_signup.value, password_signup.value);
        console.log(success, "success");
        const uid = success.user.uid;
        localStorage.setItem("uid", uid);
        console.log(uid, "uid");

        var UserFromSignup = {
            email: email_signup.value,
            name: name_sign.value,
            about: "", // Set a default value, or use null if that's more appropriate
            imageURL: "", // You may want to set a default value for imageURL as well
            uid: uid,
        }

        const docRef = await addDoc(collection(db, "users"), UserFromSignup);
        alert("User created successfully");
wrapper.classList.add("active");

    } catch (error) {
        console.log(error, "error");
        alert(error.message);
    }
}

window.signup = signup;

function login(event) {
    event.preventDefault();
    console.log("login");

    const email_login = document.getElementById("email_login");
    const password_login = document.getElementById("password_login");
    signInWithEmailAndPassword(auth, email_login.value, password_login.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            localStorage.setItem("uid", user.uid);  
            window.location.href = "dashboard.html";
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode, errorMessage);
        });
}
window.login = login;


// if user is already signed in then redirect to dashboard
window.addEventListener("DOMContentLoaded", function () {
    var uid=localStorage.getItem("uid");
    if(uid)
    {
        window.location.href="dashboard.html";
    }
    console.log(uid,"uid");
});

