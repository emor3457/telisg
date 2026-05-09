# EHS Management System (Expo + React Native + Rork) Scaffold

## Project Overview

This scaffold sets up a modern Android-focused EHS (Environment, Health & Safety) Management System using:

- Expo
- React Native
- Expo Router
- TypeScript
- React Native Reanimated
- React Native Gesture Handler
- React Native SVG
- Expo Image Picker
- Expo Camera
- Native-like Android animations
- Swipe interactions
- Clean card-based UI

Core modules:

- Splash / Welcome
- Authentication Flow
- Dashboard
- EHS Action Tracking
- Field Observations
- AI Hazard Analysis
- User Profile

---

# 1. Create Project

```bash
npx create-expo-app@latest ehs-management-system -t expo-template-blank-typescript

cd ehs-management-system
```

---

# 2. Install Dependencies

## Expo Router + Navigation

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

## Animations + Gestures

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

## Icons + UI

```bash
npx expo install @expo/vector-icons react-native-svg
```

## Image Upload + Camera

```bash
npx expo install expo-image-picker expo-camera expo-file-system
```

## Storage

```bash
npx expo install @react-native-async-storage/async-storage
```

## Charts

```bash
npm install react-native-chart-kit
```

## Swipe List

```bash
npm install react-native-swipe-list-view
```

## State Management

```bash
npm install zustand
```

---

# 3. Configure Babel

## babel.config.js

```js
module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

---

# 4. Configure app.json

```json
{
  "expo": {
    "name": "EHS Management System",
    "slug": "ehs-management-system",
    "scheme": "ehsapp",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "android": {
      "package": "com.company.ehsmanagement",
      "adaptiveIcon": {
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": [
      "expo-router",
      "expo-camera"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

# 5. Recommended Folder Structure

```text
app/
 ├── _layout.tsx
 ├── index.tsx
 ├── auth/
 │    ├── signin.tsx
 │    └── signup.tsx
 ├── dashboard/
 │    └── index.tsx
 ├── actions/
 │    ├── index.tsx
 │    └── [id].tsx
 ├── observations/
 │    ├── index.tsx
 │    └── [id].tsx
 └── profile/
      └── index.tsx

components/
 ├── ActionCard.tsx
 ├── DashboardCard.tsx
 ├── PrimaryButton.tsx
 ├── ObservationCard.tsx
 ├── ScreenHeader.tsx
 └── FloatingCameraButton.tsx

store/
 ├── authStore.ts
 └── actionStore.ts

theme/
 ├── colors.ts
 └── spacing.ts

services/
 └── aiAnalysis.ts

assets/
 ├── logo.png
 └── splash.png
```

---

# 6. Root Layout

## app/_layout.tsx

```tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </GestureHandlerRootView>
  );
}
```

---

# 7. Theme Colors

## theme/colors.ts

```ts
export const colors = {
  primary: '#0F766E',
  secondary: '#14B8A6',
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  danger: '#DC2626',
  warning: '#F59E0B',
  success: '#16A34A',
};
```

---

# 8. Welcome Screen

## app/index.tsx

```tsx
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>EHS Management System</Text>

      <Text style={styles.subtitle}>
        Action Tracking & AI Safety Intelligence
      </Text>

      <PrimaryButton
        title="Get Started"
        onPress={() => router.push('/auth/signin')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F3F4F6',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 40,
    textAlign: 'center',
  },
});
```

---

# 9. Reusable Primary Button

## components/PrimaryButton.tsx

```tsx
import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

# 10. Authentication Screens

## app/auth/signin.tsx

```tsx
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <PrimaryButton
        title="Continue"
        onPress={() => router.replace('/dashboard')}
      />

      <Text
        style={styles.link}
        onPress={() => router.push('/auth/signup')}
      >
        Create Account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0F766E',
    fontWeight: '600',
  },
});
```

---

# 11. Dashboard

## app/dashboard/index.tsx

```tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingCameraButton from '../../components/FloatingCameraButton';
import DashboardCard from '../../components/DashboardCard';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>EHS Dashboard</Text>

        <DashboardCard
          title="Pending Actions"
          value="24"
          color="#F59E0B"
        />

        <DashboardCard
          title="In Progress"
          value="12"
          color="#0EA5E9"
        />

        <DashboardCard
          title="Completed"
          value="88"
          color="#16A34A"
        />

        <DashboardCard
          title="Open Field Observations"
          value="9"
          color="#DC2626"
        />
      </ScrollView>

      <FloatingCameraButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
  },
});
```

---

# 12. Floating Camera Button

## components/FloatingCameraButton.tsx

```tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FloatingCameraButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/observations/1')}
    >
      <Ionicons
        name="camera"
        size={28}
        color="white"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
```

---

# 13. Action Tracking List

## app/actions/index.tsx

```tsx
import { View, FlatList, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import ActionCard from '../../components/ActionCard';

const actions = [
  {
    id: '1',
    title: 'Missing PPE in Hangar Area',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Oil Spill Cleanup',
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Emergency Exit Inspection',
    status: 'Completed',
  },
];

export default function ActionsScreen() {
  return (
    <View style={styles.container}>
      <SwipeListView
        data={actions}
        renderItem={({ item }) => (
          <ActionCard item={item} />
        )}
        renderHiddenItem={() => <View />}
        rightOpenValue={-75}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
});
```

---

# 14. AI Observation Detail Screen

## app/observations/[id].tsx

```tsx
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';

export default function ObservationDetailScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://picsum.photos/400' }}
        style={styles.image}
      />

      <Text style={styles.sectionTitle}>AI Hazard Analysis</Text>

      <Text style={styles.label}>Detected Hazard</Text>
      <Text style={styles.value}>
        Worker operating without proper fall protection.
      </Text>

      <Text style={styles.label}>Risk Level</Text>
      <Text style={styles.risk}>HIGH</Text>

      <Text style={styles.label}>Recommended Actions</Text>
      <Text style={styles.value}>
        - Stop work immediately
        {'\n'}- Provide approved fall arrest system
        {'\n'}- Conduct toolbox training
      </Text>

      <PrimaryButton
        title="Create Corrective Action"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  value: {
    color: '#374151',
    lineHeight: 24,
  },
  risk: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '700',
  },
});
```

---

# 15. Profile Screen

## app/profile/index.tsx

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Safety Officer</Text>

      <View style={styles.card}>
        <Text style={styles.metric}>Assigned Actions: 18</Text>
        <Text style={styles.metric}>Completed This Month: 42</Text>
        <Text style={styles.metric}>Closure Rate: 91%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.setting}>Notifications</Text>
        <Text style={styles.setting}>Dark Mode</Text>
        <Text style={styles.setting}>AI Assistance</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  metric: {
    marginBottom: 12,
    fontSize: 16,
  },
  setting: {
    marginBottom: 14,
    fontSize: 16,
  },
});
```

---

# 16. AI Analysis Service

## services/aiAnalysis.ts

```ts
export async function analyzeObservation(imageUri: string) {
  return {
    hazard: 'Missing PPE',
    riskLevel: 'HIGH',
    controls: [
      'Provide PPE',
      'Stop unsafe work',
      'Supervisor intervention',
    ],
  };
}
```

---

# 17. Zustand Store Example

## store/actionStore.ts

```ts
import { create } from 'zustand';

interface ActionItem {
  id: string;
  title: string;
  status: string;
}

interface ActionStore {
  actions: ActionItem[];
  addAction: (action: ActionItem) => void;
}

export const useActionStore = create<ActionStore>((set) => ({
  actions: [],
  addAction: (action) =>
    set((state) => ({
      actions: [...state.actions, action],
    })),
}));
```

---

# 18. Recommended Future Enhancements

## AI / Computer Vision

- PPE detection
- Unsafe posture recognition
- Fire/smoke detection
- Confined space monitoring
- Near-miss prediction

## Enterprise Features

- Offline mode
- QR-based inspections
- Corrective action workflows
- Push notifications
- Role-based permissions
- Power BI integration
- SAP integration
- ISO 45001 compliance reporting
- HSE KPI analytics

## Advanced Mobile UX

- Bottom tab navigation
- Pull-to-refresh
- Shared element transitions
- Skeleton loading animations
- Swipe-to-complete actions
- Voice-to-text observations

---

# 19. Start the App

```bash
npx expo start
```

Run Android:

```bash
a
```

---

# 20. Recommended Production Stack

## Backend

- Node.js + NestJS
- PostgreSQL
- Prisma ORM
- Redis
- AWS S3 for images

## AI Services

- OpenAI Vision
- Azure AI Vision
- Google Vertex AI

## Authentication

- Firebase Auth
- Supabase Auth
- Auth0

## Push Notifications

- Expo Notifications
- Firebase Cloud Messaging

---

# 21. Suggested Bottom Navigation Expansion

Recommended tabs:

- Dashboard
- Actions
- Observations
- Analytics
- Profile

Using:

```bash
npx expo install @react-navigation/bottom-tabs
```

---

# 22. UI Design Direction

Design language recommendations:

- Soft rounded corners (16–24px)
- Elevated floating action buttons
- Android Material-inspired motion
- Large touch targets
- High contrast safety colors
- Minimal text-heavy screens
- Card-driven layouts
- Swipe gestures for action handling
- Fast image-first workflows

---

# 23. Suggested Next Step

After scaffolding:

1. Add Bottom Tabs
2. Connect real authentication
3. Implement actual AI image analysis API
4. Add offline sync
5. Create corrective action workflows
6. Add PDF inspection reports
7. Build analytics dashboard
8. Add multilingual support

