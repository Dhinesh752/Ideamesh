// admin.js - Admin Panel Logic for CRUD Users/Posts + Auth

// Admin credentials with security question
let ADMIN_CREDENTIALS = JSON.parse(localStorage.getItem('adminCredentials')) || { 
  username: 'admin', 
  password: 'admin123',
  securityQuestion: 'What is your favorite color?',
  securityAnswer: 'blue'
};

// Fetch actual website users and posts
let allUsers = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
let websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
let categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [
  { id: 1, name: 'Coder', description: 'Innovative Idea of Software/Web Developments.' },
  { id: 2, name: 'Designer', description: 'New creation of user experience, UI / UX design.' },
  { id: 3, name: 'Music', description: 'New composition, production & performance of music.' },
  { id: 4, name: 'Art', description: 'Creative expression through various mediums.' },
  { id: 5, name: 'Data Analyst', description: 'Talent of collect, clean & interpret data.' },
  { id: 6, name: 'DevOps', description: 'Bridge gap between Deployment & operations.' },
  { id: 7, name: 'Networking', description: 'Innovative approaches to networking.' },
  { id: 8, name: 'Cyber Tech', description: 'Innovative approaches to cybersecurity.' },
  { id: 9, name: 'AI / ML', description: 'Creative researches and prediction automation.' },
  { id: 10, name: 'Digital marketing', description: 'Strategies for promoting products through digital channels.' },
  { id: 11, name: 'Cloud Tech', description: 'Cloud computing services and solutions.' },
  { id: 12, name: 'Testing', description: 'Process of evaluating software functionality.' }
];

// Save to localStorage
function saveData() {
  localStorage.setItem('adminPosts', JSON.stringify(posts));
  localStorage.setItem('ideaMeshPosts', JSON.stringify(websitePosts));
  localStorage.setItem('ideaMeshCategories', JSON.stringify(categories));
  localStorage.setItem('adminCredentials', JSON.stringify(ADMIN_CREDENTIALS));
  // Note: allUsers are fetched from 'users' key, not saved by admin
}

// Auth
let isAuthenticated = localStorage.getItem('adminAuth') === 'true';

function login(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    isAuthenticated = true;
    localStorage.setItem('adminAuth', 'true');
    document.getElementById('loginModal').style.display = 'none';
    document.querySelector('.admin-wrapper').style.display = 'flex';
    updateStats();
    renderUsers();
    renderPosts();
    return true;
  }
  alert('Invalid credentials');
  return false;
}

function logout() {
  isAuthenticated = false;
  localStorage.removeItem('adminAuth');
  document.querySelector('.admin-wrapper').style.display = 'none';
  document.getElementById('loginModal').style.display = 'block';
}

// Change Admin Credentials
function changeAdminCredentials() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;

  // Verify current password
  if (currentPassword !== ADMIN_CREDENTIALS.password) {
    alert('Current password is incorrect!');
    return;
  }

  // Validate new credentials
  if (newUsername.trim() === '') {
    alert('Username cannot be empty!');
    return;
  }

  if (newPassword.length < 6) {
    alert('Password must be at least 6 characters long!');
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Update credentials
  ADMIN_CREDENTIALS.username = newUsername;
  ADMIN_CREDENTIALS.password = newPassword;
  saveData();

  alert('Admin credentials updated successfully!');
  hideModal('changeCredentialsModal');
  document.getElementById('changeCredentialsModal').querySelector('form').reset();
}

// Verify admin identity for password recovery
function verifyAdminIdentity() {
  const answer = document.getElementById('adminSecurityAnswer').value.toLowerCase().trim();
  
  if (answer === ADMIN_CREDENTIALS.securityAnswer.toLowerCase()) {
    document.getElementById('adminVerifySection').style.display = 'none';
    document.getElementById('adminResetSection').style.display = 'block';
  } else {
    alert('Incorrect security answer. Try again!');
    document.getElementById('adminSecurityAnswer').value = '';
  }
}

// Reset admin password
function resetAdminPassword() {
  const newPassword = document.getElementById('adminNewPassword').value;
  const confirmPassword = document.getElementById('adminConfirmPassword').value;

  if (newPassword.length < 6) {
    alert('Password must be at least 6 characters long!');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  ADMIN_CREDENTIALS.password = newPassword;
  saveData();

  alert('Password reset successfully! Please login with your new password.');
  hideModal('adminForgotModal');
  document.getElementById('adminVerifySection').style.display = 'block';
  document.getElementById('adminResetSection').style.display = 'none';
  document.getElementById('adminForgotModal').querySelector('form') && document.getElementById('adminForgotModal').querySelector('form').reset();
  document.getElementById('adminSecurityAnswer').value = '';
  document.getElementById('adminNewPassword').value = '';
  document.getElementById('adminConfirmPassword').value = '';
}

// CRUD Admin Accounts (separate from website users)
function createUser(name, email, role) {
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const newUser = { 
    id: Date.now(), 
    name, 
    email, 
    role, 
    posts: [],
    createdAt: new Date().toISOString()
  };
  
  adminAccounts.push(newUser);
  localStorage.setItem(adminAccountsKey, JSON.stringify(adminAccounts));
  renderUsers();
  updateStats();
}

function updateUser(id, updates) {
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const user = adminAccounts.find(u => u.id === id);
  if (user) {
    Object.assign(user, updates);
    localStorage.setItem(adminAccountsKey, JSON.stringify(adminAccounts));
    renderUsers();
    updateStats();
  }
}

function deleteUser(id) {
  if (confirm('Delete this admin account?')) {
    const adminAccountsKey = 'adminAccounts';
    const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
    
    const filtered = adminAccounts.filter(u => u.id !== id);
    localStorage.setItem(adminAccountsKey, JSON.stringify(filtered));
    renderUsers();
    updateStats();
  }
}

// CRUD Posts (Admin-created posts)
function createPost(title, content, authorId) {
  // Fetch fresh data
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  
  const newPost = { id: Date.now(), title, content, authorId, date: new Date().toISOString() };
  posts.push(newPost);
  localStorage.setItem('adminPosts', JSON.stringify(posts));
  renderPosts();
  updateStats();
  alert('Post created successfully!');
}

function updatePost(id, updates) {
  // Fetch fresh data
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  
  const post = posts.find(p => p.id === id);
  if (post) {
    Object.assign(post, updates);
    localStorage.setItem('adminPosts', JSON.stringify(posts));
    renderPosts();
  }
}

function deletePost(id) {
  if (confirm('Delete post?')) {
    // Fetch fresh data
    posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
    
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('adminPosts', JSON.stringify(posts));
    renderPosts();
    updateStats();
    alert('Post deleted successfully!');
  }
}

// UI Updates
function updateStats() {
  // Fetch fresh data from localStorage
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || categories;
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  
  // Update stat cards
  document.getElementById('totalUsers').textContent = allUsers.length;
  document.getElementById('totalAdminPosts').textContent = posts.length;
  document.getElementById('totalWebsitePosts').textContent = websitePosts.length;
  document.getElementById('totalComments').textContent = 0;
  
  // Recent Activity - Show latest website posts
  const recentDiv = document.getElementById('recentActivity');
  const recentPosts = websitePosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  if (recentPosts.length === 0) {
    recentDiv.innerHTML = '<p style="color: #999;">No recent activity</p>';
  } else {
    recentDiv.innerHTML = recentPosts.map(p => {
      const user = allUsers.find(u => u.email === p.authorEmail);
      return `
        <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #019450, #74bfe2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0;">
            ${(user?.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <div style="flex: 1;">
            <strong>${p.title}</strong> by ${p.authorName} <br>
            <small style="color: #999;">${new Date(p.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderUsers() {
  // This section is for managing admin accounts only
  // Fetch admin-specific users if they exist, or show message
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const list = document.getElementById('userList');
  
  if (adminAccounts.length === 0) {
    list.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; color: #999;">
        <p>No admin accounts created yet. Use the form above to create one.</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = adminAccounts.map(user => `
    <div class="user-item">
      <h4>${user.name} (${user.role})</h4>
      <p>${user.email}</p>
      <button onclick="editUser(${user.id})">Edit</button>
      <button class="deleteBtn" onclick="deleteUser(${user.id})">Delete</button>
    </div>
  `).join('');
}

function renderPosts() {
  // Fetch fresh data
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const list = document.getElementById('postList');
  
  if (!posts.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No posts created yet. Create a new post using the button above.</p>';
    return;
  }
  
  list.innerHTML = posts.map(post => {
    const author = adminAccounts.find(u => u.id === post.authorId)?.name || 'Unknown';
    return `
      <div class="post-item">
        <h4>${post.title}</h4>
        <p>By: ${author} | ${new Date(post.date).toLocaleDateString()}</p>
        <p>${post.content.substring(0, 100)}...</p>
        <button class="edit-btn" onclick="editPost(${post.id})">✏️ Edit</button>
        <button class="deleteBtn" onclick="deletePost(${post.id})">🗑️ Delete</button>
      </div>
    `;
  }).join('');
}

function filterPosts(query) {
  // Fetch fresh data
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const searchTerm = query.toLowerCase();
  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm) || 
    p.content.toLowerCase().includes(searchTerm)
  );
  
  const list = document.getElementById('postList');
  
  if (!filtered.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No matching posts found</p>';
    return;
  }
  
  list.innerHTML = filtered.map(post => {
    const author = adminAccounts.find(u => u.id === post.authorId)?.name || 'Unknown';
    return `
      <div class="post-item">
        <h4>${post.title}</h4>
        <p>By: ${author} | ${new Date(post.date).toLocaleDateString()}</p>
        <p>${post.content.substring(0, 100)}...</p>
        <button class="edit-btn" onclick="editPost(${post.id})">✏️ Edit</button>
        <button class="deleteBtn" onclick="deletePost(${post.id})">🗑️ Delete</button>
      </div>
    `;
  }).join('');
}

// ===== USER PROFILES MANAGEMENT =====
function renderUserProfiles() {
  // Fetch fresh data from localStorage every time this is called
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const list = document.getElementById('userProfilesList');
  
  if (!allUsers.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center; grid-column: 1 / -1;">No registered users yet</p>';
    return;
  }
  
  list.innerHTML = allUsers.map(user => {
    const userPosts = websitePosts.filter(p => p.authorEmail === user.email);
    const initials = (user.fullName || user.email)
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `
      <div class="user-profile-card">
        <div class="profile-avatar">${initials}</div>
        <h4 style="margin: 0 0 5px 0;">${user.fullName}</h4>
        <div class="profile-info">
          <label>Email:</label>
          <span>${user.email}</span>
        </div>
        <div class="profile-info">
          <label>Date of Birth:</label>
          <span>${user.dob || 'Not provided'}</span>
        </div>
        <div class="profile-info">
          <label>Signup Method:</label>
          <span>${user.signupMethod === 'google' ? '🔵 Google' : '📧 Email'}</span>
        </div>
        <div class="profile-info">
          <label>Joined:</label>
          <span>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
        </div>
        <div class="profile-stats">
          <div class="stat">
            <div class="stat-number">${userPosts.length}</div>
            <div class="stat-label">Posts</div>
          </div>
          <div class="stat">
            <div class="stat-number">${user.createdAt ? '✓' : '?'}</div>
            <div class="stat-label">Status</div>
          </div>
        </div>
        <div class="action-buttons" style="margin-top: 15px;">
          <button class="edit-btn" onclick="viewUserPosts('${user.email}')">📄 View Posts</button>
          <button class="deleteBtn" onclick="deleteUserAccount('${user.email}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterUserProfiles(query) {
  // Fetch fresh data
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const searchTerm = query.toLowerCase();
  const filtered = allUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm) || 
    user.email.toLowerCase().includes(searchTerm)
  );
  
  const list = document.getElementById('userProfilesList');
  
  if (!filtered.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center; grid-column: 1 / -1;">No matching users found</p>';
    return;
  }
  
  list.innerHTML = filtered.map(user => {
    const userPosts = websitePosts.filter(p => p.authorEmail === user.email);
    const initials = (user.fullName || user.email)
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `
      <div class="user-profile-card">
        <div class="profile-avatar">${initials}</div>
        <h4 style="margin: 0 0 5px 0;">${user.fullName}</h4>
        <div class="profile-info">
          <label>Email:</label>
          <span>${user.email}</span>
        </div>
        <div class="profile-info">
          <label>Date of Birth:</label>
          <span>${user.dob || 'Not provided'}</span>
        </div>
        <div class="profile-info">
          <label>Signup Method:</label>
          <span>${user.signupMethod === 'google' ? '🔵 Google' : '📧 Email'}</span>
        </div>
        <div class="profile-info">
          <label>Joined:</label>
          <span>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
        </div>
        <div class="profile-stats">
          <div class="stat">
            <div class="stat-number">${userPosts.length}</div>
            <div class="stat-label">Posts</div>
          </div>
          <div class="stat">
            <div class="stat-number">${user.createdAt ? '✓' : '?'}</div>
            <div class="stat-label">Status</div>
          </div>
        </div>
        <div class="action-buttons" style="margin-top: 15px;">
          <button class="edit-btn" onclick="viewUserPosts('${user.email}')">📄 View Posts</button>
          <button class="deleteBtn" onclick="deleteUserAccount('${user.email}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function viewUserPosts(userEmail) {
  // Fetch fresh data
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  
  const userPosts = websitePosts.filter(p => p.authorEmail === userEmail);
  const user = allUsers.find(u => u.email === userEmail);
  
  if (!user) {
    alert('User not found');
    return;
  }
  
  if (userPosts.length === 0) {
    alert(`${user.fullName} has not posted anything yet.`);
    return;
  }
  
  let postsInfo = `📋 ${user.fullName}'s Posts (${userPosts.length} total)\n`;
  postsInfo += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  userPosts.forEach((post, index) => {
    postsInfo += `${index + 1}. 📝 ${post.title}\n`;
    postsInfo += `   Category: ${post.category}\n`;
    postsInfo += `   Posted: ${new Date(post.createdAt).toLocaleString()}\n`;
    postsInfo += `   Content: ${post.content.substring(0, 80)}${post.content.length > 80 ? '...' : ''}\n`;
    postsInfo += `   ID: ${post.id}\n`;
    postsInfo += `\n`;
  });
  
  alert(postsInfo);
}

function deleteUserAccount(userEmail) {
  // Fetch fresh data
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const user = allUsers.find(u => u.email === userEmail);
  if (!user) return;
  
  const userPosts = websitePosts.filter(p => p.authorEmail === userEmail);
  
  if (confirm(`Delete user "${user.fullName}" and their ${userPosts.length} posts?`)) {
    // Remove user
    allUsers = allUsers.filter(u => u.email !== userEmail);
    localStorage.setItem('users', JSON.stringify(allUsers));
    
    // Remove user's posts
    websitePosts = websitePosts.filter(p => p.authorEmail !== userEmail);
    saveData();
    
    renderUserProfiles();
    updateStats();
    alert('User account and all their posts deleted successfully!');
  }
}
function renderWebsitePosts() {
  // Fetch fresh data from localStorage
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || categories;
  
  const list = document.getElementById('websitePostList');
  const categoryFilter = document.getElementById('filterCategory');
  
  // Populate category filter
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.name;
    option.textContent = cat.name;
    categoryFilter.appendChild(option);
  });
  
  if (!websitePosts.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No posts available</p>';
    return;
  }
  
  const sortedPosts = websitePosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  list.innerHTML = sortedPosts.map(post => {
    const categoryClass = post.category || 'General';
    return `
      <div class="post-item">
        <h4>${post.title}</h4>
        <div style="margin: 10px 0;">
          <span class="post-badge">📁 ${categoryClass}</span>
          <span class="post-badge">👤 ${post.authorName}</span>
          <span class="post-badge">📧 ${post.authorEmail}</span>
          <span class="post-badge">📅 ${new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p>${post.content.substring(0, 150)}...</p>
        <div class="action-buttons">
          <button class="edit-btn" onclick="viewWebsitePostDetail('${post.id}')">👁️ View</button>
          <button class="deleteBtn" onclick="deleteWebsitePost('${post.id}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterWebsitePosts(query) {
  // Fetch fresh data
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const category = document.getElementById('filterCategory').value;
  const searchTerm = query.toLowerCase();
  
  let filtered = websitePosts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm) || 
                         p.content.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });
  
  const list = document.getElementById('websitePostList');
  if (!filtered.length) {
    list.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No matching posts found</p>';
    return;
  }
  
  const sortedPosts = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  list.innerHTML = sortedPosts.map(post => {
    const categoryClass = post.category || 'General';
    return `
      <div class="post-item">
        <h4>${post.title}</h4>
        <div style="margin: 10px 0;">
          <span class="post-badge">📁 ${categoryClass}</span>
          <span class="post-badge">👤 ${post.authorName}</span>
          <span class="post-badge">📧 ${post.authorEmail}</span>
          <span class="post-badge">📅 ${new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p>${post.content.substring(0, 150)}...</p>
        <div class="action-buttons">
          <button class="edit-btn" onclick="viewWebsitePostDetail('${post.id}')">👁️ View</button>
          <button class="deleteBtn" onclick="deleteWebsitePost('${post.id}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteWebsitePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    // Fetch fresh data
    websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
    
    // Remove the post
    websitePosts = websitePosts.filter(p => p.id != postId);
    localStorage.setItem('ideaMeshPosts', JSON.stringify(websitePosts));
    
    renderWebsitePosts();
    updateStats();
    alert('Post deleted successfully!');
  }
}

function viewWebsitePostDetail(postId) {
  // Fetch fresh data
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const post = websitePosts.find(p => p.id == postId);
  if (post) {
    alert(`Title: ${post.title}\nAuthor: ${post.authorName}\nAuthor Email: ${post.authorEmail}\nCategory: ${post.category}\nDate: ${new Date(post.createdAt).toLocaleString()}\n\nContent:\n${post.content}`);
  }
}

// ===== CATEGORY MANAGEMENT =====
function renderCategories() {
  // Fetch fresh data
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const list = document.getElementById('categoriesList');
  
  if (!categories.length) {
    list.innerHTML = '<p style="color: #999;">No categories available</p>';
    return;
  }
  
  list.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
      ${categories.map(cat => {
        const postsInCategory = websitePosts.filter(p => p.category === cat.name).length;
        return `
          <div class="category-box">
            <h4>${cat.name}</h4>
            <p style="margin: 5px 0; color: #666; font-size: 0.9rem;">${cat.description}</p>
            <div style="margin-top: 10px;">
              <span class="post-badge">📊 ${postsInCategory} posts</span>
            </div>
            <div class="action-buttons" style="margin-top: 10px;">
              <button class="edit-btn" onclick="editCategory('${cat.id}')">✏️ Edit</button>
              <button class="deleteBtn" onclick="deleteCategory('${cat.id}')">🗑️ Delete</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function addCategory() {
  // Fetch fresh data
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [];
  
  const name = document.getElementById('categoryName').value.trim();
  const description = document.getElementById('categoryDescription').value.trim();
  
  if (!name) {
    alert('Category name is required!');
    return;
  }
  
  if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    alert('Category already exists!');
    return;
  }
  
  const newCategory = {
    id: Date.now(),
    name: name,
    description: description
  };
  
  categories.push(newCategory);
  localStorage.setItem('ideaMeshCategories', JSON.stringify(categories));
  renderCategories();
  hideModal('addCategoryModal');
  document.getElementById('addCategoryModal').querySelector('form').reset();
  alert('Category added successfully!');
}

function deleteCategory(categoryId) {
  // Fetch fresh data
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  
  const category = categories.find(c => c.id == categoryId);
  if (!category) return;
  
  const postsCount = websitePosts.filter(p => p.category === category.name).length;
  if (postsCount > 0) {
    alert(`Cannot delete category with ${postsCount} posts. Please delete or reassign posts first.`);
    return;
  }
  
  if (confirm(`Delete category "${category.name}"?`)) {
    categories = categories.filter(c => c.id != categoryId);
    localStorage.setItem('ideaMeshCategories', JSON.stringify(categories));
    renderCategories();
    alert('Category deleted successfully!');
  }
}

function editCategory(categoryId) {
  // Fetch fresh data
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [];
  
  const category = categories.find(c => c.id == categoryId);
  if (!category) return;
  
  const newName = prompt('Enter new category name:', category.name);
  if (newName && newName.trim()) {
    const newDesc = prompt('Enter new category description:', category.description);
    category.name = newName.trim();
    if (newDesc) category.description = newDesc.trim();
    localStorage.setItem('ideaMeshCategories', JSON.stringify(categories));
    renderCategories();
    alert('Category updated successfully!');
  }
}

// ===== HOMEPAGE PREVIEW =====
function renderHomepagePreview() {
  // Fetch fresh data
  categories = JSON.parse(localStorage.getItem('ideaMeshCategories')) || [];
  websitePosts = JSON.parse(localStorage.getItem('ideaMeshPosts')) || [];
  allUsers = JSON.parse(localStorage.getItem('users')) || [];
  
  // Render categories
  const categoriesDiv = document.getElementById('homepageCategories');
  categoriesDiv.innerHTML = categories.map(cat => {
    const postCount = websitePosts.filter(p => p.category === cat.name).length;
    return `
      <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; border-top: 4px solid #019450;">
        <h4 style="margin: 0; color: #019450; font-size: 1.1rem;">${cat.name}</h4>
        <p style="margin: 8px 0; font-size: 0.85rem; color: #666; line-height: 1.4;">${cat.description.substring(0, 45)}...</p>
        <span class="post-badge" style="margin-top: 10px;">📊 ${postCount} posts</span>
      </div>
    `;
  }).join('');
  
  // Render latest posts with better formatting
  const latestDiv = document.getElementById('homepageLatestPosts');
  const latest = websitePosts.slice(0, 8).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (latest.length === 0) {
    latestDiv.innerHTML = '<div style="padding: 30px; text-align: center; color: #999;"><p>No posts available on the website yet</p></div>';
  } else {
    latestDiv.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
        ${latest.map(post => {
          const user = allUsers.find(u => u.email === post.authorEmail);
          const initials = (user?.fullName || 'U')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
          
          return `
            <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border-left: 4px solid #019450;">
              <h5 style="margin: 0 0 10px 0; color: #333; font-size: 0.95rem;">${post.title}</h5>
              <div style="display: flex; align-items: center; gap: 8px; margin: 10px 0;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #019450, #74bfe2); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">${initials}</div>
                <div style="font-size: 0.8rem;">
                  <div style="color: #333; font-weight: 500;">${post.authorName}</div>
                  <div style="color: #999;">${new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <span class="post-badge">📁 ${post.category}</span>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 0.85rem; line-height: 1.4;">${post.content.substring(0, 80)}...</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

function exportWebsiteData() {
  const data = {
    exportDate: new Date().toLocaleString(),
    totalPosts: websitePosts.length,
    totalCategories: categories.length,
    posts: websitePosts,
    categories: categories
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ideamesh_backup_${new Date().getTime()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  alert('Data exported successfully!');
}

// Modal handlers (to be called from HTML onclick)
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
  // Populate author dropdown if creating post
  if (modalId === 'createPostModal') {
    const adminAccountsKey = 'adminAccounts';
    const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
    
    const authorSelect = document.getElementById('postAuthor');
    authorSelect.innerHTML = '<option value="">Select Author</option>';
    adminAccounts.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.name;
      authorSelect.appendChild(option);
    });
  }
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function editUser(id) {
  const adminAccountsKey = 'adminAccounts';
  const adminAccounts = JSON.parse(localStorage.getItem(adminAccountsKey)) || [];
  
  const user = adminAccounts.find(u => u.id === id);
  if (!user) return;
  
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value = user.role;
  document.getElementById('editUserId').value = id;
  showModal('editUserModal');
}

function saveEditUser() {
  const id = parseInt(document.getElementById('editUserId').value);
  updateUser(id, {
    name: document.getElementById('editUserName').value,
    email: document.getElementById('editUserEmail').value,
    role: document.getElementById('editUserRole').value
  });
  hideModal('editUserModal');
}

function editPost(id) {
  // Fetch fresh data
  posts = JSON.parse(localStorage.getItem('adminPosts')) || [];
  
  const post = posts.find(p => p.id === id);
  if (!post) return;
  
  document.getElementById('editPostTitle').value = post.title;
  document.getElementById('editPostContent').value = post.content;
  document.getElementById('editPostId').value = id;
  showModal('editPostModal');
}

function saveEditPost() {
  const id = parseInt(document.getElementById('editPostId').value);
  updatePost(id, {
    title: document.getElementById('editPostTitle').value,
    content: document.getElementById('editPostContent').value
  });
  hideModal('editPostModal');
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  if (isAuthenticated) {
    document.querySelector('.admin-wrapper').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'none';
    updateStats();
    renderUsers();
    renderPosts();
    renderUserProfiles();
    renderWebsitePosts();
    renderCategories();
    renderHomepagePreview();
  } else {
    document.querySelector('.admin-wrapper').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';
  }
  
  // Add logout button listener
  document.querySelector('.logout-btn').addEventListener('click', logout);
});

// Switch between sections
function switchSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  
  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
    // Refresh data for specific sections
    if (sectionId === 'userProfiles') renderUserProfiles();
    if (sectionId === 'homepagePreview') renderHomepagePreview();
    if (sectionId === 'websiteContent') renderWebsitePosts();
    if (sectionId === 'categories') renderCategories();
    if (sectionId === 'posts') renderPosts();
    if (sectionId === 'users') renderUsers();
  }
}
