import * as React from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Text } from '~/components/ui/text';
import { useSession } from '~/lib/ctx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const getNameInitials = (name: string | undefined) => {
    if (!name) return '';
    return name
        .split(' ')
        .map((part) => part[0])
        .join('');
}

export function UserDropdown() {
    const { user, signOut } = useSession()
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button asChild variant='ghost' size={'sm'}>
                    <Avatar alt="Zach Nugent's Avatar">
                        <AvatarImage source={{ uri: apiUrl + user?.photoURL.url }} />
                        <AvatarFallback>
                            <Text>{getNameInitials(user?.displayName)}</Text>
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent insets={{ right: 10 }} className='w-64 native:w-72'>
                <View className='flex flex-col gap-y-0'>
                    <DropdownMenuLabel className='py-0'>
                        {user?.displayName}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className='py-0 font-normal text-gray-600'>
                        {user?.email}
                    </DropdownMenuLabel>
                </View>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Text>Home</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Text>Profile</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Text>Settings</Text>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onPressIn={() => {
                    signOut()
                }}>
                    <Text>Log out</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}