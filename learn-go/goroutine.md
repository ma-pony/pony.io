# goroutine

其实就是Python里的协程
协程其实是用户态的线程，而不是内核态的线程
声明周期和Python一致，主协程挂掉，从协程也一起挂掉


## 运行
写起来很简单, 只需要在函数调用前加一个go关键字，相当于Python的async关键字

```go
func main() {
    // 创建一个协程
    go func() {
        fmt.Println("hello world")
    }()
    // 协程的执行
    fmt.Println("hello")
}

```

## 等待
同样也有一个类似于Python await的功能

```go
var wg sync.WaitGroup
// go 里边的await不是关键字，是一个struct, 他更像一个计数器
// 里边有三个方法
// Add(delta int)
// Done()
// Wait()
// 运行协程之前先要通过Add来指定协程函数的运行次数，协程内部要调用Done来指定协程已经完成， 协程外部通过Wait来等待协程执行完毕

func f () {
    defer wg.Done()
    fmt.Println("hello")
}

func main() {
    wg.Add(1)
    go f()
    wg.Wait()
}

// 如果add和最终done的数量不一致会有问题
```

## 锁
### 互斥锁
```go
// 定义互斥锁
var lock sync.Mutex
// 加锁
lock.Lock()
// 解锁
lock.Unlock()

```

### 读写锁

读程序和写程序要分开加锁，写锁解锁的时候需要唤醒所有等待的读锁

```go
// 定义读写锁
var rwLock sync.RWMutex
// 加读锁
rwLock.RLock()
// 加写锁
rwLock.Lock()
// 解读锁
rwLock.RUnlock()
// 解写锁
rwLock.Unlock()

```


Python相对go来讲，单个协程占用的内存更小
但go的协程写起来比较简单

# TODO go与Python协程性能与实现原理对比



## channel
关键字chan, 必须要指定管道里消息的类型
channel 是一个引用类型，必须要初始化，不然默认值是nil
在go中，需要make初始化一个有三种类型，slice， map， channel
channel是协程安全的，实际也是通过锁实现的，所以报错经常会是deadlock

### 基本操作
```go
// 定义一个channel
var ch chan int
// 初始化
// 无缓冲区
ch = make(chan int)
没有缓存区的channel，消费者要提前等待消费，消息要立马被消费掉，因为没有缓存区暂存消息
如果先存入消息，channel加锁，等待消息者消费，然而此时消费者并没有被定义，代码会一直卡在当前这一步，
导致锁无法释放，deadlock，如果有缓存区的话，他会把消息放到缓存区，代码继续执行

// 有缓冲区
ch = make(chan int, 10)

// 发送
ch <- 1
// 接收
v := <- ch


// 当暂存区满了之后，继续写入会报错
// 当暂存区空了之后，继续读取也会报错

// 关闭channel
close(ch)
// 关闭后的channel不能再写入，但可以读取数据
v, ok = <- ch

如果关闭的channel中的数据已被全部取出，再以<-继续取数据并不会报错
而是返回
消息的默认值，false = <- ch

我们可以通过判断OK的值来判断消息是否关闭

for range ch {
    // do something
}

但是以for range的方式取数据，如果channel关闭了，for循环会自动退出

```

### 类型
有缓存区和无缓冲区
双向还是单向

正常的channel都是双向的，即可以输入输出

还可以定义只能输入或输出的单向channel(很少会这么定义
```go
只能输入
c := make(chan<- int 10)

只能输出
c := make(<-chan int 10)

```

我们偶尔会有只允许存值或只允许取值的情况
通过会通过标记函数参数的类型来实现，例如
```go

func consumer(queue <-chan int){
    // 取数据
}

func producer(queue chan<- int){
    // 存数据
}

```


## select

```go

var c1 := make(chan int 1)
var c2 := make(chan int 2)

select {
    case <- c1:
        // do something
    case <- c2:
        // do something
    default:
        // do something
}

// select和socket里边的IO多路复用很类似
// select会公平地选择一个已就绪的case执行，假随机

// 应用场景: 1. timeout的超时机制，2. 判断某个channel是否超时(未超时则default

```

## context
实际上也是通过channel实现的

```go
// 定义
// 需要传递一个父的context进去
ctx, cancel = context.WithCancel(context.Background())

func f(ctx context.Context) {
    select {
        case <- ctx.Done():
            return
        default:
            // do something
    }
}


// 直接调用cancel()就可以让f函数退出
cancel()
// 同时cancel也会进行传递，如果有子的context也会一起done，链式调用取消


ctx, cancel = context.WithDeadline()

// 这种更好用
ctx, cancel = context.WithTimeout(context.Background(), time.Second * 2)

ctx, cancel = context.Value()

```

