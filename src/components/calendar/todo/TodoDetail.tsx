"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";

const TodoDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container center">
      <div className="w-[1400px]">
        {editorMode ? (
          <TodoEditMode setEditorMode={setEditorMode} />
        ) : (
          <TodoViewMode setEditorMode={setEditorMode} />
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
