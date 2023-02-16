# 接口

## 什么是接口
接口也可以叫做协议
接口就是要求实现他的对象都遵循一个协议

python中是没有接口，但有类似的实现（抽象基类），都是在类里实现
例如Python中的Iterable类型，也可以算是一个接口
只要你自定义的类里实现了__iter__方法，遵循了可迭代协议，那么他就是一个Iterable类型

接口有一个默认的规范，一般都有er结尾，就像Python的自定义私有方法以_开头一样

```go
// 定义协议
type Programmer interface {
	Coding (string) string
	Debugging (string) string
}

type GoProgrammer struct {

}


func (g GoProgrammer) Coding (string) string {
	return "go is good"
}

func (g GoProgrammer) Debugging (string) string {
	return "debug is good"
}
var pro Programmer = GoProgrammer{}
fmt.Printf("%T\n", pro)
```

打印pro的type你可以发现，pro是一个GoProgrammer类型，而不是Programmer类型，他只是实现了Programmer的协议
而且Programmer不能直接去实例化，接口类型不能实例化

而Python中的抽象基类不一样，是可以实例化的，他是class


## 接口的组合
```go
type Programmer interface {
	Coding (string) string
	Debugging (string) string
}


type Designer interface {
	Design (string) string
}

type FullStack interface {
	Programmer
	Designer
	Manage()
}
```
接口也可以通过组合的方式来实现继承，FullStack要实现Programmer 和 Designer的方法 and manage


## error 也是一个接口
```go
type error interface {
	Error() string
}
```
那我们在自定义error的时候可能会变的复杂， go提供了几种更方便定义error的方式

```go
	var err error =  errors.New("error")
	fmt.Println(err)
	var err1 error = fmt.Errorf("%S", "error")
	fmt.Println(err1)
```
通常来说，fmt会更常用, 他可以format一个字符串，而New只能传一个string，当然，他们的返回值并没有区别


## 空接口

1. 可以接收任意类型的赋值
```go
var i interface{}
i  = 1
i = "hello world"
i = []int{1,2,3}
```
一般情况下很少使用空接口，容易引起误解，不确定他到底是什么类型

2. 参数传递
```go
func test(i interface{}) {
    fmt.Println(i)
}
```
这个函数就可以接收任意类型的参数

3. 空接口可以做为map的值
```go
var student = map[string]interface{}{
    "name": "tim",
    "age": 18,
    "course": []string{"go", "python"},
}
```
这样map的value就可以是任意值，自由度更高，类似于Python的dict


## 接口的类型断言

```go
type Ali struct {}

type AWS struct {}


func Upload (x interface{}) {
    switch v = x.(type) {
        case Ali:
            // 上传到阿里云
        case AWS:
            // 上传到AWS
    }
    v, ok := x.(int)
    if ok {
        fmt.Println(v)
    }
}
// interface的类型断言写法非常奇怪， x.(type)
// 同时返回值也很奇怪，v, ok := x.(int) 是返回的value和OK(bool)
// swith 是返回的又是具体的type

```

## 通过sort来理解interface
sort.Sort() 
go里边的排序方法

python里边的sorted方法需要传递一个iterable对象，即实现了__iter__方法的对象
go里边也类似，Sort需要传递一个Interface，这个interface需要实现Len, Less, Swap方法

```go
type Course struct {
	Name string
	Price int
	Url string
}

type Courses []Course


func (c Courses) Len() int {
	return len(c)
}

func (c Courses) Less(i, j int ) bool{
	return c[i].Price < c[j].Price
}

func (c Courses) Swap(i, j int) {
	c[i], c[j] = c[j], c[i]
}

s := Courses{
    Course{},
    Course{},
    Course{},
}

sort.Sort(s)

```

