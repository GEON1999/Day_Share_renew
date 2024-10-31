// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // SVG 파일을 처리하기 위한 설정 추가
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            expandProps: "start",
            // SVGO를 활성화하고 설정을 지정합니다.
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      // viewBox 속성 제거를 방지합니다.
                      removeViewBox: false,
                    },
                  },
                },
                {
                  name: "removeDimensions",
                  active: true, // width와 height 속성을 제거하여 CSS로 제어 가능하게 합니다.
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
