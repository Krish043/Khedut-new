import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Chat.css';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('Please type a message before sending.');
      return;
    }

    const newQuestions = [...questions, message];
    setQuestions(newQuestions); // display user's message immediately
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/messages`, {
        message,
      });

      if (response.status === 200) {
        setAnswers([...answers, response.data.answer]);
      } else {
        setAnswers([...answers, 'Error: Failed to get a response.']);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setAnswers([...answers, 'Error: An error occurred while sending the message.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[90vh] mt-12 p-5 flex items-center justify-center'>
      <div className="flex flex-col h-[80vh] w-[70vw] mx-auto bg-gray-100 rounded-xl shadow-lg border border-gray-300">
        <div className="rounded-t-xl bg-success text-white p-4 text-center text-xl font-bold">
          Khedut Saathi
        </div>

        <div className="flex-1 p-4 overflow-auto bg-gray-200 rounded-b-xl">
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((que, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  {/* User message */}
                  <div className="self-end flex items-center gap-2 max-w-xs p-3 bg-green-200 text-gray-800 rounded-lg shadow-md">
                    <span>{que}</span>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-xs">
                      🧑‍💻
                    </div>
                  </div>

                  {/* Bot reply */}
                  {index < answers.length && (
                    <div className="self-start flex items-start gap-2 max-w-xs p-3 bg-white text-gray-800 rounded-lg shadow-md">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                        🤖
                      </div>
                      <span>{answers[index]}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No messages yet.</p>
            )}

            {/* Bot typing indicator */}
            {loading && questions.length > answers.length && (
              <div className="self-start flex items-center gap-2 mt-2 text-gray-500 text-sm">
                <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs">
                  🤖
                </div>
                <div className="italic animate-pulse">Typing...</div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="bg-white p-4 flex items-center border-t border-gray-300 rounded-b-xl">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg border-gray-300 bg-white focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`ml-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-success hover:bg-blue-600'} transition`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
