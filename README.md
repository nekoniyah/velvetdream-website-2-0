# VelvetDream Website 2.0

A modern, responsive personal website/portfolio built with Svelte and Vite, featuring a clean design and seamless user experience.

## 🚀 Features

- Modern and responsive design
- Server-side rendering capabilities
- Dynamic project portfolio
- Contact form with validation
- Secure API endpoints
- MongoDB integration
- Authentication system

## 🛠️ Tech Stack

- **Frontend:** Svelte, Vite
- **Styling:** SASS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **Deployment:** Vercel
- **Package Manager:** Bun

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/velvetdream-website-2-0.git
cd velvetdream-website-2-0
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

## 🚀 Development

Start the development server:
```bash
bun run dev
```

The site will be available at `http://localhost:3000`

## 🏗️ Building for Production

Build the project:
```bash
bun run build
```

Preview the production build:
```bash
bun run preview
```

## 🧪 Testing

(Coming soon) Run tests:
```bash
bun test
```

## 📝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## 🔒 Security

- CSRF protection implemented
- Secure authentication system
- API rate limiting
- Input validation
- Security headers

## 🎯 Roadmap

- [ ] TypeScript migration
- [ ] Dark/light theme support
- [ ] Blog section
- [ ] Newsletter subscription
- [ ] Enhanced SEO optimization
- [ ] Comprehensive test coverage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contact

For questions or feedback, please use the contact form on the website or open an issue.
