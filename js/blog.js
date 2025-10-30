class BlogSystem {
    constructor() {
        this.blogPostsContainer = document.getElementById('blog-posts');
        this.posts = this.loadPosts();
        this.renderBlog();
    }

    loadPosts() {
        const posts = localStorage.getItem('blogPosts');
        return posts ? JSON.parse(posts) : [];
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    addPost(title, content, date = new Date().toLocaleDateString()) {
        const post = {
            id: Date.now(),
            title,
            content,
            date
        };
        this.posts.unshift(post);
        this.savePosts();
        this.renderBlog();
    }

    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== id);
        this.savePosts();
        this.renderBlog();
    }

    renderBlog() {
        this.blogPostsContainer.innerHTML = '';
        this.posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            article.innerHTML = `
                <h3>${post.title}</h3>
                <p class="post-date">${post.date}</p>
                <p>${post.content}</p>
                <button class="delete-btn" data-id="${post.id}" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; display: none;">Delete</button>
            `;
            this.blogPostsContainer.appendChild(article);
        });
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogSystem = new BlogSystem();
});
