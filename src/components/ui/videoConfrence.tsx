import  { useRef, useState } from 'react';
import Webcam from "react-webcam";

const VideoInterview = () => {
  const webcamRef = useRef(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([{sender:'', text:''}]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(
    "Welcome! Let's start with your introduction. Could you tell me about yourself?"
  );

  // Questions bank
  let questionBank = [
    "What experience do you have with React?",
    "How do you handle state management in large applications?",
    "Describe a challenging project you worked on and how you solved the problems",
    "How do you approach component design?",
    "What testing strategies do you use for React applications?"
  ];

  let index= useRef(5);
  const startInterview = () => {
    setInterviewStarted(true);
    setChatMessages([
      {
        sender: 'bot',
        text: currentQuestion
      }
    ]);
  };


  
    const speakText = (text) => {
      console.log("txt",text);
      // const utterance = new SpeechSynthesisUtterance(text[text.length-1].text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // You can customize the language or voice
      window.speechSynthesis.speak(utterance);
    };

    

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const newMessages = [
      ...chatMessages,
      { sender: 'user', text: currentMessage }
    ];
    setChatMessages(newMessages);
    setCurrentMessage('');

    // Simulate bot response after delay
    setTimeout(() => {
      const nextQuestion = questionBank[index.current];
      index.current = index.current -1;
      // (      questionBank: string | any[]) => questionBank.slice(0,questionBank.length-2);
      if (nextQuestion) {
        speakText(nextQuestion);
        setCurrentQuestion(nextQuestion);
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot', text: nextQuestion }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot', text: "Thank you! That concludes our interview." }
          
        ]);
      }
      
    }, 2000);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="interview-container">
      <h1>Technical Interview</h1>
      
      {!interviewStarted ? (
        <div className="start-screen">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="preview-camera"
          />
          <button onClick={startInterview}>Start Interview</button>
        </div>
      ) : (
        <div className="interview-screen">
          <div className="video-section">
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={videoConstraints}
              className="live-camera"
            />
            <div className="current-question">
              <h3>Current Question:</h3>
              <p>{currentQuestion}</p>
            </div>
          </div>
          
          <div className="chat-section">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <strong>{msg.sender === 'bot' ? 'Interviewer' : 'You'}:</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your answer..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .interview-container {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .start-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .preview-camera {
          border-radius: 8px;
          max-width: 100%;
        }
        
        button {
          padding: 10px 20px;
          background: #0066ff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:hover {
          background: #0052cc;
        }
        
        .interview-screen {
          display: flex;
          gap: 20px;
          height: 80vh;
        }
        
        .video-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .live-camera {
          border-radius: 8px;
          width: 100%;
          height: auto;
        }
        
        .current-question {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        
        .chat-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .message {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 18px;
        }
        
        .message.bot {
          align-self: flex-start;
          background: #e5e5ea;
        }
        
        .message.user {
          align-self: flex-end;
          background: #007aff;
          color: white;
        }
        
        .chat-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #ddd;
        }
        
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default VideoInterview;
