import { View } from 'react-native';
import { Text } from '~/components/ui/text';


export default function Index() {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                You're logged in, to log out, please use the top right dropdown
            </Text>
        </View>
    );
}
