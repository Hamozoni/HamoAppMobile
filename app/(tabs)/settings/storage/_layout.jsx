import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";


export default function SettingsStorageLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Storage and data",
                    headerLeft: () => (<ChevronBackBtn />)
                }}
            />
        </Stack>
    );
}