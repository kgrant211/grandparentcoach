# Grandparent Coach App - Setup Guide

## ✅ Dependencies Installed Successfully!

The core dependencies have been installed. Here's what you need to do next:

## 1. Environment Setup

Create a `.env` file in the root directory with the following content:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# API Configuration
EXPO_PUBLIC_API_BASE=https://your-api-domain.com

# RevenueCat Configuration
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key_here

# OpenAI Configuration (for server-side use)
OPENAI_API_KEY=your_openai_api_key_here
```

## 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the scripts from:
   - `supabase/schema.sql` - Creates the database tables
   - `supabase/policies.sql` - Sets up security policies
3. Copy your project URL and anon key to the `.env` file

## 3. Start the App

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your phone

## 4. Test the App

The app should now run with:
- ✅ Home screen with welcome message
- ✅ Ask screen for AI coaching (will show placeholder responses)
- ✅ Guides screen with parenting tips
- ✅ Settings screen with accessibility options

## 5. Next Steps

### For Full Functionality:

1. **Set up AI Backend**: Create a server (Vercel/Cloudflare) that handles the AI requests
2. **Configure RevenueCat**: Set up subscription products
3. **Add App Icons**: Replace placeholder icons in `assets/` folder
4. **Test Voice Features**: Voice input requires device testing

### Current Limitations:

- AI responses are placeholder (needs backend)
- Voice input needs device testing
- Subscription features need RevenueCat setup
- App icons are placeholders

## 6. Development Notes

- The app uses TypeScript for type safety
- All components are accessible with large text and high contrast
- Safety filters are built-in for medical/crisis content
- The design is optimized for grandparents (large buttons, clear text)

## Troubleshooting

If you encounter issues:

1. **Metro bundler errors**: Try `npx expo start --clear`
2. **Dependency conflicts**: The app uses `--legacy-peer-deps` for compatibility
3. **TypeScript errors**: Make sure all imports are correct

## Project Structure

```
grandparent-coach/
├── app/                    # Expo Router screens
├── components/            # Reusable UI components  
├── lib/                   # Core utilities
├── state/                 # State management
├── server/                # API client
├── prompts/               # AI system prompts
└── supabase/              # Database schema
```

The app is now ready for development and testing! 🎉
