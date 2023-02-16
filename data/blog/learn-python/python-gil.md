---
title: Python GIL
// title 必须是英文
subtitle: python gil 介绍
slug: python-gil
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873577116/8DzikMhsh.jpeg?auto=compress
domain: pony.hashnode.dev
ignorePost: true
---

# 什么是GIL
cpython解释器采用的一种机制，他确保同一时刻只会有一个线程在执行Python字节码。
此机制通过设置对象模型（包括dict等重要内置类型）针对并发访问的隐式安全简化了cpython的实现，
给整个解释器加锁使得解释器多线程运行更方便，但牺牲了多处理器上的并行性。

# 为什么会有GIL
Python的垃圾回收机制是造成GIL的主要原因
在多线程的程序中，为了保证引用计数的正常增减，引用计数操作必须以线程安全的方式执行，当然也可以参用其他的方式，
但对于当时来讲，线程安全的方式是最有效也是最简单最安全的方式。
所以GIL一次只允许一个线程在解释器中运行，这直接导致计算密集型的代码无法利于到多线程的优势

# 移除GIL
Sam Gross提出了一种设想，项目地址在下边
[NoGIL]https://github.com/colesbury/nogil

## 偏置引用计数
- 将每个对象与创建它的线程联系起来，即所有者线程
- 在所有者线程中启用高效的非原子本地引用计数
- 运行在其他的进程中进行较慢但原子的共享引用计数

详细描述参考这篇论文
[Biased reference counting: minimizing atomic operations in garbage collection](https://dl.acm.org/doi/10.1145/3243176.3243195)
简单来讲，每个对象的引用计数一分为二，一个本地计数用于对象的所有者，一个共享计数用于所有其他线程。
所有者对本地计数进行非原子指令操作，访问改对象的其他线程多共享引用计数实现原子操作

每当拥有线程删除对对象的引用时，它都会检查两个引用计数是否为零。
如果本地和共享计数都为零，那可以释放对象。
如果本地计数为零但共享计数不为零，则设置一个特殊位以指示拥有线程以丢弃该对象，共享计数的任何后续递减操作都将释放该对象。

该算法提高了引用计数的性能，在线程中创建的对象也很少会和其他线程共享，大多数情况下，共享引用计数不会被使用，
也避免了使用原子操作来操作该计数的成本

## 加速跨线程的对象访问
- 一些特殊对象永久存在
- 延迟引用计数用于其他的全局可访问对象

None、True、False、其他小整数、内部字符串等其他的单例对象，他们的引用计数永远不会计算并且永远不会被释放

许多函数和模块由于出现在全局字典中而本质上形成了引用计数循环并且他们的计数永远不会被清零，对于这种对象，
采用了一种延迟引用计数的技术
