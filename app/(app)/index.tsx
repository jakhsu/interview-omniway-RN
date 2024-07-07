import { View } from 'react-native';
import FinancialCalculator from '~/components/FinancialCalculator';


export default function Index() {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FinancialCalculator />
        </View>
    );
}
