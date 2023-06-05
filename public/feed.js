// This loads the username into the corner of the page
window.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('username');
    if(user) {
        let elem = document.querySelector('#userInfo');
        elem.textContent = user;
        elem.style.fontSize = "15px";
        elem.style.height = 'auto';
    }
    else {
        window.location.replace('index.html');
    }

    // Fill the feed with all the posts
    fillFeed()
    // Display the quote as well
    getQuote();
});
 
async function fillFeed() {
    // Grab the data
    const response = await fetch('/api/feed/posts');
    const store = await response.json();

    // Go through each post and make its html element
    for(const post of store) {
        rehydratePost(post, store.length);
    }
}

function getQuote() {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        // Get the content element
        const quoteItself = document.getElementById('thequote');
        // Get the author element
        const author = document.getElementById('author');
        // Set the two things now
        quoteItself.textContent = data.content;
        author.textContent = data.author;
      });
}

// This is the actual function that we will be using to puff up the posts
async function rehydratePost(post, length) {
    // Get the root user likes array to compare
    const username = localStorage.getItem('username');
    const response = await fetch(`/api/feed/${username}`);
    const likes = await response.json();

    // First we need to make the element that we are going to add to the DOM
    const newElement = document.createElement('div');

    // Next we find the feed field to add the post to
    const feed = document.querySelector('#feedfield');
 
    // Now we can add the right class to the element
    newElement.classList.add('post');

    // Now we can insert all of the different parts of it
        // Top matter
        const newTop = document.createElement('div');
        newTop.classList.add('topMatter');

            // User
            const user = document.createElement('p');
            user.textContent = post.user;
            user.classList.add('user');

            // Time Stamp
            const timeStamp = document.createElement('p');

                // Date
                const date = document.createTextNode(`${getDate(new Date(post.time))}`);
                
                // Break
                const lineBreak = document.createElement('br');
                
                // Time
                const time = document.createTextNode(`${getTime(new Date(post.time))}`);
            
            timeStamp.appendChild(date);
            timeStamp.appendChild(lineBreak);
            timeStamp.appendChild(time);
            timeStamp.classList.add('timestamp');
           
            // Buttons
            const buttons = document.createElement('div');
            buttons.classList.add('buttons');
                
                // Like button
                const like = document.createElement('button');
                    //Add class
                    like.classList.add('like');
                    // Add id
                    like.setAttribute('id', `like${length - post.place - 1}`);
                    // If the post is liked
                    if(likes.includes(post.place)) {
                        // Add on click
                        like.setAttribute('onclick', `offLike(${length - post.place - 1})`);
                        // Add color
                        like.style.backgroundColor = 'rgb(41, 195, 246)';
                    }
                    else {
                        // Add on click
                        like.setAttribute('onclick', `onLike(${length - post.place - 1})`);
                    }
                    // Add text
                    like.textContent = 'Like';

                buttons.appendChild(like);

         newTop.appendChild(user);
        newTop.appendChild(timeStamp);
        newTop.appendChild(buttons);

        // Bottom Matter
        const newBottom = document.createElement('div');
        newBottom.classList.add('bottomMatter');

            // Title
            const title = document.createElement('b');
            title.textContent = post.title;
            title.classList.add('title');

            // Thoughts
            const thoughts = document.createElement('p');
            thoughts.textContent = post.content;
            thoughts.classList.add('thoughts');

        newBottom.appendChild(title);
        newBottom.appendChild(thoughts);

    // And finally we add that all to the post div
    newElement.appendChild(newTop);
    newElement.appendChild(newBottom);

    // And to finish we add that to the feed field
    feed.appendChild(newElement);
}

// This is to get the post's date and change it into a string
function getDate(time) {
    let value = '';
    let month = time.getMonth() + 1;
    value += month;
    value += '/';
    value += time.getDate();
    value += '/';
    value += time.getFullYear();
    return value;
}

// This is a function just to take a post's time and change it into a string that we like
function getTime(time) {
    let bool = false;
    let value = '';
    let hour = time.getHours();
    if(hour > 12) {
        hour = hour - 12;
        value += hour;
        bool = true;
    }
    else {
        value += hour;
    }
    value += ':';
    if(time.getMinutes() < 10) {
        value += 0;
    }
    value += time.getMinutes();
    value += ' ';
    if(bool) {
        value += 'pm';
    }
    else {
        value += 'am';
    }
    return value;
}

// This takes us back to the login page if we click on the username
function backToLogin() {
    localStorage.removeItem('username');
    window.location.replace('index.html');
};

function getRootUser() {
    // Get the username
    const username = localStorage.getItem('username');
    // Get the array of the user objects
    const userData = JSON.parse(localStorage.getItem('userData'));
    // Find the username in the list of userData and return that object

    return userData.find(obj => obj.name === username);
}

// This allows us to add more posts to our local storage
async function addPost() {

    // Let's get the root user to add the post to his posts
    // const rootUser = getRootUser();

    // Also get the length of the root users posts array to set that in the object
    // const rootLength = rootUser.posts.length;

    // Make an object to hold that place in the user's posts and the place in the overall posts
    // const rootObj = new Object();

    // Add the rootLength place
    // rootObj.myPlace = rootLength;

    // Let's get what we need from the form
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    // Pull the posts array out of storage to update it
    // let store = JSON.parse(localStorage.getItem('posts'));
    // if(!store) {
    //     localStorage.setItem('posts', JSON.stringify([]));
    //     store = JSON.parse(localStorage.getItem('posts'));
    // }

    // Let's make an object to hold all this info
    let obj = new Object;
    obj.title = title;
    obj.content = content;
    obj.user = localStorage.getItem('username');
    obj.time = new Date();
    // obj.place = store.length;
    obj.likes = 0;

    // Maybe I'll put this in at a later date
    // obj.comments = [];

    // Add the overall place to the rootObj
    // rootObj.allPlace = store.length;

    // Add the rootObj to the root users posts
    // rootUser.posts.push(rootObj);

    // Replace the root user in the userData array
    // const userData = JSON.parse(localStorage.getItem('userData'));
    // userData[rootUser.num] = rootUser;
    // localStorage.setItem('userData', JSON.stringify(userData));

    // Now we can actually store the data
    // store.unshift(obj);
    // localStorage.setItem('posts', JSON.stringify(store));
    
    await fetch(`/api/feed/post/${obj.user}`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),
    });
}

function enablePost() {
    if(document.getElementById('postTitle').value.length > 0 && document.getElementById('postContent').value.length > 0) {
        document.getElementById('postIt').disabled = false;
    }
    else {
        document.getElementById('postIt').disabled = true;
    }
}

// Turns a like on
async function onLike(likeNum) {
    // Update the post and the user's likes array
    const response = await fetch(`/api/feed/${localStorage.getItem('username')}/like/${likeNum}`, {
        method: 'POST',
        headers: {'content-type': 'application:json'},
    });

    // Get the posts array
    // const posts = JSON.parse(localStorage.getItem('posts'));

    // Now we can update the likes counter of the post
    // posts[likeNum].likes += 1;

    // Get the root user
    // const rootUser = getRootUser();

    // Update their likes array
    // rootUser.likes.push(posts[likeNum].place);

    // Restore everything in the local storage
    // const userData = JSON.parse(localStorage.getItem('userData'));
    // userData[rootUser.num] = rootUser;
    // localStorage.setItem('userData', JSON.stringify(userData));

    // localStorage.setItem('posts', JSON.stringify(posts));

    // Change the button color
    const like = document.getElementById(`like${likeNum}`);
    like.style.backgroundColor = 'rgb(41, 195, 246)';

    // Change the button onclick to be offlike
    like.setAttribute('onclick', `offLike(${likeNum})`);
    
}
// Turns a like off
async function offLike(likeNum) {
        // Update the post and the user's likes array
        const response = await fetch(`/api/feed/${localStorage.getItem('username')}/dislike/${likeNum}`, {
            method: 'POST',
            headers: {'content-type': 'application:json'},
        });

        // Get the posts array
        // const posts = JSON.parse(localStorage.getItem('posts'));

        // Now we can update the likes counter of the post
        // posts[likeNum].likes -= 1;
    
        // Get the root user
        // const rootUser = getRootUser();
    
        // Update their likes array
        // rootUser.likes = rootUser.likes.filter(item => item !== posts[likeNum].place);
    
        // Restore everything in the local storage
        // const userData = JSON.parse(localStorage.getItem('userData'));
        // userData[rootUser.num] = rootUser;
        // localStorage.setItem('userData', JSON.stringify(userData));
    
        // localStorage.setItem('posts', JSON.stringify(posts));

        // Change the button color
        const like = document.getElementById(`like${likeNum}`);
        like.style.backgroundColor = 'purple';

        // Change the button onclick to be onlike
        like.setAttribute('onclick', `onLike(${likeNum})`);
}

function closeTop() {
    // Get the elements to change
    let top = document.getElementById('quoteAndNew');
    
    // Make it disappear
    top.style.display = 'none';

    // Put in the new function
    const bars = document.getElementById('bars');
    bars.setAttribute('onclick', `openTop()`);
}

function openTop() {
    // Get the element
    let top = document.getElementById('quoteAndNew');
    // Make it appear
    top.style.display = 'flex';
    // Put in the new function
    const bars = document.getElementById('bars');
    bars.setAttribute('onclick', `closeTop()`);
}