import { Text } from "@rneui/base";
import SafeAreaView from "react-native-safe-area-view";

export default function ResetPasswordScreen({navigation}) {
    
    return (
        <SafeAreaView forceInset={{top: 'always'}}>
            <Text>This is a testing page for reset password</Text>
        </SafeAreaView>
    )
}