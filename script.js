document.getElementById('idcardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let inputData = document.getElementById('inputData').value.trim();
    let lines = inputData.split('\n');
    let results = [];
    let idcardPattern = /\d{17}[\dX]/;  // 身份证号的正则表达式：18位数字，最后一位可以是X

    // 清空结果区域
    document.getElementById('result').innerHTML = '';

    lines.forEach((line, index) => {
        line = line.trim();

        // 寻找身份证号（18位数字串）
        let idcardMatch = line.match(idcardPattern);

        if (idcardMatch) {
            let idcard = idcardMatch[0];  // 提取匹配的身份证号
            let name = line.replace(idcard, '').trim();  // 剩下的部分视为姓名

            if (!name || idcard.length !== 18) {
                results.push(`第 ${index + 1} 行数据格式有误。`);
                return;
            }

            // 构建请求体
            let data = {
                "biz_content": JSON.stringify({
                    "name": name,
                    "idcard": idcard
                })
            };

            // 发起API请求
            fetch('https://smrzhy.market.alicloudapi.com/smrz/dmp/api/jinrun.idcard.verify.idcard', {
                method: 'POST',
                headers: {
                    'Authorization': 'APPCODE e59ae8621841494ba475d139340834fe',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: new URLSearchParams(data)
            })
            .then(response => response.json())
            .then(data => {
                // 根据 API 的返回值判断是否一致
                 
                if (data.code === "2" || data.code === "400") {
                    results.push(`${name} 信息不一致 `);
                }

                // 输出所有不一致的结果
                if (results.length > 0 ) {
                    document.getElementById('result').innerHTML = results.join('<br>');
                } else if (results.length === 0) {
                    document.getElementById('result').innerHTML = '所有输入均一致';
                }
            })
            .catch(error => {
                results.push(`第 ${index + 1} 行: 请求失败：${error}`);
                
                // 输出所有不一致的结果
                if (results.length > 0 && results.length === lines.length) {
                    document.getElementById('result').innerHTML = results.join('<br>');
                }
            });
        }
    });
});
