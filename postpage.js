import {
    getFirestore,
    collection,
    getDocs,
    db,
} from "./firbase.js";


function backbtn() {
    window.location.href = "dashboard.html";
}

window.backbtn = backbtn;


var blogerId = localStorage.getItem("blogId");
console.log(blogerId);


window.onload = async function () {
    
    
    var content = document.getElementById("content");
    console.log("postpage");

    var name;
    var blgerUID;
    var authname, authimage;
    var userarray = [];
    console.log(blogerId);
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
    console.log(BlogArr);
    for (var i = 0; i < BlogArr.length; i++) {
        console.log("BlogID Isent", blogerId);
      var blog = BlogArr[i];
      if (blog.blogId == blogerId) {
        console.log(blog);
        var title = blog.title;
        var image = blog.image;
        var author = authname;
        var timestamp = blog.timestamp;
        var description = blog.desc;
        blgerUID = blog.uid;
        break;
      }
    }
    console.log(blgerUID,"blgerUID");
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
        if (user.uid == blgerUID) {
            // console.log(user.uid);
            authname = user.name;
            authimage= user.Authorimage;
            break;
        }
    }

    content.innerHTML += PostpageUI(
        title,
        image,
        authname,
        timestamp,
        description
      );

    localStorage.deleteItem("blogId");

}


function PostpageUI(title, image, author, timestamp, description) {
    console.log("postpageUI");
    var UI = `
    <div id="post-image">
        <img src=${image} alt="">
    </div>
    <div id="post-title">
        <h1>${title}</h1>
        <p>Author : ${author}</p>
    </div>
    <div id="post-content">
        <p>${description}</p>
    </div>
    <div class="post-footer">
    <div class="post-footer-left">
        <div class="post-footer-left-item">
            <i class="fa-solid fa-heart"></i>
            <span>Like</span>
        </div>
        <div class="post-footer-left-item">
            <i class="fa-solid fa-comment"></i>
            <span>Comment</span>
        </div>
        <div class="post-footer-left-item">
            <i class="fa-solid fa-share"></i>
            <span>Share</span>
        </div>
    </div>
    <div class="post-footer-right">
        <div class="post-footer-right-item">
            <i class="fa-solid fa-bookmark"></i>
            <span>Save</span>
        </div>
    </div>
</div>`
    return UI;
}


