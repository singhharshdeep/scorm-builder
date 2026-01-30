import { useState } from "react";
import type { CourseData, Slide } from "../types/scorm";
import { compileScorm } from "../utils/compiler";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";

export default function App() {
  const [course, setCourse] = useState<CourseData>({
    id: `course_${Date.now()}`,
    title: "My First SCORM Course",
    slides: [
      {
        id: uuidv4(),
        title: "Introduction",
        content: "<h1>Welcome</h1><p>Start editing...</p>",
      },
    ],
  });

  const [activeSlideId, setActiveSlideId] = useState<string>(
    course.slides[0].id,
  );
  const activeSlide = course.slides.find((s) => s.id === activeSlideId);

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setCourse((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const addSlide = () => {
    const newSlide = {
      id: uuidv4(),
      title: "New Slide",
      content: "<p>New Content</p>",
    };
    setCourse((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setActiveSlideId(newSlide.id);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
        <input
          className="text-xl font-bold border-none focus:ring-0 w-1/2"
          value={course.title}
          onChange={(e) =>
            setCourse((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <button
          onClick={() => compileScorm(course)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
        >
          Export SCORM (.zip)
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Slide List */}
        <aside className="w-64 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={addSlide}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-md text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm font-medium"
            >
              + Add New Slide
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {course.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSlideId === slide.id
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="opacity-50 mr-2">{index + 1}.</span>
                {slide.title || "Untitled Slide"}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Stage: Editor */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          {activeSlide ? (
            <div className="max-w-4xl w-full mx-auto space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-uppercase tracking-wider text-slate-400 font-bold">
                  SLIDE TITLE
                </label>
                <input
                  className="w-full text-3xl font-bold border-none bg-transparent focus:ring-0 p-0"
                  value={activeSlide.title}
                  onChange={(e) =>
                    updateSlide(activeSlide.id, { title: e.target.value })
                  }
                  placeholder="Enter title..."
                />
              </div>

              <div className="space-y-2 flex flex-col flex-1 min-h-100">
                <label className="text-xs font-uppercase tracking-wider text-slate-400 font-bold">
                  CONTENT (Markdown)
                </label>
                <textarea
                  className="flex-1 w-full p-4 border rounded-xl font-mono text-sm bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={activeSlide.content}
                  onChange={(e) =>
                    updateSlide(activeSlide.id, { content: e.target.value })
                  }
                  placeholder="<p>Enter HTML content here...</p>"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-400 mb-2">
                  PREVIEW
                </label>
                <div
                  className="flex-1 p-4 border rounded-xl bg-white overflow-y-auto prose prose-slate"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(activeSlide.content),
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Select a slide to start editing
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
