//编辑试卷验证规则
//验证分数
function validateScore(rule, value, callback) {
        if (!isNaN(value)) {
            if (!(value > 0)) {
                callback(new Error("分数不能等于或小于0"));
            } else {
                callback();
            }
        } else {
            callback(new Error("分数必须为数字"));
        }
}
//验证空格
const RGE = /^\s+|\s+$/gm;
function validateBlank(rule, value, callback) {
    if (!value.replace(RGE, "")) {
        callback(new Error("输入不能为纯空格"));
    } else {
        callback();
    }
}
const required = { required: true, message: "请输入", trigger: "blur" }
export const scoreRule = [
    required,
    {
    validator: validateScore,
    trigger: "blur"
}];
export const balnkRule = [
    required,
    {
        validator: validateBlank,
        trigger: "blur"
    }
];