import React, { useState } from "react";
import { db, addDoc, collection } from "../firebase";
import Layout from "../components/global/Layout";
import { Link } from "react-router";

const AddQuestion = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [type, setType] = useState("text");
  const [optionType, setOptionType] = useState("text");
  const [embed, setEmbed] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.includes("") || !correctAnswer) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    try {
      await addDoc(collection(db, "quizzes"), {
        question,
        options,
        correctAnswer,
        type,
        embed,
				optionType
      });
      alert("Pertanyaan berhasil ditambahkan!");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setType("");
      setEmbed("");
      setOptionType("");
    } catch (error) {
      console.error("Error menambahkan pertanyaan:", error);
    }
  };

  return (
    <Layout>
			<Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "45px"}}>
        <img src="/image/arrow-back.svg" width={25}/>
			</Link>
      <h3>Tambah Pertanyaan</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Pertanyaan:</label>
          <input
            type="text"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Input pertanyaan"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Question Type:</label>
          <select onChange={(e) => setType(e.target.value)} value={type} className="form-select">
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Embed (optional):</label>
          <input
            type="text"
            className="form-control"
            value={embed}
            onChange={(e) => setEmbed(e.target.value)}
            placeholder={type === "image" ? "Input URL gambar" : type === "video" ? "Input URL video" : ""}
          />
        </div>

				<div className="mb-3">
          <label className="form-label">Option Type:</label>
          <select onChange={(e) => setOptionType(e.target.value)} value={optionType} className="form-select">
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <label className="form-label">Pilihan {index + 1}:</label>
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              placeholder={`${optionType === "image" ? "Input URL gambar" : "Input jawaban"}`}
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Jawaban Benar:</label>
          <select
            className="form-select"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Pilih jawaban</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Tambah Pertanyaan</button>
      </form>
    </Layout>
  );
};

export default AddQuestion;
