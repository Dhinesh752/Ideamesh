document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.post-container');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('postId'));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const posts = JSON.parse(localStorage.getItem('ideaMeshPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    const isOwner = currentUser && post && currentUser.email === post.authorEmail;
    
    if (!post) {
        container.innerHTML = '<p style="text-align:center; padding:20px; font-size:18px;">Post not found.</p>';
        return;
    }
    
    const actionButtons = isOwner ? `
        <div class="post-actions">
            <button id="editPostBtn" class="action-button edit-button">Edit</button>
            <button id="deletePostBtn" class="action-button delete-button">Delete</button>
        </div>
    ` : '';
    
    const postHtml = `
        <div class="post-detail">
            <div class="post-header">
                <h1>${escapeHtml(post.title)}</h1>
                <div class="post-meta">
                    <span class="category">${escapeHtml(post.category)}</span>
                    <span class="date">Posted: ${new Date(post.createdAt).toLocaleString()}</span>
                    ${post.authorName ? `<span class="author">By: ${escapeHtml(post.authorName)}</span>` : ''}
                </div>
                ${actionButtons}
            </div>
            ${post.imageData ? `<div class="post-image"><img src="${post.imageData}" alt="${escapeHtml(post.title)}" /></div>` : ''}
            ${post.documentData ? `<div class="post-document"><a href="${post.documentData}" download="${escapeHtml(post.title)}.${getFileExtension(post.documentData)}">📄 Download Document</a></div>` : ''}
            <div class="post-content">
                ${post.content ? `<p>${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>` : '<p style="color:#999;">No description provided.</p>'}
            </div>
            <div class="comments-section">
                <h2>Comments</h2>
                <form id="commentForm" class="comment-form">
                    <textarea id="commentText" placeholder="Write a comment..." required></textarea>
                    <button type="submit">Post Comment</button>
                </form>
                <div id="commentsList" class="comments-list"></div>
            </div>
        </div>
    `;
    
    container.innerHTML = postHtml;
    
    if (isOwner) {
        document.getElementById('editPostBtn').addEventListener('click', function () {
            window.location.href = `6editpost.html?postId=${postId}`;
        });

        document.getElementById('deletePostBtn').addEventListener('click', function () {
            if (!confirm('Are you sure you want to delete this post?')) return;
            const updatedPosts = posts.filter(p => p.id !== postId);
            localStorage.setItem('ideaMeshPosts', JSON.stringify(updatedPosts));
            localStorage.removeItem(`comments_${postId}`);
            alert('Post deleted successfully.');
            window.location.href = '3home.html';
        });
    }
    
    function getFileExtension(dataUrl) {
        const mimeType = dataUrl.split(';')[0].split(':')[1];
        const extensions = {
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'text/plain': 'txt',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
        };
        return extensions[mimeType] || 'file';
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        comments.forEach(function (comment) {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-author">${escapeHtml(comment.author || 'Anonymous')}</div>
                <div class="comment-date">${new Date(comment.createdAt).toLocaleString()}</div>
                <div class="comment-text">${escapeHtml(comment.text).replace(/\n/g, '<br>')}</div>
            `;
            commentsList.appendChild(commentEl);
        });
    }
    
    loadComments();
    
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const commentText = document.getElementById('commentText').value.trim();
        if (!commentText) return;
        
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
        const newComment = {
            author: currentUser ? currentUser.fullName : 'Anonymous',
            text: commentText,
            createdAt: new Date().toISOString()
        };
        comments.push(newComment);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
        
        document.getElementById('commentText').value = '';
        loadComments();
    });

    // Avatar hover effect
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
