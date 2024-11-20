# Git 自动推送使用说明

## 配置信息
- **GitHub用户名**: JuneWat
- **GitHub邮箱**: lfyl2422340@outlook.com
- **仓库地址**: https://github.com/JuneWat/secure-harvest-vault.git

## 使用方法

### Windows (PowerShell)
```powershell
.\git-push.ps1
```

或者指定提交信息：
```powershell
.\git-push.ps1 "你的提交信息"
```

### Linux/Mac (Bash)
```bash
./git-push.sh
```

或者指定提交信息：
```bash
./git-push.sh "你的提交信息"
```

## 脚本功能
1. 自动检查是否有更改
2. 显示当前更改状态
3. 添加所有更改到暂存区
4. 提交更改（使用提供的消息或默认时间戳）
5. 推送到GitHub

## 注意事项
- 确保你有更改需要提交，否则脚本会提示没有更改
- 如果推送失败，请检查网络连接和GitHub权限
- 提交信息如果不提供，将使用默认的时间戳格式

## 手动推送
如果需要手动操作，可以使用以下命令：

```bash
# 查看状态
git status

# 添加所有更改
git add -A

# 提交
git commit -m "你的提交信息"

# 推送
git push origin main
```

