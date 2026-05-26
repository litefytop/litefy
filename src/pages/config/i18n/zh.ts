export const zh = {
  common: {
    copy: "复制",
    copied: "已复制",
    copySuccess: "文档已复制到剪贴板",
    copyDocs: "复制文档",
    className:
      "支持 string | string[] | boolean | null | undefined | Record<string,string | string[]>",
    prop: "属性",
    type: "类型",
    default: "默认值",
    description: "描述",
    theme: {
      light: "浅色",
      dark: "深色",
      system: "跟随系统",
    },
  },
  home: {
    title: "Litefy UI",
    description:
      "Litefy 是一套轻量化、高复用、低侵入的基础UI原子组件，主打简约无过多预设样式，保留原生布局特性，兼顾通用性与定制灵活性。",
    subDescription:
      "无冗余样式嵌套、体积轻量，支持按需引入与样式覆写，适配移动端/中后台多场景，可快速结合Tailwind、自定义主题扩展，满足业务快速迭代与个性化视觉改造需求。",
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
    button: "Button 按钮",
    accordion: "Accordion 手风琴",
    "accordion-controlled": "Accordion 手风琴（受控）",
    anchor: "Anchor 锚点",
    toast: "Toast 消息提示",
    dialog: "Dialog 对话框",
    drawer: "Drawer 抽屉",
    input: "Input 输入框",
    checkbox: "Checkbox 复选框",
    slider: "Slider 滑块",
    textarea: "Textarea 文本域",
    tabs: "Tabs 标签页",
    upload: "Upload 上传",
    "date-picker": "DatePicker 日期选择",
    select: "Select 选择器",
    loading: "Loading 加载",
    empty: "Empty 空状态",
    skeleton: "Skeleton 骨架屏",
    separator: "Separator 分割线",
    theme: "Theme 主题",
    title: "Title 标题",
    text: "Text 文本",
    description: "Description 描述",
    spin: "Spin 旋转",
    image: "Image 图片",
    watermark: "Watermark 水印",
    radio: "Radio 单选框",
    label: "Label 标签",
    search: "Search 搜索",
    sidebar: "Sidebar 侧边栏",
    paper: "Paper 纸张",
    pagination: "Pagination 分页",
    transfer: "Transfer 穿梭框",
    overlay: "Overlay 遮罩",
    table: "Table 表格",
    sheet: "Sheet 抽屉",
    dropdown: "Dropdown 下拉菜单",
    password: "Password 密码",
    "number-field": "NumberField 数字输入框",
  },

  "dropdown": {
    title: "下拉菜单",
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
      label: "标签",
    },
    api: {
      sectionTitles: {
        dropdownProps: "dropdown Props",
        dropdownTriggerProps: "dropdownTrigger Props",
        dropdownContentProps: "dropdownContent Props",
        dropdownItemProps: "dropdownItem Props",
        dropdownSeparatorProps: "dropdownSeparator Props",
        dropdownLabelProps: "dropdownLabel Props",
      },
      dropdownProps: {
        children: "子组件",
      },
      triggerProps: {
        children: "触发器内容",
        target: "关联的 Content ID",
      },
      contentProps: {
        children: "菜单内容",
        popover: "弹出模式",
        alignX: "水平对齐",
        alignY: "垂直对齐",
      },
      itemProps: {
        children: "菜单项内容",
        onClick: "点击回调",
      },
      separatorProps: {},
      labelProps: {},
    },
  },

  accordion: {
    title: "手风琴",
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
    icon: {
      title: "自定义图标",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      title: "结构",
      accordion: "手风琴",
      item: "子组件",
      summary:"摘要",
      content: "内容",
    },
    api: {
      props: {

 
        icon: "自定义展开/收起图标",
      },
      itemProps: {
        value: "唯一标识符（必填）",
        label: "标题内容（必填）",
        itemProps: "内部封装属性透传配置",
        icon: "自定义图标（覆盖 Accordion 的 icon）",
      },
      itemPropsConfig: {
        summary: "摘要元素属性",
        content: "内容区域属性",
      },

      sectionTitles: {
        accordionProps: "Accordion Props",
        accordionItemProps: "Accordion.Item Props",
        itemPropsConfig: "itemProps 配置",
      },
    },
  },

  accordionControlled: {
    title: "手风琴（受控）",
    description: "受控模式的手风琴组件，支持通过状态管理精确控制展开/收起行为。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控模式",
    },
    multiple: {
      title: "多选模式",
    },
    icon: {
      title: "自定义图标",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      title: "结构",
      accordion: "手风琴",
      item: "子组件",
      label: "标题",
      content: "内容",
    },
    api: {
      props: {
        defaultOpenKeys: "默认展开的键数组",
        openKeys: "受控的展开键数组",
        onOpenChange: "展开状态变化时的回调",
        allowMultiple: "是否允许多选",
        icon: "自定义展开/收起图标",
      },
      itemProps: {
        value: "唯一标识符（必填）",
        label: "标题内容（必填）",
        itemProps: "内部封装属性透传配置",
        icon: "自定义图标（覆盖 AccordionControlled 的 icon）",
      },
      itemPropsConfig: {
        root: "根元素属性",
        label: "标签元素属性",
        content: "内容区域属性",
      },
      sectionTitles: {
        accordionProps: "AccordionControlled Props",
        accordionItemProps: "AccordionControlled.Item Props",
        itemPropsConfig: "itemProps 配置",
      },
    },
  },

  anchor: {
    title: "锚点",
    description: "页面锚点导航组件。",
    examples: {
      description:
        "默认监听根元素，由于示例使用 iframe 容器，因此需要手动指定 root 属性。",
    },
    scrollBehavior: {
      title: "滚动行为",
      description:
        "锚点组件使用 CSS scroll-margin-top 实现正确的滚动定位。使用锚点导航时，需要给目标元素添加 scroll-margin-top 样式：",
      note: "根据 Header 高度调整该值，确保点击锚点链接时目标内容不会被 Header 遮挡。",
    },
    anatomy: {
      anchor: "锚点",
      section: "分组",
      item: "项",
      link: "链接文本",
    },
    api: {
      sectionTitles: {
        anchorProps: "Anchor Props",
        anchorSectionProps: "Anchor.Section Props",
        anchorItemProps: "Anchor.Item Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        rootMargin: "IntersectionObserver 的根边距（上 右 下 左）",
        root: "IntersectionObserver 的根元素。在 iframe 中默认为 document.documentElement 以修复视口偏移问题",
      },
      sectionProps: {
        href: "锚点目标 ID（带 # 前缀，可选）",
        linkText: "链接文本",
        itemProps: "内部封装属性透传",
      },
      itemProps: {
        href: "锚点目标 ID（带 # 前缀）",
      },
      itemPropsConfig: {
        link: "链接 `<a>` 标签属性",
        nav: "内部导航 `<nav>` 容器属性",
      },
    },
  },

  button: {
    title: "按钮",
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

    withIcons: {
      title: "带图标",
    },
    anatomy: {
      button: "按钮",
      icon: "图标",
      spinner: "加载指示器",
    },
    api: {
      sectionTitles: {
        buttonProps: "Button Props",
        loadingConfig: "ButtonLoadingConfig",
      },
      props: {
        variant: "按钮样式变体",
        loading: "加载状态配置",
      },
      loadingConfig: {
        icon: "图标元素属性",
        loading: "加载状态",
      },
    },
  },

  toast: {
    title: "消息提示",
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
    api: {
      sectionTitles: {
        toastOptions: "Toast Options",
        toasterProps: "Toaster Props",
      },
      toastOptions: {
        type: "消息类型",
        title: "标题",
        description: "描述信息",
        icon: "自定义图标",
        duration: "显示时长（毫秒），设为 Infinity 则不自动关闭",
        onDismiss: "关闭时的回调",
        onAutoClose: "自动关闭时的回调",
        actions: "操作按钮数组",
      },
      toasterProps: {
        position: "消息位置",
        visibleToasts: "最大显示数量",
      },
    },
  },

  checkbox: {
    title: "复选框",
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

    variants: {
      title: "变体",
    },
    validation: {
      title: "校验",
    },
    anatomy: {
      checkbox: "复选框",
      label: "标签",
      description: "描述",
      content: "内容",
      item: "标签及指示器",
    },
    api: {
      sectionTitles: {
        checkboxProps: "Checkbox Props",
        checkboxItemProps: "Checkbox.Item Props",
        itemPropsConfig: "itemProps 配置",
        itemProps: "itemProps 配置",
      },
      props: {
        value: "选中的值（受控模式）",
        defaultValue: "初始选中的值（非受控模式）",
        onValueChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        invalid: "无效状态，支持 boolean 或 string 类型",
        disabled: "是否禁用整个组",
        name: "表单字段名称",
        label: "标签文本",
        description: "描述文本",
        itemProps: "内部元素属性透传配置",
        options: "选项数组，用于渲染多个复选框",
      },
      item: {
        value: "复选框的值（必填）",
        onCheckedChange: "选中状态变化回调",
        disabled: "是否禁用",
        variant: "样式变体",
        indicator: "指示器配置",
        itemProps:"内部元素属性透传配置"
      },

      itemProps: {

        content: "内容容器 `<div>` 元素属性",
        label: "标签 `<span>` 元素属性",
        description: "描述 `<small>` 元素属性",
        invalid: "无效文本 `<span>` 元素属性",
        options: "选项项 `<button>` 元素属性",
      },
    },
  },

  description: {
    title: "描述",
    description: "描述组件，用于展示文本描述。",
    basic: {
      title: "基础",
    },
    api: {
      sectionTitles: {
        descriptionProps: "Description Props",
      },

    },
  },

  empty: {
    title: "空状态",
    description: "空状态组件，用于展示无数据时的提示。",
    basic: {
      title: "基础",
    },
    custom: {
      title: "自定义",
    },
    api: {
      sectionTitles: {
        emptyProps: "Empty Props",
      },
      props: {
        icon: "图标，与子组件互斥",
        text: "文字，与子组件互斥",
        children:"子组件，与文字图标互斥",
      },
    },
  },

  input: {
    title: "输入框",
    description: "输入框组件，用于收集用户输入。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    disabled: {
      title: "禁用",
    },
    validation: {
      title: "校验",
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
    api: {
      sectionTitles: {
        inputProps: "Input Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        value: "输入值（受控模式）",
        defaultValue: "初始输入值（非受控模式）",
        onChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        placeholder: "占位符",
        type: "输入类型",
        invalid: "无效信息",
        label: "标签文本",
        description: "描述文本",
        leading: "前导内容",
        trailing: "尾随内容",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        group: "组容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        invalid: "无效信息 `<small>` 属性",
        leading: "前导容器 `<span>` 属性",
        trailing: "尾随容器 `<span>` 属性",
        description: "描述 `<small>` 属性",
      },
    },
  },

  password: {
    title: "密码",
    description: "密码输入框组件。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    validation: {
      title: "校验",
    },
    anatomy: {
      root: "根元素",
      input: "输入框",
      toggle: "切换按钮",
    },
    api: {
      sectionTitles: {
        passwordProps: "Password Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        value: "输入值（受控模式）",
        defaultValue: "初始输入值（非受控模式）",
        onChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        label: "标签文本",
        description: "描述文本",
        invalid: "无效信息",
        leading: "前缀内容",
        trailing: "后缀内容",
        placeholder: "占位符",
        disabled: "是否禁用",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        root: "根容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        group: "输入框组 `<div>` 属性",
        leading: "前缀 `<span>` 属性",
        trailing: "后缀 `<span>` 属性",
        invalid: "无效 `<div>` 属性",
        description: "描述 `<small>` 属性",
        toggle: "切换按钮 `<button>` 属性",
      },
    },
  },

  slider: {
    title: "滑块",
    description: "滑块组件，用于选择范围内的数值。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    orientation: {
      title: "方向",
    },
    anatomy: {
      input: "滑块",
    },
    api: {
      sectionTitles: {
        sliderProps: "Slider Props",
      },
      props: {
        value: "当前值（受控模式）",
        defaultValue: "初始值（非受控模式）",
        orientation: "方向：horizontal 或 vertical",
        disabled: "是否禁用",
      },
    },
  },

  textarea: {
    title: "文本域",
    description: "多行文本输入组件，用于收集用户输入。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    validation: {
      title: "校验",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      root: "根元素",
      label: "标签",
      textarea: "文本域",
      description: "描述",
    },
    api: {
      sectionTitles: {
        textareaProps: "Textarea Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        value: "输入值（受控模式）",
        defaultValue: "初始输入值（非受控模式）",
        onChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        placeholder: "占位符",
        disabled: "是否禁用",
        invalid: "无效信息",
        label: "标签文本",
        description: "描述文本",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        root: "根容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        invalid: "无效 `<small>` 属性",
        description: "描述 `<small>` 属性",
      },
    },
  },

  tabs: {
    title: "标签页",
    description: "标签页组件，用于在多个内容面板之间切换。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    vertical: {
      title: "垂直方向",
    },
    disabled: {
      title: "禁用",
    },
    styled: {
      title: "自定义样式",
    },
    anatomy: {
      root: "根元素",
      list: "列表容器",
      trigger: "触发器",
      content: "内容面板",
    },
    api: {
      sectionTitles: {
        tabsProps: "Tabs Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        options: "标签选项配置数组",
        defaultValue: "默认选中的标签值（非受控）",
        value: "选中的标签值（受控）",
        onValueChange: "标签切换回调",
        orientation: "方向：horizontal 或 vertical",
        activationMode: "激活模式：automatic 或 manual",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        list: "列表容器 `<div>` 属性",
        trigger: "触发器 `<button>` 属性",
        content: "内容面板 `<div>` 属性",
      },
    },
    docs: {
      introduction: "Tabs 组件用于在多个相关内容的面板之间进行切换。它支持受控和非受控模式，并提供水平和垂直两种布局方向。",
      features: [
        "支持受控和非受控两种模式",
        "提供水平和垂直两种布局方向",
        "支持键盘导航，符合 WAI-ARIA 标准",
        "支持自动和手动两种激活模式",
        "可通过 itemProps 透传内部元素属性",
      ],
      usage: "使用 Tabs 组件时，需要传入 options 数组配置所有标签选项。每个选项包含 value、label、children 和可选的 disabled 属性。",
    },
  },

  upload: {
    title: "上传",
    description: "文件上传组件，支持自定义校验逻辑。",
    basic: {
      title: "基础",
    },
    validation: {
      title: "校验",
    },
    multiple: {
      title: "多选",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      root: "根元素",
      label: "标签",
      input: "输入框",
      description: "描述",
    },
    api: {
      sectionTitles: {
        uploadProps: "Upload Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        label: "标签文本",
        description: "描述文本",
        invalid: "无效信息",
        disabled: "是否禁用",
        multiple: "是否多选",
        accept: "接受的文件类型",
        onChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        root: "根容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        description: "描述 `<small>` 属性",
        invalid: "无效信息 `<small>` 属性",
      },
    },
  },

  "date-picker": {
    title: "日期选择",
    description: "日期选择输入组件。",
    basic: {
      title: "基础",
    },
    type: {
      title: "类型",
    },
    disabled: {
      title: "禁用",
    },
    anatomy: {
      root: "根元素",
      label: "标签",
      input: "输入框",
      description: "描述",
    },
    api: {
      sectionTitles: {
        datePickerProps: "DatePicker Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        label: "标签文本",
        description: "描述文本",
        invalid: "无效信息",
        placeholder: "占位符",
        type: "输入类型",
        onChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        root: "根容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        description: "描述 `<small>` 属性",
        invalid: "无效信息 `<small>` 属性",
      },
    },
    valueNote: "值映射",

  },

  select: {
    title: "选择器",
    description: "选择器组件，用于从选项列表中选择。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    validation: {
      title: "校验",
    },
    disabled: {
      title: "禁用",
    },
    group: {
      title: "分组",
    },
    multiple: {
      title: "多选",
    },
    anatomy: {
      root: "根元素",
      label: "标签",
      group: "选择器组",
      select: "选择器",
      leading: "前缀",
      trailing: "后缀",
      invalid: "无效信息",
      description: "描述",
    },
    api: {
      sectionTitles: {
        selectProps: "Select Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        value: "选中的值（受控模式）",
        defaultValue: "初始选中的值（非受控模式）",
        onChange: "值变化回调",
        options: "选项列表（支持单层或分组）",
        placeholder: "占位符",
        disabled: "是否禁用",
        multiple: "是否多选",
        invalid: "无效信息",
        label: "标签文本",
        description: "描述文本",
        leading: "前缀内容",
        trailing: "后缀内容",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        group: "选择器组 `<div>` 属性",
        label: "标签 `<label>` 属性",
        invalid: "无效信息 `<div>` 属性",
        description: "描述 `<small>` 属性",
        leading: "前缀 `<span>` 属性",
        trailing: "后缀 `<span>` 属性",
      },
    },
  },

  loading: {
    title: "加载",
    description: "加载组件，用于展示内容加载状态。",
    basic: {
      title: "基础",
    },
    custom: {
      title: "自定义",
    },
    api: {
      sectionTitles: {
        loadingProps: "Loading Props",
      },
      props: {
        loading: "是否显示加载状态",
        children: "子组件",
        fallback: "加载时显示的占位符",
        skeleton: "骨架屏内容",
        className: "自定义类名",
      },
    },
  },

  image: {
    title: "图片",
    description: "图片组件，支持加载状态和错误处理。",
    basic: {
      title: "基础",
    },
    skeleton: {
      title: "自定义骨架屏",
    },
    failure: {
      title: "自定义错误",
    },
    progressive: {
      title: "渐进式加载",
    },
    api: {
      sectionTitles: {
        imageProps: "Image Props",
      },
      props: {
        src: "图片地址（必填）",
        alt: "图片描述",
        skeleton: "加载时显示的骨架屏内容",
        fallback: "加载失败时显示的内容",
        placeholderSrc: "渐进式图片加载的占位图源",
        delay: "延迟加载时间（毫秒）",
      },
    },
  },

  radio: {
    title: "单选框",
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
    variant: {
      title: "变体",
    },
    validation: {
      title: "校验",
    },
    anatomy: {
      group: "组",
      label: "标签",
      description: "描述",
      item: "项",
      indicator: "指示器",
    },
    api: {
      sectionTitles: {
        radioProps: "Radio Props",
        radioItemProps: "Radio.Item Props",
        itemPropsConfig: "itemProps 配置",
        itemProps: "itemProps 配置",
      },
      props: {
        value: "选中值（受控模式）",
        defaultValue: "初始选中值（非受控模式）",
        onValueChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        invalid: "无效状态，支持 boolean 或 string 类型",
        disabled: "是否禁用",
        name: "表单字段名称",
        label: "标签文本",
        description: "描述文本",
        itemProps: "内部元素属性透传配置",
        options: "选项数组，用于渲染多个单选框",
      },
      item: {
        value: "选项值",
        onCheckedChange: "选中状态变化回调",
        disabled: "是否禁用",
        variant: "样式变体 (radio | segment)",
        indicator: "指示器配置",
      },
      itemProps: {
        root: "根容器 `<div>` 元素属性",
        content: "内容容器 `<div>` 元素属性",
        label: "标签 `<label>` 元素属性",
        description: "描述 `<small>` 元素属性",
        invalid: "无效文本 `<span>` 元素属性",
        options: "选项项 `<button>` 元素属性",
      },
    },
  },

  dialog: {
    title: "对话框",
    description: "对话框组件，用于展示模态内容。",
    basic: {
      title: "基础",
    },
    api: {
      sectionTitles: {
        dialogProps: "Dialog Props",
        refMethods: "Ref Methods",
      },
      props: {
        open: "控制对话框是否打开（受控模式）",
        onClose: "对话框关闭时的回调函数",
      },
      refMethods: {
        show: "打开对话框（非模态）",
        showModal: "打开对话框（模态）",
        close: "关闭对话框",
      },
    },
  },

  drawer: {
    title: "抽屉",
    description: "抽屉组件，用于从侧边滑入展示内容。",
    basic: {
      title: "基础",
    },
    api: {
      sectionTitles: {
        drawerRef: "DrawerRef",
        drawerProps: "Drawer Props",
      },
      props: {
        show: "打开抽屉",
        close: "关闭抽屉",
        placement: "抽屉位置",
      },
    },
  },

  "number-field": {
    title: "数字输入框",
    description: "数字输入框组件，用于输入带增减按钮的数值。",
    basic: {
      title: "基础",
    },
    controlled: {
      title: "受控",
    },
    minMax: {
      title: "范围限制",
    },
    step: {
      title: "步长",
    },
    disabled: {
      title: "禁用",
    },
    validation: {
      title: "校验",
    },
    anatomy: {
      root: "根元素",
      label: "标签",
      group: "输入框组",
      btn: "按钮",
      input: "输入框",
      desc: "描述",
    },
    api: {
      sectionTitles: {
        numberFieldProps: "NumberField Props",
        itemPropsConfig: "itemProps 配置",
      },
      props: {
        value: "输入值（受控模式）",
        defaultValue: "初始输入值（非受控模式）",
        onValueChange: "值变化回调，可返回 { invalid?: string } 触发无效状态",
        label: "标签文本",
        description: "描述文本",
        invalid: "无效信息",
        min: "最小值",
        max: "最大值",
        step: "步长",
        disabled: "是否禁用",
        itemProps: "内部封装属性透传",
      },
      itemPropsConfig: {
        root: "根容器 `<div>` 属性",
        label: "标签 `<label>` 属性",
        group: "输入框组 `<div>` 属性",
        btn: "按钮 `<button>` 属性",
        desc: "描述 `<small>` 属性",
        error: "错误信息 `<small>` 属性",
      },
    },
  },

  pagination: {
    title: "分页",
    description: "分页组件，用于展示数据列表的分页导航。",
    basic: {
      title: "基础",
    },
    customPageSize: {
      title: "自定义每页条数",
    },
    customText: {
      title: "自定义文本",
    },
    customIcons: {
      title: "自定义图标",
    },
    withActions: {
      title: "带操作按钮",
    },
    api: {
      sectionTitles: {
        paginationProps: "Pagination Props",
        description: "Pagination.Description",
        sizer: "Pagination.Sizer",
        controls: "Pagination.Controls",
        use: "Pagination.use",
      },
      props: {
        current: "当前页码",
        pageSize: "每页条数",
        total: "总数据条数",
        onChange: "页码或每页条数变化时的回调",
        children: "子元素",
      },
      description: {
        format: "自定义分页文字格式",
      },
      sizer: {
        options: "每页条数选项数组",
        format: "自定义每页条数选项文字",
      },
      controls: {
        children: "控制按钮子元素",
      },
      use: "获取分页上下文，用于自定义分页按钮",
    },
  },

  sidebar: {
    title: "侧边栏",
    description: "可折叠的侧边栏组件，支持通过 ref 控制展开收起。",
    basic: {
      title: "基础",
    },
    api: {
      sectionTitles: {
        sidebarProps: "Sidebar Props",
        sidebarHandle: "SidebarHandle",
      },
      props: {
        defaultOpen: "默认是否展开",
        children: "侧边栏内容",
        ref: "用于控制侧边栏的 ref",
      },
      handle: {
        toggle: "切换展开收起状态",
        open: "展开侧边栏",
        close: "收起侧边栏",
        isOpen: "当前展开状态",
      },
    },
  },
};
