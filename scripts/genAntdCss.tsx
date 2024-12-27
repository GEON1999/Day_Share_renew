import { extractStyle } from "@ant-design/static-style-extract";
import withTheme from "../src/app/ConfigProvider";
import fs from "fs";

const outputPath = "./public/antd.min.css";

const css = extractStyle(withTheme);

fs.writeFileSync(outputPath, css);
