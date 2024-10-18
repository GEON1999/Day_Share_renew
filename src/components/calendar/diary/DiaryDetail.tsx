"use client";

import React, { useState } from "react";
import DiaryViewMode from "./diaryViewMode";
import DiaryEditMode from "./diaryEditMode";

const DiaryDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container center">
      <div className="w-[1400px]">
        {editorMode ? (
          <DiaryEditMode setEditorMode={setEditorMode} />
        ) : (
          <DiaryViewMode
            setEditorMode={setEditorMode}
            editorMode={editorMode}
          />
        )}
      </div>
    </div>
  );
};

export default DiaryDetail;
