import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { useContext, useState } from 'react'
import { StatisticsContext } from './StatisticsContext';
import { PieChart } from 'react-native-svg-charts';


export default function StatsScreen() {
    const { incorrectTopics, questionsAnswered, numOfIncorrect, correctlyAnswered, imageUri, highestAnswerStreak } = useContext(StatisticsContext);
    const accuracy = (correctlyAnswered/questionsAnswered) * 100;
    // Pie chart data: accuracy and inaccuracy (remaining %)
    const data = [
        {
        key: 1,
        value: accuracy,
        svg: { fill: 'lime' }, // Green for correct answers
        },
        {
        key: 2,
        value: 100 - accuracy,
        svg: { fill: 'red' }, // Red for incorrect answers
        },
    ];
    
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Practice These Topics</Text>
                    <View>
                        {Object.entries(incorrectTopics).map(([topicName, count]) => (
                            <View key={topicName} style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                                <View style={count > 2 ? styles.severeStruggleBox: styles.mildStruggleBox}></View>
                                <Text style={styles.topicText}>
                                    {topicName}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={{position: "absolute", bottom: 15, right: 15}}>
                        <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "right"}}>Total: {questionsAnswered}</Text>
                        <Text style={{fontSize: 15, color: "lime", fontWeight: "bold", textAlign: "right"}}>Correct: {correctlyAnswered}</Text>
                        <Text style={{fontSize: 15, color: "red", fontWeight: "bold", textAlign: "right"}}>Wrong: {numOfIncorrect}</Text>
                    </View>
                    <Text style={styles.headerText}>Accuracy</Text>
            
                    <View style={styles.pieChartContainer}>
                        <PieChart style={{ height: 200 }} data={data} />
                    </View>

                    <Text style={styles.accuracyText}>
                        {accuracy.toFixed(2)}%
                    </Text>
                    <View style={{ position: 'absolute', left: 10, bottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image 
                            source={require('./assets/StreakImg.png')}
                            style={{ width: 80, height: 80 }}
                        />
                        <Text style={{ position: "absolute", color: "white", fontSize: 20, fontWeight: 'bold', paddingTop: 16 }}>
                            {highestAnswerStreak} 
                        </Text>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>
                            Highest Streak
                        </Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Most Recent Question</Text>
                    {imageUri && (                
                        <Image
                            source={{ uri: imageUri }}
                            style={{marginTop: 5, alignSelf: "center", width: 320, height: 480, resizeMode: "contain"}}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 50,
        width: '100%',
    },
    contentContainer: {
        backgroundColor: 'deepskyblue',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowOffset: {width: 5, height: 5},
        shadowColor: 'black',
        shadowOpacity: 0.5,         // Shadow opacity (0 to 1)
        shadowRadius: 4,          // Shadow blur radius
    },
    headerText: {
        alignSelf: "center",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    topicText: {
        fontSize: 18,
        marginVertical: 5,
        fontFamily: "Monster"
    },
    pieChartContainer: {
        marginBottom: 30,
    },
    accuracyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        position: "absolute",
        alignSelf: "center",
        top: "54%"
    },
    mildStruggleBox:{
        width: 18,
        height: 18,
        backgroundColor: "orange",
        marginRight: 5,
        borderRadius: 5,
    },
    severeStruggleBox:{
        width: 18,
        height: 18,
        backgroundColor: "red",
        marginRight: 5,
        borderRadius: 5,
    }
});