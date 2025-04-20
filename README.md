# MWGA - Web Page Tariff Simulator
# MWGA - 网页访问加税模拟器

[![English & Chinese](https://img.shields.io/badge/Language-English%20%26%20Chinese-blue)](README.md)
[![简体中文](https://img.shields.io/badge/语言-简体中文-red)](README_CN.md)

![MWGA](https://img.shields.io/badge/MWGA-Make%20Web%20Great%20Again-red)
![License](https://img.shields.io/github/license/xjy666a/web-tariff-simulator)
![Version](https://img.shields.io/badge/version-0.1-blue)

## English

### Introduction

**Web Page Tariff Simulator** is a satirical Tampermonkey script that simulates the impact of trade wars by adding "tariffs" to your web browsing experience. When you visit a website, the script will calculate the original loading time, then apply your custom tariff rate (default 125%), and make you wait for the additional time - just like how tariffs slow down international trade!

The script features special "exemptions" for mobile phone and semiconductor websites, mirroring real-world trade policies.

### Features

- 🕒 Simulates tariffs by adding artificial loading delays to websites
- 💰 Customizable tariff rates (default: 125%)
- 🚫 Tax exemptions for specified industries (mobile & semiconductor websites)
- 🔧 User-configurable exemption list
- 📊 Visual progress bar and detailed statistics about loading times
- 🌐 "Make Web Great Again" (MWGA) banner for the full satirical experience

### Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on the Tampermonkey icon and select "Create a new script"
3. Delete any default code and paste the entire content of `tax_on_webpages.user.js`
4. Save the script (Ctrl+S or File > Save)
5. The script will now run automatically on all websites

### Configuration

Click on the Tampermonkey icon and look for options under "Web Page Tariff Simulator":

- **Enable/Disable Tariffs**: Toggle tariff simulation on/off
- **Set Tariff Rate**: Change the percentage rate (higher = longer wait times)
- **Manage Custom Exemptions**: Add your frequently visited websites to the exemption list
- **Delete Custom Exemption**: Remove a specific domain from your exemption list
- **Clear All Custom Exemptions**: Reset your exemption list

### How It Works

1. When you visit a website, the script measures its original loading time
2. It immediately clears the loaded content and shows a "tariff notification"
3. Based on your set tariff rate, it calculates the additional waiting time
4. A progress bar shows the "tariff payment" process
5. After the wait, the original content is restored with a tariff receipt in the corner
6. The "MWGA" banner appears at the bottom of the page

### Default Exempt Websites

The script provides tariff exemption for these types of websites by default:

#### Mobile Websites
apple.com, mi.com, oneplus.com, samsung.com, huawei.com, vivo.com, oppo.com, motorola.com, etc.

#### Semiconductor Websites
intel.com, amd.com, nvidia.com, qualcomm.com, arm.com, tsmc.com, micron.com, etc.

Chinese domain versions (.cn or .com.cn) of these websites are also exempt.

### Why Create This?

This script is a humorous satire of tariff policies in trade wars. It lets users personally experience the efficiency loss and inconvenience brought by "tariffs," while also reflecting the common "selective exemption" policies in trade wars.

By adding "tariffs" to the browsing experience, we hope to provoke thought about trade policies in a light-hearted and entertaining way.

Copyright (c) 2025 xjy666a

