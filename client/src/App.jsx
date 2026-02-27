import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const downloadPDF = async () => {
  const input = document.getElementById("blog-content");

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${topic || "ai-blog"}.pdf`);
};

  const generateBlog = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setBlog("");
    setCopied(false);

    try {
      const response = await fetch("https://ai-blog-generator-5suo.onrender.com/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setBlog(data.content);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
           AI Blog Generator
        </h1>

        {/* Input + Tone */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter blog topic..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="seo">SEO Optimized</option>
            <option value="technical">Technical</option>
          </select>

          <button
            onClick={generateBlog}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">
            {error}
          </p>
        )}

        {blog && (
          <div className="mt-6">

            <div className="flex justify-between mb-3">
              <button
                onClick={copyToClipboard}
                className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded-md transition"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>

              <button
                onClick={downloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1 rounded-md transition"
              >
                 Download PDF
              </button>
            </div>

            <div id="blog-content" className="prose max-w-none">
              <ReactMarkdown>{blog}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
