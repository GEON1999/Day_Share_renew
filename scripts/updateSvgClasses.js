const fs = require("fs");
const path = require("path");

// SVG 파일이 있는 디렉토리 경로
const svgDirectory = "./src/icons";

// 디렉토리 내 모든 SVG 파일을 읽어 처리
fs.readdir(svgDirectory, (err, files) => {
  if (err) {
    console.error("디렉토리를 읽는 중 오류 발생:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".svg") {
      const filePath = path.join(svgDirectory, file);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`${file} 파일을 읽는 중 오류 발생:`, err);
          return;
        }

        // 파일 이름을 기반으로 고유한 접두사 생성
        const uniquePrefix = path.basename(file, ".svg");

        // 스타일 정의와 클래스명 변경
        const updatedData = data
          .replace(/\.cls-(\d+)/g, (match, p1) => {
            return `.${uniquePrefix}-cls-${p1}`;
          })
          .replace(/class="cls-(\d+)"/g, (match, p1) => {
            return `class="${uniquePrefix}-cls-${p1}"`;
          });

        // 파일에 변경된 내용 쓰기
        fs.writeFile(filePath, updatedData, "utf8", (err) => {
          if (err) {
            console.error(`${file} 파일을 쓰는 중 오류 발생:`, err);
          } else {
            console.log(`${file} 파일의 클래스명이 고유하게 변경되었습니다.`);
          }
        });
      });
    }
  });
});
