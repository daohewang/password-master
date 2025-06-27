document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strength-text');

    // 字符集
    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?'
    };

    // 生成密码
    function generatePassword() {
        let charset = '';
        let password = '';

        // 检查至少选择了一个选项
        if (!uppercaseCheckbox.checked && 
            !lowercaseCheckbox.checked && 
            !numbersCheckbox.checked && 
            !symbolsCheckbox.checked) {
            alert('请至少选择一种字符类型');
            return;
        }

        // 构建字符集
        if (uppercaseCheckbox.checked) charset += CHAR_SETS.uppercase;
        if (lowercaseCheckbox.checked) charset += CHAR_SETS.lowercase;
        if (numbersCheckbox.checked) charset += CHAR_SETS.numbers;
        if (symbolsCheckbox.checked) charset += CHAR_SETS.symbols;

        // 生成密码
        const length = parseInt(lengthInput.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        // 确保密码包含所有选中的字符类型
        const checks = [
            { condition: uppercaseCheckbox.checked, regex: /[A-Z]/ },
            { condition: lowercaseCheckbox.checked, regex: /[a-z]/ },
            { condition: numbersCheckbox.checked, regex: /[0-9]/ },
            { condition: symbolsCheckbox.checked, regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>/?]/ }
        ];

        const hasAllRequired = checks.every(check => 
            !check.condition || check.regex.test(password)
        );

        if (!hasAllRequired) {
            return generatePassword(); // 重新生成
        }

        return password;
    }

    // 计算密码强度
    function calculateStrength(password) {
        let score = 0;
        
        // 长度评分
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // 字符类型评分
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        return score;
    }

    // 更新强度指示器
    function updateStrengthIndicator(password) {
        const score = calculateStrength(password);
        let strength, color, width;

        switch (true) {
            case score <= 2:
                strength = '弱';
                color = 'var(--weak-color)';
                width = '25%';
                break;
            case score <= 4:
                strength = '中等';
                color = 'var(--medium-color)';
                width = '50%';
                break;
            case score <= 6:
                strength = '强';
                color = 'var(--strong-color)';
                width = '75%';
                break;
            default:
                strength = '非常强';
                color = 'var(--very-strong-color)';
                width = '100%';
        }

        strengthBar.style.setProperty('--strength-color', color);
        strengthBar.style.setProperty('--strength-width', width);
        strengthText.textContent = `强度：${strength}`;
    }

    // 复制密码
    async function copyPassword() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            alert('复制失败，请手动复制');
        }
    }

    // 事件监听器
    generateBtn.addEventListener('click', () => {
        const password = generatePassword();
        if (password) {
            passwordDisplay.value = password;
            updateStrengthIndicator(password);
        }
    });

    copyBtn.addEventListener('click', copyPassword);

    // 初始生成密码
    generateBtn.click();
});