"use client";

import React, { useState } from "react";
import DiaryViewMode from "./diaryViewMode";
import DiaryEditMode from "./diaryEditMode";

const DiaryDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container">
      {editorMode ? (
        <DiaryEditMode setEditorMode={setEditorMode} editorMode={editorMode} />
      ) : (
        <DiaryViewMode setEditorMode={setEditorMode} editorMode={editorMode} />
      )}
    </div>
  );
};

export default DiaryDetail;
