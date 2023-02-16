---
title: Python Type Hint
// title 必须是英文
subtitle: python 类型提示
slug: python-type-hint
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/unsplash/PbzntH58GLQ/upload/v1653831013147/Tie1TT8RA.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress
domain: pony.hashnode.dev
---
Python的类型提示更多的是给人看的，更方便理解，利于一些静态类型分析工具，更早地发现类型错误。
他并不会导致运行更慢，影响run time。


Python有一个专门的tying模块，提供了一些常见的类型封装
下边以Python3.10为例，举一些常见的例子，更多的例子或更深入的用法参考官方文档
https://docs.python.org/zh-cn/3/library/typing.html

1. list
```python
# 3.9之后
def sum_list(a: list[int]) -> int:
    return sum(a)

# 3.9之前
from typing import List
def sum_list(a: List[int]) -> int:
    return sum(a)
sum_list([1, 2, 3])
sum_list((1, 2, 3))
```
实际sum_list((1, 2, 3))已经被提示类型错误了。
然而在实际应用中，我们经常会对一个list的类型参数，传递tuple或者range之类的参数
标记为list可能会不太合适，更好的是标记一个更加底层的类型
```python
from typing import Sequence
def sum_list(a: Sequence[int]) -> int:
    return sum(a)
sum_list([1, 2, 3])
sum_list((1, 2, 3))
```
2. dict
```python
# 3.9之后
def sum_dict(a: dict[str, int]) -> int:
    return sum(a.values())
sum_dict({"a": 1, "b": 2, "c": 3})

# 3.9之前
from typing import Dict
def sum_dict(a: Dict[str, int]) -> int:
    return sum(a.values())
sum_dict({"a": 1, "b": 2, "c": 3})
```
3. or
```python
# 3.9之后
def or_func(a: int | str) -> int:
    return a

# 3.9之前
from typing import Union
def or_func(a: Union[int, str]) -> int:
    return a
```
4. None
```python
from typing import Optional
def operation_none(a: Optional[int]) -> int:
    return a if a else 0
```
Optional 就代表了这个参数可能是None, 当然你也可以用or来表示 a: int | None
5. 自有类型
```python

class MyClass:
    def __init__(self, a: int):
        self.a = a

def my(a: "MyType") -> int:
    ...

```


