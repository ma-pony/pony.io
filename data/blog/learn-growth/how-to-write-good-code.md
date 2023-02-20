---
title: How to write a good code
// title 必须是英文
subtitle: 如何写好代码（本人主要从事Python开发，所有大多数都以Python为例）
slug: how-to-write-good-code
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873577116/8DzikMhsh.jpeg?auto=compress
domain: pony.hashnode.dev
---

决定程序员是否优秀的隐私不在于代码本身，而在于他们对编写代码精益求精和坚韧不拔的态度。

牢记代码是写给人看的，其次才是编译器。


# 代码格式规范
每种语言都有自己的规范，每个项目可能也会有自己的规范

## 代码评审过程中很容易出现对于代码规范的过度执着。
建议使用black，flake8等代码格式检查工具，
以固定的格式作为标准，减少冲突，提高评审效率。
同时利用Git的hooks，例如pre-commit等hook工具自动检查代码格式，并在提交时自动修复，减少开发负担。


# 版本控制
以Git为例

## 清晰的提交记录尤为重要。
不要将代码格式排版的优化和新增修改功能放在同一次提交之中。
## commit 要遵循一定的规范。
比如：
```shell
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
# type代表某次提交的类型，比如是修复一个bug还是增加一个新的feature。
```

vscode和pycharm都有现成的commit template插件，非常方便。
同时也建议将其加入Git hooks中


# 写更少的代码
少即是多。如非必要，勿增实体。

## 如果看到了重复代码，就想办法消除他，更不要复制代码。
IDE通常都会有重复代码提示。

## 在设计时优先考虑第三方库，避免重复造轮子
节省精力和时间，他们通常也更稳定易用

## 不要写多余的代码。
哪怕你认为这些代码会在将来被用到。如果现在不需要，就不要写，等真正用到的时候再写

## 不要注释代码，直接删掉。
不用担心找不回来，有Git。



# 代码注释
好的注释是成功的一半

## 确保每一条注释都有价值，并且注释通常是为了解释为什么这么做
代码也是文档，怎么做应该由代码来解释

## 始终相信代码，而不是文档
经手过多次的代码和文档并不一定是一致的


# 优化代码
每个项目都会进入泥潭

## 对于烂代码，不要追究责任
也许他只是在产品的压力下走了捷径，也许他并不是一个开发人员。
享受整理代码的过程，当做提高代码质量的良机

## 每次改变一点点，每次都变得比之前更好
谨慎的选择优化的范围规模


# 测试
未经过测试的代码就是bug的滋生地，测试就是杀虫剂

## 写代码的同时写测试
当时的记忆思路才是最清晰的

## 在修复bug时，先写一个失败的测试来模拟bug出来的原因
防止再次出现

## 保证测试的覆盖率是100%
用coverage等第三方库来保证覆盖率，并且不要去降低测试的覆盖率（破窗效应）。
特殊情况下可以通过no coverage的方式来跳过某一行的测试

## 写优质的测试，不写劣质的测试
劣质测试的常见问题：
1、测试时好时坏
2、难以阅读和理解
3、测试太大，准备数据非常多，运行速度慢
4、一个测试用例中测试多个行为
5、仅仅针对某个API，而不是某种行为或功能
6、对第三方代码进行测试

## 再好的测试也无法取代QA
混沌测试，模糊测试等等
