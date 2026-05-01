export const zh = {
  common: {
    copy: "复制",
    copied: "已复制",
    copySuccess: "文档已复制到剪贴板",
    copyDocs: "复制文档供 AI 使用或通过 MCP 服务器获取",
  },
  installation: "安装",
  examples: "示例",
  anatomy: "结构",
  docs: "文档",
  api: "API",
  cssClasses: "CSS 类",
  usage: "用法",
  demo: "演示",
  gettingStarted: "开始",
  introduction: "介绍",
  componentsGroup: "组件",

  components: {
    button: "按钮",
    accordion: "手风琴",
    anchor: "锚点",
    input: "输入框",
    checkbox: "复选框",
    slider: "滑块",
    textarea: "文本域",
    select: "选择器",
    loading: "加载",
    empty: "空状态",
    skeleton: "骨架屏",
    separator: "分割线",
    theme: "主题",
    title: "标题",
    text: "文本",
    description: "描述",
    field: "字段",
    spin: "旋转",
    img: "图片",
    watermark: "水印",
    show: "显示",
    "input-group": "输入组",
    radio: "单选框",
    label: "标签",
    segment: "分段",
    form: "表单",
    toggle: "切换",
    search: "搜索",
    sidebar: "侧边栏",
    paper: "纸张",
    pagination: "分页",
    transfer: "穿梭框",
    toast: "通知",
    overlay: "遮罩",
    table: "表格",
    sheet: "抽屉",
    "dropdown-menu": "下拉菜单",
    password: "密码",
    "code-block": "代码块",
  },

  accordion: {
    title: "Accordion",
    description: "手风琴组件，用于展示可折叠的内容区域。",
    basic: {
      title: "基础",
    },
    multiple: {
      title: "多个展开",
    },
    controlled: {
      title: "受控",
    },
    anatomy: {
      title: "结构",
      accordion: "Accordion",
      item: "项",
      trigger: "触发器",
      titleLabel: "标题",
      content: "内容",
    },
  },

  anchor: {
    title: "锚点",
    description: "页面锚点导航组件。",
    basic: {
      title: "基础",
    },
    withSections: {
      title: "分组",
    },
    anatomy: {
      anchor: "锚点",
      section: "分组",
      item: "项",
      link: "链接",
    },
  },

  checkbox: {
    title: "复选框",
    description: "复选框组件，用于多选场景。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    direction: {
      title: "方向",
    },
    disabled: {
      title: "禁用",
    },
    variant: {
      title: "变体",
    },
    anatomy: {
      group: "组",
      checkbox: "复选框",
      indicator: "指示器",
    },
  },

  radio: {
    title: "单选框",
    description: "单选框组件，用于单选场景。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    direction: {
      title: "方向",
    },
    disabled: {
      title: "禁用",
    },
    variant: {
      title: "变体",
    },
    anatomy: {
      group: "组",
      radio: "单选框",
      indicator: "指示器",
    },
  },

  description: {
    title: "描述",
    description: "辅助描述组件，用于提供额外的说明信息。",
    basic: {
      title: "基础用法",
    },
  },

  input: {
    title: "输入框",
    description: "输入框组件，用于接收用户文本输入。",
    basic: {
      title: "基础",
    },
    prefixSuffix: {
      title: "前缀/后缀",
    },
    error: {
      title: "错误状态",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      group: "容器",
      label: "标签",
      input: "输入框",
      leading: "前缀",
      trailing: "后缀",
      error: "错误信息",
      description: "描述",
    },
  },

  password: {
    title: "密码输入框",
    description: "带显示/隐藏密码功能的输入框。",
    basic: {
      title: "基础",
    },
    anatomy: {
      root: "根元素",
      input: "输入框",
      toggle: "切换按钮",
    },
  },

  "dropdown-menu": {
    title: "下拉菜单",
    description: "弹出式菜单组件，用于展示可切换的选项列表。",
    basic: {
      title: "基础",
    },
    align: {
      title: "对齐方式",
    },
    side: {
      title: "方向",
    },
    anatomy: {
      root: "根元素",
      trigger: "触发器",
      content: "内容",
    },
  },

  button: {
    title: "按钮",
    description: "按钮组件，用于触发操作。",
    variants: {
      title: "变体",
    },
    disabled: {
      title: "禁用",
    },
    loading: {
      title: "加载中",
    },
    iconOnly: {
      title: "仅图标",
    },
    withIcons: {
      title: "带图标",
    },
    direction: {
      title: "方向",
    },
  },
} as const;
