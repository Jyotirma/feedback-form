
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    const questions = [
      { id: 'q1', question: 'How satisfied are you with our products?', type: 'rating' },
      { id: 'q2', question: 'How fair are the prices compared to similar retailers?', type: 'rating' },
      { id: 'q3', question: 'How satisfied are you with the value for money of your purchase?', type: 'rating' },
      { id: 'q4', question: 'On a scale of 1-10, how likely are you to recommend us to your friends and family?', type: 'rating' },
      { id: 'q5', question: 'What could we do to improve our service?', type: 'text' }
    ];
    setQuestions(questions);
  }, []);

  useEffect(() => {
    // Generating a new session ID and set it
    const newSessionID = generateSessionID();
    setSessionID(newSessionID);
  }, []);

  useEffect(() => {
    // Saving answers to local storage whenever it changes
    localStorage.setItem(`customerAnswers_${sessionID}`, JSON.stringify(answers));
  }, [answers, sessionID]);


  const generateSessionID = () => {
    return Date.now().toString();
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSkipQuestion = () => {
    handleAnswerChange(questions[currentQuestionIndex].id, 'Skipped');
    handleNextQuestion();
  };

  const handleSubmitSurvey = () => {
    // Setting a flag as 'COMPLETED' in local storage
    localStorage.setItem(`surveyStatus_${sessionID}`, 'COMPLETED');
    setCompleted(true);
  };

  const handleStartSurvey = () => {
    setStarted(true);
  };

  const renderQuest = ()=>{
    const que = questions[currentQuestionIndex]
   
    if(que.type==='rating'){
      const selectedAnswer = answers[que.id];
      return(
        <div>
          <p>{que.question}</p>
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                value={rating}
                checked={selectedAnswer === rating.toString()}
                onChange={(e) => handleAnswerChange(que.id, e.target.value)}
              />
              {rating}
            </label>
          ))}
        </div>
      )
    }
    else if (que.type === 'text') {
      return (
        <div>
          <p>{que.question}</p>
          <textarea rows="4" onChange={(e) => handleAnswerChange(que.id, e.target.value)}></textarea>
        </div>
      );
    }
  };

  const survey =()=>{
    if (completed) {
      return (
        <div>
          <p>Thank you for your time!</p>
          {/* Show the welcome screen after 5 seconds */}
          {setTimeout(() => {
            setCompleted(false)
            setStarted(false);
            setCurrentQuestionIndex(0);
          }, 5000)}
        </div>
      );
    }

    if (!started) {
      return (
        <div>
          <h1>Welcome to our shop!</h1>
          <h2>Please give your valuable feedback</h2>
          <button onClick={handleStartSurvey}>Start</button>
        </div>
      );
    }

    if (questions.length === 0) {
      return <p>Loading questions...</p>;
    }
    if (currentQuestionIndex === questions.length - 1) {
      return (
        <div>
          <p>Question {currentQuestionIndex + 1}/{questions.length}</p>
          {renderQuest()}
          <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button onClick={handleSubmitSurvey}>Submit</button>
        </div>
      );
    }

    return (
      <div>
        <p>Question {currentQuestionIndex + 1}/{questions.length}</p>
        {renderQuest()}
        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
        <button onClick={handleSkipQuestion}>Skip</button>
      
      </div>
    );
  
  } 
  

  return (
    <div className="App">
      <div className="cont">
        
      { survey()}
      </div>
    </div>
  );
}

export default App;
