---
title: Python Sorted(list) vs List.sort
subtitle: 为什么两种排序出来的结果会不一样
slug: python-sortedlist-vs-listsort
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/unsplash/PbzntH58GLQ/upload/v1653831013147/Tie1TT8RA.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress
domain: pony.hashnode.dev
---

在Python中， 如果我们需要给一个list排序，通常来讲会采取以下两种方式
1. 
```
list_a = [1,2,3,4,5,2,3,3,3]
print(sorted(list_a))
[1, 2, 2, 3, 3, 3, 3, 4, 5]
```
2. 
```
list_a = [1,2,3,4,5,2,3,3,3]
list_a.sort()
print(list_a)
[1, 2, 2, 3, 3, 3, 3, 4, 5]
```

正常来讲，这两种都能满足你的需求，
但如果你需要指定一个sort key的时候，并且sort key function里取了list里的值进行操作时，就需要注意了。

例如下边这个例子，
规则1：首先根据key在list中出现的次数排序，越少位置越靠前。规则2：次数相同时，数字越大越靠前

1. 
```
list_a = [1,2,3,4,5,2,3,3,3]
print(sorted(list_a, key=lambda x: (list_a.count(x), -x)))
[5, 4, 1, 2, 2, 3, 3, 3, 3]
```

2. 
```
list_a = [1,2,3,4,5,2,3,3,3]
list_a.sort(key=lambda x: (list_a.count(x), -x))
print(list_a)
[5, 4, 3, 3, 3, 3, 2, 2, 1]
```

你会发现这两种排序出来的结果并不一样，sorted是我们期待的结果，但.sort却看起来只应用到了规则2 ，数字越大越靠前。

这是因为.sort的实际过程是这样的：
1. 先将list_a置为空列表，同时创建一个临时列表来存储list_a的数据。
2. 对临时列表进行排序，这个时候list_a.count(x)就全都一样的了，都是0，因为list_a是空的。
3. 将临时列表赋值回list_a。

实际.sort两个排序规则都被应用了，但因为第一个规则得出来的结果都是相同的0，所以就完全按照规则2进行排序了。


