# Ultra-Modern Tech Portfolio

A cutting-edge portfolio built with Next.js, TypeScript, Three.js, and Tailwind CSS featuring interactive 3D backgrounds, smooth animations, and an AI chat assistant.

## 🚀 Features

- **Neural Network 3D Background**: Interactive morphing network visualization with liquid metal effects
- **AI Chat Assistant**: Floating chat interface for portfolio questions (ready for OpenAI integration)  
- **Glitch Text Effects**: Modern cyberpunk-style animations
- **3D Card Interactions**: Projects showcase with tilt effects and glow animations
- **Interactive Skill Visualizations**: Animated progress bars and rotating 3D elements
- **Responsive Design**: Fully optimized for all devices
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Built with Tailwind CSS

## 🛠️ Tech Stack

- **Next.js 15** - React framework for production
- **TypeScript** - Type safety and better DX
- **Three.js & React Three Fiber** - 3D graphics and animations
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Lucide React** - Additional icons

## 🎨 Sections

- ✅ **Hero** - Interactive typing animation with floating tech icons
- ✅ **About** - Animated stats cards and tech stack badges  
- ✅ **Projects** - 3D hover effects with project filtering
- ✅ **Skills** - Category tabs with animated progress bars
- ✅ **Contact** - Form with status feedback and social links
- ✅ **AI Chat** - Interactive assistant interface

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Personal Information
Update the following files with your information:
- `components/sections/Hero.tsx` - Name and title
- `components/sections/About.tsx` - Bio and stats
- `components/sections/Contact.tsx` - Contact details
- `app/layout.tsx` - SEO metadata

### Projects
Add your projects in `components/sections/Projects.tsx`:
```typescript
const projects = [
  {
    title: 'Your Project',
    description: 'Project description...',
    tech: ['React', 'TypeScript', 'Next.js'],
    github: 'https://github.com/username/repo',
    demo: 'https://yourproject.com',
    // ...
  }
];
```

### Skills  
Update your skills in `components/sections/Skills.tsx`:
```typescript
const skillCategories = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, level: 95 },
      // Add your skills...
    ]
  }
];
```

### AI Chat
To enable real AI responses, update `components/ui/AIChat.tsx`:
1. Install OpenAI SDK: `npm install openai`
2. Add your API key to environment variables
3. Replace the mock response with actual OpenAI API calls

## 🌟 Unique Features

### Neural Network Background
The interactive 3D background features:
- Morphing neural network nodes
- Mouse-reactive particles
- Liquid metal distortion effects
- Smooth camera movements
- Dynamic lighting

### Interactive Elements
- Glitch text effects on hover
- 3D card tilts and shadows
- Animated skill progress bars
- Floating action buttons
- Smooth scroll animations

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1920px)  
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔧 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using modern web technologies.
