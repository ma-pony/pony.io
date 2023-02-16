# rpc
远程过程调用(remote procedure call)
rpc强调的是和本地调用效果一致
选择rpc方案重要的是生态和支持的语言

rpc调用的关键问题
1. call id， 即函数的映射
2. 序列化和反序列化
3. 网络传输

## 四部分组成
### 客户端
### 服务端
### 客户端存根(代理)
### 服务端存根(代理)


调用过程
客户端-> 客户端存根(代理)-> socket通信 —> socket通信 -> 服务端存根(代理)-> 服务端

## 基于HTTP的rpc

## 基于xml的rpc
python自带了一个xmlrpc的模块,可以直接调用远程的服务
实现起来非常简单
```python
from xmlrpc.server import SimpleXMLRPCServer

class MyClass:
    def add(self, x, y):
        return x + y


service = SimpleXMLRPCServer(('localhost', 8000))
service.register_instance(MyClass())
```


```python
import xmlrpc.client


proxy = xmlrpc.client.ServerProxy('http://localhost:8000')
print(proxy.add(1, 2))
```


## 基于json的rpc
有很多jsonrpc的开源项目
jsonrpclib举例，基本就是模仿的xmlrpc模块，调用方式类似


## 基于MQ的rpc
zerorpc举例
zeromq消息队列 + msgpack消息序列化模块来实现rpc
```python
import zerorpc
class MyClass:
    
    # 一元接口
    def add(self, x, y):
        return x + y
    
    # 流式接口
    @zerorpc.stream
    def stream(self):
        yield 1
        yield 2
        yield 3
    
s = zerorpc.Server(MyClass())
s.bind('tcp://0.0.0.0:4242')
s.run()

```

```python
import zerorpc
c = zerorpc.Client()
c.connect('tcp://0.0.0.0:4242')

# 一元调用
print(c.add(1, 2))

# 流式调用
for res in c.stream():
    print(res)

```


### 调用过程
客户端 -> msgpack -> zeromq(解耦，异步，限流，负载均衡) -> msgpack -> 服务端

### 缺点
生态不完善，语言支持少
