
#### rvm install 2.7.6 error
install 2.7.6 时报错
`
Error running '__rvm_make -j8',
please read /Users/ponyma/.rvm/log/1652007465_ruby-2.7.6/make.log

There has been an error while running make. Halting the installation.
`

报错log显示和OpenSSL相关，尝试执行以下命令后成功修复：
```shell
brew install openssl@1.1.1
rvm pkg install openssl
export optflags="-Wno-error=implicit-function-declaration"
rvm install 2.2.0 --with-openssl-dir=$rvm_path/usr --rubygems ignore
```

但装包又报错SSL_CTX_set_ecdh_auto

发现是rvm的环境中有一个1.0.2版本的OpenSSL
```shell
ruby -ropenssl -e 'puts OpenSSL::OPENSSL_VERSION'
```
而本地实际安装了1.1.1版本
不清楚怎么回事，只好将rvm重装一下

## uninstall rvm
```shell

rvm implode 
or
rm -rf ~/.rvm 

```

## install rvm
Install Homebrew

Install GPG
```
brew install gpg
```
Import RVM keys into GPG
```shell
 curl -sSL https://rvm.io/mpapis.asc | gpg --import -
 curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -
```

Trust RVM keys with GPG
```shell
 echo 409B6B1796C275462A1703113804BB82D39DC0E3:6: | gpg --import-ownertrust
 echo 7D2BAF1CF37B13E2069D6956105BD0E739499BDB:6: | gpg --import-ownertrust
```

Install RVM
```shell
 \curl -sSL https://get.rvm.io | bash -s -- --ignore-dotfiles

```
To source RVM, add this line to your shell config file
```shell
 source ${HOME}/.rvm/scripts/rvm

```
Restart Terminal

Confirm installation
```shell
 rvm --version
```
See RVM CLI docs for how to manage different versions of Ruby.
