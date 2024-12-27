import React from "react";
import { ConfigProvider } from "antd";
import ko_KR from "antd/locale/ko_KR";
const backgroundColor = "#f8e0f1";
const borderColor = "#FFE5CA";
const secondaryBorderColor = "#FFE5CA";
const pointColor = "#E74646";

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: pointColor,
          colorBgBase: "white",
          fontFamily: "Noto Sans",
        },
      }}
    >
      <ConfigProvider
        locale={ko_KR}
        theme={{
          token: {
            colorBorderSecondary: secondaryBorderColor,
            colorBorder: borderColor,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
);

export default withTheme;
export { backgroundColor, pointColor, borderColor, secondaryBorderColor };
