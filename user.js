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
  push,
  child,
} from "./firbase.js";



var edited = false;
var feedbck = document.getElementById("post_container_user");
var title_top = document.getElementById("top-title");
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
})
var count=0;
// ====================loader====================
document.addEventListener("DOMContentLoaded", function () {
  // Show loader on page load
  showLoader();

  // You can simulate some loading time with setTimeout
  setTimeout(function () {
    // Hide loader after some time (simulating loaded content)
    hideLoader();
  }, 2000); // Change this to your desired loading time
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
function backbtn() {
  location.replace("./dashboard.html");
}
window.backbtn = backbtn;

window.addEventListener("DOMContentLoaded", async function () {


  var card = document.getElementById("card");
  var uid = localStorage.getItem("uid");
  var blogarray=[];
  const querySnapshot_blog = await getDocs(collection(db, "posts"));
  querySnapshot_blog.forEach(function (doc) {
    blogarray.push({
      uid: doc.data().uid,
    });
  }
  );
  for (var i = 0; i < blogarray.length; i++) {
    var blog = blogarray[i];
    if (blog.uid == uid) {
      count++;
    }
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
      title_top.innerHTML = `Profile-${user.name}`;

    }
  }
  var userarray = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach(function (doc) {
    userarray.push({
      name: doc.data().name,
      about: doc.data().about,
      uid: doc.data().uid,
      image: doc.data().imageURL,
    });
  });
  console.log(count);
  for (var i = 0; i < userarray.length; i++) {
    var user = userarray[i];
    // console.log(uid);
    if (user.uid == uid || edited == true) {
      console.log("conndition matched");
      // console.log(user.image);
      card.innerHTML += CreateUI_profile(user.name, user.about, user.image, user.uid, count);
    }
  }
  // console.log(userarray);



});
document.getElementById('upload-btn').addEventListener('click', function (event) {
  // Prevent the default button behavior, which may be closing the modal
  event.preventDefault();

  // Trigger click on the hidden file input
  document.getElementById('photo_profile').click();
});

// Handle file selection
document.getElementById('photo_profile').addEventListener('change', function () {
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


async function deletePost(e) {
  var uniqueId = e.id;
  console.log(uniqueId);

  await deleteDoc(doc(db, "posts", uniqueId));
  window.location.reload();
}
window.deletePost = deletePost;


window.addEventListener("DOMContentLoaded", async function () {
  // feedbck.innerHTML = "";
  console.log("OnlyUserPost");
  var uid = localStorage.getItem("uid");
  console.log(uid, "uid");

  if (!uid) {
    location.replace("./index.html");
    return;
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
  // console.log(BlogArr, "BlogArr");
  for (var i = 0; i < BlogArr.length; i++) {
    var blog = BlogArr[i];
    // console.log(blog);
    if (blog.uid == uid) {
      console.log("conndition matched");
      var UserImage = await getImageofUser(uid);
      var timestamp = calculateTimeAgo(blog.timestamp)
      feedbck.innerHTML += createUI(blog.title, blog.desc, blog.image, blog.uid, blog.blogId, UserImage.image, UserImage.name, timestamp);
      title_top.innerHTML = `${UserImage.name}`;
      console.log(blog.blogId);

    }
  }
});
function createUI(title, description, image, uid, unID, UserImage, username, timestamp) {
  var length = description.length;
  var uniqueId = unID; 
  console.log(unID);

  var UI = `
    <div class="post-box tech">
    <img src="${image}" alt="" class="post-img">
    
    <a href="#" id=${uniqueId} onclick="postpage(this)" class="post-title">${title}</a>

    
    <p class="post-description">${description}</p>
    <div class="profile">
    <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
        <img src=${UserImage} alt="" class="profile-img">
        <span class="profile-name">${username}</span>
        <span class="profile-time"><i class="fa-solid fa-circle"></i>${timestamp}</span>
    </div>
    <button class="delete-button" id=${uniqueId} onclick="deletePost(this)"><i class="fa-solid fa-trash"></i></button>
    </div>
  </div>
    `;

  return UI;
}

window.createUI = createUI;


async function edit_profile() {
  event.preventDefault();
  var fileinput = document.getElementById("photo_profile");
  var imageURL;
  var card = document.getElementById("card");

  if (fileinput.files[0]) {
    imageURL = await imageUpload(fileinput.files[0]);
  } else {
    imageURL = "./img/screen-shot-2023-04-13-at-10-35-31-am.webp";
  }

  var name_profile = document.getElementById("name_profile");
  var about_profile = document.getElementById("about_profile");
  var uid = localStorage.getItem("uid");

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach(async function (doc) {
    if (doc.data().uid == uid) {
      card.innerHTML = "";
      console.log("yes");

      // Get a reference to the document
      const docRef = doc.ref;

      // Update the document data
      await updateDoc(docRef, {
        name: name_profile.value,
        about: about_profile.value,
        imageURL: imageURL,
        edited: true,
      });
      card.innerHTML += CreateUI_profile(name_profile.value, about_profile.value, imageURL, uid);

      console.log("Document updated for uid: ", uid);
    }
  });

  myModal.hide();
  // window.location="./user.html";
  // location.reload();

}

window.edit_profile = edit_profile;



function imageUpload(file) {
  return new Promise(function (resolve, reject) {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg/png",
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


function CreateUI_profile(name, bio, image, uid, count) {
  var new_image= image;
  
  console.log("create ui profile");
  if (!image) {
      image = "https://firebasestorage.googleapis.com/v0/b/my-first-project-1-c98da.appspot.com/o/images%2Fscreen-shot-2023-04-13-at-10-35-31-am.webp?alt=media&token=b014caf2-8194-4b96-b122-49c06b561240";
    console.log("image not found");
  }
  var ui = `
  <div class="page-1">
                <img src=${image} alt="">
            </div>
            
            <div class="page-2">
                <div class="p-name">
                    <h3>${name}</h3>
                </div>
                <div class="p-about">
                    <h3>"${bio}"</h3>
                </div>
                <div class="p-social">
                    <a href="https://abdullahshafiq.online/"><i class="fa-solid fa-user"></i></a>
                    <a href="https://abdullahshafiq.online/"><i class="fa-brands fa-github"></i></a>
                    <a href="https://abdullahshafiq.online/"><i class="fa-brands fa-instagram"></i></a>
                </div>
                <div class="blog-created">
                    <h4>${count}</h4>
                    <p>Blogs Created</p>
                </div>
            </div>
            <div class="page-3">
                <button  data-bs-toggle="modal" data-bs-target="#myModal">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </div>
  `
  image = new_image;
  return ui;
}
window.CreateUI_profile = CreateUI_profile;

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
window.calculateTimeAgo = calculateTimeAgo;


function postpage(element) {
  localStorage.setItem("blogId", element.id);
  window.location.href = "postpage.html";
}
window.postpage = postpage;