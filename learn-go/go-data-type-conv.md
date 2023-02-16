---
title: go data type conversion
// title 必须是英文
subtitle: go的数据类型转换
slug: go-data-type-conv
tags: go 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873577116/8DzikMhsh.jpeg?auto=compress
domain: pony.hashnode.dev
---

# strconv包
## 字符串转换为数字
```go 
s := '123'
i, err = strconv.Atoi(s)
```

## 数字转换为字符串
```go
s := strconv.Itoa(123)
```

## parse函数
将字符串转换为指定的类型
```go
i, err = strconv.ParseInt('123', 10, 64)
b, err = strconv.ParseBool('true)
f, err = strconv.ParseFloat('1.23', 64)
u, err = strconv.ParseUint('123', 10, 64)
```
ParseInt()和ParseUint()有3个参数：
```go
func ParseInt(s string, base int, bitSize int) (i int64, err error)
func ParseUint(s string, base int, bitSize int) (uint64, error)
```
说明：
  a. bitSize参数表示转换为什么位的int/uint，有效值为0、8、16、32、64。当bitSize=0的时候，表示转换为int或uint类型。例如bitSize=8表示转换后的值的类型为int8或uint8。
  b. base参数表示以什么进制的方式去解析给定的字符串，有效值为0、2-36。当base=0的时候，表示根据string的前缀来判断以什么进制去解析：0x开头的以16进制的方式去解析，0开头的以8进制方式去解析，其它的以10进制方式解析。
