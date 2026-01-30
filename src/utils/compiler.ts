import JSZip from "jszip";
import { saveAs } from "file-saver";
import scormBridgeSource from "../templates/ScormBridge.js?raw";
import { marked } from 'marked';

import type { CourseData } from "../types/scorm";
import { generateManifest } from "./generators";

export const compileScorm = async (course: CourseData) => {
  const zip = new JSZip();

  const processedSlides = course.slides.map(slide => ({
    ...slide,
    body: marked.parse(slide.content) // Converts MD -> HTML string
  }));

  // Create a version of the config with HTML bodies
  const runtimeConfig = { ...course, slides: processedSlides };

  // 1. Add the Manifest
  zip.file("imsmanifest.xml", generateManifest(course));

  zip.file("scorm-bridge.js", scormBridgeSource);
  // 2. Add the Course Data (for the player to read)
  zip.folder("assets")?.file("course-data.json", JSON.stringify(runtimeConfig));

  // 3. Add the Player Shell (Standard HTML/JS)
  zip.file(
    "index.html",
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${course.title}</title>
        <script src="scorm-bridge.js"></script>
      </head>
      <body onload="ScormBridge.init()" onunload="ScormBridge.finish()">
        <div id="ui">
          <h1>${course.title}</h1>
          <div id="slide-content"></div>
          <button id="next-btn">Next Slide</button>
        </div>

        <script>
          const slides = ${JSON.stringify(course.slides)};
          let currentIdx = 0;

          function render() {
            const slide = slides[currentIdx];
            document.getElementById('slide-content').innerHTML = '<h2>' + slide.title + '</h2>' + slide.content;
            
            // If it's the last slide, change button to 'Finish'
            if (currentIdx === slides.length - 1) {
              const btn = document.getElementById('next-btn');
              btn.innerText = "Finish Course";
              btn.onclick = () => ScormBridge.finish();
            }
          }

          document.getElementById('next-btn').onclick = () => {
            currentIdx++;
            render();
          };

          render();
        </script>
      </body>
    </html>
  `,
  );

  // 4. Export the ZIP
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${course.id}_package.zip`);
};
