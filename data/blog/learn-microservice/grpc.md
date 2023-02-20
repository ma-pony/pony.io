google开源的高性能的通用框架
基于HTTP2.0，既对TCP连接进行了优化，又没有损失性能

protobuf只是一个序列化发序列化协议

protobuf其实是一种格式化数据存储格式， 就等同于json,xml, 不过比他们性能强很多，轻量高效

优点：
    1. 压缩性好
    2. 序列化反序列化快速
    3. 传输速度快
    4. 使用简单，可自动生成代码
    5. 维护成本低，只维护proto文件
    6. 向后兼容性好
    7. 二进制传输，加密性好
    8. 跨平台，支持多种语言

缺点：
    1. 通用性差，需要额外安装包
    2. 自解释性差，只能通过proto文件了解数据结构



## python 下应用

### 安装
```
pip install grpcio
pip install grpc-tools

```

### 定义hello.proto 文件

```
syntax = "proto3"; // 版本声明


package hello; // 包名

service HelloService { // 服务名
    rpc Hello(HelloRequest) returns (HelloResponse) {}
}

message HelloRequest {
    string name = 1 ;  // 1是标识编号，不是值 // 可变长编码    
}

message HelloResponse {
    string name = 1;
}

```

### 自动生成代码
```
python -m grpc_tools.protoc --python_out=.. --grpc_python_out=. -I. hello.proto
```
执行后会看到生成了两个文件， hello_pb2.py和hello_pb2_grpc.py


### 实现service
```
from concurrent.futures import ThreadPoolExecutor

import grpc

import hello_pb2
import hello_pb2_grpc


class HelloService(hello_pb2_grpc.HelloServiceServicer):
    def Hello(self, request, context):
        return hello_pb2.HelloResponse(name=f"hello {request.name}")


if __name__ == "__main__":
    server = grpc.server(ThreadPoolExecutor(max_workers=10))  # 创建一个服务器
    hello_pb2_grpc.add_HelloServiceServicer_to_server(HelloService(), server)  # 将service注册到服务器上，生成一个service proxy
    server.add_insecure_port('[::]:50051')  # 指定IP和端口
    server.start()  # 启动服务器
    server.wait_for_termination()  # 等待服务器结束

```


### 实现client
```
import grpc

import hello_pb2
import hello_pb2_grpc

if __name__ == "__main__":
    with grpc.insecure_channel("localhost:50051") as channel:  # 创建一个client
        stub = hello_pb2_grpc.HelloServiceStub(channel)  # 创建一个client proxy
        response: hello_pb2.HelloResponse = stub.Hello(hello_pb2.HelloRequest(name="world"))  # 调用服务端的方法, 参数必须是个proto类型的对象
        print(response.name)

```