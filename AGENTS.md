# Project Agent Instructions

<!-- aki-agent-kit:bootstrap:start -->
## Personal Development Baseline

Project profile: `project`

在每个新会话进行实质性规划或修改之前：

1. 读取项目开发原则：
   https://github.com/gongfpp/aki-agent-kit/blob/main/principles/project-development.md?raw=1
2. 如果 profile 为 `game`，额外读取：
   https://github.com/gongfpp/aki-agent-kit/blob/main/principles/game-development.md?raw=1
3. 在 Git 仓库内，当前会话第一次执行会写入项目文件的任务前读取 Git 原则：
   https://github.com/gongfpp/aki-agent-kit/blob/main/principles/git.md?raw=1
   任务完成并验证后按该原则完成本地版本管理收尾。是否 push、创建 PR 或执行其他远端操作，由当前项目指令、仓库既有流程和当次任务决定。
4. 只有在精简、清理、架构收敛或删除无用复杂度的任务中读取：
   https://github.com/gongfpp/aki-agent-kit/blob/main/principles/simplification.md?raw=1
   如果 profile 为 `game`，同时读取：
   https://github.com/gongfpp/aki-agent-kit/blob/main/principles/game-simplification.md?raw=1

同一远程原则在当前会话成功读取后视为已加载，不因后续轮次或重复任务再次读取；只有用户要求刷新、远程入口发生变化或明确需要重新核实时才重新读取。

必须实际读取成功后再声称使用了最新版原则。远程读取失败时明确指出失败项，并继续遵循当前项目已有事实、契约和用户指令。

这些内容是个人开发偏好，不覆盖项目自身的真实契约或更高优先级指令。
<!-- aki-agent-kit:bootstrap:end -->

## 项目 Git 约定

- 源仓库：`github.com/gongfpp/interface-atlas`（**private**），`main` 为默认分支。只放源码与 CI。
- 发布走公开构建仓库 `github.com/gongfpp/interface-atlas-web`：源仓库 `.github/workflows/deploy-web.yml` 先跑完整检查（`verify` job），通过后再构建并**增量提交** `dist/` 到公开仓库 `main`（clone → rsync → 保留旧 `_astro` hash 资源 → commit → push，不再 force-push；旧资源继续可用可避免 Pages HTML 缓存造成的无样式窗口），由该仓库 GitHub Pages 发布（<https://gongfpp.github.io/interface-atlas-web/>）。不要在该公开仓库手工改文件，产物由源仓库覆盖。
- 发布与检查是同一提交上的依赖关系：检查不通过就不会发布。手动触发 `Deploy site to interface-atlas-web` 等同于正式发布，不要用它做未经验证的预览。
- 任务边界区分：只读审阅/解释不写文件；修改类任务在本地提交；是否 push 到 `main` 由本约定决定——**任务完成并验证通过后，提交并 push 到 `origin/main`**（用户已授权持续 push，无需逐次询问）。未完成或未验证的改动不要 push。
- 提交遵循 Conventional Commits；一个逻辑完整的阶段一个 commit。
- **每次迭代完成并发布后，在给用户的回复末尾附上线上地址**：<https://gongfpp.github.io/interface-atlas-web/>（方便直接点开查看）。
- 本机网络对 github.com 时好时坏：push 失败时重试（API 与 git 端点可用性不同步）。
