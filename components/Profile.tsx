import { View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";
import { UserDropdown } from "./UserDropdown";
import { useSession } from "~/lib/ctx";

export function Profile() {
    const { user } = useSession()
    return (
        <View className="flex flex-row gap-x-4 items-center">
            <ThemeToggle />
            {
                user && (
                    <UserDropdown />
                )
            }
        </View>
    );
}