import { View } from 'react-native';
import FinancialCalculator from '~/components/FinancialCalculator';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useSession } from '~/lib/ctx';


export default function Index() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FinancialCalculator />
        </View>
    );
}
