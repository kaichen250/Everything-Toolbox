// 音乐播放器配置 - 修改此处更换歌曲/歌单
// type: 2=单曲, 0=歌单
// id: 网易云音乐歌曲或歌单ID
// auto: 0=不自动播放, 1=自动播放
const musicConfig = {
    type: 0,           // 2=单曲, 0=歌单
    id: 13782311100,    // 歌曲/歌单ID
    auto: 1            // 0=不自动播放, 1=自动播放
};

// 主题切换功能 - 适配Aero风格
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const backToTopBtn = document.querySelector('.back-to-top');
    const updateList = document.getElementById('update-list');
    
    // 音乐播放器功能
    const musicToggle = document.getElementById('music-toggle');
    const musicPlayerContainer = document.getElementById('music-player-container');
    const musicPlayerClose = document.getElementById('music-player-close');
    const neteasePlayer = document.getElementById('netease-player');
    let isPlayerVisible = false;
    
    // 初始化音乐播放器URL
    function initMusicPlayer() {
        const playerUrl = `https://music.163.com/outchain/player?type=${musicConfig.type}&id=${musicConfig.id}&auto=${musicConfig.auto}&height=90`;
        neteasePlayer.src = playerUrl;
    }
    
    // 初始化播放器
    initMusicPlayer();
    
    // 切换播放器显示/隐藏
    function toggleMusicPlayer() {
        isPlayerVisible = !isPlayerVisible;
        if (isPlayerVisible) {
            musicPlayerContainer.classList.add('show');
            musicToggle.classList.add('playing');
        } else {
            musicPlayerContainer.classList.remove('show');
            musicToggle.classList.remove('playing');
        }
    }
    
    // 关闭播放器
    function closeMusicPlayer() {
        isPlayerVisible = false;
        musicPlayerContainer.classList.remove('show');
        musicToggle.classList.remove('playing');
    }
    
    // 音乐按钮点击事件
    musicToggle.addEventListener('click', toggleMusicPlayer);
    
    // 关闭按钮点击事件
    musicPlayerClose.addEventListener('click', closeMusicPlayer);
    
    // 点击页面其他地方关闭播放器
    document.addEventListener('click', function(e) {
        if (isPlayerVisible && 
            !musicPlayerContainer.contains(e.target) && 
            !musicToggle.contains(e.target)) {
            closeMusicPlayer();
        }
    });
    // 检查本地存储中的主题偏好
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // 主题切换按钮点击事件
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // 返回顶部按钮功能
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 从data.js加载更新日志数据
    function loadUpdates() {
        try {
            // 直接从全局变量获取数据
            displayUpdates(changelogData.updates);
        } catch (error) {
            console.error('Error loading changelog data:', error);
            // 显示友好的错误信息
            updateList.innerHTML = `
                <div class="update-item color-scheme1">
                    <div class="update-section">
                        <h3 class="update-title">
                            <span class="update-title-icon">⚠️</span>加载提示
                        </h3>
                        <div class="update-content">
                            <p>无法加载更新日志数据。</p>
                            <p>请确保data.js文件存在且包含正确的更新日志数据。</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    // 显示更新日志
    function displayUpdates(updates) {
        updateList.innerHTML = ''; // 清空现有内容
        
        // 按年份分组
        const updatesByYear = {};
        updates.forEach(update => {
            const year = update.date.split('年')[0];
            if (!updatesByYear[year]) {
                updatesByYear[year] = [];
            }
            updatesByYear[year].push(update);
        });
        
        // 按年份倒序显示
        const years = Object.keys(updatesByYear).sort((a, b) => b - a);
        
        years.forEach(year => {
            const yearUpdates = updatesByYear[year];
            
            // 创建年份分组容器
            const yearGroup = document.createElement('li');
            yearGroup.className = 'year-group';
            
            const yearHeader = document.createElement('div');
            yearHeader.className = 'year-header';
            yearHeader.setAttribute('data-year', year);
            yearHeader.innerHTML = `
                <h3 class="year-title">
                    <i class="fas fa-chevron-down year-icon"></i>
                    ${year}年 更新日志
                    <span class="year-count">(${yearUpdates.length}个版本)</span>
                </h3>
            `;
            
            const yearContent = document.createElement('div');
            yearContent.className = 'year-content';
            yearContent.id = `year-${year}`;
            
            // 创建更新项
            yearUpdates.forEach(update => {
                const updateItem = document.createElement('li');
                updateItem.className = `update-item ${update.colorScheme}`;
                updateItem.id = update.id;
                
                updateItem.innerHTML = `
                    <img src="${update.banner}" alt="${update.version}" class="update-banner">
                    <div class="update-date">
                        ${update.date} - ${update.version}
                        ${update.isLatest ? '<span class="version-badge color-red">最新版本</span>' : ''}
                    </div>
                `;
                
                // 添加各个部分
                update.sections.forEach(section => {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'update-section';
                    sectionDiv.innerHTML = `
                        <h3 class="update-title">
                            <span class="update-title-icon">${section.icon}</span>${section.title.replace(/X/g, section.items.length)}
                        </h3>
                        <div class="update-content">
                            ${section.items.map(item => `<div class="update-list-item">${item}</div>`).join('')}
                        </div>
                    `;
                    updateItem.appendChild(sectionDiv);
                });
                
                yearContent.appendChild(updateItem);
            });
            
            yearGroup.appendChild(yearHeader);
            yearGroup.appendChild(yearContent);
            updateList.appendChild(yearGroup);
        });
        
        // 添加年份分组的点击事件
        addYearGroupEvents();
    }
    
    // 添加年份分组的事件监听
    function addYearGroupEvents() {
        const yearHeaders = document.querySelectorAll('.year-header');
        
        yearHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                const content = document.getElementById(`year-${year}`);
                const icon = this.querySelector('.year-icon');
                
                if (content && icon) {
                    // 切换显示状态
                    content.classList.toggle('collapsed');
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                    
                    // 保存折叠状态到本地存储
                    const collapsedYears = JSON.parse(localStorage.getItem('collapsedYears') || '{}');
                    collapsedYears[year] = content.classList.contains('collapsed');
                    localStorage.setItem('collapsedYears', JSON.stringify(collapsedYears));
                }
            });
            
            // 初始化时根据本地存储恢复折叠状态
            const year = header.getAttribute('data-year');
            const content = document.getElementById(`year-${year}`);
            const icon = header.querySelector('.year-icon');
            const collapsedYears = JSON.parse(localStorage.getItem('collapsedYears') || '{}');
            
            if (collapsedYears[year] && content && icon) {
                content.classList.add('collapsed');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }

    // 存储上一次的版本信息
    let lastVersion = '';
    let lastBanner = '';
    let scrollTimeout = null;
    
    // 滚动监听，显示当前可见的版本号和背景
    function updateVersionDisplay() {
        // 防抖处理，避免频繁触发
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const updateItems = document.querySelectorAll('.update-item');
            let currentVersion = '--';
            let currentColor = '';
            let currentBanner = '';
            
            // 优化的检测逻辑：找到视口中最上方的更新项
            let bestItem = null;
            let bestScore = -Infinity;
            
            for (let i = 0; i < updateItems.length; i++) {
                const item = updateItems[i];
                const rect = item.getBoundingClientRect();
                
                // 计算元素在视口中的可见比例和位置分数
                const viewportHeight = window.innerHeight;
                const elementHeight = rect.height;
                
                // 计算元素与视口的交集
                const overlapTop = Math.max(0, -rect.top);
                const overlapBottom = Math.max(0, rect.bottom - viewportHeight);
                const visibleHeight = Math.max(0, elementHeight - overlapTop - overlapBottom);
                const visibleRatio = visibleHeight / elementHeight;
                
                // 计算位置分数：可见比例越高，位置越靠上，分数越高
                let positionScore = 0;
                
                if (visibleRatio > 0) {
                    // 基础分数：可见比例
                    positionScore = visibleRatio * 100;
                    
                    // 位置奖励：越靠近视口中心得分越高
                    const viewportCenter = viewportHeight * 0.5;
                    const itemCenter = rect.top + elementHeight * 0.5;
                    const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
                    const positionBonus = Math.max(0, 50 - (distanceFromCenter / viewportHeight) * 50);
                    
                    positionScore += positionBonus;
                    
                    // 顶部优先：如果元素在视口上半部分，给予额外奖励
                    if (itemCenter < viewportCenter) {
                        positionScore += 20;
                    }
                }
                
                // 更新最佳项目
                if (positionScore > bestScore) {
                    bestScore = positionScore;
                    bestItem = item;
                }
            }
            
            // 如果找到合适的项目
            if (bestItem) {
                const versionElement = bestItem.querySelector('.update-date');
                if (versionElement) {
                    // 获取完整文本
                    const text = versionElement.textContent.trim();
                    
                    // 直接获取版本号，不使用正则
                    const versionText = text.split('-')[1]?.trim() || text;
                    currentVersion = versionText;
                    
                    // 获取颜色方案
                    if (bestItem.classList.contains('color-red')) {
                        currentColor = 'var(--color-red-middle)';
                    } else if (bestItem.classList.contains('color-green')) {
                        currentColor = 'var(--color-green-middle)';
                    } else if (bestItem.classList.contains('color-gold')) {
                        currentColor = 'var(--color-gold-middle)';
                    } else if (bestItem.classList.contains('color-pink')) {
                        currentColor = 'var(--color-pink-middle)';
                    }
                    
                    // 获取banner图片
                    const bannerElement = bestItem.querySelector('.update-banner');
                    if (bannerElement) {
                        currentBanner = bannerElement.src;
                    }
                }
            }
        
        // 更新背景（只有当版本或banner发生变化时）
        if (currentBanner && (currentVersion !== lastVersion || currentBanner !== lastBanner)) {
            console.log('Version or banner changed, updating background...');
            
            // 检查是否为深色模式
            const isDarkMode = document.body.classList.contains('dark-mode');
            const gradient = isDarkMode 
                ? 'linear-gradient(rgba(30, 30, 30, 0.3), rgba(25, 25, 25, 0.4))'
                : 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(245, 250, 255, 0.3))';
            
            // 获取背景层
            const currentLayer = document.querySelector('.background-layer.current');
            const nextLayer = document.querySelector('.background-layer.next');
            
            // 设置新背景
            const newBackground = `${gradient}, url('${currentBanner}')`;
            
            console.log('Switching background...');
            
            // 设置下一个背景
            nextLayer.style.backgroundImage = newBackground;
            
            // 确保下一层在上面
            nextLayer.style.zIndex = '2';
            currentLayer.style.zIndex = '1';
            
            // 切换层
            currentLayer.style.opacity = '0';
            nextLayer.style.opacity = '1';
            
            // 等待动画完成后交换类名
            setTimeout(() => {
                currentLayer.classList.remove('current');
                currentLayer.classList.add('next');
                nextLayer.classList.remove('next');
                nextLayer.classList.add('current');
                
                // 重置z-index
                currentLayer.style.zIndex = '0';
                nextLayer.style.zIndex = '1';
                
                // 更新记录
                lastVersion = currentVersion;
                lastBanner = currentBanner;
            }, 1500);
        }
    }, 200); // 200ms防抖延迟
    }
    
    // 初始加载更新日志
    loadUpdates();
    
    // 添加滚动监听
    window.addEventListener('scroll', updateVersionDisplay);
    window.addEventListener('resize', updateVersionDisplay);
    
    // 设置初始背景
    function setInitialBackground() {
        const currentLayer = document.querySelector('.background-layer.current');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const gradient = isDarkMode 
            ? 'linear-gradient(rgba(30, 30, 30, 0.3), rgba(25, 25, 25, 0.4))'
            : 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(245, 250, 255, 0.3))';
        
        // 使用第一张更新日志的banner作为初始背景
        if (changelogData && changelogData.updates && changelogData.updates.length > 0 && changelogData.updates[0].banner) {
            currentLayer.style.backgroundImage = `${gradient}, url('${changelogData.updates[0].banner}')`;
        }
    }
    
    // 初始更新版本显示
    setTimeout(() => {
        setInitialBackground();
        updateVersionDisplay();
    }, 100);
});