# ShiftEase｜排班助手

一个简洁的排班日历应用。输入你的排班周期（例如 4 上 2 休）和最近一次周期起始日期，即可快速查看今天、当月以及未来某天是上班日还是休息日。

## 功能特性

- 📅 月历视图展示每日排班状态
- 🔴 上班日 / 🟢 休息日清晰标记
- ⚙️ 支持自定义“上几休几”排班周期
- 📌 支持设置周期起始日期
- 💾 配置自动保存到本地浏览器
- 🇨🇳 中文日期与星期显示
- ✨ 简洁动效与移动端友好的界面

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- date-fns
- lucide-react
- motion

## 本地运行

### 环境要求

- Node.js
- npm

### 安装依赖

```bash
npm install
````

### 启动开发服务器

```bash
npm run dev
```

默认访问：

```bash
http://localhost:3000
```

## 可用脚本

```bash
npm run dev      # 启动本地开发服务
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # TypeScript 类型检查
npm run clean    # 清理构建产物
```

## 使用说明

1. 打开应用
2. 点击右上角设置按钮
3. 输入排班周期，例如：

   * 上班天数：4
   * 休息天数：2
4. 设置最近一次排班周期开始的第一天
5. 应用会自动计算每一天的排班状态

## 项目结构

```txt
.
├── src/
│   ├── App.tsx          # 应用主界面
│   ├── index.css        # 全局样式与 Tailwind 配置
│   └── lib/
│       └── utils.ts     # 排班计算逻辑与工具函数
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 排班计算逻辑

应用以用户设置的“起始日期”作为周期锚点，根据目标日期与起始日期之间相差的天数，计算该日期落在当前排班周期中的位置。

例如设置为：

* 上班 4 天
* 休息 2 天
* 起始日期为某个上班周期的第一天

则周期会按以下方式循环：

```txt
上 上 上 上 休 休 ｜ 上 上 上 上 休 休 ｜ ...
```

## 数据存储

排班配置会保存到浏览器的 `localStorage` 中，不需要登录，也不会上传到服务器。

## License

Apache-2.0

