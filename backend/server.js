const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'issues.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper to read issues
const readIssues = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading issues file:', err);
    return [];
  }
};

// Helper to write issues safely
const writeIssues = (issues) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(issues, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing issues file:', err);
    return false;
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), message: 'CivicHero API is running smoothly' });
});

// GET /api/issues - List all issues with filtering & sorting
app.get('/api/issues', (req, res) => {
  const { category, status, search, sort, reporterType } = req.query;
  let issues = readIssues();

  // Filter by category
  if (category && category !== 'All') {
    issues = issues.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by status
  if (status && status !== 'All') {
    issues = issues.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by reporter type (elder, kid, citizen)
  if (reporterType && reporterType !== 'All') {
    issues = issues.filter(i => i.reporter?.type === reporterType);
  }

  // Search keyword (matches title, description, address, or ID)
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    issues = issues.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.location?.address && i.location.address.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'most_upvoted') {
    issues.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  } else if (sort === 'oldest') {
    issues.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // Default newest first
    issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({ success: true, count: issues.length, data: issues });
});

// GET /api/issues/:id - Single issue
app.get('/api/issues/:id', (req, res) => {
  const issues = readIssues();
  const issue = issues.find(i => i.id.toLowerCase() === req.params.id.toLowerCase());
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }
  res.json({ success: true, data: issue });
});

// POST /api/issues - Create a new issue
app.post('/api/issues', (req, res) => {
  const {
    title,
    description,
    category,
    categoryIcon,
    urgency = 'Medium',
    location,
    reporter,
    photo
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and category are required' });
  }

  const issues = readIssues();
  const nextNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `REP-${new Date().getFullYear()}-${nextNum}`;

  const defaultIcons = {
    'Roads & Potholes': '🚧',
    'Street Lighting & Electricity': '💡',
    'Water Supply & Leakage': '💧',
    'Sanitation & Waste': '🗑️',
    'Parks & Playgrounds': '🛝',
    'Public Safety & Obstructions': '⚠️',
    'Drainage & Flooding': '🌊',
    'Other': '📍'
  };

  const newIssue = {
    id: newId,
    title: title.trim(),
    description: (description || 'No detailed description provided.').trim(),
    category: category,
    categoryIcon: categoryIcon || defaultIcons[category] || '📍',
    urgency: urgency || 'Medium',
    status: 'Reported',
    statusColor: 'purple',
    location: {
      address: location?.address || 'Community Area, City',
      lat: location?.lat || 12.9716 + (Math.random() - 0.5) * 0.02,
      lng: location?.lng || 77.5946 + (Math.random() - 0.5) * 0.02
    },
    reporter: {
      name: reporter?.name || 'Concerned Citizen',
      badge: reporter?.badge || (reporter?.type === 'kid' ? 'Junior Civic Hero ⭐' : reporter?.type === 'elder' ? 'Community Elder' : 'Active Citizen'),
      type: reporter?.type || 'citizen'
    },
    photo: photo || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    upvotes: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'Pending Department Assignment',
    assignedOfficer: 'Unassigned',
    estimatedCompletion: null,
    timeline: [
      {
        status: 'Reported',
        timestamp: new Date().toISOString(),
        actor: `${reporter?.name || 'Citizen'} (${reporter?.type === 'kid' ? 'Junior Hero' : reporter?.type === 'elder' ? 'Elder' : 'Citizen'})`,
        note: `Issue reported successfully under "${category}". Priority assessed as ${urgency}.`
      }
    ],
    resolution: null,
    comments: []
  };

  issues.unshift(newIssue);
  writeIssues(issues);

  res.status(201).json({
    success: true,
    message: 'Community issue reported successfully!',
    data: newIssue
  });
});

// POST /api/issues/:id/upvote - "I see this too / Upvote"
app.post('/api/issues/:id/upvote', (req, res) => {
  const issues = readIssues();
  const index = issues.findIndex(i => i.id.toLowerCase() === req.params.id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  issues[index].upvotes = (issues[index].upvotes || 0) + 1;
  issues[index].updatedAt = new Date().toISOString();
  writeIssues(issues);

  res.json({
    success: true,
    message: 'Upvote recorded! Your voice helps authorities prioritize.',
    upvotes: issues[index].upvotes
  });
});

// POST /api/issues/:id/comments - Add community comment
app.post('/api/issues/:id/comments', (req, res) => {
  const { author = 'Citizen', role = 'Citizen', text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  const issues = readIssues();
  const index = issues.findIndex(i => i.id.toLowerCase() === req.params.id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const commentObj = {
    id: 'c_' + Date.now(),
    author: author.trim(),
    role: role,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  if (!issues[index].comments) {
    issues[index].comments = [];
  }
  issues[index].comments.push(commentObj);
  issues[index].updatedAt = new Date().toISOString();
  writeIssues(issues);

  res.status(201).json({
    success: true,
    message: 'Comment added',
    comment: commentObj
  });
});

// PATCH /api/issues/:id/status - Authority Action: Update status & post resolution proof
app.patch('/api/issues/:id/status', (req, res) => {
  const {
    status,
    department,
    assignedOfficer,
    estimatedCompletion,
    note,
    resolutionPhoto,
    resolutionNotes,
    actorName = 'Municipal Authority'
  } = req.body;

  const validStatuses = ['Reported', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  const issues = readIssues();
  const index = issues.findIndex(i => i.id.toLowerCase() === req.params.id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const current = issues[index];
  const now = new Date().toISOString();

  if (status) {
    current.status = status;
    // Map status color
    if (status === 'Reported') current.statusColor = 'purple';
    else if (status === 'Under Review') current.statusColor = 'blue';
    else if (status === 'In Progress') current.statusColor = 'amber';
    else if (status === 'Resolved') current.statusColor = 'emerald';
    else if (status === 'Rejected') current.statusColor = 'rose';
  }

  if (department) current.department = department;
  if (assignedOfficer) current.assignedOfficer = assignedOfficer;
  if (estimatedCompletion) current.estimatedCompletion = estimatedCompletion;
  current.updatedAt = now;

  // Append to timeline
  const timelineEntry = {
    status: status || current.status,
    timestamp: now,
    actor: actorName,
    note: note || (status === 'Resolved' ? 'Work completed and officially verified.' : `Status updated to ${status}.`)
  };
  current.timeline.push(timelineEntry);

  // If resolved, add resolution proof
  if (status === 'Resolved') {
    current.resolution = {
      proofPhoto: resolutionPhoto || current.photo,
      notes: resolutionNotes || note || 'Issue has been successfully addressed and verified on-site.',
      completedAt: now
    };
  }

  writeIssues(issues);

  res.json({
    success: true,
    message: `Issue updated to "${status || current.status}" successfully!`,
    data: current
  });
});

// GET /api/stats - Analytics Dashboard for authorities and citizens
app.get('/api/stats', (req, res) => {
  const issues = readIssues();
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const underReview = issues.filter(i => i.status === 'Under Review').length;
  const reported = issues.filter(i => i.status === 'Reported').length;
  const totalUpvotes = issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  // Category counts
  const categoryCounts = {};
  issues.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  // Urgency counts
  const urgencyCounts = {
    High: issues.filter(i => i.urgency === 'High').length,
    Medium: issues.filter(i => i.urgency === 'Medium').length,
    Low: issues.filter(i => i.urgency === 'Low').length
  };

  // Reporter breakdown (Kid Heroes, Elders, Citizens)
  const reporterCounts = {
    elder: issues.filter(i => i.reporter?.type === 'elder').length,
    kid: issues.filter(i => i.reporter?.type === 'kid').length,
    citizen: issues.filter(i => i.reporter?.type !== 'elder' && i.reporter?.type !== 'kid').length
  };

  res.json({
    success: true,
    data: {
      total,
      resolved,
      inProgress,
      underReview,
      reported,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      totalUpvotes,
      categoryCounts,
      urgencyCounts,
      reporterCounts
    }
  });
});

// Serve frontend static files in production if dist exists
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` CivicHero Fullstack API running on port ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Issues: http://localhost:${PORT}/api/issues`);
  console.log(`===============================================`);
});
