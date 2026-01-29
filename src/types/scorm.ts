// src/types/scorm.ts
export interface Slide {
  id: string;
  title: string;
  content: string; // HTML or Markdown
}

export interface CourseData {
  id: string;
  title: string;
  slides: Slide[];
}