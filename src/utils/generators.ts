import type { CourseData } from "../types/scorm";

export const generateManifest = (data: CourseData): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${data.id}" version="1.1"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p1"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1 imscp_rootv1p1.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${data.title}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${data.title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="assets/course-data.json"/>
    </resource>
  </resources>
</manifest>`;
};
