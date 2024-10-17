"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";

const TodoDetail = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div className="main_container">
      {editorMode ? (
        <TodoEditMode setEditorMode={setEditorMode} />
      ) : (
        <TodoViewMode setEditorMode={setEditorMode} />
      )}
    </div>
  );
};

export default TodoDetail;
