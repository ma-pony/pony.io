---
title: go constant
// title 必须是英文
subtitle: go的常量定义
slug: go-constant
tags: go 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873577116/8DzikMhsh.jpeg?auto=compress
domain: pony.hashnode.dev
---

# 常量
常量通常指在程序运行时不会被修改的值，是一个简单的标识符

## const 关键字
const来定义常量
```go
const name = "go"
```
也可以定义一个常量组
```go
const (
    Female = 0
    Male = 1
)
```
常量组中可以不指定类型和初始化值，就与上一行非空常量右值相同

`常量中的数据类型只可以是布尔型，数字型(整数型、浮点型、复数)和字符串型`

## iota特殊常量
iota是一个特殊的语法

```go
const (
    a = iota
    b
    c
)
```
第一个iota等于0，第二个iota等于1，第三个iota等于2
每当iota等于0，每当iota在新的一行被使用时，它的值就会自动加1。
iota实际是按行序递增的，如果插入了一个非iota的行，就会中断iota的递增，必须显式的恢复
```go
const (
    a = iota //0
    b        //1
    c = 'c'  //'c'
    d = iota //3
    e        //4
)
```
