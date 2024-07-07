import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useSession } from '~/lib/ctx';
import { useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function SignIn() {
  const { signIn } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      await signIn({ identifier, password });
      router.replace('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Label nativeID='email'>Email</Label>
      <Input
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, width: '80%', padding: 8 }}
        placeholder="Email"
        value={identifier}
        inputMode='text'
        onChangeText={setIdentifier}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Label nativeID='password'>Password</Label>
      <Input
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, width: '80%', padding: 8 }}
        placeholder="Password"
        value={password}
        inputMode='text'
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button asChild onPress={handleSignIn}>
        <Text>
          Sign In
        </Text>
      </Button>
    </View>
  );
}