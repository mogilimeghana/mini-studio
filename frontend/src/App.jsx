
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://mini-content-engine-9c42.onrender.com";

const getImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

function App() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const pollingRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error("Fetching jobs failed:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!productImage) {
      setPreviewImage("");
      return;
    }

    const objectUrl = URL.createObjectURL(productImage);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [productImage]);

  const generateContent = async () => {
    if (isGenerating) return;

    if (!productName.trim() || !description.trim() || !productImage) {
      alert("Please enter product name, description and upload an image.");
      return;
    }

    setIsGenerating(true);
    setStatus("processing");
    setImageUrl("");
    setJobId("");

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("productImage", productImage);

      const response = await axios.post(
        `${API_URL}/generate`,
        formData
      );

      const id = response.data.jobId;

      setJobId(id);
      setStatus(response.data.status || "processing");

      setProductName("");
      setDescription("");
      setProductImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchJobs();

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = setInterval(async () => {
        try {
          const jobResponse = await axios.get(`${API_URL}/jobs/${id}`);
          const currentStatus = jobResponse.data.status;

          setStatus(currentStatus);

          if (currentStatus === "completed") {
            setImageUrl(jobResponse.data.imageUrl);
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsGenerating(false);
            await fetchJobs();
          } else if (currentStatus === "failed") {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsGenerating(false);
            await fetchJobs();
          }
        } catch (error) {
          console.error("Status polling failed:", error.message);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setStatus("Unable to check status");
          setIsGenerating(false);
        }
      }, 2000);

    } catch (error) {
      console.error("Generation request failed:", error);
      setStatus("failed");
      setIsGenerating(false);
      await fetchJobs();
      alert("Failed to submit generation request.");
    }
  };

  const completedJobs = jobs.filter(
    (job) => job.status === "completed"
  ).length;

  const getStatusClass = (value) => {
    if (value === "completed") return "completed";
    if (value === "failed") return "failed";
    return "processing";
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a href="#" className="brand">
          <span className="brand-icon">✦</span>
          <span>mini<span className="brand-highlight">studio</span></span>
        </a>

        <div className="nav-right">
          <span className="nav-status">
            <span className="online-dot"></span>
            AI Studio
          </span>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero">
          <span className="eyebrow">✦ YOUR AI CREATIVE WORKSPACE</span>
          <h1>Bring your products to life.</h1>
          <p>
            Transform ordinary product photos into beautiful,
            professional visuals with AI.
          </p>
        </section>

        <section className="workspace">
          <div className="form-panel">
            <div className="section-heading">
              <div>
                <span className="step-label">STEP 01</span>
                <h2>Product details</h2>
                <p>Tell us about the product you want to showcase.</p>
              </div>
              <span className="heading-icon">✎</span>
            </div>

            <div className="form-group">
              <label htmlFor="productName">PRODUCT NAME</label>
              <input
                type="text"
                id="productName"
                placeholder="e.g. Bloom Essence Perfume"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">PRODUCT DESCRIPTION</label>
              <textarea
                id="description"
                rows="5"
                placeholder="Describe your product, its features, fragrance, materials, or style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="field-hint">
                A detailed description helps create better results.
              </span>
            </div>

            <div className="form-group">
              <label>REFERENCE IMAGE</label>

              <div
                className={`upload-box ${previewImage ? "has-image" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    setProductImage(file);
                  }
                }}
              >
                {previewImage ? (
                  <div className="selected-file">
                    <img src={previewImage} alt="Selected product" />
                    <div>
                      <strong>{productImage?.name}</strong>
                      <span>Image ready to upload</span>
                      <span className="change-image">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">↑</span>
                    <strong>Drop your image here</strong>
                    <span>or click to browse files</span>
                    <small>PNG, JPG or JPEG</small>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={(e) =>
                  setProductImage(e.target.files?.[0] || null)
                }
              />
            </div>

            <button
              className="generate-button"
              onClick={generateContent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Creating your image...
                </>
              ) : (
                <>✦ Generate with AI <span>→</span></>
              )}
            </button>

            <p className="privacy-note">
              ✧ Your product image is used as a reference for generation.
            </p>
          </div>

          <div className="preview-panel">
            <div className="section-heading preview-heading">
              <div>
                <span className="step-label">STEP 02</span>
                <h2>Live preview</h2>
                <p>Your AI-generated product visual appears here.</p>
              </div>
              <span className="heading-icon">◫</span>
            </div>

            <div className="image-stage">
              {imageUrl ? (
                <img
                  src={getImageUrl(imageUrl)}
                  alt="Generated product"
                  className="generated-image"
                />
              ) : (
                <div className="empty-preview">
                  {isGenerating ? (
                    <>
                      <span className="large-spinner"></span>
                      <h3>Creating something beautiful...</h3>
                      <p>Your image is being generated. Please wait.</p>
                    </>
                  ) : (
                    <>
                      <div className="preview-art">✦</div>
                      <h3>Your canvas awaits</h3>
                      <p>
                        Upload a product image and generate your
                        first AI-powered visual.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="result-meta">
              <div>
                <span>GENERATION STATUS</span>
                <strong className={`status ${getStatusClass(status)}`}>
                  {status || "Waiting"}
                </strong>
              </div>

              {jobId && (
                <div>
                  <span>JOB ID</span>
                  <strong className="job-reference">
                    {jobId.slice(0, 8)}...
                  </strong>
                </div>
              )}
            </div>

            {status === "failed" && (
              <p className="error-message">
                Image generation failed. Please try again.
              </p>
            )}

            {imageUrl && (
              <a
                className="download-button"
                href={getImageUrl(imageUrl)}
                download
                target="_blank"
                rel="noreferrer"
              >
                ↓ Download generated image
              </a>
            )}
          </div>
        </section>

        <section className="history-section">
          <div className="history-heading">
            <div>
              <span className="step-label">YOUR WORKSPACE</span>
              <h2>Generation history</h2>
              <p>All your previous product image generations.</p>
            </div>

            <div className="history-count">
              <strong>{jobs.length}</strong>
              <span>Total jobs</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span>Total generations</span>
              <strong>{jobs.length}</strong>
            </div>
            <div className="stat-card">
              <span>Completed</span>
              <strong>{completedJobs}</strong>
            </div>
            <div className="stat-card">
              <span>Failed</span>
              <strong>
                {jobs.filter((job) => job.status === "failed").length}
              </strong>
            </div>
          </div>

          <div className="table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>JOB</th>
                  <th>PROMPT</th>
                  <th>STATUS</th>
                  <th>CREATED AT</th>
                  <th>IMAGE</th>
                </tr>
              </thead>

              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="job-id">
                        {job.id.slice(0, 8)}...
                      </td>

                      <td className="prompt-cell" title={job.prompt}>
                        {job.prompt}
                      </td>

                      <td>
                        <span className={`status ${getStatusClass(job.status)}`}>
                          {job.status}
                        </span>
                      </td>

                      <td className="date-cell">
                        {new Date(job.created_at).toLocaleString()}
                      </td>

                      <td>
                        {job.image_url ? (
                          <a
                            className="view-link"
                            href={getImageUrl(job.image_url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View image ↗
                          </a>
                        ) : (
                          <span className="not-ready">Not ready</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No generations yet. Create your first product visual!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          <span>✦ mini studio</span>
          <span>Made for creative possibilities.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
