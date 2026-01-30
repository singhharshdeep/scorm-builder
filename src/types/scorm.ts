// src/types/scorm.ts
export interface Slide {
  id: string;
  title: string;
  content: string; // HTML or Markdown
  media?: {
    file: File;        // The actual File object from the <input>
    type: 'image' | 'video';
    name: string;      // The filename we'll use inside the ZIP
  };
}

export interface CourseData {
  id: string;
  title: string;
  slides: Slide[];
}