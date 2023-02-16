---
title: python list vs tuple
// title 必须是英文
subtitle: python list与tuple的区别
slug: python-list-vs-tuple
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873645238/7TFlE4Q8N.jpeg?auto=compress
domain: pony.hashnode.dev
---

# list
可变类型
list本质是一个可变长的连续数组

# tuple
不可变类型
tuple 和list相似，本质也是一个数组，但是空间相对大小固定
同时Python的tuple做了很多优化，来提升在程序中的效率

为了提高效率，避免频繁的调用系统函数free和malloc向操作系统申请和释放空间，tuple源文件中定义了一个free_list,
所有申请过的，小于一定大小的元组，在释放的时候都会被放进这个free_list中供下次使用，如果以后需要再去创建同样的tuple，
Python就可以直接在缓存中载入

