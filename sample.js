document.addEventListener('DOMContentLoaded', function () {
    // Fetch admin posts
    const adminPosts = JSON.parse(localStorage.getItem('adminPosts') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const adminPostsGrid = document.getElementById('adminPostsGrid');
    
    // Render Admin Featured Posts
    if (adminPosts.length > 0) {
        const adminPostsContainer = document.querySelector('.admin-featured-posts');
        if (adminPostsContainer) {
            adminPostsContainer.style.display = 'block';
            adminPostsGrid.innerHTML = adminPosts.slice(0, 6).map(post => {
                const author = allUsers.find(u => u.id === post.authorId);
                const authorName = author ? author.name : 'Admin';
                return `
                    <div class="admin-post-card">
                        <div class="admin-post-header">
                            <h3>${post.title}</h3>
                            <div class="admin-post-meta">
                                <span>👤 ${authorName}</span>
                                <span>📅 ${new Date(post.date).toLocaleDateString()}</span>
                                <span class="admin-badge">ADMIN POST</span>
                            </div>
                        </div>
                        <div class="admin-post-body">
                            <p>${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
                        </div>
                        <div class="admin-post-footer">
                            <span>Featured Content from Administration</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } else {
        // Hide admin posts section if no posts
        const adminPostsContainer = document.querySelector('.admin-featured-posts');
        if (adminPostsContainer) {
            adminPostsContainer.style.display = 'none';
        }
    }
    
    // Fetch website posts
    const posts = JSON.parse(localStorage.getItem('ideaMeshPosts') || '[]');
    const container = document.querySelector('section.content');
    const searchInput = document.querySelector('input[type="search"]');
    let allPosts = [];
    if (!posts.length) {
        const empty = document.createElement('div');
        empty.className = 'no-posts';
        empty.textContent = 'No posts available.';
        container.appendChild(empty);
        return;
    }
    allPosts = posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    function renderPosts(postsToShow) {
        container.innerHTML = '';
        if (!postsToShow.length) {
            const empty = document.createElement('div');
            empty.className = 'no-posts';
            empty.textContent = 'No matching posts found.';
            container.appendChild(empty);
            return;
        }
        postsToShow.forEach(function (post) {
            const wrapper = document.createElement('div');
            wrapper.style.cursor = 'pointer';
            wrapper.style.position = 'relative';
            const iframe = document.createElement('iframe');
            iframe.scrolling = 'no';
            if (post.imageData) {
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;}body{font-family:Arial,sans-serif;background:#f9f9f9;color:#111;box-sizing:border-box;text-align:center;overflow:hidden;width:100%;height:100%;}h3{margin:0 0 0.5rem;font-size:1rem;} img{max-width:100%;height:auto;display:block;margin:0 auto;border-radius:8px;padding:12px;}</style></head><body><h3>${escapeHtml(post.title)}</h3><img src="${post.imageData}" alt="${escapeHtml(post.title)}" /></body></html>`;
                iframe.srcdoc = html;
            } else {
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;}body{font-family:Arial,sans-serif;background:#d0d0d0;color:#111;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden;}h3{margin:0;font-size:1.1rem;text-align:center;}</style></head><body><h3>${escapeHtml(post.title)}</h3></body></html>`;
                iframe.srcdoc = html;
            }
            iframe.addEventListener('load', function () {
                iframe.style.height = '320px';
            });
            iframe.style.pointerEvents = 'none';
            wrapper.appendChild(iframe);
            wrapper.addEventListener('click', function () {
                window.location.href = `7viewpost.html?postId=${post.id}`;
            });
            container.appendChild(wrapper);
        });
    }

    renderPosts(allPosts);

    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.toLowerCase();
        const filteredPosts = allPosts.filter(post => post.title.toLowerCase().includes(searchValue));
        renderPosts(filteredPosts);
    });

    // Avatar hover effect
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const avatar = document.querySelector('.avatar-text');
    if (avatar) {
        if (currentUser) {
            const initial = currentUser.fullName.charAt(0).toUpperCase();
            avatar.textContent = initial;
            avatar.addEventListener('mouseover', function() {
                this.textContent = currentUser.fullName;
            });
            avatar.addEventListener('mouseout', function() {
                this.textContent = initial;
            });
        } else {
            // Default if no user
            avatar.textContent = 'U';
            avatar.addEventListener('mouseover', function() {
                this.textContent = 'User';
            });
            avatar.addEventListener('mouseout', function() {
                this.textContent = 'U';
            });
        }
    }
});

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function sendMessage(event) {
    event.preventDefault();
    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const messageTextarea = document.querySelector('textarea');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageTextarea.value.trim();

    if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
        alert('Please enter a valid name (only alphabets and spaces).');
        nameInput.focus();
        return;
    }

    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    if (!message) {
        alert('Please enter your message.');
        messageTextarea.focus();
        return;
    }

    // Simulate sending the message
    alert('Message sent successfully!');
    // Reset the form
    nameInput.value = '';
    emailInput.value = '';
    messageTextarea.value = '';
}