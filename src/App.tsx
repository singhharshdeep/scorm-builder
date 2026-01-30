import "./App.css";
import { compileScorm } from "./utils/compiler";

function App() {
  const testCourse = {
  id: "TEST_COURSE_001",
  title: "Frontend Engineering Basics",
  slides: [
    {
      id: "slide_1",
      title: "Introduction",
      content: "<h1>Welcome</h1><p>This is the first slide of our custom SCORM builder.</p>"
    },
    {
      id: "slide_2",
      title: "The Architecture",
      content: "<p>SCORM uses a <strong>parent-child</strong> communication model via JavaScript.</p>"
    },
    {
      id: "slide_3",
      title: "Final Step",
      content: "<p>Click the button below to report completion to Blackboard.</p>"
    }
  ]
};
  return (
    <>
      <button
        onClick={() =>
          compileScorm(testCourse)
        }
      >
        Export
      </button>
    </>
  );
}

export default App;
