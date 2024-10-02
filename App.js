import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PracticeScreen from './PracticeScreen';
import StatsScreen from './StatsScreen';
import { StatisticsProvider } from './StatisticsContext';
import { Image } from 'react-native';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <StatisticsProvider>
        <NavigationContainer>
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "deepskyblue",
                tabBarInactiveTintColor: "lightgray",
                headerShown: false,
                tabBarStyle: {
                    height: 50, 
                    borderTopWidth: 4,
                    borderTopColor: "deepskyblue"
                    //padding: 20, // Add padding to center the icons/text
                },
            }}>
            <Tab.Screen name="PreCAT" 
                component={PracticeScreen} 
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('./assets/PLAYIcon.png')}
                            style={{
                                marginTop: 30,
                                width: 25,
                                height: 25,
                                resizeMode: 'contain',
                                justifyContent: "center",
                                tintColor: focused ? 'deepskyblue' : 'lightgray', // Optional tint color
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen name="Statistics" 
                component={StatsScreen}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('./assets/STATSIcon.png')}
                            style={{
                                marginTop: 30,
                                width: 25,
                                height: 25,
                                resizeMode: 'contain',
                                justifyContent: "center",
                                tintColor: focused ? 'deepskyblue' : 'lightgray', // Optional tint color
                            }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
        </NavigationContainer>
    </StatisticsProvider>
  );
}