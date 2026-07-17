document.addEventListener('DOMContentLoaded', () => {
    // 1. 全局页面淡入渐现动效
    if (document.body) {
        document.body.style.opacity = 0;
        setTimeout(() => {
            document.body.style.transition = 'opacity 2s ease-in-out';
            document.body.style.opacity = 1;
        }, 50);
    }

    // 2. Fiction 页面：3D 回环塔罗牌控制系统
    const carousel = document.querySelector('.tarot-carousel');
    if (carousel) {
        const cards = Array.from(document.querySelectorAll('.tarot-card'));
        const totalCards = cards.length; 
        
        // 【核心修复：增加记忆定位功能】
        // 检查网址链接里有没有带 "?card=数字" 的小尾巴
        const urlParams = new URLSearchParams(window.location.search);
        // 如果有小尾巴，就把对应的牌居中；如果是第一次直接进来的，就默认居中 0 (魔术师)
        let currentIndex = urlParams.has('card') ? parseInt(urlParams.get('card')) : 0;

        // 核心渲染函数：根据当前居中索引计算每张牌的状态
        function updateCarousel() {
            cards.forEach((card, i) => {
                let diff = i - currentIndex;

                // 算法核心：实现 8 张牌的闭环环绕计算 (保证 diff 处于 -4 到 3 之间)
                if (diff < -4) diff += totalCards;
                if (diff > 3) diff -= totalCards;

                // 清除当前卡牌的所有状态类
                card.className = 'tarot-card';

                // 根据相对位移赋予不同的 3D 样式类
                if (diff === 0) {
                    card.classList.add('card-center'); 
                } else if (diff === -1) {
                    card.classList.add('card-left-1'); 
                } else if (diff === 1) {
                    card.classList.add('card-right-1'); 
                } else if (diff === -2) {
                    card.classList.add('card-left-2'); 
                } else if (diff === 2) {
                    card.classList.add('card-right-2'); 
                } else {
                    card.classList.add('card-hidden');  
                }
            });
        }

        // 初始化布局
        updateCarousel();

        // 绑定卡牌点击控制
        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                let diff = i - currentIndex;
                if (diff < -4) diff += totalCards;
                if (diff > 3) diff -= totalCards;

                if (diff === 0) {
                    // 点击居中牌 a：执行跳转进入对应的作品页面
                    const link = card.getAttribute('data-link');
                    if (link) {
                        window.location.href = link;
                    }
                } else if (diff === -1) {
                    // 点击左侧牌 b：向左滑，b 变成居中牌
                    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                    updateCarousel();
                } else if (diff === 1) {
                    // 点击右侧牌 c：向右滑，c 变成居中牌
                    currentIndex = (currentIndex + 1) % totalCards;
                    updateCarousel();
                }
            });
        });
    }
});