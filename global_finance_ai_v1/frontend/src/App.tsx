import { useEffect, useState } from "react";
import { Activity, Globe2, Layers3, BriefcaseBusiness, BrainCircuit, Settings, RefreshCw } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const markets = [
  { id: "global", label: "全球" }, { id: "cn", label: "A股" },
  { id: "us", label: "美股" }, { id: "hk", label: "港股" },
  { id: "crypto", label: "加密" }
] as const;
type Market = typeof markets[number]["id"];
type Item = { symbol: string; name: string; status: string; value: number | null; change_pct: number | null };
type Data = { status: string; note: string; as_of: string; items: Item[] };

const nav = [
  { label: "全球市场", icon: Activity },
  { label: "宏观与新闻", icon: Globe2 },
  { label: "行业与资金", icon: Layers3 },
  { label: "投资组合", icon: BriefcaseBusiness },
  { label: "AI智能分析", icon: BrainCircuit },
];

export default function App() {
  const [market, setMarket] = useState<Market>("global");
  const [page, setPage] = useState("全球市场");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const response = await fetch(`${API}/api/markets/overview?market=${market}`);
      if (!response.ok) throw new Error(`API error ${response.status}`);
      setData(await response.json());
    } catch {
      setData(null);
      setError("暂时无法连接本地数据服务。请先启动 FastAPI 后端。");
    }
  }

  useEffect(() => { load(); }, [market]);

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">GF</div><div><b>GLOBAL FINANCE AI</b><small>MARKET INTELLIGENCE</small></div></div>
      <div className="nav-label">工作台</div>
      {nav.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => setPage(label)}><Icon size={18}/>{label}</button>)}
      <div className="sidebar-bottom"><button className="nav-item"><Settings size={18}/>系统设置</button><small>V1.0 · 开发预览</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span className="eyebrow">GLOBAL MARKET WORKSPACE</span><h1>{page}</h1></div><span className="status-pill"><i/>数据接口待配置</span></header>
      {page === "全球市场" ? <>
        <section className="intro"><div><span className="eyebrow">MARKET OVERVIEW</span><h2>全球市场，一屏掌握</h2><p>统一查看四大市场行情、行业方向与风险状态。</p></div><button className="refresh" onClick={load}><RefreshCw size={16}/>刷新</button></section>
        <div className="market-tabs">{markets.map(m => <button key={m.id} onClick={() => setMarket(m.id)} className={market === m.id ? "selected" : ""}>{m.label}</button>)}</div>
        <section className="metric-grid">
          <Metric title="市场综合方向" value="待计算" detail="等待行情与宏观数据"/>
          <Metric title="市场广度" value="待接入" detail="上涨 / 下跌家数"/>
          <Metric title="资金方向" value="待接入" detail="ETF申赎与份额变化"/>
          <Metric title="风险状态" value="待计算" detail="波动率与组合风险"/>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h3>主要市场指数</h3><p>当前仅显示跟踪清单，未连接真实行情</p></div><span className="tag">PLACEHOLDER</span></div>
          {error && <div className="error">{error}</div>}
          <div className="quote-list">{data?.items.map(item => <div className="quote-row" key={item.symbol}><div><b>{item.name}</b><small>{item.symbol}</small></div><span className="pending">待接入</span></div>)}</div>
          <p className="footnote">{data?.note ?? "数据尚未加载。"} {data?.as_of ? `API检查时间：${new Date(data.as_of).toLocaleString()}` : ""}</p>
        </section>
        <section className="two-col">
          <div className="panel"><h3>重点行业</h3><div className="chips"><span>AI算力</span><span>半导体</span><span>存储芯片</span><span>AI云计算</span><span>AI能源</span></div></div>
          <div className="panel"><h3>AI市场判断</h3><p className="muted">数据接入后，综合宏观、趋势、产业、资金与风险，输出方向、依据和失效条件。</p><span className="tag">等待数据</span></div>
        </section>
      </> : <section className="panel coming"><div className="coming-icon"><BrainCircuit/></div><h2>{page}</h2><p>该入口已纳入统一导航，功能将在 V1.0 按优先级接入。暂不增加重复页面。</p></section>}
      <footer>GLOBAL FINANCE AI · 内部研究工具 · 非自动交易系统</footer>
    </main>
  </div>;
}

function Metric({title, value, detail}: {title:string; value:string; detail:string}) {
  return <div className="metric"><small>{title}</small><strong>{value}</strong><span>{detail}</span></div>;
}
