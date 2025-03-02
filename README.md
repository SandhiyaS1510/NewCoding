Social Media Feed Ranking System
🚀 A dynamic social media web application that ranks posts based on user engagement. Built with Node.js, Express.js, MySQL, and Sequelize, this system allows users to create posts, upload images, like, comment, and experience a feed ranking algorithm that prioritizes the most engaging content.

📌 Features
✅ User Authentication – Secure registration and login system.
✅ Post Creation & Image Uploads – Users can create posts with text and images.
✅ Engagement-Based Feed Ranking – Posts are ranked based on the number of likes.
✅ Like & Comment System – Users can interact with posts via likes and comments.
✅ Edit & Delete Posts – Users can modify or remove their own posts.
✅ Responsive UI – Fully functional across different devices.

🛠 Tech Stack:
Frontend:
HTML5, CSS3, JavaScript (Vanilla JS)
Backend:
Node.js, Express.js, Sequelize (ORM for MySQL)
Database:
MySQL (for storing users, posts, likes, and comments)
Other Tools:
Multer (for image uploads)
Body-Parser (for handling request bodies)
CORS (for enabling cross-origin requests)
⚙️ Installation & Setup
Prerequisites
Ensure you have the following installed:

Node.js (v12 or higher) → Download Here
MySQL (v5.7 or higher) → Download Here
Git (for cloning the repository) → Download Here
1️⃣ Clone the Repository

git clone https://github.com/your-username/social-media-feed-ranking.git
cd social-media-feed-ranking
2️⃣ Install Dependencies

npm install
3️⃣ Configure Database
Open MySQL and create a database:

CREATE DATABASE socialmediafeedranking;
Update database credentials in app.js:

const sequelize = new Sequelize('socialmediafeedranking', 'root', 'your-password', {
    host: 'localhost',
    dialect: 'mysql'
});
4️⃣ Run the Server

node app.js
Server will start at: http://localhost:3000

🚀 Usage
1️⃣ Register a New User
Open http://localhost:3000 in your browser.
Register with a username and password.
2️⃣ Login
Log in using registered credentials.
3️⃣ Create a Post
Upload an image and add text content.
4️⃣ Like & Comment
Interact with posts by liking and commenting.
5️⃣ Edit & Delete Posts
Edit or delete posts you have created.
🧪 Testing
Use Postman or the browser console to test API endpoints.
Example API request to fetch posts:

GET http://localhost:3000/feed
🚀 Future Enhancements
🔹 Real-time Notifications – Notify users about likes & comments.
🔹 User Profiles – Display all posts by a specific user.
🔹 Friend System – Allow users to follow each other.
🔹 Hashtags & Search – Enable keyword-based post discovery.

🤝 Contributing
Want to improve this project? Follow these steps:

Fork the repository
Create a new branch (git checkout -b feature-name)
Make your changes
Commit and push (git commit -m "Added new feature" && git push origin feature-name)
Submit a pull request 🚀
📄 License
This project is open-source under the MIT License.

⭐ If you like this project, don’t forget to star the repo! ⭐
Happy Coding! 😊🚀
