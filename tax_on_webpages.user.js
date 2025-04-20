// ==UserScript==
// @name         网页访问加税模拟器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  模拟对网页访问加征关税，讽刺贸易战
// @author       xjy666a
// @icon         https://img.picui.cn/free/2025/04/20/68047b6599955.png
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置
    let taxRate = GM_getValue('taxRate', 125); // 默认税率为125%
    let isEnabled = GM_getValue('isEnabled', true); // 默认启用
    let customExemptDomains = GM_getValue('customExemptDomains', []); // 用户自定义免税域名

    // 预设免税网站列表
    const defaultExemptDomains = [
        // 手机网站
        'apple.com', 'mi.com', 'oneplus.com', 'samsung.com', 'huawei.com',
        'vivo.com', 'oppo.com', 'motorola.com', 'gsmarena.com', 'phonearena.com',
        // 半导体网站
        'intel.com', 'amd.com', 'nvidia.com', 'qualcomm.com', 'arm.com',
        'tsmc.com', 'micron.com', 'broadcom.com', 'analog.com', 'ti.com',
        'nxp.com', 'infineon.com', 'st.com', 'rohm.com', 'renesas.com',
        'skhynix.com', 'asml.com', 'semi.org', 'semiconductors.org'
    ];

    // 合并默认和自定义免税域名
    let exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

    // 判断当前网站是否免税
    function isExemptWebsite() {
        const currentHost = window.location.hostname.toLowerCase();

        // 检查是否为直接匹配的免税网站
        if (exemptDomains.some(domain => currentHost.includes(domain))) {
            return true;
        }

        // 检查是否为免税网站的中国域名版本（.cn）
        // 例如：apple.cn, apple.com.cn, mi.cn, mi.com.cn 等
        for (const domain of exemptDomains) {
            const baseDomain = domain.replace('.com', '').replace('.org', '');
            if (currentHost.includes(`${baseDomain}.cn`) ||
                currentHost.includes(`${baseDomain}.com.cn`)) {
                return true;
            }
        }

        return false;
    }

    // 注册菜单命令
    GM_registerMenuCommand('✅ 开启/关闭加税功能', function() {
        isEnabled = !isEnabled;
        GM_setValue('isEnabled', isEnabled);
        alert(`加税功能已${isEnabled ? '开启' : '关闭'}，刷新页面生效`);
        location.reload();
    });

    GM_registerMenuCommand('💰 设置网页访问税率', function() {
        const newRate = prompt('请输入网页访问税率（如：125表示125%）：', taxRate);
        if (newRate !== null && !isNaN(newRate) && newRate >= 0) {
            taxRate = parseFloat(newRate);
            GM_setValue('taxRate', taxRate);
            alert(`税率已设置为 ${taxRate}%`);
        }
    });

    GM_registerMenuCommand('🔍 管理自定义免税网站', function() {
        let message = '当前自定义免税网站列表（每行一个域名）：\n';
        message += '例如: example.com\n\n';
        message += '提示：修改后需刷新页面生效\n\n';

        const domainsText = prompt(message, customExemptDomains.join('\n'));

        if (domainsText !== null) {
            // 解析用户输入的域名（按行分割）
            const domains = domainsText
                .split('\n')
                .map(domain => domain.trim())
                .filter(domain => domain.length > 0);

            // 保存设置
            customExemptDomains = domains;
            GM_setValue('customExemptDomains', customExemptDomains);

            // 更新合并的列表
            exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

            if (confirm(`已保存 ${domains.length} 个自定义免税网站，需要刷新页面才能生效。\n\n是否立即刷新页面？`)) {
                location.reload();
            }
        }
    });

    // 添加清空自定义免税网站的菜单
    GM_registerMenuCommand('🗑️ 清空自定义免税网站', function() {
        if (customExemptDomains.length === 0) {
            alert('自定义免税网站列表已经是空的');
            return;
        }

        if (confirm(`确定要清空所有 ${customExemptDomains.length} 个自定义免税网站吗？`)) {
            customExemptDomains = [];
            GM_setValue('customExemptDomains', []);

            // 更新合并的列表
            exemptDomains = [...defaultExemptDomains];

            if (confirm('已清空自定义免税网站列表，需要刷新页面才能生效。\n\n是否立即刷新页面？')) {
                location.reload();
            }
        }
    });

    // 添加删除单个免税网站的菜单
    GM_registerMenuCommand('✂️ 删除单个免税网站', function() {
        if (customExemptDomains.length === 0) {
            alert('自定义免税网站列表为空，没有可删除的网站');
            return;
        }

        // 构建带有编号的域名列表
        let listMessage = '当前自定义免税网站列表：\n\n';
        customExemptDomains.forEach((domain, index) => {
            listMessage += `${index + 1}. ${domain}\n`;
        });
        listMessage += '\n请输入要删除的网站序号(1-' + customExemptDomains.length + ')，或直接输入域名:';

        const userInput = prompt(listMessage);

        if (userInput === null) return; // 用户取消

        let indexToRemove = -1;
        const inputNum = parseInt(userInput);

        // 检查是否输入的是有效序号
        if (!isNaN(inputNum) && inputNum >= 1 && inputNum <= customExemptDomains.length) {
            indexToRemove = inputNum - 1;
        } else {
            // 按域名查找
            indexToRemove = customExemptDomains.findIndex(domain =>
                domain.toLowerCase() === userInput.toLowerCase().trim());
        }

        if (indexToRemove === -1) {
            alert('未找到匹配的免税网站，请检查输入');
            return;
        }

        // 获取要删除的域名并确认
        const domainToRemove = customExemptDomains[indexToRemove];
        if (confirm(`确定要删除免税网站 "${domainToRemove}" 吗？`)) {
            // 删除指定域名
            customExemptDomains.splice(indexToRemove, 1);
            GM_setValue('customExemptDomains', customExemptDomains);

            // 更新合并列表
            exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

            if (confirm(`已删除免税网站 "${domainToRemove}"，需要刷新页面才能生效。\n\n是否立即刷新页面？`)) {
                location.reload();
            }
        }
    });

    // 如果功能关闭，直接退出
    if (!isEnabled) return;

    // 防止重复执行
    if (window.taxAlreadyApplied) return;
    window.taxAlreadyApplied = true;

    // 检查是否为免税网站
    if (isExemptWebsite()) {
        // 等网页加载完成后显示免税提示
        window.addEventListener('load', function() {
            const exemptNotice = document.createElement('div');
            exemptNotice.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,100,0,0.8);color:white;padding:10px 15px;border-radius:5px;font-size:14px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.3);';

            exemptNotice.innerHTML = `
                <div style="font-weight:bold;margin-bottom:5px;">
                    ✅ 此网站享受特殊豁免权
                </div>
                <div style="font-size:12px;">
                    根据最新贸易政策，手机和半导体网站<br>无需缴纳网页访问关税！
                </div>
            `;

            document.body.appendChild(exemptNotice);

            // 点击关闭
            exemptNotice.addEventListener('click', function() {
                exemptNotice.remove();
            });

            // 5秒后自动消失
            setTimeout(() => {
                if (exemptNotice.parentNode) {
                    exemptNotice.style.transition = 'opacity 1s';
                    exemptNotice.style.opacity = '0';
                    setTimeout(() => exemptNotice.remove(), 1000);
                }
            }, 5000);
        });

        // 免税网站提前返回，不执行加税逻辑
        return;
    }

    // 记录页面加载开始时间
    const startTime = performance.now();

    // 当页面加载完成时
    window.addEventListener('load', function() {
        // 计算原始加载时间（毫秒）
        const originalLoadTime = performance.now() - startTime;

        // 计算税后加载时间
        const taxedLoadTime = originalLoadTime * (1 + taxRate / 100);
        const additionalWaitTime = taxedLoadTime - originalLoadTime;

        // 保存当前页面内容
        const originalContent = document.documentElement.innerHTML;

        // 清除页面内容并显示加税提示
        document.body.innerHTML = '';
        const taxDiv = document.createElement('div');
        taxDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:24px;z-index:9999;';

        taxDiv.innerHTML = `
            <div style="text-align:center;max-width:80%;">
                <h1 style="color:red;">⚠️ 网页访问加征关税通知 ⚠️</h1>
                <p>根据最新贸易战政策，您访问此网站需加征 <span style="color:red;font-weight:bold;">${taxRate}%</span> 的关税</p>
                <p>原始加载时间：${(originalLoadTime/1000).toFixed(2)}秒</p>
                <p>税后加载时间：${(taxedLoadTime/1000).toFixed(2)}秒</p>
                <p>正在模拟贸易战带来的额外等待...</p>
                <div id="taxProgressBar" style="width:80%;height:20px;background:#eee;margin:20px auto;border-radius:10px;overflow:hidden;">
                    <div id="taxProgressFill" style="width:0%;height:100%;background:red;transition:width linear;"></div>
                </div>
                <p id="taxCountdown"></p>
                <p style="font-size:14px;color:#666;margin-top:15px;">提示：手机和半导体网站已获特殊豁免，无需缴纳关税</p>
            </div>
        `;

        document.body.appendChild(taxDiv);

        // 添加进度条动画
        const progressFill = document.getElementById('taxProgressFill');
        const countdownEl = document.getElementById('taxCountdown');
        progressFill.style.transition = `width ${additionalWaitTime}ms linear`;

        // 启动倒计时
        const updateInterval = 100; // 每100毫秒更新一次
        let remainingTime = additionalWaitTime;

        const countdownInterval = setInterval(() => {
            remainingTime -= updateInterval;
            const percentage = 100 - (remainingTime / additionalWaitTime * 100);
            progressFill.style.width = `${percentage}%`;
            countdownEl.textContent = `剩余等待时间：${(remainingTime/1000).toFixed(1)}秒`;

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
            }
        }, updateInterval);

        // 等待额外的时间后恢复页面
        setTimeout(function() {
            document.documentElement.innerHTML = originalContent;

            // 添加已完成税收的标记
            const taxPaidMark = document.createElement('div');
            taxPaidMark.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px 15px;border-radius:5px;font-size:14px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.3);';

            taxPaidMark.innerHTML = `
                <div style="border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:5px;font-weight:bold;color:#ff5555;">
                    ⚠️ 网页访问已征收 ${taxRate}% 关税
                </div>
                <div style="display:flex;justify-content:space-between;margin:3px 0;">
                    <span>原始加载时间:</span>
                    <span>${(originalLoadTime/1000).toFixed(2)}秒</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin:3px 0;">
                    <span>关税后时间:</span>
                    <span>${(taxedLoadTime/1000).toFixed(2)}秒</span>
                </div>
                <div style="margin-top:5px;font-size:12px;text-align:center;color:#aaa;">
                    点击关闭此提示
                </div>
            `;

            document.body.appendChild(taxPaidMark);

            // 添加MWGA标语
            const mwgaBanner = document.createElement('div');
            mwgaBanner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(255,0,0,0.9);color:white;padding:10px 25px;border-radius:5px;font-size:18px;z-index:9999;box-shadow:0 2px 15px rgba(0,0,0,0.4);text-align:center;font-weight:bold;cursor:pointer;';

            mwgaBanner.innerHTML = `
                <div style="font-size:28px;letter-spacing:5px;margin-bottom:5px;">M W G A</div>
                <div style="font-size:16px;">Make Web Great Again!</div>
            `;

            document.body.appendChild(mwgaBanner);

            // 点击移除标记
            taxPaidMark.addEventListener('click', function() {
                taxPaidMark.remove();
            });

            mwgaBanner.addEventListener('click', function() {
                mwgaBanner.remove();
            });

            // 10秒后自动消失
            setTimeout(() => {
                if (taxPaidMark.parentNode) {
                    taxPaidMark.style.transition = 'opacity 1s';
                    taxPaidMark.style.opacity = '0';
                    setTimeout(() => taxPaidMark.remove(), 1000);
                }

                if (mwgaBanner.parentNode) {
                    mwgaBanner.style.transition = 'opacity 1s, transform 1s';
                    mwgaBanner.style.opacity = '0';
                    mwgaBanner.style.transform = 'translateX(-50%) translateY(20px)';
                    setTimeout(() => mwgaBanner.remove(), 1000);
                }
            }, 10000);

        }, additionalWaitTime);
    });
})();
