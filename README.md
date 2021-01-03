# hexo-steam-games
![https://img.shields.io/npm/v/hexo-steam?color=%09%23bf00ff](https://img.shields.io/npm/v/hexo-steam?color=%09%23bf00ff)
![license](https://img.shields.io/github/license/slyli/hexo-steam?color=FF5531)


## 介绍

**为Hexo添加Steam游戏库页面** 

[Demo](https://slyli.cn/steam/).

## 安装

```bash
$ npm install hexo-steam --save
```

------------

## 配置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件).

``` yaml
steam:
  enable: true
  path:
  steamId: "xxxxx" #steam 64位Id
  title: Steam游戏库
  top_img: 
  length: 1000
  except: 
    - 205790

```

- **enable**: 是否启用
- **path**: 页面路径，默认为 `/steam/index.html`
- **steamId**: steam 64位Id(需要放在引号里面，不然会有BUG), ***需要将steam库设置为公开！***
- **title**: 该页面的标题
- **length**: 要显示游戏的数量，游戏太多的话可以限制一下
- **top_img**: 图片链接

## 使用

1. 使用`hexo t`命令更新steam游戏库数据，和生成页面！

## 示例

![示例图片](https://github.com/SlyLi/hexo-steam/blob/main/example/exp1.png?raw=true)
![示例图片](https://github.com/SlyLi/hexo-steam/blob/main/example/exp2.png?raw=true)

## 参考
 [hexo-steam-games](https://github.com/HCLonely/hexo-steam-games)

