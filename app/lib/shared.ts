export const appName = "Litefy UI";
export const siteUrl = "https://litefy.top";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
  user: "litefytop",
  repo: "litefy",
  branch: "main",
};

export const tabsScrollLabels = (zh: boolean) =>
  zh
    ? { prevLabel: "向左滚动标签", nextLabel: "向右滚动标签" }
    : { prevLabel: "Scroll tabs left", nextLabel: "Scroll tabs right" };

export const numberFieldLabels = (zh: boolean) =>
  zh
    ? { incrementLabel: "增加", decrementLabel: "减少" }
    : { incrementLabel: "Increase", decrementLabel: "Decrease" };

export const dialogCloseLabel = (zh: boolean) => (zh ? "关闭（Esc）" : "Close (ESC)");

export const transferMoveLabels = (zh: boolean) =>
  zh
    ? { moveRightLabel: "选中项移到右侧", moveLeftLabel: "选中项移到左侧" }
    : { moveRightLabel: "Move right", moveLeftLabel: "Move left" };

export const chatInputLabels = (zh: boolean) =>
  zh
    ? { attachLabel: "添加图片", sendLabel: "发送", removeLabel: "移除图片" }
    : { attachLabel: "Attach image", sendLabel: "Send", removeLabel: "Remove image" };
