"use client";

import * as React from "react";
import { useParams } from "react-router";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Callout,
  Card,
  Chip,
  DropdownMenu,
  FieldSearch,
  FormItem,
  Input,
  Kbd,
  Pagination,
  Progress,
  Select,
  Table,
  Timeline,
  Toaster,
  type MenuConfig,
  type SortState,
  type TableColumn,
} from "@/ui";
import { Bell, Download, Flag, Printer, Search, X } from "lucide-react";
import NotFound from "./not-found";

type OrderStatus = "done" | "processing" | "unpaid" | "canceled";

interface Order {
  id: string;
  customer: string;
  customerEn: string;
  amount: number;
  status: OrderStatus;
  date: string;
  op?: string;
}

const CUSTOMERS = [
  ["云帆科技", "Cloud Sail Tech"],
  ["远山文化传媒", "Farside Media"],
  ["松果零售", "Pinecone Retail"],
  ["蓝鲸物流", "Blue Whale Logistics"],
  ["青柠设计工作室", "Lime Studio"],
  ["长风制造", "Changfeng Mfg"],
  ["海图数据", "SeaChart Data"],
  ["木桥建筑", "Woodbridge Build"],
];

const STATUSES: OrderStatus[] = ["done", "processing", "unpaid", "canceled"];

const ORDERS: Order[] = Array.from({ length: 24 }, (_, i) => ({
  id: `SO-2610-${String(24 - i).padStart(3, "0")}`,
  customer: CUSTOMERS[i % CUSTOMERS.length][0],
  customerEn: CUSTOMERS[i % CUSTOMERS.length][1],
  amount: 180 + ((i * 237) % 2400),
  status: STATUSES[(i * 3 + 1) % STATUSES.length],
  date: `10-${String((i % 9) + 1).padStart(2, "0")}`,
}));

const COPY = {
  en: {
    title: "Default Style",
    crumb: ["Styles", "Default Style"],
    stylesHref: "/en/docs/styles",
    search: "Search orders",
    searchCustomer: "Search customer",
    allStatuses: "All statuses",
    newOrder: "New order",
    bulk: "Bulk actions",
    exportCsv: "Export CSV",
    printLabels: "Print labels",
    dangerGroup: "Danger zone",
    cancelOrder: "Cancel order",
    list: "Orders",
    colId: "Order no.",
    colCustomer: "Customer",
    colAmount: "Amount",
    colStatus: "Status",
    colActions: "Actions",
    detail: "Details",
    revoke: "Revoke",
    perPage: "per page",
    summary: (total: number, page: number, pages: number) =>
      `${total} orders · page ${page} of ${pages}`,
    status: { done: "Completed", processing: "Processing", unpaid: "Unpaid", canceled: "Canceled" },
    stats: {
      today: ["Orders today", "vs. yesterday"],
      pending: ["Awaiting shipment", "needs action"],
      paid: ["Payment rate", "collected / billable"],
      avg: ["Average order", "week over week"],
    },
    form: {
      title: "New order",
      customer: "Customer",
      customerPh: "Company name",
      customerRule: "Customer name is required",
      amount: "Amount",
      priority: "Priority",
      priorityOptions: [["high", "High"], ["medium", "Medium"], ["low", "Low"]] as [string, string][],
      note: "Note",
      notePh: "Delivery window, invoicing…",
      submit: "Create order",
      reset: "Reset",
      created: "Order created",
    },
    activity: {
      title: "Recent activity",
      items: [
        { time: "10:24", heading: "SO-2610-018 completed", description: "Signed by customer" },
        { time: "09:12", heading: "SO-2610-021 created", description: "Deposit pending" },
        { time: "Yesterday", heading: "SO-2610-009 revoked", description: "Refund issued" },
      ],
    },
    callout: "Revoked orders are refunded automatically within 24 hours.",
    notifications: "Notifications",
    currency: "$",
  },
  zh: {
    title: "Default Style 默认方案",
    crumb: ["样式", "默认方案"],
    stylesHref: "/zh/docs/styles",
    search: "搜索订单",
    searchCustomer: "搜索客户",
    allStatuses: "全部状态",
    newOrder: "新建订单",
    bulk: "批量操作",
    exportCsv: "导出 CSV",
    printLabels: "打印面单",
    dangerGroup: "危险操作",
    cancelOrder: "取消订单",
    list: "订单列表",
    colId: "单号",
    colCustomer: "客户",
    colAmount: "金额",
    colStatus: "状态",
    colActions: "操作",
    detail: "明细",
    revoke: "撤回",
    perPage: "条/页",
    summary: (total: number, page: number, pages: number) =>
      `共 ${total} 条 · 第 ${page}/${pages} 页`,
    status: { done: "已完成", processing: "处理中", unpaid: "待付款", canceled: "已取消" },
    stats: {
      today: ["今日订单", "较昨日"],
      pending: ["待发货", "需处理"],
      paid: ["回款率", "已收 / 应收"],
      avg: ["客单价", "环比"],
    },
    form: {
      title: "新建订单",
      customer: "客户名称",
      customerPh: "公司名称",
      customerRule: "请输入客户名称",
      amount: "金额（元）",
      priority: "优先级",
      priorityOptions: [["high", "高"], ["medium", "中"], ["low", "低"]] as [string, string][],
      note: "备注",
      notePh: "交付窗口、开票信息…",
      submit: "创建订单",
      reset: "重置",
      created: "订单已创建",
    },
    activity: {
      title: "最近动态",
      items: [
        { time: "10:24", heading: "SO-2610-018 已完成", description: "客户已签收" },
        { time: "09:12", heading: "SO-2610-021 已创建", description: "定金待支付" },
        { time: "昨天", heading: "SO-2610-009 已撤回", description: "退款已发起" },
      ],
    },
    callout: "撤回后的订单将在 24 小时内自动退款。",
    notifications: "通知",
    currency: "¥",
  },
} as const;

const STATUS_CHIP: Record<OrderStatus, "success" | "info" | "warning" | "outline"> = {
  done: "success",
  processing: "info",
  unpaid: "warning",
  canceled: "outline",
};

export function meta({ params }: { params: { lang?: string } }) {
  const t = params.lang === "zh" ? COPY.zh.title : COPY.en.title;
  return [{ title: `${t} — Litefy UI` }, { name: "robots", content: "noindex" }];
}

export default function TemplateShowcase() {
  const { lang, slug } = useParams<{ lang?: string; slug: string }>();
  if (slug !== "default") return <NotFound />;
  return <DefaultTemplate lang={lang === "zh" ? "zh" : "en"} />;
}

function DefaultTemplate({ lang }: { lang: "zh" | "en" }) {
  const t = COPY[lang];
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = React.useState<SortState<Order>>({ key: "id", direction: "asc" });
  const [query, setQuery] = React.useState<{ field: string; value: string }>({ field: "customer", value: "" });

  const filtered = React.useMemo(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return ORDERS;
    if (query.field === "status") return ORDERS.filter((o) => o.status === q);
    return ORDERS.filter((o) =>
      `${o.id} ${o.customer} ${o.customerEn}`.toLowerCase().includes(q),
    );
  }, [query]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const k = sort.key;
      return ((a[k] ?? "") > (b[k] ?? "") ? 1 : -1) * dir;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const columns: TableColumn<Order>[] = [
    { key: "id", header: t.colId, sortable: true, width: "9rem" },
    {
      key: lang === "zh" ? "customer" : "customerEn",
      header: t.colCustomer,
      render: (o) => (lang === "zh" ? o.customer : o.customerEn),
    },
    {
      key: "amount",
      header: t.colAmount,
      sortable: true,
      width: "8rem",
      render: (o) => `${t.currency}${o.amount.toLocaleString(lang === "zh" ? "zh-CN" : "en-US")}`,
    },
    {
      key: "status",
      header: t.colStatus,
      width: "8rem",
      render: (o) => <Chip variant={STATUS_CHIP[o.status]}>{t.status[o.status]}</Chip>,
    },
    {
      key: "date",
      header: lang === "zh" ? "日期" : "Date",
      sortable: true,
      width: "6.5rem",
    },
    {
      key: "op",
      header: t.colActions,
      width: "12rem",
      render: () => (
        <span className="inline-flex gap-1">
          <Button variant="text" className="text-primary">
            {t.detail}
          </Button>
          <Button variant="text" className="text-danger">
            {t.revoke}
          </Button>
        </span>
      ),
    },
  ];

  const bulkItems: MenuConfig[] = [
    { label: <span className="flex items-center gap-2"><Download className="size-4" aria-hidden />{t.exportCsv}</span> },
    { label: <span className="flex items-center gap-2"><Printer className="size-4" aria-hidden />{t.printLabels}</span> },
    { group: t.dangerGroup, items: [{ label: <span className="flex items-center gap-2"><X className="size-4" aria-hidden />{t.cancelOrder}</span> }] },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <span className="flex items-center gap-2 font-medium">
          <Flag className="size-4 text-primary" aria-hidden />
          Litefy
        </span>
        <Breadcrumb items={[{ label: t.crumb[0], href: t.stylesHref }, { label: t.crumb[1] }]} />
        <div className="ml-auto flex items-center gap-3">
          <Input
            className="w-64"
            placeholder={t.search}
            leading={<Search className="size-4" />}
            trailing={<Kbd>⌘K</Kbd>}
            aria-label={t.search}
          />
          <Badge label="5">
            <Button variant="text" aria-label={t.notifications}>
              <Bell className="size-4" />
            </Button>
          </Badge>
          <Avatar fallback={lang === "zh" ? "运" : "OP"} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 lg:p-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t.stats.today[0]} value="128" delta="+12" deltaVariant="success" deltaNote={t.stats.today[1]} />
          <StatCard label={t.stats.pending[0]} value="36" delta="6" deltaVariant="warning" deltaNote={t.stats.pending[1]} />
          <StatCard label={t.stats.paid[0]} value="62%" progress={62} deltaNote={t.stats.paid[1]} />
          <StatCard label={t.stats.avg[0]} value={`${t.currency}486`} delta="-3%" deltaVariant="outline" deltaNote={t.stats.avg[1]} />
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-base font-medium">{t.list}</h2>
              <FieldSearch
                className="w-72"
                fields={[
                  { value: "customer", label: t.colCustomer, placeholder: t.searchCustomer },
                  {
                    value: "status",
                    label: t.colStatus,
                    allLabel: t.allStatuses,
                    options: STATUSES.map((s) => ({ value: s, label: t.status[s] })),
                  },
                ]}
                onSearch={(field, value) => {
                  setQuery({ field, value });
                  setPage(1);
                }}
              />
              <span className="ml-auto flex items-center gap-2">
                <DropdownMenu
                  className="litefy-button-outline"
                  trigger={t.bulk}
                  items={bulkItems}
                  alignX="end"
                />
                <Button variant="primary">{t.newOrder}</Button>
              </span>
            </div>
            <Table
              columns={columns}
              data={rows}
              getKey={(o) => o.id}
              sort={sort}
              onSortChange={setSort}
              empty={lang === "zh" ? "没有符合条件的订单" : "No matching orders"}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Select
                className="w-28"
                defaultValue="10"
                options={[
                  { label: `10 ${t.perPage}`, value: "10" },
                  { label: `20 ${t.perPage}`, value: "20" },
                ]}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
                aria-label={t.perPage}
              />
              <Pagination
                className="ml-auto"
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                summary={t.summary(sorted.length, safePage, totalPages)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-4 p-4">
              <h2 className="text-base font-medium">{t.form.title}</h2>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  Toaster.success({ title: t.form.created });
                  e.currentTarget.reset();
                }}
              >
                <FormItem
                  name="customer"
                  label={t.form.customer}
                  required
                  validate={(v) => v.trim().length > 0 || t.form.customerRule}
                  controlProps={{ placeholder: t.form.customerPh }}
                />
                <FormItem
                  name="amount"
                  label={t.form.amount}
                  variant="number-input"
                  controlProps={{ min: 0 }}
                />
                <FormItem
                  name="priority"
                  label={t.form.priority}
                  variant="select"
                  controlProps={{
                    options: t.form.priorityOptions.map(([value, label]) => ({ value, label })),
                    defaultValue: "medium",
                  }}
                />
                <FormItem
                  name="note"
                  label={t.form.note}
                  variant="textarea"
                  controlProps={{ placeholder: t.form.notePh }}
                />
                <div className="flex gap-2 pt-1">
                  <Button type="submit" variant="primary">
                    {t.form.submit}
                  </Button>
                  <Button type="reset" variant="outline">
                    {t.form.reset}
                  </Button>
                </div>
              </form>
            </Card>

            <Callout variant="info">{t.callout}</Callout>

            <Card className="flex flex-col gap-4 p-4">
              <h2 className="text-base font-medium">{t.activity.title}</h2>
              <Timeline items={t.activity.items.map((i) => ({ ...i }))} />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaVariant,
  deltaNote,
  progress,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaVariant?: "success" | "warning" | "outline";
  deltaNote?: string;
  progress?: number;
}) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-medium tabular-nums">{value}</span>
      {progress != null ? (
        <Progress current={progress} duration={100} />
      ) : (
        delta && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Chip variant={deltaVariant}>{delta}</Chip>
            {deltaNote}
          </span>
        )
      )}
    </Card>
  );
}
