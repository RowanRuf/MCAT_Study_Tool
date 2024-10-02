import React, { createContext, useState } from 'react';

// Create the context
export const StatisticsContext = createContext();

// Create a provider component
export const StatisticsProvider = ({ children }) => {
  const [incorrectTopics, setIncorrectTopics] = useState({}); // State to store incorrect topics
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [numOfIncorrect, setNumOfInccorect] = useState(0);
  const [correctlyAnswered, setCorrectlyAnswered] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [highestAnswerStreak, setHighestAnswerStreak] = useState(0);

  return (
    <StatisticsContext.Provider 
        value={{ 
            incorrectTopics, 
            setIncorrectTopics,
            questionsAnswered,
            setQuestionsAnswered,
            numOfIncorrect,
            setNumOfInccorect,
            correctlyAnswered,
            setCorrectlyAnswered,
            imageUri,
            setImageUri,
            highestAnswerStreak,
            setHighestAnswerStreak,
            }}>
      {children}
    </StatisticsContext.Provider>
  );
};