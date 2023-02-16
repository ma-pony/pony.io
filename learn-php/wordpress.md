# 安装
网上有很多文章将如何在服务器上安装的，很多服务器都提供了安装工具
目前只记录怎么在本地安装

## 下载

[官网下载](https://cn.wordpress.org/download/)

我们推荐服务器运行PHP 7.4或更高版本；数据库软件可采用MySQL 5.7或更高版本，也可采用MariaDB 10.2或更高版本。
我们也推荐Apache或Nginx作为运行WordPress的可靠选项，但您也可以选择其他HTTP服务器软件。


## 安装
修改wp-config.php文件，更改数据库名称、用户名和密码。(默认文件是wp-config-sample.php, 需要改一下名字)


### docker 安装
1. 创建一个空的文件夹(例如my_wordpress)
2. 进入文件夹，创建一个docker-compose.yaml
3. 在docker-compose.yaml中添加如下内容
```yaml
version: "3.9"
    
services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    volumes:
      - wordpress_data:/var/www/html
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
volumes:
  db_data: {}
  wordpress_data: {}
```
4. 运行 `docker-compose up -d`
5. 打开 `http://localhost:8000`
