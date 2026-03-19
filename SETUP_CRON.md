# OpenStream定时优化设置指南

为了保持OpenStream项目的最佳性能，建议每12小时运行一次优化脚本。

## 自动化优化设置

### 方法1：使用crontab（推荐）

1. 编辑crontab：
```bash
crontab -e
```

2. 添加以下行以每12小时运行一次优化脚本：
```bash
0 */12 * * * /tmp/manusilized/optimize-openstream.sh >> /tmp/manusilized/logs/optimization.log 2>&1
```

3. 保存并退出编辑器

### 方法2：使用systemd timer（Linux系统）

1. 创建服务文件 `/etc/systemd/system/openstream-optimize.service`：
```ini
[Unit]
Description=OpenStream Optimization
After=network.target

[Service]
Type=oneshot
ExecStart=/tmp/manusilized/optimize-openstream.sh
WorkingDirectory=/tmp/manusilized
User=your-username
Group=your-group
```

2. 创建timer文件 `/etc/systemd/system/openstream-optimize.timer`：
```ini
[Unit]
Description=OpenStream Optimization Timer
Requires=openstream-optimize.service

[Timer]
OnBootSec=10min
OnUnitActiveSec=12h
AccuracySec=1min
Persistent=true

[Install]
WantedBy=timers.target
```

3. 启用并启动timer：
```bash
sudo systemctl enable openstream-optimize.timer
sudo systemctl start openstream-optimize.timer
```

## 手动运行优化

也可以随时手动运行优化脚本：
```bash
/tmp/manusilized/optimize-openstream.sh
```

## 日志查看

优化日志将保存在 `/tmp/manusilized/logs/optimization.log` 文件中。