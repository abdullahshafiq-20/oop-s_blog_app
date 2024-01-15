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

var edited=false;
var feedbck = document.getElementById("post_container_user");
var title_top = document.getElementById("top-title");
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
})
// ====================loader====================
document.addEventListener("DOMContentLoaded", function() {
  // Show loader on page load
  showLoader();

  // You can simulate some loading time with setTimeout
  setTimeout(function() {
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
function backbtn()
{
  location.replace("./dashboard.html");
}
window.backbtn=backbtn;

window.addEventListener("DOMContentLoaded", async function (){

  var card = document.getElementById("card");
  var uid = localStorage.getItem("uid");
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
  for (var i = 0; i < userarray.length; i++) {
    var user = userarray[i];
    console.log(uid);
    if (user.uid == uid  || edited==true) {
      console.log("conndition matched");
      card.innerHTML += CreateUI_profile(user.name, user.about, user.image, user.uid);
    }
  }
  console.log(userarray);



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
      feedbck.innerHTML += createUI(blog.title, blog.desc, blog.image, blog.uid, blog.blogId, UserImage.image,UserImage.name);
      title_top.innerHTML = `${UserImage.name}`;

    }
  }
});
function createUI(title, description, image, uid, unID, UserImage, username) {
  var length = description.length;
  var uniqueId = unID; // Unique ID for each card
  console.log(unID);
  // if (length > 100) {
  //   var des = description.slice(0, 100);
  //   var des2 = description.slice(100, length);
  // } else {
  //   var des = description;
  //   var des2 = "";
  // }


  var UI = `
    <div class="post-box tech">
    <img src="${image}" alt="" class="post-img">
    
    <a href="#" class="post-title">${title}</a>
    
    <p class="post-description">${description}</p>
    <div class="profile">
        <img src=${UserImage} alt="" class="profile-img">
        <span class="profile-name">${username}</span>
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
      card.innerHTML="";
      console.log("yes");

      // Get a reference to the document
      const docRef = doc.ref;

      // Update the document data
      await updateDoc(docRef, {
        name: name_profile.value,
        about: about_profile.value,
        imageURL: imageURL,
        edited:true,
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

function CreateUI_profile(name, bio, image, uid) {
  var ui = `
  <button class="mail ">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
</button>
<div class="profile-pic">
  <img src=${image} alt="">

</div>
<div class="bottom ">
  <div class="content">
      <span class="name">${name}</span>
      <span class="about-me">${bio}</span>
  </div>
 <div class="bottom-bottom">
  <div class="social-links-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.999" viewBox="0 0 16 15.999">
          <path id="Subtraction_4" data-name="Subtraction 4" d="M6-582H-2a4,4,0,0,1-4-4v-8a4,4,0,0,1,4-4H6a4,4,0,0,1,4,4v8A4,4,0,0,1,6-582ZM2-594a4,4,0,0,0-4,4,4,4,0,0,0,4,4,4,4,0,0,0,4-4A4.005,4.005,0,0,0,2-594Zm4.5-2a1,1,0,0,0-1,1,1,1,0,0,0,1,1,1,1,0,0,0,1-1A1,1,0,0,0,6.5-596ZM2-587.5A2.5,2.5,0,0,1-.5-590,2.5,2.5,0,0,1,2-592.5,2.5,2.5,0,0,1,4.5-590,2.5,2.5,0,0,1,2-587.5Z" transform="translate(6 598)"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
        
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>

  </div>
  <button class="button" data-bs-toggle="modal" data-bs-target="#myModal"><i class="fa-solid fa-edit"></i></button>
 </div>
</div>
  `
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
