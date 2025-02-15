"use client";

import React, { useState } from "react";
import DiaryViewMode from "./diaryViewMode";
import DiaryEditMode from "./diaryEditMode";

const DiaryDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container center">
      <div className="w-[1670px] px-[100px] pb-[80px] flex justify-center">
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
