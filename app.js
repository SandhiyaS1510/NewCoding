const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Sequelize
const sequelize = new Sequelize('socialmediafeedranking', 'root', 'Root@123', {
    host: 'localhost',
    dialect: 'mysql'
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define Post model
const Post = sequelize.define('Post', {
    content: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define Comment model
const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Establish relationships
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Sync models with the database
sequelize.sync()
    .then(() => console.log('Database & tables created!'));

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Routes
app.post('/register', async (req, res) => {
    try {
        if (!req.body.username) {
            return res.status(400).json({ message: 'Username is mandatory' });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: 'Password is mandatory' });
        }
        const user = await User.create(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user && user.password === req.body.password) {
            res.status(200).json({ message: 'User logged in successfully', user });
        } else {
            res.status(401).json('Invalid credentials');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

app.post('/posts', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image', error: err });
        }

        if (req.file === undefined) {
            return res.status(400).json('Error: No File Selected!');
        }

        try {
            const post = await Post.create({
                content: req.body.content || '',
                imageUrl: `/uploads/${req.file.filename}`,
                userId: req.body.userId,
                likes: req.body.likes || 0,
                comments: req.body.comments || 0
            });
            res.status(201).json({ message: 'Post uploaded successfully', post });
        } catch (error) {
            res.status(400).json({ message: 'Error creating post', error });
        }
    });
});

app.post('/posts/:postId/like', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);
        if (post) {
            post.likes += 1;
            await post.save();
            res.status(200).json({ message: 'Post liked', post });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error });
    }
});

app.post('/posts/:postId/comments', async (req, res) => {
    try {
        const { content, userId } = req.body;
        const post = await Post.findByPk(req.params.postId);
        if (post) {
            const comment = await Comment.create({ content, userId, postId: post.id });
            post.comments += 1;
            await post.save();
            res.status(201).json({ message: 'Comment added', comment });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
});

app.put('/posts/:postId', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);
        if (post) {
            post.content = req.body.content || post.content;
            if (req.body.imageUrl) {
                post.imageUrl = req.body.imageUrl;
            }
            await post.save();
            res.status(200).json({ message: 'Post updated successfully', post });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

app.delete('/posts/:postId', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);
        if (post) {
            await post.destroy();
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});

app.get('/feed', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['username']
            }, {
                model: Comment,
                include: [User]
            }],
            order: [['likes', 'DESC']] // Order by likes in descending order
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feed', error });
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));