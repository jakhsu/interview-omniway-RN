import { View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";
import { UserDropdown } from "./UserDropdown";

export function Profile() {
    return (
        <View className="flex flex-row gap-x-4 items-center">
            <ThemeToggle />
            <UserDropdown />
        </View>
    );
}