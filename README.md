# Grandparent Coach App

An AI-powered mobile app that helps grandparents learn modern parenting approaches and handle challenging situations with their grandchildren.

## Features

- **AI Coaching**: Get personalized advice based on gentle parenting principles
- **Voice Input**: Speak your questions naturally (Pro feature)
- **Text-to-Speech**: Listen to advice read aloud
- **Guides**: Bite-sized parenting tips and strategies
- **Favorites**: Save helpful advice for later (Pro feature)
- **Accessibility**: Large text, high contrast, voice support
- **Safety First**: Built-in safety filters and crisis handling

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI-compatible API with custom prompts
- **Payments**: RevenueCat for subscriptions
- **State Management**: React Context + Custom Hooks
- **TypeScript**: Full type safety

## Project Structure

```
grandparent-coach/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   └── modals/            # Modal screens
├── components/            # Reusable UI components
├── lib/                   # Core utilities and configurations
├── state/                 # State management hooks
├── server/                # API client code
├── prompts/               # AI system prompts
└── supabase/              # Database schema and policies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Fill in your API keys and configuration.

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL scripts in `supabase/` folder
   - Update your environment variables

5. Start the development server:
   ```bash
   npm start
   ```

### Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_BASE=https://your-api-domain.com
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Key Features

### AI Coaching System

The app uses a carefully crafted system prompt that:
- Asks clarifying questions before giving advice
- Follows gentle parenting principles
- Never provides medical or legal advice
- Handles crisis situations appropriately
- Uses plain language for accessibility

### Safety & Privacy

- Content filtering for medical/safety keywords
- Crisis detection and appropriate responses
- Minimal data collection
- No storage of child PII
- Row-level security in database

### Accessibility

- Large, scalable text (18-20pt base)
- High contrast mode
- Voice input and output
- Large touch targets (48px minimum)
- Screen reader support

## Database Schema

### Tables

- `profiles`: User account information
- `sessions`: Coaching conversation sessions
- `messages`: Individual messages in conversations
- `favorites`: Saved advice and summaries
- `usage_analytics`: Anonymized usage data

### Security

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## AI Integration

The app uses a server-side proxy to:
- Inject the system prompt
- Handle safety filtering
- Manage rate limiting
- Stream responses
- Log anonymized metadata

## Subscription Model

- **Free**: 3 coaching sessions
- **Pro ($9.99/month)**: Unlimited sessions, voice input, favorites, summaries
- **Trial**: 7-day free trial for new users

## Development

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Accessibility-first design

### Testing

```bash
npm test
```

### Building for Production

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## Deployment

1. Set up your server API (Vercel/Cloudflare Workers)
2. Configure RevenueCat products
3. Set up App Store/Google Play accounts
4. Build and submit to app stores

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact [your-email@domain.com].

## Safety Notice

This app provides educational support only and is not medical or legal advice. For medical concerns or emergencies, contact a licensed professional or local emergency services immediately.
