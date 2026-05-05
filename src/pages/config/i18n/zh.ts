export const zh = {
  common: {
    copy: "复制",
    copied: "已复制",
    copySuccess: "文档已复制到剪贴板",
    copyDocs: "复制文档",
  },
  home: {
    title: "Plain UI",
    description: "Plain 是一套轻量化、高复用、低侵入的基础UI原子组件，主打简约无过多预设样式，保留原生布局特性，兼顾通用性与定制灵活性。",
    subDescription: "无冗余样式嵌套、体积轻量，支持按需引入与样式覆写，适配移动端/中后台多场景，可快速结合Tailwind、自定义主题扩展，满足业务快速迭代与个性化视觉改造需求。",
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
    toast: "消息提示",
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
    overlay: "遮罩",
    table: "表格",
    sheet: "抽屉",
    "dropdown-menu": "下拉菜单",
    password: "密码",
    "code-block": "代码块",
  },

  "dropdown-menu": {
    title: "Dropdown Menu",
    description: "下拉菜单组件，用于展示操作列表。",
    basic: {
      title: "基础",
    },
    side: {
      title: "位置",
      top: "顶部",
      bottom: "底部",
    },
    align: {
      title: "对齐",
      start: "开始",
      center: "居中",
      end: "结束",
    },
    anatomy: {
      root: "根元素",
      trigger: "触发器",
      content: "内容",
      item: "项",
      separator: "分割线",
    },
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

  button: {
    title: "Button",
    description: "按钮组件，用于触发操作。",
    variants: {
      title: "样式",
      primary: "主要",
      secondary: "次要",
      ghost: "幽灵",
      link: "链接",
    },
    sizes: {
      title: "尺寸",
      sm: "小",
      md: "中",
      lg: "大",
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
    direction: {
      title: "方向",
      ltr: "从左到右",
      rtl: "从右到左",
    },
    withIcons: {
      title: "带图标",
    },
    anatomy: {
      button: "Button",
      icon: "图标",
      spinner: "加载指示器",
    },
  },

  toast: {
    title: "Toast",
    description: "轻量级消息提示组件。",
    types: {
      title: "类型",
    },
    descriptionText: {
      title: "带描述信息",
    },
    duration: {
      title: "持续时间",
    },
    icon: {
      title: "自定义图标",
    },
    actions: {
      title: "操作按钮",
    },
    position: {
      title: "位置",
    },
    dismiss: {
      title: "手动关闭",
    },
    callbacks: {
      title: "回调函数",
    },
    anatomy: {
      root: "根元素",
      icon: "图标",
      content: "内容",
      title: "标题",
      description: "描述",
      actions: "操作按钮",
    },
  },

  checkbox: {
    title: "Checkbox",
    description: "复选框组件，用于多选。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    disabled: {
      title: "禁用",
    },
    direction: {
      title: "方向",
      horizontal: "水平",
      vertical: "垂直",
    },
    variants: {
      title: "样式",
      default: "默认",
      squared: "方形",
    },
    anatomy: {
      group: "组",
      checkbox: "Checkbox",
      indicator: "指示器",
    },
  },

  description: {
    title: "Description",
    description: "描述组件，用于展示文本描述。",
    basic: {
      title: "基础",
    },
    anatomy: {
      description: "Description",
      title: "标题",
      content: "内容",
    },
  },

  input: {
    title: "Input",
    description: "输入框组件，用于收集用户输入。",
    basic: {
      title: "基础",
    },
    disabled: {
      title: "禁用",
    },
    error: {
      title: "错误",
    },
    prefixSuffix: {
      title: "前后缀",
    },
    anatomy: {
      group: "组",
      label: "标签",
      input: "输入框",
      leading: "前导",
      trailing: "尾随",
      description: "描述",
    },
  },

  password: {
    title: "Password",
    description: "密码输入框组件。",
    basic: {
      title: "基础",
    },
    anatomy: {
      root: "根元素",
      input: "输入框",
      toggle: "切换按钮",
    },
  },

  radio: {
    title: "Radio",
    description: "单选框组件，用于单选。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    disabled: {
      title: "禁用",
    },
    direction: {
      title: "方向",
      horizontal: "水平",
      vertical: "垂直",
    },
    variants: {
      title: "样式",
      default: "默认",
      filled: "填充",
    },
    anatomy: {
      radio: "Radio",
      group: "RadioGroup",
      indicator: "指示器",
    },
  },
};
