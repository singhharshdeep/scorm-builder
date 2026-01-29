import "./App.css";
import { compileScorm } from "./utils/compiler";

function App() {
  return (
    <>
      <button
        onClick={() =>
          compileScorm({
            id: "1",
            title: "Dummy Scorm",
            slides: [
              {
                id: "1",
                title: "Dummy Slide",
                content: "<h1>Dummy Header</h1>",
              },
            ],
          })
        }
      >
        Export
      </button>
    </>
  );
}

export default App;
