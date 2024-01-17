import {
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
  app,
} from "./firbase.js";


// import { callthis } from "./postpage.js";

// ====================header====================




function initializeLocomotiveScroll() {
  const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
  });
}

// Delay execution by 5 seconds



// Function to initialize LocomotiveScroll


 
  // const scroll = new LocomotiveScroll({
  //   el: document.querySelector('#main'),
  //   smooth: true
  // });
  // Delay execution by 5 seconds



// Reference to your Firestore collection
// const firestore = getFirestore();
// const dataCollection = collection(firestore, 'posts'); // Replace with your actual collection name

// // Fetch data from Firestore
// getDocs(dataCollection)
//   .then((querySnapshot) => {
//     // Data has been loaded, call the function to initialize LocomotiveScroll
//     initializeLocomotiveScroll();
//     console.log("Data loaded successfully!");
    
//   })
//   .catch((error) => {
//     console.error("Error loading Firestore data:", error);
//   });




let header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0)
})


// ====================header====================

// ====================loader====================
document.addEventListener("DOMContentLoaded", function () {
  // Show loader on page load
  showLoader();

  // You can simulate some loading time with setTimeout
  setTimeout(function () {
    // Hide loader after some time (simulating loaded content)
    hideLoader();
  }, 2500); // Change this to your desired loading time
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("content-box").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("l-main").style.display = "none";

  document.getElementById("content-box").style.display = "block";
}

// ====================loader====================


var uniqIdforPostpage;
var content = document.getElementById("content");

var title_top = document.getElementById("top-title");
const feedbck = document.getElementById("post_container");
const avatar = document.getElementById("avatar_nav");
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
})
var userbtn = document.getElementById("userbtn");
var feedbtn = document.getElementById("feedbtn");
var curved= document.getElementById("curved");
// if user already login on same pc
window.addEventListener("DOMContentLoaded", function () {
  var uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.href = "index.html";
  }
  console.log(uid, "uid");
});

function myprofile() {
  window.location.href = "user.html";
}
window.myprofile = myprofile;

// ====================

// =========================

window.addEventListener("DOMContentLoaded", async function () {
  feedbck.innerHTML = "";
  console.log("blog load");
  var uid = localStorage.getItem("uid");
  console.log(uid, "uid");

  if (!uid) {
    location.replace("./index.html");
    return;
  }
  var userarray = [];
  const querySnapshot_user = await getDocs(collection(db, "users"));
  querySnapshot_user.forEach(function (doc) {
    userarray.push({
      name: doc.data().name,
      uid: doc.data().uid,
      image: doc.data().imageURL,
    });
  });

  for (var i = 0; i < userarray.length; i++) {
    var user = userarray[i];
    if (user.uid == uid) {
      avatar.innerHTML = uiForNav(user.name, user.image);
      var UserImage = await getImageofUser(user.uid);
      curved.innerHTML = `Welcome ${UserImage.name}`;

    }
  }

  var BlogArr = [];
  const querySnapshot = await getDocs(collection(db, "posts"));
  querySnapshot.forEach(function (doc) {
    BlogArr.push({
      title: doc.data().title,
      desc: doc.data().description,
      uid: doc.data().uid,
      image: doc.data().image,
      timestamp: doc.data().timestamp,
      blogId: doc.id,

    });
  });
  console.log(BlogArr, "BlogArr");

  for (var i = 0; i < BlogArr.length; i++) {
    var blog = BlogArr[i];
    console.log(blog.uid, "blog.uid");
    var UserImage = await getImageofUser(blog.uid);
    var timestamp = calculateTimeAgo(blog.timestamp);
    if (blog.uid == uid) {
      avatar.innerHTML = uiForNav(UserImage.name, UserImage.image);
    }
    feedbck.innerHTML += createUI(blog.title, blog.desc, blog.image, blog.uid, blog.blogId, UserImage.image, UserImage.name, timestamp);
  }

});



// logout function
function logout() {
  localStorage.removeItem("uid");
  window.location.href = "index.html";
}
window.logout = logout;



document.getElementById('close-btn').addEventListener('click', function (event) {
  event.preventDefault();
  // Additional code if needed
});





// upload image function
document.getElementById('upload-btn').addEventListener('click', function (event) {
  // Prevent the default button behavior, which may be closing the modal
  event.preventDefault();

  // Trigger click on the hidden file input
  document.getElementById('file-input').click();
});

// Handle file selection
document.getElementById('file-input').addEventListener('change', function () {
  // Access the selected file(s) using this.files
  var selectedFiles = this.files;

  // Display the file name
  var fileNameDisplay = document.getElementById('file-name');
  if (selectedFiles.length > 0) {
    fileNameDisplay.textContent = 'Selected File: ' + selectedFiles[0].name;
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
});

//=======================================================



////////////////////////////==================================



// add post function
async function addpost() {
  event.preventDefault();
  var fileinput = document.getElementById("file-input");
  var imageURL;

  if (fileinput.files[0]) {
    imageURL = await imageUpload(fileinput.files[0]);
  } else {
    imageURL = "https://firebasestorage.googleapis.com/v0/b/my-first-project-1-c98da.appspot.com/o/images%2Fclose-up-elegant-decoration-house-1.jpg?alt=media&token=3757c49e-cbc0-452f-8408-ced38f5d6eff";
  }

  var title = document.getElementById("title");
  var description = document.getElementById("description");
  var file = document.getElementById("file-input");
  var uid = localStorage.getItem("uid");

  // Add a timestamp field
  // var timestamp = firebase.firestore.FieldValue.serverTimestamp();
  var timestamp = new Date().getTime();
  var postObj = {
    title: title.value,
    description: description.value,
    uid: uid,
    image: imageURL,
    timestamp: timestamp,
    // timestamp: timestamp,
  };
  const docRef = await addDoc(collection(db, "posts"), postObj);
  var userCredit = await getImageofUser(uid);
  timestamp = calculateTimeAgo(timestamp);
  feedbck.innerHTML += createUI(title.value, description.value, imageURL, uid, docRef.id, userCredit.image, userCredit.name, timestamp);
  myModal.hide();
  title.value = "";
  description.value = "";
  file.value = "";
}

window.addpost = addpost;


// function for creating UI
function createUI(title, description, image, uid, unID, userimage, username, timestamp) {
  var length = description.length;
  var uniqueId = unID; // Unique ID for each card
  // console.log(unID);
  if(!userimage)
  {
    userimage="https://firebasestorage.googleapis.com/v0/b/my-first-project-1-c98da.appspot.com/o/images%2Fscreen-shot-2023-04-13-at-10-35-31-am.webp?alt=media&token=b014caf2-8194-4b96-b122-49c06b561240"
  }
  var UI = `
  <div class="post-box tech">
  <img src="${image}" alt="" class="post-img">
  
  <a href="#" id=${uniqueId} onclick="postpage(this)" class="post-title">${title}</a>
  
  <p class="post-description">${description}</p>
  <div class="profile">
      <img src=${userimage} alt="" class="profile-img">
      <span class="profile-name">${username}</span>
      <span class="profile-time"><i class="fa-solid fa-circle"></i>${timestamp}</span>
  </div>
</div>
  `;

  return UI;
}

window.createUI = createUI;


function imageUpload(file) {
  return new Promise(function (resolve, reject) {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}
window.imageUpload = imageUpload;


function uiForNav(name, image) {
  if (!image) {
    image = "https://firebasestorage.googleapis.com/v0/b/my-first-project-1-c98da.appspot.com/o/images%2Fscreen-shot-2023-04-13-at-10-35-31-am.webp?alt=media&token=b014caf2-8194-4b96-b122-49c06b561240";
  }
  var UI = `
  <div class="avatar">
  <img src=${image} alt="">
</div>
  `;
  return UI;
}
window.uiForNav = uiForNav;

async function getImageofUser(uid) {
  var credit_object = {
    name: "",
    image: "",
  };
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach(function (doc) {
    if (doc.data().uid == uid) {
      credit_object.name = doc.data().name;
      credit_object.image = doc.data().imageURL;
    }
  });
  return credit_object;
}
window.getImageofUser = getImageofUser;

function calculateTimeAgo(timestamp) {
  var timeAgo = "";
  var currentTime = new Date().getTime();
  var diff = currentTime - timestamp;
  var seconds = diff / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;

  if (seconds < 60) {
    timeAgo = "Just now";
  } else if (minutes < 60) {
    timeAgo = Math.floor(minutes) + " minutes ago";
  } else if (hours < 24) {
    timeAgo = Math.floor(hours) + " hours ago";
  } else {
    timeAgo = Math.floor(days) + " days ago";
  }
  return timeAgo;
}


function postpage(element) {
  localStorage.setItem("blogId", element.id);
  window.location.href = "postpage.html";
}
window.postpage = postpage;





