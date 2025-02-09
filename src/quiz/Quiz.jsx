import { Link } from "react-router";
import Layout from "../components/global/Layout.jsx";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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
        // Randomize array object
        setQuestions(quizData.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);

    // Tampilkan loading dulu
    Swal.fire({
      title: "Memeriksa jawaban...",
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading(); // Menampilkan loading spinner
      }
    });

    setTimeout(() => {
      Swal.close(); // Tutup loading setelah 1.5 detik

      if (option === questions[currentQuestion].correctAnswer) {
        setScore((prevScore) => prevScore + 1);

        // Jika sudah sampai akhir maka text jadi finish
        const text = currentQuestion + 1 === questions.length ? "Cek Nilai Akhir" : "Pertanyaan Selanjutnya";
        Swal.fire({
          icon: "success",
          title: "Jawaban Benar!",
          showConfirmButton: true,
          confirmButtonText: text,
        }).then((result) => {
          if (result.isConfirmed) {
            handleNextQuestion();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Jawaban kamu salah nih",
          showConfirmButton: true,
          confirmButtonText: "Pertanyaan Selanjutnya",
        }).then((result) => {
          if (result.isConfirmed) {
            handleNextQuestion();
          }
        });
      }
    }, 1500); // Delay 1.5 detik sebelum tampil hasil
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
                {questions[currentQuestion]?.optionType === "image" ? <img src={option} width={100} /> : option }
              </button>
            ))
          ) : (
            <p>Loading questions...</p> // ✅ Tampilkan loading jika data belum siap
          )}
          {/* {currentQuestion + 1 === questions.length && (
            <button
              className="btn btn-success mt-3"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              Finish Quiz
            </button>
            )
          } */}
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