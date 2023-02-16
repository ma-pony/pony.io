---
title: python int
// title 必须是英文
subtitle: python整数对象
slug: python-int
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873665590/Ml999NBdk.jpeg?auto=compress
domain: pony.hashnode.dev
---
python中整数分为小整数对象和大整数对象

# 小整数对象
数值较小的整数对象在内存中会频繁使用，如果每次都向内存申请释放空间，会对Python的性能产生一定的影响
同时整数对象属于不可变类型，共享时不用担心被修改

小整数对象会有一个范围，Python运行时会初始化并创建范围内的所有整数，访问这个范围内的整数对象会是同一个对象，
同一个内存地址，代码表示为
```python
a = 1
b = 1
id(a) == id(b)
```

Python源代码中规定了这个范围
```c
define NSMALLPOSINTS 257 范围的右边界
define NSMALLNEGINTS 5 范围的左边界
-NSMALLNEGINTS(inclusive) to NSMALLPOSINTS(not inclusive) [-5, 257) 范围
```

# 大整数对象
Python提供了一个可扩展的内存空间 通用整数对象池，
整个空间是一个PyIntBlock结构，是用一个单向列表连接一串内存block，每个block维护一个整数对象数组objects
用于存放被缓存的整数对象

使用一个单向链表管理所有block的objects中的所有空闲内存，由free_list指出下一个可用的空闲内存。
如果当前没有空闲内存，free_list为null，会创建新内存
