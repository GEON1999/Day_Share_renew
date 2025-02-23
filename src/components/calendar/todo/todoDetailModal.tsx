"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";
import useSearch from "@/hooks/useSearch";
const TodoDetailModal = () => {
  const [editorMode, setEditorMode] = useState(false);
  const todoId = useSearch.useSearchQueryTodoId();
  if (!todoId) {
    return null;
  }
  return (
    <div>
      <div>
        {editorMode ? (
          <TodoEditMode setEditorMode={setEditorMode} />
        ) : (
          <TodoViewMode setEditorMode={setEditorMode} />
        )}
      </div>
    </div>
  );
};

export default TodoDetailModal;
