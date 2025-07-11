const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Models
const Event = require('./models/Event');
const Project = require('./models/Project');
const Member = require('./models/Member');
const Timeline_events = require('./models/Timeline_Events');
  
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://inteliot:inteliot@backend.ipiryxk.mongodb.net/intel-iot-club', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

/* ROUTES */

// Events
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json({ message: 'Event added successfully' });
});

// Edit Event
app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err });
  }
});

// Delete Event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  res.status(201).json({ message: 'Project added successfully' });
});

// Edit Project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err });
  }
});

// Delete Project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err });
  }
});

// Members
app.get('/api/members', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

app.post('/api/members', async (req, res) => {
  const newMember = new Member(req.body);
  await newMember.save();
  res.status(201).json({ message: 'Member added successfully' });
});

// Edit Member
app.put('/api/members/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member updated successfully', member: updatedMember });
  } catch (err) {
    res.status(500).json({ message: 'Error updating member', error: err });
  }
});

// Delete Member
app.delete('/api/members/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting member', error: err });
  }
});

app.post("/api/timeline/add", async (req, res) => {
  try {
    const newEvent = new Timeline_events(req.body);
    await newEvent.save();
    res.status(201).json({ message: 'Event added' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding timeline event', error: err.message });
  }
});

app.get("/api/timeline_events/get", async (req, res) => {
  try {
    const events = await Timeline_events.find().sort({ date: 1 }); // sorted by date ascending
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching timeline events', error: err.message });
  }
});

app.patch('/api/timeline/update/:id', async (req, res) => {
  try {
    const updatedEvent = await Timeline_events.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },  // only update fields sent in request
      { new: true }        // return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Timeline event not found' });
    }

    res.json({ message: 'Timeline event updated successfully', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating timeline event', error: err.message });
  }
});

app.delete('/api/timeline/delete/:id', async (req, res) => {
  try {
    const deletedEvent = await Timeline_events.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Timeline event not found' });
    }
    res.json({ message: 'Timeline event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting timeline event', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
