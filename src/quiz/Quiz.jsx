import { Link } from "react-router";
import Layout from "../components/global/Layout.jsx";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect, useRef } from "react"; // Import useRef
import Swal from "sweetalert2";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const questionAudioRef = useRef(null);

  // Add effect to handle audio ended
  useEffect(() => {
    if (questionAudioRef.current) {
      questionAudioRef.current.onended = () => setIsPlaying(false);
    }
  }, [currentQuestion]);

  // Ref untuk audio
  const correctAudio = useRef(null);
  const incorrectAudio = useRef(null);
  const gameStartAudio = useRef(null);
  const nextQuizAudio = useRef(null);
  const congratsAudio = useRef(null);

  // Add this function to handle play/pause
  const toggleAudio = () => {
    if (questionAudioRef.current) {
      if (isPlaying) {
        questionAudioRef.current.pause();
      } else {
        questionAudioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    let isMounted = true; // Track apakah komponen masih di-mount

    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (!isMounted) return; // Hindari set state jika komponen sudah unmounted
        setQuestions(quizData.sort(() => Math.random() - 0.5).slice(0, 10));

        console.log("Data fetched:", quizData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    // Cleanup function untuk mencegah memory leak jika komponen unmount sebelum fetch selesai
    return () => {
      isMounted = false;
      if (gameStartAudio.current) {
        gameStartAudio.current.pause();
      }
    };
  }, []);

  // Efek untuk memutar audio setelah gameStartAudio.current terpasang dan questions sudah di-fetch
  useEffect(() => {
    if (questions.length > 0 && gameStartAudio.current) {
      console.log(
        "Memutar gameStartAudio di dalam useEffect setelah questions ada dan audio ready"
      );

      gameStartAudio.current.play().catch((error) => {
        console.error("Autoplay dicegah:", error);
        Swal.fire({
          icon: "question",
          title: "Start Game",
          confirmButtonText: "Mulai",
        }).then(() => {
          gameStartAudio.current
            .play()
            .catch((err) => console.error("Gagal memutar:", err));
        });
      });
    } else {
      console.log("gameStartAudio belum siap atau questions belum ada");
    }
  }, [questions]); // Jalankan efek ini setiap kali state 'questions' berubah

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);

    // Tampilkan loading dulu
    Swal.fire({
      title: "Memeriksa jawaban...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan loading spinner
      },
    });

    setTimeout(() => {
      Swal.close(); // Tutup loading setelah 1.5 detik

      if (option === questions[currentQuestion].correctAnswer) {
        setScore((prevScore) => prevScore + 1);

        // Putar suara benar
        if (correctAudio.current) {
          correctAudio.current.play();
        }

        // Jika sudah sampai akhir maka text jadi finish
        const text =
          currentQuestion + 1 === questions.length
            ? "Cek Nilai Akhir"
            : "Selanjutnya";
        Swal.fire({
          icon: "success",
          title: "Jawaban Benar!",
          showConfirmButton: true,
          confirmButtonColor: "#de703a",
          confirmButtonText: text,
        }).then((result) => {
          if (result.isConfirmed) {
            handleNextQuestion();
          }
        });
      } else {
        // Putar suara salah
        if (incorrectAudio.current) {
          incorrectAudio.current.play();
        }
        Swal.fire({
          icon: "error",
          title: "Jawaban kamu salah nih",
          showConfirmButton: true,
          confirmButtonColor: "#de703a",
          confirmButtonText: "Selanjutnya",
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
      if (nextQuizAudio.current) {
        nextQuizAudio.current.play();
      }
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // play congrats audio`
      if (congratsAudio.current) {
        congratsAudio.current.play();
      }
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <h3>Loading questions...</h3>
      </div>
    );
  }

  return (
    <Layout>
      {/* Audio elements */}
      <audio
        ref={correctAudio}
        src="/audio/correct-6033.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={incorrectAudio}
        src="/audio/wrong-answer.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={gameStartAudio}
        src="/audio/game-start.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={nextQuizAudio}
        src="/audio/next-quiz.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={congratsAudio}
        src="/audio/congrats.mp3"
        preload="auto"
      ></audio>
      <Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "27px"}}>
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>
      {!isFinished ? (
        <div className="mt-3 card bg-primary p-1 border-0">
          <div className="mt-3 mb-4">
            <h6 className="text-muted">
              Tantangan {currentQuestion + 1} of {questions.length}
            </h6>
            <div
              className="progress mt-3"
              role="progressbar"
              aria-label="Basic example"
              style={{backgroundColor: "#D9D9D9", height: "10px"}}
            >
              <div
                className="progress-bar bg-orange"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* If exist question type video */}
          {questions[currentQuestion]?.type === "video" && (
            <div className="ratio ratio-16x9">
              <iframe
                src={questions[currentQuestion]?.source}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* If exist question type audio */}
          {questions[currentQuestion]?.type === "audio" && (
            <div className="d-flex justify-content-center align-items-center my-3">
              <audio
                ref={questionAudioRef}
                src={questions[currentQuestion]?.embed}
                className="d-none"
              />
              <button 
                className="btn btn-lg btn-orange rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
                onClick={toggleAudio}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`} style={{ fontSize: "24px" }}></i>
              </button>
            </div>
          )}

          {/* If exist question type image */}
          {questions[currentQuestion]?.type === "image" && (
            <img
              className="w-100"
              src={questions[currentQuestion]?.embed}
              alt={questions[currentQuestion]?.question}
            />
          )}
          
          <h5 className="my-4 text-muted">
            {questions[currentQuestion].question}
          </h5>
          {questions.length > 0 && questions[currentQuestion]?.options ? ( // ✅ Pastikan data ada
            questions[currentQuestion].options.map((option, index) => (
              // ✅ Pakai 'options'
              <button
                key={index}
                className={`btn btn-block my-2 ${
                  selectedAnswer === option
                    ? "btn-orange"
                    : "btn-outline-orange"
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                {questions[currentQuestion]?.optionType === "image" ? (
                  <img src={option} width={100} />
                ) : (
                  option
                )}
              </button>
            ))
          ) : (
            <p>Loading questions...</p> // ✅ Tampilkan loading jika data belum siap
          )}
        </div>
      ) : (
        <div className="text-center mt-4">
          <h2 className="text-orange fw-bold">
            {score >= 7 ? "Yeayy kamu hebat!" : "Jangan Menyerah!"}
          </h2>
          <h6 className="text-muted">Kamu mendapatkan nilai</h6>

          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto my-4"
            style={{ width: "180px", height: "180px", background: "#F2EBDC" }}
          >
            <div
              className="text-center fw-bold"
              style={{
                fontSize: "80px",
                color: `${
                  score <= 5 ? "#D82121" : score <= 7 ? "#46B1E2" : "#699F4C"
                }`,
              }}
            >
              {score * 10}
            </div>
          </div>
          <h6 className="text-muted">
            Kamu menjawab dengan benar {score} tantangan
          </h6>
          <button
            className="btn btn-orange w-100 mt-3"
            onClick={() => window.location.reload()}
          >
            Ulangi Tantangan
          </button>
        </div>
      )}
    </Layout>
  );
}
