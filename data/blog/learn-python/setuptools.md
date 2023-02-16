# setuptools get python version error
setuptools 52.0.0之前的某一个版本会将Python 3.10解析成Python3.1，导致某些指定python版本的包安装报错
需要升级到setuptools 52.0.0以上
