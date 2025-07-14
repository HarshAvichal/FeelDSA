# FeelDSA - Visual Data Structures & Algorithms Learning Platform

FeelDSA is an interactive web application designed to help students learn Data Structures and Algorithms through visual learning, step-by-step animations, and AI-powered tutoring.

## 🚀 Features

### 🎯 Visual Learning
- **Interactive Animations**: Watch algorithms execute step-by-step with Framer Motion animations
- **Real-time Highlighting**: See exactly which elements are being processed at each step
- **Playback Controls**: Play, pause, step forward/backward, and reset animations
- **Progress Tracking**: Visual progress bar showing completion status

### 🤖 AI-Powered Tutoring
- **Context-Aware AI**: The AI tutor knows what you're currently learning
- **Personalized Help**: Get answers based on your current step and data structure state
- **Step-by-Step Explanations**: Understand the "why" behind each algorithm step
- **Code Snippets**: Receive relevant code examples and explanations

### 📚 Comprehensive DSA Coverage
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort
- **Search Algorithms**: Linear Search, Binary Search
- **Data Structures**: Arrays, Stacks, Queues, Linked Lists, Binary Trees
- **Complexity Analysis**: Time and space complexity for each algorithm

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Easy navigation on mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4 API
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FeelDSA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### OpenAI API Setup
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. The AI tutor will be available for context-aware assistance

### Customization
- **Adding New Algorithms**: Extend the `algorithms` object in `src/utils/algorithms.js`
- **Styling**: Modify Tailwind classes or add custom CSS in `src/index.css`
- **Animations**: Adjust Framer Motion settings in components

## 📖 Usage

### Homepage
- Browse available DSA topics
- Use search and category filters
- Click on any topic to start learning

### Visualization Page
- **Play/Pause**: Control animation playback
- **Step Navigation**: Move forward/backward through steps
- **Reset**: Start over from the beginning
- **New Array**: Generate a new random array to practice with
- **Info Panel**: View algorithm description and complexity

### AI Tutor
- Ask questions about the current algorithm
- Get context-aware explanations
- Receive code snippets and examples
- Understand the reasoning behind each step

## 🏗️ Project Structure

```
FeelDSA/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DsaCard.jsx     # Topic cards for homepage
│   │   ├── Visualizer.jsx  # Algorithm visualization
│   │   └── AITutorChat.jsx # AI chat interface
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Homepage with topic grid
│   │   └── Visualize.jsx   # Visualization page
│   ├── context/            # React Context for state management
│   │   └── VisualizerContext.jsx
│   ├── utils/              # Helper functions
│   │   ├── algorithms.js   # Algorithm implementations
│   │   └── openai.js       # OpenAI API integration
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🎨 Customization

### Adding New Algorithms
1. Add algorithm data to `src/utils/algorithms.js`
2. Implement the `steps` function that returns an array of step objects
3. Each step should include:
   - `array`: Current array state
   - `highlightedIndex`: Index to highlight
   - `operationDescription`: Description of current operation

### Styling
- Modify Tailwind classes in components
- Add custom CSS in `src/index.css`
- Update color scheme in `tailwind.config.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Framer Motion for smooth animations
- Tailwind CSS for the utility-first styling
- Lucide for the beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Learning! 🎓** 