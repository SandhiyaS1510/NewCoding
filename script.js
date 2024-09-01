let currentUser = null;

document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('postForm').addEventListener('submit', createPost);

function showRegisterPage() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('feedPage').style.display = 'none';
}

function showLoginPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('feedPage').style.display = 'none';
}

function showFeedPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('feedPage').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
    loadFeed();
}

function goBack() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('feedPage').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
}

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert(data.message);
            showLoginPage();
        } else {
            alert(data.message || 'Registration failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User logged in successfully') {
            alert(data.message);
            currentUser = data.user;
            showFeedPage();
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

function createPost(event) {
    event.preventDefault();
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').files[0];

    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);
    formData.append('userId', currentUser.id);

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Post uploaded successfully') {
            alert(data.message);
            loadFeed();
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = '';
        } else {
            alert(data.message || 'Post creation failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadFeed() {
    fetch('http://localhost:3000/feed')
    .then(response => response.json())
    .then(posts => {
        const feedElement = document.getElementById('feed');
        feedElement.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p>${post.content}</p>
                <img src="${post.imageUrl}" alt="Post Image">
                <p>Likes: ${post.likes}</p>
                <p>Comments: ${post.comments}</p>
                <button onclick="likePost(${post.id})">Like</button>
                <button onclick="showEditForm(${post.id}, '${post.content}')">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
                <div id="comments-${post.id}">
                    <form onsubmit="addComment(event, ${post.id})">
                        <input type="text" placeholder="Add a comment" required>
                        <button type="submit">Comment</button>
                    </form>
                </div>
            `;
            if (post.Comments && post.Comments.length > 0) {
                post.Comments.forEach(comment => {
                    const commentElement = document.createElement('p');
                    commentElement.innerText = `${comment.User.username}: ${comment.content}`;
                    postElement.querySelector(`#comments-${post.id}`).appendChild(commentElement);
                });
            }
            feedElement.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error:', error));
}

function likePost(postId) {
    fetch(`http://localhost:3000/posts/${postId}/like`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Post liked') {
            alert(data.message);
            loadFeed();
        } else {
            alert(data.message || 'Failed to like post');
        }
    })
    .catch(error => console.error('Error:', error));
}

function addComment(event, postId) {
    event.preventDefault();
    const content = event.target.querySelector('input').value;

    fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, userId: currentUser.id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Comment added') {
            alert(data.message);
            loadFeed();
        } else {
            alert(data.message || 'Failed to add comment');
        }
    })
    .catch(error => console.error('Error:', error));
}

function showEditForm(postId, content) {
    const newContent = prompt('Edit your post:', content);
    if (newContent !== null) {
        editPost(postId, newContent);
    }
}

function editPost(postId, content) {
    fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Post updated successfully') {
            alert(data.message);
            loadFeed();
        } else {
            alert(data.message || 'Failed to update post');
        }
    })
    .catch(error => console.error('Error:', error));
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Post deleted successfully') {
                alert(data.message);
                loadFeed();
            } else {
                alert(data.message || 'Failed to delete post');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}