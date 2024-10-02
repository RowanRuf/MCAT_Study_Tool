import { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StatusBar, ScrollView, Vibration, TouchableHighlight, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { StatisticsContext } from './StatisticsContext';
import ViewShot from 'react-native-view-shot';

export default function PracticeScreen() {
  
  const { 
    incorrectTopics, 
    setIncorrectTopics, 
    questionsAnswered, 
    setQuestionsAnswered,
    numOfIncorrect,
    setNumOfIncorrect,
    correctlyAnswered,
    setCorrectlyAnswered,
    imageUri,
    setImageUri,
    highestAnswerStreak,
    setHighestAnswerStreak
   } = useContext(StatisticsContext);  

  const topicsCovered = ["General Chemistry", "Organic Chemistry", "Biochemistry", "Physics", "Biology", "Molecular Biology", "Genetics", "Human Physiology", "Cell Biology", "Microbiology", "Metabolism", "Behavioral Sciences", "Psychology", "Sociology", "Critical Analysis and Reasoning", "Research Methods and Statistics", "Scientific Inquiry and Reasoning Skills"];

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Question: Which of the following theories most accurately explains the process through which individuals learn behavioral patterns by observing others?1. Psychoanalytic Theory2. Social Cognitive Theory3. Biological Determinism4. Humanistic TheoryCorrect Answer: 2");
  const [explanation, setExplanation] = useState('Loading Explanation...'); // New state to hold the explanation

  const [question, setQuestion] = useState('Loading Question...');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [topic, setTopic] = useState('');

  const [currentAnswerStreak, setCurrentAnswerStreak] = useState(0);
  const [correctAnswerPressed, setCorrectAnswerPressed ] = useState(false);
  const [answeredIncorrectly, setAnsweredIncorrectly] = useState(false);
  const [answer1Pressed, setAnswer1Pressed ] = useState(false);
  const [answer2Pressed, setAnswer2Pressed ] = useState(false);
  const [answer3Pressed, setAnswer3Pressed ] = useState(false);
  const [answer4Pressed, setAnswer4Pressed ] = useState(false);

  const [isStruggledTopic, setIsStruggledTopic] = useState(false); 

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExplanationFetched, setIsExplanationFetched] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);

  const viewShotRef = useRef(null);

  const getMostStruggledTopic = () => {
    if (Object.keys(incorrectTopics).length === 0 || (questionsAnswered % 5 !== 0)) {
      const randomTopicInt = Math.floor(Math.random() * topicsCovered.length);
      return topicsCovered[randomTopicInt]; // PickRandomTopicFromArray
    }
    setIsStruggledTopic(true);
    return Object.entries(incorrectTopics).reduce((max, topic) => {
      return topic[1] > max[1] ? topic : max;
    }, ['', 0])[0]; // Returns the topic with the highest count
  };

  const handlePress = (selectedAnswer) => {
    if (correctAnswer === selectedAnswer) {
      console.log("Correct");
      setCorrectAnswerPressed(true);
      setIsNextPressed(false);
      captureScreen();
      Vibration.vibrate();

      if(!answeredIncorrectly){
        setQuestionsAnswered(questionsAnswered + 1);
        setCorrectlyAnswered(correctlyAnswered + 1);
        incrementAnswerStreak();

        setIncorrectTopics(prev => {
          if (prev[topic]) {
            const newCount = prev[topic] - 1;
            if (newCount <= 0) {
              const { [topic]: _, ...remainingTopics } = prev; // Remove the topic if count is zero
              return remainingTopics;
            } else {
              return { ...prev, [topic]: newCount };
            }
          }
          return prev;
        });
      }
    } else {
      if(!answeredIncorrectly){
        setAnsweredIncorrectly(true);
        setCurrentAnswerStreak(0);

        setQuestionsAnswered(prevQuestionsAnswered => prevQuestionsAnswered + 1);
        setNumOfIncorrect(prevNumOfIncorrect => prevNumOfIncorrect + 1);
        setIncorrectTopics(prev => ({
          ...prev,
          [topic]: (prev[topic] || 0) + 1, // Increment or initialize the count for the topic
        }));
      }
      console.log("Wrong answer.");
    }
  };
 

  // Fetch question using OpenAI API //AI
  // const fetchChatCompletion = async (prompt) => {
  //   try {
  //     const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer sk-r6jIlN9bensebP3A9P-8cM7hl9GSrvEobwopqc9choT3BlbkFJKII8IcmXFvwoCJirvDcVjtlIyn84oBDiN7E5no7rkA` // Replace with your actual API key
  //       },
  //       body: JSON.stringify({
  //         model: "gpt-3.5-turbo",
  //         max_tokens: 100,
  //         messages: [
  //           { role: "user", content: prompt } // Pass the prompt to the API
  //         ],
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log('Response Data:', data); // Log the response data

  //     if (data && data.choices && data.choices.length > 0) {
  //       return data.choices[0].message.content.trim();
  //     } else {
  //       console.log('No choices found in the response');
  //       return '';
  //     }
  //   } catch (error) {
  //     console.error('Fetch Error:', error);
  //     return ''; // Handle error by returning an empty string
  //   }
  // };

  const generateQuestion = async () => {
    const mostStruggledTopic = getMostStruggledTopic();
    const prompt = `Create a question on the topic "${mostStruggledTopic}" that would be on the MCAT Exam. Format: Question: [The question here] 1. Answer 1 2. Answer 2 3. Answer 3 4. Answer 4 Correct Answer: [number of correct answer]`;    
    // const generatedOutput = await fetchChatCompletion(prompt); //AI
    // if (generatedOutput) {

    //   const questionMatch = generatedOutput.match(/Question:\s*(.*)\n/);
    //   const answerMatch = generatedOutput.match(/1\.\s*(.*)\n2\.\s*(.*)\n3\.\s*(.*)\n4\.\s*(.*)\n/);
    //   const correctAnswerMatch = generatedOutput.match(/Correct Answer:\s*(\d)/);

    //   if (questionMatch && answerMatch && correctAnswerMatch) {
    //     const questionStr = questionMatch[1].trim();
    //     const answerNumber1 = answerMatch[1].trim();
    //     const answerNumber2 = answerMatch[2].trim();
    //     const answerNumber3 = answerMatch[3].trim();
    //     const answerNumber4 = answerMatch[4].trim();
    //     const correctAnswerNum = correctAnswerMatch[1].trim();
  
    //     // Set the state variables
    //     setQuestion(questionStr);
    //     setAnswer1(answerNumber1);
    //     setAnswer2(answerNumber2);
    //     setAnswer3(answerNumber3);
    //     setAnswer4(answerNumber4);
    //     setCorrectAnswer(correctAnswerNum);
    //     setTopic(mostStruggledTopic);
    //     setCorrectAnswerPressed(false); // Reset answer press state for next question
    //     setAnswer1Pressed(false);
    //     setAnswer2Pressed(false);
    //     setAnswer3Pressed(false);
    //     setAnswer4Pressed(false);
    //   }
    // }
    if (output) {       //test output NOT AI
      // Set the state variables
      setQuestion("Which of the following theories most accurately explains the process through which individuals learn behavioral patterns by observing others?");
      setAnswer1("Psychoanalytic Theory");
      setAnswer2("Social Cognitive Theory");
      setAnswer3("Biological Determinism");
      setAnswer4("Humanistic Theory");
      setCorrectAnswer("2");
      setTopic(mostStruggledTopic);
      setCorrectAnswerPressed(false); // Reset answer press state for next question
      setAnswer1Pressed(false);
      setAnswer2Pressed(false);
      setAnswer3Pressed(false);
      setAnswer4Pressed(false);
    }
  };
  
  const fetchExplanation = async () => {
    if(!isExplanationFetched){
      const prompt = `Explain how to solve the following MCAT question: "${question}" with the correct answer: ${correctAnswer}`;

      // const generatedExplanation = await fetchChatCompletion(prompt); //AI
      // setExplanation(generatedExplanation); // Store the explanation //AI
      setExplanation(`Generated Explanation! Testing Purposes... Question: ${question}, Correct Answer: ${correctAnswer}`); //Test NOT AI
      
      setIsExplanationFetched(true); // Mark that explanation has been fetched
    }
  };

  const incrementAnswerStreak = () => {
    setCurrentAnswerStreak(prevStreak => {
      const newStreak = prevStreak + 1;
  
      // Update highest streak if the new streak is greater
      // if (newStreak > highestAnswerStreak) {
      //   setHighestAnswerStreak(newStreak);
      // }
  
      return newStreak;
    });
  };

  const captureScreen = () => {
    viewShotRef.current.capture().then(uri => {
      console.log("capturedScreen!");
      setImageUri(uri); // Save the captured image URI
    });
  };

  // Call generateQuestion when the program starts
  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
      <StatusBar hidden />
      <View style={{ backgroundColor: "white", flex: 1, alignItems: 'center'}}>
        <ScrollView style={{flexGrow: 1, paddingHorizontal: 35, paddingTop: 50, paddingBottom: 35}}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: 'red' }}>{isStruggledTopic ? "Redemption!" : ""}</Text><Text style={{ fontSize: 20, fontWeight: "bold", color: 'black' }}>Topic: {topic}</Text>    
    
          <Text style={{ marginTop: 5, fontWeight: "bold", fontSize: 22, color: 'deepskyblue' }}>{question}</Text>
    
          <View style={styles.buttonContainer}>
            <TouchableHighlight 
              underlayColor="deepskyblue"  
              style={answer1Pressed ? (correctAnswer === "1" ? styles.btnCorrect : styles.btnFail) : styles.btnNormal}
              disabled={correctAnswerPressed}
              onPress={() => {
                setAnswer1Pressed(true);
                handlePress("1")}}
            >
              <Text style={styles.answerText}>
                <Text style={{ fontWeight: 'bold' }}>1. </Text>
                {answer1}
              </Text>
            </TouchableHighlight>
    
            <TouchableHighlight 
              underlayColor="deepskyblue"  
              style={answer2Pressed ? (correctAnswer === "2" ? styles.btnCorrect : styles.btnFail) : styles.btnNormal}
              disabled={correctAnswerPressed}
              onPress={() => {
                setAnswer2Pressed(true);
                handlePress("2")}}
            >
              <Text style={styles.answerText}>
                <Text style={{ fontWeight: 'bold' }}>2. </Text>
                {answer2}
              </Text>
            </TouchableHighlight>
    
            <TouchableHighlight 
              underlayColor="deepskyblue"  
              style={answer3Pressed ? (correctAnswer === "3" ? styles.btnCorrect : styles.btnFail) : styles.btnNormal}
              disabled={correctAnswerPressed}
              onPress={() => {
                setAnswer3Pressed(true);
                handlePress("3")}}
            >
              <Text style={styles.answerText}>
                <Text style={{ fontWeight: 'bold' }}>3. </Text>
                {answer3}
              </Text>
            </TouchableHighlight>
    
            <TouchableHighlight 
              underlayColor="deepskyblue"  
              style={answer4Pressed ? (correctAnswer === "4" ? styles.btnCorrect : styles.btnFail) : styles.btnNormal}
              disabled={correctAnswerPressed}
              onPress={() => {
                setAnswer4Pressed(true);
                handlePress("4")}}
            >
              <Text style={styles.answerText}>
                <Text style={{ fontWeight: 'bold' }}>4. </Text>
                {answer4}
              </Text>
            </TouchableHighlight>
            {answeredIncorrectly && !correctAnswerPressed && (
              <Text style={{alignSelf: "center", color: "red", marginTop: 10, fontSize: 20, fontWeight: "bold"}}>Try Again!</Text>
            )}
            {correctAnswerPressed && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                {/* Correct text on the left */}
                <Text style={{ color: "lime", fontSize: 25, fontWeight: "bold", marginRight: 10 }}>
                  Correct!
                </Text>

                {/* Image with streak number overlaid */}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image 
                    source={require('./assets/StreakImg.png')}
                    style={{ width: 100, height: 100 }}
                  />
                  <Text style={{ position: "absolute", color: "white", fontSize: 20, fontWeight: "bold", paddingTop: 40 }}>
                    {currentAnswerStreak}
                  </Text>
                </View>
              </View>
            )}
          </View>
    
          {correctAnswerPressed && (
            <TouchableOpacity style={styles.explanationBtn}
              onPress={() => {
                setIsModalVisible(true);
                if(!isExplanationFetched){
                  setExplanation("Loading Explanation..."); // Clear previous explanation
                  fetchExplanation(); // Fetch explanation
                }
              }}
            >
              <Image
                source={require('./assets/explanationBtnImg.png')} // Replace with valid image URI or source
                style={styles.explanationImg}
              />
            </TouchableOpacity>
          )}
    
          {isExplanationFetched && (
            <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" presentationStyle="pageSheet">
              <View style={{ flex: 1, backgroundColor: "lightgray", padding: 20 }}>
                <Text style={styles.modalHeader}>Answer Explanation</Text>
                <Text style={styles.modalContent}>{explanation}</Text>
                <Button title="Close" color="deepskyblue" onPress={() => setIsModalVisible(false)} />
              </View>
            </Modal>
          )}
        </ScrollView>
    
        {correctAnswerPressed && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              if(!isNextPressed){
                setQuestion("Loading Question...");
                setIsStruggledTopic(false); //Reset Additional Topic Text
                setAnsweredIncorrectly(false);
                setIsNextPressed(true);
                generateQuestion();
                setExplanation(''); // Clear previous explanation
                setIsExplanationFetched(false); // Reset explanation state for the next question
              }
            }}
          >
            <Image
              source={require('./assets/nextBtnImg.png')} // Replace with valid image URI or source
              style={styles.nextImg}
            />
          </TouchableOpacity>
        )}
      </View>
    </ViewShot>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',    // Align buttons horizontally
    justifyContent: 'space-around',  // Spread out the buttons
    marginTop: 10,
  },
  btnNormal: {
    backgroundColor: "lightgray",             // Set a fixed width for the buttons
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  btnCorrect: {
    backgroundColor: "lime",             // Set a fixed width for the buttons
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  btnFail: {
    backgroundColor: "red",             // Set a fixed width for the buttons
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  answerText: {
    marginLeft: 10,
    fontSize: 20,
  },
  nextBtn: {
    position: 'absolute',
    top: 10,  // Distance from bottom
    right: 10,   // Distance from right
  },
  nextImg: {
    width: 75,   // Width of the image
    height: 75,  // Height of the image
  },
  modalContent: {
    fontSize: 20,
    color: "black",
  },
  modalHeader: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'deepskyblue'
  },
  explanationImg: {
    width: 190,
    height: 75,
    resizeMode: "cover"
  },
  explanationBtn:{
    alignSelf: "center",
  }
});