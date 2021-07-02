module.exports = {
    presets: ["@vue/cli-plugin-babel/preset"],
    plugins: [
        [
            "import",
            { libraryName: "ant-design-vue", libraryDirectory: "es", style: "css" } // 注意如果没有less-loader得自己装一下
        ]
    ]
};
