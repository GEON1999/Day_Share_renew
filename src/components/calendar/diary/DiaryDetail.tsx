"use client";

import React, { useState } from "react";
import DiaryViewMode from "./diaryViewMode";
import DiaryEditMode from "./diaryEditMode";

const DiaryDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container center">
      <div className="w-[300px] lg:w-[1670px] lg:px-[100px] lg:pb-[80px] flex justify-center items-center lg:items-start">
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
