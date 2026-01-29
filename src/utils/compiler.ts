// src/utils/compiler.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { CourseData } from '../types/scorm';
import { generateManifest } from './generators';

export const compileScorm = async (data: CourseData) => {
  const zip = new JSZip();

  // 1. Add the Manifest
  zip.file("imsmanifest.xml", generateManifest(data));

  // 2. Add the Course Data (for the player to read)
  zip.folder("assets")?.file("course-data.json", JSON.stringify(data));

  // 3. Add the Player Shell (Standard HTML/JS)
  zip.file("index.html", `
    <!DOCTYPE html>
    <html>
      <head><title>${data.title}</title></head>
      <body>
        <div id="player-root">Loading...</div>
        <script>
            // We'll build the real player in Sprint 2
            fetch('assets/course-data.json')
              .then(r => r.json())
              .then(data => {
                document.getElementById('player-root').innerHTML = '<h1>' + data.title + '</h1>';
                console.log("SCORM Course Initialized", data);
              });
        </script>
      </body>
    </html>
  `);

  // 4. Export the ZIP
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${data.id}_package.zip`);
};