import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '~/lib/ctx';
import { FinancialFiguresResponse } from '~/lib/types';

const fetchFinancialFigures = async (token: string): Promise<FinancialFiguresResponse> => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/figures`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching financial figures');
    }

    return response.json();
};

const FinancialCalculator = () => {
    const { accessToken } = useSession();
    const [fromDate, setFromDate] = useState('2021-07');
    const [toDate, setToDate] = useState('2023-12');
    const [totalAmount, setTotalAmount] = useState(0);
    const [isValid, setIsValid] = useState(true);

    const { data, isError, isLoading } = useQuery<FinancialFiguresResponse>({
        queryKey: ['financialFigures', accessToken],
        queryFn: () => fetchFinancialFigures(accessToken as string),
        enabled: !!accessToken
    });

    const handleCalculate = () => {
        const fromYear = parseInt(fromDate.split('-')[0]);
        const fromMonth = parseInt(fromDate.split('-')[1]);
        const toYear = parseInt(toDate.split('-')[0]);
        const toMonth = parseInt(toDate.split('-')[1]);

        const fromDateObject = new Date(fromYear, fromMonth - 1);
        const toDateObject = new Date(toYear, toMonth - 1);

        if (toDateObject < fromDateObject) {
            setIsValid(false);
            return;
        } else {
            setIsValid(true);
        }

        const filteredData = data?.data.filter((item) => {
            const { yearPeriod, monthPeriod } = item.attributes;
            const itemDate = new Date(yearPeriod, monthPeriod - 1);
            return itemDate >= fromDateObject && itemDate <= toDateObject;
        });

        if (!filteredData) {
            setTotalAmount(0);
            return;
        }
        const total = filteredData
            .reduce((sum, item) => sum + item.attributes.totalAmount, 0)
            .toFixed(2);

        setTotalAmount(Number(total));
    };

    if (isLoading) {
        return <Text className="text-center text-lg">Loading...</Text>;
    }

    if (isError) {
        return <Text className="text-center text-lg text-red-500">Error fetching data</Text>;
    }

    return (
        <View className="p-4 w-4/5">
            <Text className="text-xl font-bold mb-4">Financial Calculator</Text>
            <View className="mb-4">
                <View className="mb-2">
                    <Text className="mb-1">From Date:</Text>
                    <TextInput
                        className="border border-gray-300 rounded px-2 py-1"
                        value={fromDate}
                        onChangeText={setFromDate}
                        placeholder="YYYY-MM"
                    />
                </View>
                <View className="mb-2">
                    <Text className="mb-1">To Date:</Text>
                    <TextInput
                        className="border border-gray-300 rounded px-2 py-1"
                        value={toDate}
                        onChangeText={setToDate}
                        placeholder="YYYY-MM"
                    />
                </View>
                {!isValid && (
                    <Text className="text-red-500">"To" date cannot be earlier than "From" date</Text>
                )}
            </View>
            <Button asChild onPress={handleCalculate}>
                <Text>
                    Calculate
                </Text>
            </Button>
            <Text className="mt-4 text-lg">Total Amount: {totalAmount}</Text>
        </View>
    );
};

export default FinancialCalculator;