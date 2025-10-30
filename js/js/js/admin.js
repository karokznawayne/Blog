const DEFAULT_PASSWORD = 'admin123'; // Change this!

function adminLogin() {
    const password = document.getElementById('admin-password').value;
    const storedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;

    if (password === storedPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        sessionStorage.setItem('adminLoggedIn', 'true');
        loadAdminData();
    } else {
        document.getElementById('login-error').textContent = 'Invalid password!';
        document.getElementById('login-error').style.display = 'block';
    }
}

function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-password').value = '';
    document.getElementById('login-error').style.display = 'none';
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function addNewTrack() {
    const name = document.getElementById('track-name-input').value;
    const artist = document.getElementById('track-artist-input').value;
    const src = document.getElementById('track-src-input').value;
    const image = document.getElementById('track-image-input').value;

    if (!name || !artist || !src || !image) {
        alert('Please fill all fields!');
        return;
    }

    let tracks = JSON.parse(localStorage.getItem('musicTracks')) || [];
    tracks.push({
        id: Date.now(),
        name,
        artist,
        src,
        image
    });

    localStorage.setItem('musicTracks', JSON.stringify(tracks));
    alert('Track added successfully!');
    document.getElementById('track-name-input').value = '';
    document.getElementById('track-artist-input').value = '';
    document.getElementById('track-src-input').value = '';
    document.getElementById('track-image-input').value = '';

    loadAdminData();
}

function deleteTrack(id) {
    if (confirm('Delete this track?')) {
        let tracks = JSON.parse(localStorage.getItem('musicTracks')) || [];
        tracks = tracks.filter(track => track.id !== id);
        localStorage.setItem('musicTracks', JSON.stringify(tracks));
        loadAdminData();
    }
}

function addNewBlogPost() {
    const title = document.getElementById('blog-title-input').value;
    const content = document.getElementById('blog-content-input').value;

    if (!title || !content) {
        alert('Please fill all fields!');
        return;
    }

    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.unshift({
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('blogPosts', JSON.stringify(posts));
    alert('Blog post published successfully!');
    document.getElementById('blog-title-input').value = '';
    document.getElementById('blog-content-input').value = '';

    loadAdminData();
}

function deleteBlogPost(id) {
    if (confirm('Delete this post?')) {
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadAdminData();
    }
}

function changePassword() {
    const newPassword = document.getElementById('new-password-input').value;
    if (!newPassword) {
        alert('Please enter a new password!');
        return;
    }
    localStorage.setItem('adminPassword', newPassword);
    alert('Password changed successfully!');
    document.getElementById('new-password-input').value = '';
}

function saveSiteSettings() {
    const siteTitle = document.getElementById('site-title-input').value;
    if (siteTitle) {
        localStorage.setItem('siteTitle', siteTitle);
        document.title = siteTitle;
        alert('Settings saved!');
    }
}

function clearAllData() {
    if (confirm('This will delete ALL data! Are you sure?')) {
        localStorage.clear();
        alert('All data cleared!');
        location.reload();
    }
}

function loadAdminData() {
    // Load tracks
    const tracks = JSON.parse(localStorage.getItem('musicTracks')) || [];
    const tracksList = document.getElementById('admin-tracks-list');
    tracksList.innerHTML = '';
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${track.name}</strong> - ${track.artist}
            <button onclick="deleteTrack(${track.id})" style="margin-left: 1rem; background: #e74c3c; color: white; border: none; padding: 0.5rem; cursor: pointer;">Delete</button>
        `;
        tracksList.appendChild(li);
    });

    // Load blog posts
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const blogList = document.getElementById('admin-blog-list');
    blogList.innerHTML = '';
    posts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${post.title}</strong> (${post.date})
            <button onclick="deleteBlogPost(${post.id})" style="margin-left: 1rem; background: #e74c3c; color: white; border: none; padding: 0.5rem; cursor: pointer;">Delete</button>
        `;
        blogList.appendChild(li);
    });
}

// Check if already logged in
window.addEventListener('load', () => {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminData();
    }
});
