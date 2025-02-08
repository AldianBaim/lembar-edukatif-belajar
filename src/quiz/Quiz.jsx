import { Link } from "react-router";
import Layout from "../components/global/Layout.jsx";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function Quiz() {
	const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(quizData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center"><h3>Loading questions...</h3></div>;
  }
  console.log(currentQuestion);
  return (
    <Layout>
      {!isFinished ? (
        <div className="card shadow-lg p-4">
          <Link to="/" className="text-decoration-none text-primary mb-1">
            <div>&larr; Kembali</div>
          </Link>
          <h4>Question {currentQuestion + 1} of {questions.length}</h4>
          {questions[currentQuestion]?.type === "video" && ( 
            <div class="ratio ratio-16x9">
              <iframe c src="https://www.youtube.com/embed/-_3dgN-NVMg?si=unAUIZvq6_w5ypF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          )}
          <h5 className="mt-3">{questions[currentQuestion].question}</h5>
          {questions.length > 0 && questions[currentQuestion]?.options ? ( // ✅ Pastikan data ada
            questions[currentQuestion].options.map((option, index) => ( // ✅ Pakai 'options'
              <button
                key={index}
                className={`btn btn-block my-2 ${selectedAnswer === option ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))
          ) : (
            <p>Loading questions...</p> // ✅ Tampilkan loading jika data belum siap
          )}
          <button
            className="btn btn-success mt-3"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestion + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      ) : (
        <div className="card shadow-lg p-4 text-center">
          <h3>Quiz Finished!</h3>
          <h4>Your Score: {score} / {questions.length}</h4>
          <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      )}
    </Layout>
  );
}