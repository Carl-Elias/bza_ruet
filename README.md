# BZA RUET Website

This is a React.js website for the Bogura Zilla Association (BZA) RUET - a district association connecting alumni and current students from Bogura, Bangladesh studying at Rajshahi University of Engineering and Technology.

🚀 **Live Website**: https://bza-ruet-alumni-477a6.web.app

## 🌟 Features

### Core Functionality

- **Alumni Network**: Connect current students with alumni professionals
- **Event Management**: Organize and promote club events, workshops, and cultural programs
- **Announcements**: Share important updates and news with the community
- **Contact System**: Easy communication channels for members and interested parties

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Easy Navigation**: Intuitive routing and user-friendly menu system
- **Search & Filter**: Find events, alumni, and announcements quickly

## 🚀 Technology Stack

- **Frontend**: React.js 18 with Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS3 with CSS Modules and Flexbox/Grid
- **Build Tool**: Vite for fast development and optimized builds

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── About.jsx       # About BZA
│   ├── Alumni.jsx      # Alumni directory
│   ├── Events.jsx      # Events listing
│   ├── Announcements.jsx # News & updates
│   └── Contact.jsx     # Contact information
├── data/               # Mock data and constants
├── hooks/              # Custom React hooks
└── styles/             # CSS files
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd BZA
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎨 Design Features

### Color Scheme

- **Primary**: Blue (#3b82f6) - Professional and trustworthy
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Green and purple for different categories

### Typography

- **Font**: Inter - Modern, readable sans-serif font
- **Hierarchy**: Clear heading structure for better accessibility

### Layout

- **Responsive Grid**: CSS Grid and Flexbox for adaptive layouts
- **Cards**: Consistent card-based design for content blocks
- **Navigation**: Sticky header with mobile-friendly hamburger menu

## 📱 Pages Overview

### Home Page

- Hero section with association introduction
- Statistics showcase
- Feature highlights
- Call-to-action sections

### Alumni Network

- Searchable alumni directory
- Filter by batch, department, location
- Contact information for networking
- Alumni registration call-to-action

### Events

- Upcoming and past events listing
- Event categorization and filtering
- Detailed event information
- Registration capabilities

### Announcements

- Priority-based announcement system
- Category filtering
- Newsletter subscription
- Administrative updates

### Contact

- Multiple contact methods
- Contact form with categorization
- Executive committee information
- FAQ section

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting

- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy drag-and-drop deployment
- **GitHub Pages**: Free hosting for open source projects

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style and structure
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📧 Contact & Support

- **Email**: info@bzaruet.org
- **Website**: [BZA RUET Official](https://bzaruet.org)
- **Location**: RUET Campus, Kazla, Rajshahi-6204, Bangladesh

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RUET Administration** for their support
- **BZA Executive Committee** for guidance and requirements
- **Alumni Network** for providing content and feedback
- **Open Source Community** for the amazing tools and libraries

---

**Built with ❤️ for the Bogura Zilla Association community at RUET**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
