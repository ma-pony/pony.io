
---
title: chrome新开标签页自动打开DevTools
date: '2023-06-30'
tags: ['chrome', 'test']
draft: false
summary: chrome新开标签页自动打开DevTools
---

# chrome新开标签页自动打开DevTools

开发者工具(DevTools)是Chrome浏览器中非常重要的一个功能，它可以帮助开发者调试和分析网页的各种问题。如果你经常使用DevTools，那么你可能会希望每次在Chrome中新开一个标签页时，DevTools自动打开。

## chrome

命令行运行 Chrome 并传递--auto-open-devtools-for-tabs标志：

1. 退出任何正在运行的 Chrome 实例。在 Windows 上，请确保从任务管理器中结束所有的 Chrome 进程。
2. 运行您最喜欢的终端或命令行应用程序。
3. 根据您的操作系统，运行以下命令：
- Mac：open -a "Google Chrome" --args --auto-open-devtools-for-tabs
- Windows：start chrome --auto-open-devtools-for-tabs
- Linux：google-chrome --auto-open-devtools-for-tabs

每个新标签将自动打开DevTools ，直到您关闭 Chrome。

## playwright、puppeteer

如果你正在使用一些web自动化工具库，例如playwright、puppeteer等，那就更简单了，只需要在launch options中增加一个"devtools": True。

之后，每当你在Chrome中新开一个标签页时，DevTools都会自动打开。这个功能可以帮助你更快地进行网页开发和调试，提高工作效率。