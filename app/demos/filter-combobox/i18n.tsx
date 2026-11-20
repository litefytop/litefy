"use client";

import { useState } from "react";
import { FilterCombobox, type FilterComboboxField, type FilterComboboxTexts, type FilterRule } from "@/ui/skins";

const statusValues = ["Scheduled", "Overdue", "On hold", "In progress", "Completed"];
const statusLabels = ["已排期", "已逾期", "挂起", "进行中", "已完成"];

const texts: FilterComboboxTexts = {
  placeholder: "输入列名添加筛选条件",
  fieldPlaceholder: "列名",
  operatorPlaceholder: "操作符",
  valuePlaceholder: "值",
  emptyFieldsText: "没有匹配的列",
  emptyOperatorsText: "没有匹配的操作符",
  emptyValuesText: "没有匹配的选项",
  invalidValueText: "请输入一个值",
  invalidRangeText: "请输入两个值，以逗号、斜杠、空格或波浪号分隔",
  invertedRangeText: "起始值不能大于结束值",
  removeLabel: "删除条件",
  editLabel: "编辑条件",
  cancelDraftText: "放弃条件",
  clearText: "清空",
  separatorLabel: "可用以下键分隔",
  submitText: "应用",
  loadingText: "加载中",
  resultCountText: "共 {count} 条",
  operatorLabels: {
    is: "等于", isNot: "不等于", contains: "包含", notContains: "不包含",
    gt: "大于", gte: "大于等于", lt: "小于", lte: "小于等于",
    between: "介于", notBetween: "不介于", before: "早于", after: "晚于",
    isEmpty: "为空", isNotEmpty: "不为空",
  },
};

const fields: FilterComboboxField[] = [
  { name: "summary", label: "工单", type: "text", aliases: ["job", "标题"], operators: ["contains", "notContains", "isEmpty", "isNotEmpty"] },
  {
    name: "status", label: "状态", type: "enum", aliases: ["state", "状态"], operators: ["is", "isNot", "isEmpty"],
    options: statusLabels.map((label, index) => ({ label, value: statusValues[index] })),
  },
  { name: "quote", label: "报价", type: "number", aliases: ["amount", "金额"], operators: ["is", "gt", "gte", "lt", "lte", "between"] },
  { name: "scheduledOn", label: "预约日期", type: "date", aliases: ["date", "日期"], operators: ["is", "before", "after", "between"] },
];

export default function Demo() {
  const [rules, setRules] = useState<FilterRule[]>([
    { id: "seed", field: "quote", operator: "between", value: ["1000", "5000"] },
  ]);
  return (
    <div className="flex w-full flex-col items-center">
      <FilterCombobox fields={fields} value={rules} onChange={setRules} texts={texts} />
    </div>
  );
}
